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
			INTERSECTED: undefined,
			cubes: [],
			cubePositions: []
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
			//window.addEventListener("resize", this.resizeCanvas.bind(this), false);
		},
		removeResizeListener() {
			//window.removeEventListener("resize", this.resizeCanvas.bind(this), false);
		},
		initThree() {
			this.camera = new THREE.PerspectiveCamera(
				70,
				this.canvas.width / this.canvas.height,
				1,
				10000
			);
			this.camera.position.z = 3;

			this.pointer = new THREE.Vector2();
			this.raycaster = new THREE.Raycaster();

			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color(0x00aafa);

			this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
			this.material = new THREE.MeshNormalMaterial();

			//this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.mesh = new THREE.Mesh(
				this.geometry,
				new THREE.MeshLambertMaterial({ color: 0x097969 })
			);
			this.addRandomCubes();

			this.scene.add(this.mesh);
			this.addLights();

			this.renderer = new THREE.WebGLRenderer({
				canvas: this.canvas,
				antialias: true
			});
			this.renderer.setPixelRatio(window.devicePixelRatio);
			//this.renderer.setSize(this.canvas.clientwidth, this.canvas.height);
			//this.renderer.render(this.scene, this.camera);
		},
		addLights() {
			this.light = new THREE.DirectionalLight(0xff33bb, 2);
			this.light.position.set(1, 1, 1).normalize();
			this.scene.add(this.light);

			const light1 = new THREE.DirectionalLight(0xffcc22, 2);
			light1.position.set(-1, 1, 1).normalize();
			this.scene.add(light1);

			const light2 = new THREE.DirectionalLight(0xccff11, 5);
			light2.position.set(0, -4, 3).normalize();
			this.scene.add(light2);
		},
		addRandomCubes() {
			this.setCubePositions();
			for (let i = 0; i < this.cubePositions.length; i++) {
				let inst = this.makeCubeInstance(
					this.geometry,
					this.cubePositions[i][0],
					this.cubePositions[i][1],
					this.cubePositions[i][2]
				);
				this.cubes.push(inst);
			}
		},
		makeCubeInstance(geometry, x, y, z) {
			const material = new THREE.MeshLambertMaterial({
				color: Math.random() * 0xffffff
			});

			const cube = new THREE.Mesh(geometry, material);
			this.scene.add(cube);

			cube.position.x = x;
			cube.position.y = y;
			cube.position.y = z;

			return cube;
		},
		setCubePositions() {
			let distance = 0.25;
			// dynamic hook: cube count (h)
			for (let h = 0; h < Math.ceil(1.5 / distance); h++) {
				let pos = [0, 0, 0];
				for (let i = 0; i < pos.length; i++) {
					let iPositions = this.cubePositions.map((pos) => pos[i]);
					let rp =
						Math.random().toFixed(2) *
						(Math.random().toFixed(2) >= 0.5 ? 1.0 : -1.0) *
						Math.floor(Math.random() * 3);
					let exists =
						iPositions.findIndex((pos) => {
							return Math.abs(rp - pos) < distance;
						}) !== -1 || Math.abs(rp) <= distance;
					while (exists) {
						rp =
							Math.random().toFixed(2) *
							(Math.random().toFixed(2) >= 0.5 ? 1.0 : -1.0) *
							Math.floor(Math.random() * 3);
						//console.log(Math.abs(rp));
						exists =
							iPositions.findIndex((pos) => {
								return Math.abs(rp - pos) < distance;
							}) !== -1 || Math.abs(rp) <= distance;
					}
					pos[i] = rp;
				}
				this.cubePositions.push(pos);
			}
		},
		render(timestamp) {
			if (this.resizeRendererToDisplaySize()) {
				const _canvas = this.renderer.domElement;
				this.camera.aspect = _canvas.clientWidth / _canvas.clientHeight;
				this.camera.updateProjectionMatrix();
			}
			this.checkPointerRaycastIntersection();
			this.rotateCubes(timestamp);
			this.renderer.render(this.scene, this.camera);
		},
		resizeRendererToDisplaySize() {
			const _canvas = this.renderer.domElement;
			const pixelRatio = window.devicePixelRatio;
			//console.log(_canvas, pixelRatio);
			const width = (_canvas.clientWidth * pixelRatio) | 0;
			const height = (_canvas.clientHeight * pixelRatio) | 0;
			const needResize = _canvas.width !== width || _canvas.height !== height;
			console.log(needResize);
			if (needResize) {
				this.renderer.setSize(width, height, false);
			}
			return needResize;
		},
		rotateCubes(time) {
			time *= 0.001;
			let i = 0;
			this.cubes.forEach((ch) => {
				if (ch.type === "Mesh") {
					let speed = 1 + i * 0.1;
					//console.log(time);
					let rot = time * speed;
					ch.rotation.x = rot;
					ch.rotation.y = rot;
					i++;
				}
			});
		},
		rotateX(mouseY) {
			this.mesh.rotation.x += mouseY / 100;
		},
		rotateY(mouseX) {
			//TODO: need to check cube x and only invert it if it's right side up
			this.mesh.rotation.y += mouseX / 100;
		},
		setPointerX(mouseX) {
			this.pointer.x = (mouseX / window.innerWidth) * 2 - 1;
		},
		setPointerY(mouseY) {
			this.pointer.y = -(mouseY / window.innerHeight) * 2 + 1;
		},
		checkPointerRaycastIntersection() {
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
					this.INTERSECTED.material.emissive.setHex(0x777777);
				}
				if (this.input.mouseState.left) {
					//console.log("we should drag", this.INTERSECTED);
					this.INTERSECTED.material.emissive.setHex(0xbbbbbb);
				} else {
					this.INTERSECTED.material.emissive.setHex(0x777777);
				}
			} else {
				if (this.INTERSECTED)
					this.INTERSECTED.material.emissive.setHex(
						this.INTERSECTED.currentHex
					);

				this.INTERSECTED = null;
			}
		}
	}
};
</script>
<style>
canvas {
	display: block;
	margin: 0;
	width: 100%;
	height: 100%;
}
</style>
