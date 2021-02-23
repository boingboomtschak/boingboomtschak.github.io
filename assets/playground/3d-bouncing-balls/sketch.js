const BALL_SPEED = 7.5;
const BALL_SIZE = 30;
const BALL_AGE = 500;

let spaceWidth, spaceHeight, spaceDepth;
let font;
let ball_total = 0;

const balls = [];

class Ball {
  constructor(x, y, z, dir, col) {
    this.pos = createVector(x, y, z);
    this.vel = createVector(BALL_SPEED, BALL_SPEED, BALL_SPEED);
    this.vel.rotate(radians(dir));
    this.col = col;
    this.srk = [0, 0, 0, 150];
    this.age = BALL_AGE;
  }
  draw() {
    if (this.age <= BALL_AGE * 0.1) {
      this.col = [
        red(this.col),
        green(this.col),
        blue(this.col),
        alpha(this.col) * 0.8
      ];
      this.srk = [
        red(this.srk),
        green(this.srk),
        blue(this.srk),
        alpha(this.srk) * 0.8
      ]
    }
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    ambientMaterial(this.col);
    //stroke(this.srk);
    sphere(BALL_SIZE);
    pop();
  }
  move() {
    if (this.pos.x < -spaceWidth + BALL_SIZE) { // left border 
      let sn = createVector(BALL_SPEED, 0, 0);
      this.vel.reflect(sn);
    } else if (this.pos.x > spaceWidth - BALL_SIZE) { // right border
      let sn = createVector(-BALL_SPEED, 0, 0);
      this.vel.reflect(sn);
    } else if (this.pos.y < -spaceHeight + BALL_SIZE) { // top border
      let sn = createVector(0, BALL_SPEED, 0);
      this.vel.reflect(sn);
    } else if (this.pos.y > spaceHeight - BALL_SIZE) { // bottom border
      let sn = createVector(0, -BALL_SPEED, 0);
      this.vel.reflect(sn);
    } else if (this.pos.z > spaceDepth - BALL_SIZE) { // "close" border
      let sn = createVector(0, 0, -BALL_SPEED);
      this.vel.reflect(sn);
    } else if (this.pos.z < -spaceDepth + BALL_SIZE) { // "far" border
      let sn = createVector(0, 0, BALL_SPEED);
      this.vel.reflect(sn);
    }
    this.pos.add(this.vel);
  }
  run() {
    this.age--;
    if (this.age > 0) {
      this.draw();
      this.move();
      //this.collide();
    }
  }
  alive() {
    if (this.age <= 0) {
      return false;
    } else {
      return true;
    }
  }
  getPos() {
    return this.pos;
  }
  collide() {
    balls.forEach(b => {
      if (this.pos != b.getPos() && this.pos.dist(b.getPos()) <= BALL_SIZE && this.pos.dist(b.getPos()) > 0) {
        let sn = p5.Vector.sub(b.getPos(), this.pos);
        this.pos.reflect(sn);
      }
    });
  }
}

function preload() {
  font = loadFont("roboto.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  spaceWidth = width / 2;
  spaceHeight = height / 2;
  spaceDepth = (width + height) / 4;
  let col = [
    random(0, 255),
    random(0, 255),
    random(0, 255),
    200
  ];
  let ball = new Ball(
    random(-spaceWidth, spaceWidth),
    random(-spaceHeight, spaceHeight),
    random(-spaceDepth, spaceDepth),
    random(0, 360),
    col
  );
  balls.push(ball);
  ball_total++;
}

function draw() {
  background("#B7EDFF");
  purgeBalls(balls);
  ambientLight(150);
  pointLight(255, 255, 255, mouseX - width / 2, mouseY - height / 2, 100);
  drawBounds();
  balls.forEach(b => b.run());
  drawText();
}

function mouseDragged() {
  let col = [
    random(0, 255), 
    random(0, 255), 
    random(0, 255),
    255
  ];
  let b = new Ball(
    map(mouseX, 0, width, -spaceWidth/2, spaceWidth/2),
    map(mouseY, 0, height, -spaceHeight/2, spaceHeight/2),
    random(-spaceDepth, spaceDepth),
    random(0, 360),
    col
  );
  balls.push(b);
  ball_total++;
}

function purgeBalls(balls) {
  for (i = 0; i < balls.length; i++) {
    if (!balls[i].alive()) {
      balls.splice(i, i+1);
    }
  }
}

function drawBounds() {
  push();
  ambientMaterial(80);
  // Left border
  push();
  translate(-width/2, 0, 0);
  rotateY(PI/2);
  box(height, height, 10)
  pop();
  // Right border
  push();
  translate(width/2, 0, 0);
  rotateY(PI/2);
  box(height, height, 10)
  pop();
  // Top border
  push();
  translate(0, -height/2, 0);
  rotateX(-PI/2);
  box(width, height, 10);
  
  pop();
  // Bottom border
  push();
  translate(0, height/2, 0);
  rotateX(-PI/2);
  box(width, height, 10);
  pop(); 
  pop();
}

function drawText() {
  fill(0);
  textFont(font);
  textSize(20);
  translate(
    (-width / 2) + 10,
    (-height / 2) + 20,
    0
  );
  text("Total Balls: " + ball_total, 0, 0);
  text("Living Balls: " + balls.length, 0, 25);
}