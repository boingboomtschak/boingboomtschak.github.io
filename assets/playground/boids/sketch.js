// Sketch Constants
const NUM_BOIDS = 5;
const BOID_SIZE = 15;
const BOID_SPEED = 5;
const PERCEPTION = 75;
const SHOW_SIGHT = false;
const BORDER_MODE = "wrap" // "wrap" or "box"
const BOX_ROTATE_FACTOR = 0.5;

// Sketch Globals
var CANVAS_X = 0;
var CANVAS_Y = 0; 

// Weights
const ALIGNMENT_WEIGHT = 1.0;
const COHESION_WEIGHT = 1.0;
const SEPARATION_WEIGHT = 1.25;

// Flock
const flock = [];

// Classes
class Boid {
  constructor(x, y, dir) {
    this.pos = createVector(x, y);
    this.vel = createVector(BOID_SPEED, BOID_SPEED);
    this.vel.rotate(radians(dir));
    this.col = [
      random(125, 255),
      random(125, 255),
      random(125, 255)
    ]
  }
  // Utility functions
  getPos() {
    return this.pos;
  }
  getVel() {
    return this.vel;
  }
  // Main class functions
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    if (SHOW_SIGHT) {
      noFill();
      circle(0, 0, PERCEPTION);
    }
    rotate(this.vel.heading());
    fill(this.col);
    triangle(
      0 - (BOID_SIZE / 2), 
      0 + (BOID_SIZE / 2), 
      0 - (BOID_SIZE / 2), 
      0 - (BOID_SIZE / 2), 
      0 + (BOID_SIZE / 2), 
      0 
    );
    pop();

  }
  move(boids) {
    let alignment = this.alignment(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);
    alignment.mult(ALIGNMENT_WEIGHT);
    cohesion.mult(COHESION_WEIGHT);
    separation.mult(SEPARATION_WEIGHT);
    this.vel.add(alignment);
    this.vel.add(cohesion);
    this.vel.add(separation);
    this.vel.normalize();
    this.vel.setMag(BOID_SPEED);
    this.pos.add(this.vel);
  }
  border() {
    if(BORDER_MODE == "wrap") {
      if(this.pos.x < -BOID_SIZE) {
        this.pos.x = (CANVAS_X + BOID_SIZE);
      }
      if(this.pos.y < -BOID_SIZE) {
        this.pos.y = (CANVAS_Y + BOID_SIZE);
      }
      if(this.pos.x > CANVAS_X + BOID_SIZE) {
        this.pos.x = -BOID_SIZE;
      }
      if(this.pos.y > CANVAS_Y + BOID_SIZE) {
        this.pos.y = -BOID_SIZE;
      }
    } else if (BORDER_MODE == "box") {
      if (this.pos.x - PERCEPTION < 0) { // left bound
        if(this.vel.y < 0) { // go right
          let cv = createVector(0, -1);
          cv.div(this.pos.x / BOID_SIZE);
          this.vel.add(cv);
        } else { // go left
          let cv = createVector(0, 1);
          cv.div(this.pos.x / BOID_SIZE);
          this.vel.add(cv);
        }
      } 
      if (this.pos.y - PERCEPTION < 0) { // top bound
        if (this.vel.x > 0) { // go right
          let cv = createVector(1, 0);
          cv.div(this.pos.y / BOID_SIZE);
          this.vel.add(cv);
        } else { // go left
          let cv = createVector(-1, 0);
          cv.div(this.pos.y / BOID_SIZE);
          this.vel.add(cv);
        }
      }
      if (this.pos.x + PERCEPTION > CANVAS_X) { // right bound 
        if(this.vel.y > 0) { // go right
          let cv = createVector(0, 1);
          cv.div((CANVAS_X - this.pos.x) / BOID_SIZE);
          this.vel.add(cv);
        } else { // go left
          let cv = createVector(0, -1);
          cv.div((CANVAS_X - this.pos.x) / BOID_SIZE);
          this.vel.add(cv);
        }
      }
      if (this.pos.y + PERCEPTION > CANVAS_Y) { // bottom bound
        if (this.vel.x < 0) { // go right
          let cv = createVector(-1, 0);
          cv.div((CANVAS_Y - this.pos.y) / BOID_SIZE);
          this.vel.add(cv);
        } else { // go left
          let cv = createVector(1, 0);
          cv.div((CANVAS_Y - this.pos.y) / BOID_SIZE);
          this.vel.add(cv);
        }
      }
      this.vel.normalize();
      this.vel.setMag(BOID_SPEED);
    }
  }
  // Principle functions
  separation(boids) {
    let cv = createVector(0, 0); // Computation vector
    let nc = 0; // Neighbor count
    for (i = 0; i < boids.length; i++) {
      if (this.pos != boids[i].getPos() && this.pos.dist(boids[i].getPos()) <= PERCEPTION) {
        if(this.pos.dist(boids[i].getPos()) > 0) {
          nc++;
          let iv = p5.Vector.sub(this.pos, boids[i].getPos()); // Iterator vector
          iv.normalize();
          iv.div(this.pos.dist(boids[i].getPos()));
          cv.add(iv);
        }
      }
    }
    if (nc > 0) {
      cv.div(nc); // Divide by number of neighbors
      cv.normalize(); // Normalize to vector of length 1
      return cv
    } else {
      return createVector(0, 0);
    }
  }
  cohesion(boids) {
    let cv = createVector(0, 0); // Computation vector
    let nc = 0; // Neighbor count
    for (i = 0; i < boids.length; i++) {
      if (this.pos != boids[i].getPos() && this.pos.dist(boids[i].getPos()) <= PERCEPTION) {
        nc++;
        cv.add(boids[i].getPos()); // Add position vector
      }
    }
    if (nc > 0) {
      cv.div(nc); // Divide by number of neighbors
      cv.sub(this.pos); // Recalculate cv as vector to center of mass of neighbors
      cv.normalize(); // Normalize to vector of length 1
      return cv;
    } else {
      return createVector(0, 0);
    }
  }
  alignment(boids) {
    let cv = createVector(0, 0); // Computation vector
    let nc = 0; // Neighbor count
    for (i = 0; i < boids.length; i++) {
      if (this.pos != boids[i].getPos() && this.pos.dist(boids[i].getPos()) <= PERCEPTION) {
        nc++;
        cv.add(boids[i].getVel());
      }
    }
    if(nc > 0) {
      cv.div(nc); // Divide by number of neighbors
      cv.normalize(); // Normalize to vector of length 1
      return cv
    } else {
      return createVector(0, 0);
    }
  }
  // Run function (calls main class functions)
  run(boids) {
    this.draw();
    this.move(boids);
    this.border();
  }
}

// Setup functionality
function setup() {
  CANVAS_X = windowWidth;
  CANVAS_Y = windowHeight;
  createCanvas(CANVAS_X, CANVAS_Y);
  for(i = 0; i < NUM_BOIDS; i++) {
    flock[i] = new Boid(
      random(0, CANVAS_X),
      random(0, CANVAS_Y),
      random(0, 360)
    );
  }
}

// Main draw loop
function draw() {
  background(200);
  text(("Flock: " + flock.length + " boids"), 10, 15);
  flock.forEach(b => b.run(flock));
}

function mouseDragged() {
  b = new Boid(mouseX, mouseY, random(0, 360));
  flock.push(b);
}


// Code Graveyard

/*

function mousePressed() {
  setup();
} 

let lv = p5.Vector.add(this.pos, this.vel);
line(this.pos.x, 
  this.pos.y,
  lv.x,
  lv.y
);

*/