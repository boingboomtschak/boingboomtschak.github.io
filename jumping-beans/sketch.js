// Consts
const BEAN_FILES = ["assets/bean1.png","assets/bean2.png","assets/bean3.png","assets/bean4.png","assets/bean5.png","assets/bean6.png"];
const PIX_PER_CM = 50;
const BORDER_RADIUS = 10;
//const NUM_BEANS = 10;

const DELAY_SHAPE = 1.7239;
const DELAY_SCALE = 3.5195;
const DELAY_LOC = -0.0667;
const DISP_RATE = 3.9116;
const DISP_LOC = 0.1;
const FPS = 60;

// Globals
let bean_images = [];
let beans = [];
let img, fpsSlider, beanSliders;
let NUM_BEANS = 10;

// Classes
class Bean {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.delay = sampleDelay();
    this.img = random(bean_images);
    this.angle = sampleAngle();
  }
  move() {
    if (this.delay > 0) {
      // Count down delay if waiting
      this.delay -= (1 / FPS);
    }
    if (this.delay < 0) {
      // Sample delay, displacement, angle
      this.delay = sampleDelay();
      let disp = sampleDisp() * PIX_PER_CM;
      this.angle += sampleAngle();
      
      // Change drawn image
      this.img = random(bean_images);
      
      // Create velocity vector to apply
      let vel = createVector(1, 0);
      vel.rotate(this.angle);
      vel.setMag(disp);
      
      // Add velocity vector to position vector
      this.pos.add(vel);
      
      if (this.pos.x < BORDER_RADIUS || 
          this.pos.x > width - BORDER_RADIUS) {
        this.pos.x = map(this.pos.x, 0, width, width, 0);
      }
      if (this.pos.y < BORDER_RADIUS || 
          this.pos.y > height - BORDER_RADIUS) {
        this.pos.y = map(this.pos.y, 0, height, height, 0);
      }
    }
  }
  draw() {
    image(this.img, this.pos.x, this.pos.y);
    text(`Delay: ${round(this.delay, 1)}`, this.pos.x, this.pos.y-5);
  }
  run() {
    this.move();
    this.draw();
  }
}

// Sampling Functions
function sampleDelay() {
  let delay = jStat.invgamma.sample(DELAY_SHAPE, DELAY_SCALE) + DELAY_LOC;
  while (delay > 25) {
    delay = jStat.invgamma.sample(DELAY_SHAPE, DELAY_SCALE) + DELAY_LOC;
  }
  return delay;
}

function sampleDisp() {
  let disp = jStat.exponential.sample(DISP_RATE) + DISP_LOC;
  while (disp > 1.0) {
    disp = jStat.exponential.sample(DISP_RATE) + DISP_LOC;
  }
  return disp;
}

function sampleAngle() {
  return random(-PI, PI);
}

function preload() {
  BEAN_FILES.forEach(p => {
    img = loadImage(p);
    bean_images.push(img);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  beanSlider = createSlider(1, 40, 4);
  beanSlider.position(20, 20);
  for (let i = 0; i < NUM_BEANS; i++) {
    let bean = new Bean(random(0, width), random(0, height));
    beans.push(bean);
  }
}

function draw() {
  background(220);
  frameRate(FPS);
  if (NUM_BEANS != beanSlider.value()) {
    NUM_BEANS = beanSlider.value();
    beans = [];
    for (i = 0; i < NUM_BEANS; i++) {
      let bean = new Bean(random(0, width), random(0, height));
      beans.push(bean);
    }
  }
  text(`Beans: ${beanSlider.value()}`, beanSlider.x * 2 + beanSlider.width, 35);
  beans.forEach(b => b.run());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}