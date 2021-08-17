/* eslint-disable no-prototype-builtins */
<template>
	<div class="game">
		<div id="output">
			<div id="created-time">Created Time: {{ time.created.display }}</div>
			<div id="current-time">Current Time: {{ time.current.display }}</div>
			<div id="session-duration">Session Duration: {{ time.session }}</div>
			<div id="count">Render Count: {{ gameLoop.renderCount }}</div>
			<div id="fps">FPS: ~{{ gameLoop.fps.toFixed(3) }}</div>
			<div id="statsDOM"></div>
			<br />
			<div id="mousemove">
				mouseMovement
				<div>offsetX: {{ gameInput.mouseMovement.offsetX }}</div>
				<div>offsetY: {{ gameInput.mouseMovement.offsetY }}</div>
				<div>clientX: {{ gameInput.mouseMovement.clientX }}</div>
				<div>clientY: {{ gameInput.mouseMovement.clientY }}</div>
				<div>ctrlKey: {{ gameInput.mouseMovement.ctrlKey }}</div>
				<div>altKey: {{ gameInput.mouseMovement.altKey }}</div>
				<div>shiftKey: {{ gameInput.mouseMovement.shiftKey }}</div>
				<div>metaKey: {{ gameInput.mouseMovement.metaKey }}</div>
			</div>
			<br />
			<div id="mouseleave">
				mouseLeave
				<div id="leave-count">count: {{ gameInput.mouseLeave.leaveCount }}</div>
				<div id="leave-last">
					last leave:
					<div class="leave-last-data">
						x: {{ gameInput.mouseLeave.last.clientX }}
					</div>
					<div class="leave-last-data">
						y: {{ gameInput.mouseLeave.last.clientY }}
					</div>
				</div>
			</div>
			<br />
			<div id="mousedown">
				mouseState
				<div id="left-down">left: {{ gameInput.mouseState.left }}</div>
				<div id="left-right">right: {{ gameInput.mouseState.right }}</div>
			</div>
			<br />
			<div id="keys">
				<div id="key-down">
					keys down:
					<span v-for="key of gameInput.keys.keysDown" :key="key">{{
						`${key} `
					}}</span>
				</div>
				<div id="key-map">
					keymap:
					<div
						v-for="(keyValue, keyName) in gameInput.keys.keyMap"
						:key="keyName"
					>
						{{ keyName }} : {{ keyValue }}
					</div>
				</div>
			</div>
		</div>
		<div id="overlay" ref="overlay" tabindex="-1"></div>
		<GameCanvas ref="gameCanvasComponent" :input="gameInput" />
	</div>
</template>

<script>
import { GameInput } from "@/game/controllers/GameInput.js";
import { GameLoop } from "@/game/controllers/GameLoop.js";
import GameCanvas from "@/game/components/GameCanvas.vue";
export default {
	name: "Game",
	components: {
		GameCanvas
	},
	data() {
		return {
			gameLoop: new GameLoop(this),
			gameInput: new GameInput(),
			time: {
				created: {
					actual: new Date(),
					display: this.getTimeDisplay()
				},
				actual: new Date(),
				current: {
					actual: new Date(),
					display: this.getTimeDisplay()
				},
				session: undefined
			}
		};
	},
	mounted() {
		this.init();
	},
	beforeDestroy() {
		this.tearDown();
	},
	methods: {
		init() {
			this.gameInput.addInputListeners();
			this.$refs.overlay.focus();
			//this.animate();
			let sd = document.querySelector("#statsDOM");
			sd.appendChild(this.gameLoop.stats.dom);
			sd.style.zIndex = "inherit";
			this.gameLoop.run(0);
		},
		tearDown() {
			this.gameInput.removeInputListeners();
		},
		animate() {
			this.requestAnimation = requestAnimationFrame(this.animate.bind(this));
			this.render();
			this.update();
		},
		update(updateDelta = 0) {
			this.updateDelta = updateDelta;
			this.time.current.actual = new Date();
			this.time.current.display = this.getTimeDisplay();
			this.time.session = this.getSessionDuration();
			this.gameInput.checkKeyMap();
			//this.gameInput.checkMouseDown();
		},
		panic() {
			console.log("We got some lag bois.");
		},
		render() {
			this.$refs.gameCanvasComponent.render();
		},
		getTimeDisplay() {
			const date = new Date();
			let hours = date.getHours();
			let minutes = date.getMinutes();
			let seconds = date.getSeconds();
			let milliseconds = date.getMilliseconds();
			hours = hours < 10 ? "0" + hours : hours;
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
			if (milliseconds < 100) {
				if (milliseconds < 10) milliseconds = "00" + milliseconds;
				milliseconds = "0" + milliseconds;
			}
			return `${hours}:${minutes}:${seconds}:${milliseconds}`;
		},
		getSessionDuration() {
			let ms = this.time.current.actual - this.time.created.actual;
			let seconds = Math.floor(ms / 1000);
			let hours = Math.floor(seconds / 3600);
			seconds -= hours * 3600;
			let minutes = Math.floor(seconds / 60);
			seconds -= minutes * 60;
			hours = hours < 10 ? "0" + hours : hours;
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
			return `${hours}:${minutes}:${seconds}`;
		}
	}
};
</script>
<style>
body {
	margin: 0;
	margin-right: 0.8em;
	font-family: sans-serif;
}
#overlay {
	position: fixed;
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	z-index: 99;
	opacity: 0.1;
}
#output {
	width: 250px;
	z-index: 10;
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0.8;
	color: green;
	border-radius: 0.25em;
	padding: 1em;
	font-weight: bold;
	background-color: black;
}
.leave-last-data {
	margin-left: 0.25em;
}
#statsDOM {
	height: 50px;
}
#statsDOM div {
	padding-top: 1em;
	position: relative !important;
	display: block;
	z-index: inherit !important;
}
</style>
