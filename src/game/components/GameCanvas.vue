<template>
	<canvas ref="gameCanvas"></canvas>
</template>
<script>
import * as THREE from "three";
export default {
	name: "GameCanvas",
	props: ["mousemove"],
	data() {
		return {
			//three: THREE,
			canvas: document.getElementById("game-canvas"),
			camera: undefined,
			scene: undefined,
			renderer: undefined,
			geometry: undefined,
			material: undefined,
			mesh: undefined
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
		mousemoveX() {
			return this.mousemove.offsetX;
		},
		mousemoveY() {
			return this.mousemove.offsetY;
		}
	},
	watch: {
		mousemoveX(newX /*, oldX*/) {
			this.rotateY(newX);
		},
		mousemoveY(newY /*, oldY*/) {
			this.rotateX(newY);
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
		initThree() {
			this.camera = new THREE.PerspectiveCamera(
				70,
				this.canvas.width / this.canvas.height,
				0.01,
				10
			);
			this.camera.position.z = 1;

			this.scene = new THREE.Scene();

			this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
			this.material = new THREE.MeshNormalMaterial();

			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.scene.add(this.mesh);

			this.renderer = new THREE.WebGLRenderer({
				canvas: this.canvas,
				antialias: true
			});
			this.renderer.setSize(this.canvas.width, this.canvas.height);
			this.renderer.render(this.scene, this.camera);
		},
		rotateX(mouseY) {
			this.mesh.rotation.x = mouseY / 100;
		},
		rotateY(mouseX) {
			//TODO: need to check cube x and only invert it if it's right side up
			this.mesh.rotation.y = -(mouseX / 100);
		},
		render() {
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
