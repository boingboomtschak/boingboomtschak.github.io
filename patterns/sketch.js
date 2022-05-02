const TILE_SIZE = 16;
const GAME_SIZE = 600;

let GRID_SIZE = 4;

let canvas;
let descDiv, infoDiv;
let sizeRadio, generateButton;
let score = 0, streak = 0; let highest_streak = 0;
let grid = [];
let A_img, B_img, C_img, D_img;
let A_features = [];
let B_features = [];
let C_features = [];
let D_features = [];
let selected = null;

function preload() {
  A_img = loadImage('tilesets/a_features.png');
  B_img = loadImage('tilesets/b_features.png');
  C_img = loadImage('tilesets/c_features.png');
  D_img = loadImage('tilesets/d_features.png');
}

function setup() {
  descDiv = createDiv();
  descDiv.position((windowWidth - GAME_SIZE) / 2, 20);
  descDiv.class('dispdiv');
  descDiv.html(GAME_DESCRIPTION)
  descDiv.size(GAME_SIZE - 20);
  infoDiv = createDiv();
  infoDiv.position((windowWidth - GAME_SIZE) / 2, 122);
  infoDiv.class('dispdiv');
  infoDiv.size(GAME_SIZE - 20, 40);
  canvas = createCanvas(GAME_SIZE, GAME_SIZE);
  canvas.position((windowWidth - GAME_SIZE) / 2, 165);
  canvas.style('border', '1px solid black');
  drawingContext.imageSmoothingEnabled = false;
  let generateDiv = createDiv();
  generateDiv.position((windowWidth - GAME_SIZE) / 2, 768);
  generateDiv.class('dispdiv');
  generateDiv.size(GAME_SIZE - 20, 40);
  generateDiv.html('<p>Size: </p>');
  sizeRadio = createRadio();
  sizeRadio.option('2');
  sizeRadio.option('4');
  sizeRadio.option('8');
  sizeRadio.option('16');
  sizeRadio.selected('4');
  sizeRadio.position((windowWidth - GAME_SIZE) / 2 + 43, 781);
  sizeRadio.class('site-font');
  generateButton = createButton('Generate');
  generateButton.class('site-font');
  generateButton.position((windowWidth - GAME_SIZE) / 2 + 520, 781);
  generateButton.mousePressed(generatePuzzle);
  A_features = createTileset(A_img);
  B_features = createTileset(B_img);
  C_features = createTileset(C_img);
  D_features = createTileset(D_img);
  createGrid();
}

function draw() {
  background(220);
  drawGrid();
  infoDiv.html(`<p><b>Score</b>: ${score} | <b>Streak</b>: ${streak} | <b>Highest Streak</b>: ${highest_streak}</p>`);
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let i = Math.floor(mouseX / width * GRID_SIZE);
    let j = Math.floor(mouseY / height * GRID_SIZE);
    if (selected == null && !grid[i][j].empty()) {
      selected = grid[i][j];
    } else {
      if (selected !== grid[i][j] && !grid[i][j].empty() && selected.match(grid[i][j])) {
        grid[i][j].match(selected);
        score++;
        streak++;
        if (streak > highest_streak) highest_streak = streak;
        selected = grid[i][j];
        if (grid[i][j].empty()) selected = null;
      } else {
        if (selected !== grid[i][j] && !grid[i][j].empty()) {
          streak = 0;
          selected = null;
        }
      } 
    }
  }
}

function createTileset(tileImg) {
  let tiles = [];
  for (let x = 0; x < tileImg.width; x += TILE_SIZE) {
    let tile = createImage(TILE_SIZE, TILE_SIZE);
    tile.copy(tileImg, x, 0, TILE_SIZE, TILE_SIZE, 0, 0, TILE_SIZE, TILE_SIZE);
    tiles.push(tile);
  }
  return tiles;
}

class Tile {
  constructor(i, j, a, b, c, d) {
    this.i = i; this.j = j;
    this.a = a; this.b = b; this.c = c; this.d = d;
  } 
  empty() {
    return (this.a < 0) && (this.b < 0) && (this.c < 0) && (this.d < 0);
  }
  match(tile) {
    let matched = false;
    if (this.a >= 0 && this.a == tile.a) { this.a = -1; tile.a = -1; matched = true; }
    if (this.b >= 0 && this.b == tile.b) { this.b = -1; tile.b = -1; matched = true; }
    if (this.c >= 0 && this.c == tile.c) { this.c = -1; tile.c = -1; matched = true; }
    if (this.d >= 0 && this.d == tile.d) { this.d = -1; tile.d = -1; matched = true; }
    return matched;
  }
  draw() {
    push();
    let tile_width = width / GRID_SIZE;
    let tile_height = height / GRID_SIZE;
    rect(this.i * tile_width, this.j * tile_height, tile_width, tile_height);    
    noStroke();
    if (selected === this) { strokeWeight(3); stroke("#05F0FF"); }
    rect(this.i * tile_width, this.j * tile_height, tile_width, tile_height);
    if (this.a >= 0) image(A_features[this.a], this.i * tile_width, this.j * tile_height, tile_width, tile_height);
    if (this.b >= 0) image(B_features[this.b], this.i * tile_width, this.j * tile_height, tile_width, tile_height);
    if (this.c >= 0) image(C_features[this.c], this.i * tile_width, this.j * tile_height, tile_width, tile_height);
    if (this.d >= 0) image(D_features[this.d], this.i * tile_width, this.j * tile_height, tile_width, tile_height);
    //fill("#FF00FF"); text(`${this.a} ${this.b} ${this.c} ${this.d}`, this.i * tile_width, this.j * tile_height + 10)
    pop();
  }
}

function createGrid() {
  // Pregenerate list of feature choices to ensure there are 2 of each chosen
  let a = []; let b = []; let c = []; let d = [];
  for (let i = 0; i < (GRID_SIZE * GRID_SIZE); i += 2) {
    let a_choice = Math.floor(random(0, A_features.length));
    a.push(a_choice); a.push(a_choice);
    let b_choice = Math.floor(random(0, B_features.length));
    b.push(b_choice); b.push(b_choice);
    let c_choice = Math.floor(random(0, C_features.length));
    c.push(c_choice); c.push(c_choice);
    let d_choice = Math.floor(random(0, D_features.length));
    d.push(d_choice); d.push(d_choice);
  }
  for (let i = 0; i < GRID_SIZE; i++) {
    let row = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      let t = new Tile();
      let a_i = Math.floor(random(0, a.length));
      let b_i = Math.floor(random(0, b.length));
      let c_i = Math.floor(random(0, c.length));
      let d_i = Math.floor(random(0, d.length));
      row.push(new Tile(i, j, a[a_i], b[b_i], c[c_i], d[d_i]));
      a.splice(a_i, 1);
      b.splice(b_i, 1);
      c.splice(c_i, 1);
      d.splice(d_i, 1);
    }
    grid.push(row); 
  }
}

function drawGrid() {
  for (let i = 0; i < GRID_SIZE; i++) 
    for (let j = 0; j < GRID_SIZE; j++) 
      grid[i][j].draw();
}

function generatePuzzle() {
  GRID_SIZE = sizeRadio.value();
  grid = [];
  createGrid();
  selected = null;
  score = 0; streak = 0; highest_streak = 0;
}
