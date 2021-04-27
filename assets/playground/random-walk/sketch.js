const MOVE_AMOUNT = 10;
const MIN_COLOR = 0;
const MAX_COLOR = 200;
const FIT_SCREEN = true;

const particles = [];

let total_p = 0;

// ----------------------------

class Particle {
  constructor(x, y, col=[0, 0, 0]) {
    this.x = x;
    this.y = y;
    this.alive = true;
    this.col = col;
  }
  walk() {
    let lx = this.x;
    let ly = this.y;
    this.x += round(random(-MOVE_AMOUNT, MOVE_AMOUNT));
    this.y += round(random(-MOVE_AMOUNT, MOVE_AMOUNT));
    push();
    stroke(this.col);
    line(lx, ly, this.x, this.y);
    pop();
  }
  run() {
    this.walk();
    if (this.x < 0 || this.y < 0 || this.x > width || this.y > height) {
      this.alive = false;
    }
  }
}

// ----------------------------

function setup() {
  if (FIT_SCREEN) {
    createCanvas(windowWidth, windowHeight);
  } else {
    createCanvas(600, 600);
  }
  background(220);
  for (i = 0; i < 10; i++) {
    p = new Particle(random(0, width), random(0, height), randomColor());
    particles.push(p);
    total_p++;
  }
}

function draw() {
  particles.forEach(p => p.run());
  // culling off-screen particles
  for (i = 0; i < particles.length; i++) {
    if (!particles[i].alive) {
      particles.splice(i, 1);
    }
  }
  push();
  fill(255);
  rect(0, 0, width*0.3, height*0.06);
  fill(0);
  textSize(height*0.015);
  text(`Total Particles: ${total_p}\nLiving Particles: ${particles.length}`, width*0.01, height*0.01, width*0.3, height*0.07);
  pop();
}

function mouseDragged() {
  let p = new Particle(mouseX, mouseY, randomColor());
  particles.push(p);
  total_p++;
}

function mouseClicked() {
  let p = new Particle(mouseX, mouseY, randomColor());
  particles.push(p);
  total_p++;
}

// ----------------------------

function randomColor() {
  return [
    random(MIN_COLOR, MAX_COLOR),
    random(MIN_COLOR, MAX_COLOR),
    random(MIN_COLOR, MAX_COLOR)
  ];
}