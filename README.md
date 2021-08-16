# Vue Game

This is an experimental project made with [Vue.js 2](https://vuejs.org/) and [three.js](https://threejs.org/). I'm using this to
try as many new things as I can. For science!

Demo - [https://wforbes.github.io/vue-game](https://wforbes.github.io/vue-game)

## Progress

### Day 1

* [X] - Create a basic game loop that runs in Vue.
* [X] - Measure time to display the creation time, current time, session duration, and fine tune the game loop
* [X] - Track/capture mouse and keyboard input.
* [X] - Disable the default right-click context menu from the browser
* [X] - Capture when the mouse leaves the page.
* [X] - Capture multiple keyboard presses at once.
* [X] - Render a 3D object on the canvas element from the [three.js example on their npm page](https://www.npmjs.com/package/three).
* [X] - Control the 3D object with the mouse input.

![Gif of Day 1 Progress](https://wforbes.net/wp-content/uploads/2021/08/vue_game_day1.gif)

### Next Steps

* [ ] - Resize the canvas with the browser.
* [ ] - Control the 3D camera with mouse/keyboard input.
* [ ] - Control the 3D object with keyboard input, independent from the camera.
* [ ] - Experiment with making it mobile friendly.
* [ ] - Render a more complex scene from the [three.js examples](https://threejs.org/examples)
* [ ] - Add a menu page to open different demos
* [ ] - Add a way to return to the menu page from the demos
* ... continue to add to this list and see where it goes!

## Setup Instructions

This uses the [npm](https://docs.npmjs.com/about-npm) package manager (that comes with and runs on [node.js](https://nodejs.org/en/))
to automatically install dependencies, run for development, and build for production. I left these instructions here if you aren't
familiar.

### Installing this project

Running ``` npm install ``` in the terminal from the project directory will install the dependencies listed in ``` ./package.json ```.

### Compiling and running for development

Running ``` npm run serve ``` will compile and run the project in the browser from a local server that recompiles and reloads the app
each time it's saved.

### Compiling and minifying for production

Running ``` npm run build ``` will compile and minify it into the ``` ./dist ``` directory for upload to a production server.
