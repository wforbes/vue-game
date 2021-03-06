# Vue Game

This is an experimental project made with [Vue.js 2](https://vuejs.org/) and [three.js](https://threejs.org/). I'm using this to
try to learn as many new things as I can. For science!

Demo - [https://wforbes.github.io/vue-game](https://wforbes.github.io/vue-game)

## Progress

### Day 1

* [X] - Create a basic game loop that runs in Vue.
* [X] - Measure time and display the creation time, current time, and session duration.
* [X] - Track/capture mouse and keyboard input.
* [X] - Disable the default right-click context menu from the browser.
* [X] - Capture when the mouse leaves the page.
* [X] - Capture multiple keyboard presses at once.
* [X] - Render a 3D object on the canvas element from the [three.js example on their npm page](https://www.npmjs.com/package/three).
* [X] - Control the 3D object with the mouse input.

![Gif of Day 1 Progress](https://wforbes.net/wp-content/uploads/2021/08/vue_game_day1.gif)

### Day 2

* [X] - Measure FPS and fine tune the game loop.
* [X] - Resize the canvas with the browser window.
* [X] - Try adding stats.js for performance monitoring.
* [X] - Only rotate cube when dragging with CTRL + leftClick.
* [X] - When mouse hovers over the cube, highlight the cube slightly.
* [X] - Add more cubes, mimicing [threejs Fundamentals](https://threejsfundamentals.org/threejs/lessons/threejs-fundamentals.html),
but randomizing their color and x/y positions so that they don't collide

![Gif of Day 1 Progress](https://wforbes.net/wp-content/uploads/2021/08/vue_game_day2_2.gif)

### Next Steps

* [ ] - Improve mouse/keyboard controls related to camera, scene, and mesh. ([three.js controls code](https://github.com/mrdoob/three.js/tree/master/examples/jsm/controls))
* [ ] - Try some more demos from the [three.js examples](https://threejs.org/examples)
* [ ] - Experiment with making it mobile friendly.
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
