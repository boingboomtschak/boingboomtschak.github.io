---
layout: page
title: -playground
permalink: /playground/
---

<a href="/">../</a>

# playground

A page for various embedded web experiments, written in various tools like p5.js.

## boids

<div>
    <img src="/icons/p5-js.svg" width="14">
    <a href="https://editor.p5js.org/d-mckee/sketches/iuQZEjEN2">sketch link</a>
</div>

Boids! Based on the [original model by Craig Reynolds](https://www.red3d.com/cwr/boids/), written in the [p5.js editor](https://editor.p5js.org/), and inspired by the [boids found in Xen in the original Half Life](https://youtu.be/ucPLCf05VrI).  

Left click and drag the mouse to create new boids on the cursor!

<iframe src="/assets/playground/boids" width="100%" height="600px"></iframe>



## 3d bouncing balls

<div>
    <img src="/icons/p5-js.svg" width="14">
    <a href="https://editor.p5js.org/d-mckee/sketches/rJCGaVcNw">sketch link</a>
</div>

An extension of a lab I wrote up and led for my ACM student chapter, the original document of which can be found here on [GitHub gists](https://gist.github.com/d-mckee/559f31624471ad30d15f0ffa16e39454). This version simulates the bouncing balls in 3D, with some playing around with ambient materials and ambient/point lights. 

Left click and drag the mouse to spawn more balls, and the point light in the scene is centered on mouse X and mouse Y on the Z axis.

<iframe src="/assets/playground/3d-bouncing-balls" width="100%" height="600px"></iframe>



## minesweeper

<div>
    <img src="/icons/p5-js.svg" width="14">
    <a href="https://editor.p5js.org/d-mckee/sketches/N5kzvjHFm">sketch link</a>
</div>

A simple implementation of minesweeper without any pre-rendered graphics (all the shapes are drawn by p5). Click to uncover squares, right click to flag squares, and click the reset button to reset the board.

<iframe src="/assets/playground/minesweeper" width="100%" height="600px"></iframe>



## simple web theremin

<div>
    <img src="/icons/p5-js.svg" width="14">
    <a href="https://editor.p5js.org/d-mckee/sketches/eZmVZvny3">sketch link</a>
</div>

A simple web "theremin" written in the [p5.js editor](https://editor.p5js.org/) and using the [p5.sound library](https://github.com/processing/p5.js-sound). Set up with a simple square wave oscillator, low pass filter, and reverb effect chained together.  

Left click and drag the mouse to play, mouse X is mapped to the oscillator frequency (between ranges 100 and 500), where mouse Y is mapped to the low pass filter frequency.

<iframe src="/assets/playground/simple-web-theremin" width="100%" height="600px"></iframe>



## random walk

<div>
    <img src="/icons/p5-js.svg" width="14">
    <a href="https://editor.p5js.org/d-mckee/sketches/SXmsP2ZA-">sketch link</a>
</div>

Another short experiment with modeling particles on a random walk. Particles "die" when leaving the frame, and are culled from the list of particles. Use the mouse to click or drag to spawn new particles.

<iframe src="/assets/playground/random-walk" width="100%" height="600px"></iframe>



## sphere details

<div>
    <img src="/icons/p5-js.svg" width="14">
    <a href="https://editor.p5js.org/d-mckee/sketches/OI50H2gp4">sketch link</a>
</div>

A 10-minute experiment with sphere details in [p5.js](https://p5js.org/) - the slider controls the delay between changes, and the checkbox marked "Random" causes the sphere to change to random X and Y details.

<iframe src="/assets/playground/sphere-details" width="100%" height="600px"></iframe>




