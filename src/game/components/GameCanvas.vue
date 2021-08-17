<template>
	<canvas ref="gameCanvas"></canvas>
</template>
<script>
import * as THREE from "three";
export default {
	name: "GameCanvas",
	props: ["input"],
	data() {
		return {
			//three: THREE,
			canvas: document.getElementById("game-canvas"),
			camera: undefined,
			scene: undefined,
			renderer: undefined,
			geometry: undefined,
			material: undefined,
			mesh: undefined,
			pointer: undefined,
			raycaster: undefined,
			INTERSECTED: undefined
		};
	},
	mounted() {
		this.initCanvas();
		this.initThree();
	},
	destroyed() {
		this.removeResizeListener();
	},
	computed: {
		mouseMovementX() {
			return this.input.mouseMovement.x;
		},
		mouseMovementY() {
			return this.input.mouseMovement.y;
		},
		mousePositionX() {
			return this.input.mouseMovement.clientX;
		},
		mousePositionY() {
			return this.input.mouseMovement.clientY;
		}
	},
	watch: {
		mouseMovementX(newX /*, oldX*/) {
			if (
				this.input.mouseState.left &&
				(this.input.keyIsDown("ControlLeft") ||
					this.input.keyIsDown("ControlRight"))
			) {
				this.rotateY(newX);
			}
		},
		mouseMovementY(newY /*, oldY*/) {
			if (
				this.input.mouseState.left &&
				(this.input.keyIsDown("ControlLeft") ||
					this.input.keyIsDown("ControlRight"))
			) {
				this.rotateX(newY);
			}
		},
		mousePositionX(newX) {
			this.setPointerX(newX);
		},
		mousePositionY(newY) {
			this.setPointerY(newY);
		}
	},
	methods: {
		initCanvas() {
			this.canvas = this.$refs.gameCanvas;
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.addResizeListener();
		},
		addResizeListener() {
			window.addEventListener("resize", this.resizeCanvas.bind(this), false);
		},
		removeResizeListener() {
			window.removeEventListener("resize", this.resizeCanvas.bind(this), false);
		},
		resizeCanvas() {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		},
		setPointerX(mouseX) {
			this.pointer.x = (mouseX / window.innerWidth) * 2 - 1;
		},
		setPointerY(mouseY) {
			this.pointer.y = (mouseY / window.innerHeight) * 2 - 1;
		},
		initThree() {
			this.camera = new THREE.PerspectiveCamera(
				70,
				this.canvas.width / this.canvas.height,
				0.01,
				10
			);
			this.camera.position.z = 1;

			this.pointer = new THREE.Vector2();
			this.raycaster = new THREE.Raycaster();

			this.scene = new THREE.Scene();

			this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
			this.material = new THREE.MeshNormalMaterial();

			//this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.mesh = new THREE.Mesh(
				this.geometry,
				new THREE.MeshLambertMaterial({ color: 0x097969 })
			);
			this.scene.add(this.mesh);

			this.light = new THREE.DirectionalLight(0xff33bb, 2);
			this.light.position.set(1, 1, 1).normalize();
			this.scene.add(this.light);

			const light1 = new THREE.DirectionalLight(0xffcc22, 2);
			light1.position.set(-1, 1, 1).normalize();
			this.scene.add(light1);

			const light2 = new THREE.DirectionalLight(0xccff11, 2);
			light2.position.set(1, -1, 1).normalize();
			this.scene.add(light2);

			this.renderer = new THREE.WebGLRenderer({
				canvas: this.canvas,
				antialias: true
			});
			this.renderer.setSize(this.canvas.width, this.canvas.height);
			this.renderer.render(this.scene, this.camera);
		},
		rotateX(mouseY) {
			this.mesh.rotation.x += mouseY / 100;
		},
		rotateY(mouseX) {
			//TODO: need to check cube x and only invert it if it's right side up
			this.mesh.rotation.y += mouseX / 100;
		},
		makeCubeInstance(geometry, color, x) {
			const material = new THREE.MeshPhongMaterial({ color });

			const cube = new THREE.Mesh(geometry, material);
			scene.add(cube);

			cube.position.x = x;

			return cube;
		},
		render() {
			this.raycaster.setFromCamera(this.pointer, this.camera);
			const intersects = this.raycaster.intersectObjects(this.scene.children);
			if (intersects.length > 0) {
				if (this.INTERSECTED != intersects[0].object) {
					if (this.INTERSECTED)
						this.INTERSECTED.material.emissive.setHex(
							this.INTERSECTED.currentHex
						);
					this.INTERSECTED = intersects[0].object;
					this.INTERSECTED.currentHex =
						this.INTERSECTED.material.emissive.getHex();
					this.INTERSECTED.material.emissive.setHex(0x333333);
				}
			} else {
				if (this.INTERSECTED)
					this.INTERSECTED.material.emissive.setHex(
						this.INTERSECTED.currentHex
					);

				this.INTERSECTED = null;
			}
			this.renderer.render(this.scene, this.camera);
		}
	}
};
</script>
<style>
canvas {
	position: fixed;
	margin: 0;
	padding: 0;
}
</style>
