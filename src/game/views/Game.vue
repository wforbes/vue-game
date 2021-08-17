/* eslint-disable no-prototype-builtins */
<template>
	<div class="game">
		<div id="output">
			<div id="created-time">Created Time: {{ time.created.display }}</div>
			<div id="current-time">Current Time: {{ time.current.display }}</div>
			<div id="session-duration">Session Duration: {{ time.session }}</div>
			<div id="count">Render Count: {{ gameLoop.renderCount }}</div>
			<div id="fps">avg FPS: {{ gameLoop.fps.toFixed(3) }}</div>
			<br />
			<div id="mousemove">
				mousemove
				<div>offsetX: {{ input.mousemove.offsetX }}</div>
				<div>offsetY: {{ input.mousemove.offsetY }}</div>
				<div>clientX: {{ input.mousemove.clientX }}</div>
				<div>clientY: {{ input.mousemove.clientY }}</div>
				<div>ctrlKey: {{ input.mousemove.ctrlKey }}</div>
				<div>altKey: {{ input.mousemove.altKey }}</div>
				<div>shiftKey: {{ input.mousemove.shiftKey }}</div>
				<div>metaKey: {{ input.mousemove.metaKey }}</div>
			</div>
			<br />
			<div id="mouseleave">
				mouseleave
				<div id="leave-count">count: {{ input.mouseleave.leaveCount }}</div>
				<div id="leave-last">
					last leave:
					<div class="leave-last-data">
						x: {{ input.mouseleave.last.clientX }}
					</div>
					<div class="leave-last-data">
						y: {{ input.mouseleave.last.clientY }}
					</div>
				</div>
			</div>
			<br />
			<div id="mousedown">
				mousedown
				<div></div>
			</div>
			<br />
			<div id="keys">
				<div id="key-down">
					keys down:
					<span v-for="key of input.keys.keysDown" :key="key">{{
						`${key} `
					}}</span>
				</div>
				<div id="key-map">
					keymap:
					<div v-for="(keyValue, keyName) in input.keys.keyMap" :key="keyName">
						{{ keyName }} : {{ keyValue }}
					</div>
				</div>
			</div>
		</div>
		<div id="overlay" ref="overlay" tabindex="-1"></div>
		<GameCanvas ref="gameCanvasComponent" :mousemove="input.mousemove" />
	</div>
</template>

<script>
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
			},
			input: {
				keys: {
					keysDown: [],
					keyMap: {}
				},
				mousemove: {
					offsetX: undefined,
					offsetY: undefined,
					clientX: undefined,
					clientY: undefined,
					metaKey: undefined,
					altKey: undefined,
					ctrlKey: undefined,
					shiftKey: undefined
				},
				mouseleave: {
					leaveCount: 0,
					last: {
						clientX: undefined,
						clientY: undefined
					}
					/*

					*/
				}
			},
			output: {}
		};
	},
	mounted() {
		this.init();
	},
	destroyed() {
		this.tearDown();
	},
	methods: {
		init() {
			if (this.gameLoop === undefined) this.gameLoop = new GameLoop(this);
			this.addInputListeners();
			this.$refs.overlay.focus();
			//this.animate();
			this.gameLoop.run(0);
		},
		addInputListeners() {
			document.addEventListener("keydown", this.handleKey);
			document.addEventListener("keyup", this.handleKey);
			document.addEventListener("mousemove", this.mousemove);
			document.addEventListener("mouseleave", this.mouseleave);
			document.addEventListener("click", this.handleLeftClick);
			document.addEventListener("contextmenu", this.handleRightClick);
		},
		tearDown() {
			this.removeInputListeners();
		},
		removeInputListeners() {
			document.removeEventListener("keydown", this.handleKey);
			document.removeEventListener("keyup", this.handleKey);
			document.removeEventListener("mousemove", this.mousemove);
			document.removeEventListener("mouseleave", this.mouseleave);
			document.removeEventListener("contextmenu", this.handleRightClick);
		},
		mousemove(event) {
			event.preventDefault();
			//altKey, ctrlKey, shiftKey, metaKey - (Meta key is Windows key.)
			//bubbles, button, buttons, cancelBubble, cancelable, composed, currentTarget
			//target, srcElement, path, sourceCapabilities, toElement
			//defaultPrevented, detail, eventPhase, fromElement, isTrusted
			//layerX, layerY
			//movementX, movementY, pageX, pageY, path
			//screenX, screenY
			//x, y
			//timestamp, type, view, which
			this.input.mousemove.offsetX = event.offsetX;
			this.input.mousemove.offsetY = event.offsetY;
			this.input.mousemove.clientX = event.clientX;
			this.input.mousemove.clientY = event.clientY;
			this.input.mousemove.metaKey = event.metaKey;
			this.input.mousemove.ctrlKey = event.ctrlKey;
			this.input.mousemove.altKey = event.altKey;
			this.input.mousemove.shiftKey = event.shiftKey;
		},
		mouseleave(event) {
			//console.log(event);
			this.input.mouseleave.leaveCount++;
			this.input.mouseleave.last.clientX = event.clientX;
			this.input.mouseleave.last.clientY = event.clientY;
		},
		handleKey(event) {
			event.preventDefault();
			this.input.keys.keyMap[event.code] = event.type == "keydown";
		},
		checkKeyMap() {
			for (let key in this.input.keys.keyMap) {
				if (this.input.keys.keyMap[key] === true) {
					if (!this.input.keys.keysDown.includes(key)) {
						this.input.keys.keysDown.push(key);
					}
				} else {
					if (this.input.keys.keysDown.includes(key)) {
						let keyIdx = this.input.keys.keysDown.findIndex((k) => k === key);
						this.input.keys.keysDown.splice(keyIdx, 1);
					}
					delete this.input.keys.keyMap[key];
				}
			}
		},
		handleLeftClick(event) {
			console.log(event);
		},
		handleRightClick(event) {
			event.preventDefault();
			console.log(event);
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
			this.checkKeyMap();
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
</style>
