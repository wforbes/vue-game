// https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing#fps-control
export class GameLoop {
	gameComponent;
	requestAnimation = undefined;
	fps = 60;
	maxFPS = 100;
	timestep = 1000 / 60;
	delta = 0;
	lastFrameTimeMs = 0;
	fpsDecay = 0.25;
	lastFpsUpdate = 0;
	framesThisSecond = 0;
	updateDelta = 0;
	renderCount = 0;

	constructor(game) {
		this.gameComponent = game;
	}

	run(timestamp) {
		if (timestamp < this.lastFrameTimeMs + 1000 / this.maxFPS) {
			requestAnimationFrame(this.run.bind(this));
			return;
		}
		this.accumulateDeltaTime(timestamp);
		this.computeFPSEstimate(timestamp);
		this.regulatedUpdate();
		this.render();
		requestAnimationFrame(this.run.bind(this));
	}

	accumulateDeltaTime(timestamp) {
		this.delta += timestamp - this.lastFrameTimeMs;
		this.lastFrameTimeMs = timestamp;
	}

	computeFPSEstimate(timestamp) {
		if (timestamp > this.lastFpsUpdate + 1000) {
			this.fps =
				this.fpsDecay * this.framesThisSecond + (1 - this.fpsDecay) * this.fps;
			this.lastFpsUpdate = timestamp;
			this.framesThisSecond = 0;
		}
		this.framesThisSecond++;
	}

	regulatedUpdate() {
		let numUpdateSteps = 0;
		while (this.delta >= this.timestep) {
			this.gameComponent.update(this.timestep);
			this.delta -= this.timestep;
			if (++numUpdateSteps >= 240) {
				//game is lagging
				this.panic(); // when there's something to fix ...
				break;
			}
		}
	}

	panic() {
		console.log("[GameLoop]: panic!");
		this.delta = 0;
		// TODO: fix the lag
		this.gameComponent.panic();
	}

	render() {
		this.gameComponent.render();
		this.renderCount++;
	}
}
