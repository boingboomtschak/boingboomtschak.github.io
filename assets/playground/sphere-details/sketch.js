const SPHERE_RADIUS = 100;

let detailX, detailY, slider, radio;
let timer = 0;
let rand_check = false;
let stroke_check = true;

function setup() {
  createCanvas(600,500, WEBGL);
  detailX = 1;
  detailY = 1;
  slider = createSlider(50, 500, 250);
  rand_checkbox = createCheckbox('Random', false);
  rand_checkbox.changed(randomChecked);
  stroke_checkbox = createCheckbox('Stroke', true);
  stroke_checkbox.changed(strokeChecked);
  radio = createRadio();
  radio.option(0, "Fill");
  radio.option(1, "Normal Texture");
  radio.option(2, "Ambient Texture");
  radio.option(3, "Specular Texture");
  radio.option(4, "Emissive Texture");
  
}

function draw() {
  background(220);
  ambientLight(200);
  directionalLight(150, 150, 150, -width, height / 4, -50)
  push();
  //translate(width / 2, height / 2);
  rotateY(millis() / 1000);
  if (rand_check) {
    if (millis() >= timer + slider.value()) {
      detailX = floor(random(1, 24));
      detailY = floor(random(1, 24));
      timer = millis();
    }
  } else {
    detailX = floor(map(sin(millis() / slider.value()), -1, 1, 3, 24));
    detailY = floor(map(sin(millis() / slider.value()), -1, 1, 3, 24));
  }
  if (radio.value() == 0) {
    fill(200);
  } else if (radio.value() == 1) {
    normalMaterial();
  } else if (radio.value() == 2) {
    ambientMaterial(150);
  } else if (radio.value() == 3) {
    specularMaterial(150);
  } else if (radio.value() == 4) {
    emissiveMaterial(150);
  }
  if (stroke_check) {
    stroke(80);
  } else {
    noStroke();
  }
  sphere(SPHERE_RADIUS, detailX, detailY);
  pop();
}

function randomChecked() {
  rand_check = this.checked();
}

function strokeChecked() {
  stroke_check = this.checked();
}