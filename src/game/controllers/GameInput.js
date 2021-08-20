export class GameInput {
	keys = {
		keysDown: [],
		keyMap: {}
	};
	mouseState = {
		left: false,
		right: false
	};
	mouseMovement = {
		offsetX: undefined,
		offsetY: undefined,
		clientX: undefined,
		clientY: undefined,
		metaKey: undefined,
		altKey: undefined,
		ctrlKey: undefined,
		shiftKey: undefined,
		x: undefined,
		y: undefined
	};
	mouseLeave = {
		leaveCount: 0,
		last: {
			clientX: undefined,
			clientY: undefined
		}
	};

	constructor() {
		console.log("gameInput constructor");
	}

	addInputListeners() {
		document.addEventListener("keydown", this.handleKey.bind(this));
		document.addEventListener("keyup", this.handleKey.bind(this));
		document.addEventListener("mousemove", this.handleMouseMove.bind(this));
		document.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
		//document.addEventListener("click", this.handleLeftClick.bind(this));
		document.addEventListener("mousedown", this.handleMouseDown.bind(this));
		document.addEventListener("mouseup", this.handleMouseUp.bind(this));
		document.addEventListener("contextmenu", this.handleContextMenu.bind(this));
		document.addEventListener("onscroll", this.handleMouseScroll.bind(this));
	}

	removeInputListeners() {
		document.removeEventListener("keydown", this.handleKey.bind(this));
		document.removeEventListener("keyup", this.handleKey.bind(this));
		document.removeEventListener("mousemove", this.handleMouseMove.bind(this));
		document.removeEventListener(
			"mouseleave",
			this.handleMouseLeave.bind(this)
		);
		//document.addEventListener("click", this.handleLeftClick);
		document.removeEventListener("mousedown", this.handleMouseDown.bind(this));
		document.removeEventListener("mouseup", this.handleMouseUp.bind(this));
		document.removeEventListener(
			"contextmenu",
			this.handleContextMenu.bind(this)
		);
		document.removeEventListener("onscroll", this.handleMouseScroll.bind(this));
	}

	handleMouseMove(event) {
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
		this.mouseMovement.offsetX = event.offsetX;
		this.mouseMovement.offsetY = event.offsetY;
		this.mouseMovement.clientX = event.clientX;
		this.mouseMovement.clientY = event.clientY;
		this.mouseMovement.metaKey = event.metaKey;
		this.mouseMovement.ctrlKey = event.ctrlKey;
		this.mouseMovement.altKey = event.altKey;
		this.mouseMovement.shiftKey = event.shiftKey;
		this.mouseMovement.x = event.movementX;
		this.mouseMovement.y = event.movementY;
	}

	handleMouseLeave(event) {
		//console.log(event);
		this.mouseLeave.leaveCount++;
		this.mouseLeave.last.clientX = event.clientX;
		this.mouseLeave.last.clientY = event.clientY;
	}

	handleKey(event) {
		event.preventDefault();
		this.keys.keyMap[event.code] = event.type == "keydown";
	}

	checkKeyMap() {
		for (let key in this.keys.keyMap) {
			if (this.keys.keyMap[key] === true) {
				if (!this.keys.keysDown.includes(key)) {
					this.keys.keysDown.push(key);
				}
			} else {
				if (this.keys.keysDown.includes(key)) {
					let keyIdx = this.keys.keysDown.findIndex((k) => k === key);
					this.keys.keysDown.splice(keyIdx, 1);
				}
				delete this.keys.keyMap[key];
			}
		}
	}

	keyIsDown(keyCode) {
		return (
			this.keys.keysDown.includes(keyCode) || this.keys.keyMap[keyCode] === true
		);
	}

	handleMouseDown(event) {
		if (event.button === 0) this.mouseState.left = true;
		if (event.button === 2) {
			event.preventDefault();
			this.mouseState.right = true;
		}
	}

	handleMouseUp(event) {
		if (event.button === 0) this.mouseState.left = false;
		if (event.button === 2) this.mouseState.right = false;
	}

	handleContextMenu(event) {
		event.preventDefault();
	}

	handleMouseScroll(event) {
		console.log(event);
	}
}
