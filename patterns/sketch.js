const GAME_SIZE = 600;

let canvas;
let gridSize = 4;
let descDiv, infoDiv;
let sizeRadio, generateButton, tilesetSelect;
let score = 0, streak = 0; let highest_streak = 0;
let grid = [];
let tilesets = [];
let cur_tileset;
let selected = null;

function preload() {
  loadImage('tilesets/16xPrimitives.png', (img) => tilesets.push(createTileset('Primitives', 16, '#FFFFFF', '#000000', img)));
  loadImage('tilesets/32xCellular.png', (img) => tilesets.push(createTileset('Cellular', 32, '#363636', '#000000', img)));
  loadImage('tilesets/128xHexadecimal.png', (img) => tilesets.push(createTileset('Hexadecimal', 128, '#000000', '#00FF00', img)));
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
  cur_tileset = tilesets[0];
  tilesetSelect = createSelect();
  tilesets.forEach((ts) => { tilesetSelect.option(ts.name) });
  tilesetSelect.changed(changeTileset);
  tilesetSelect.class('site-font');
  tilesetSelect.position((windowWidth - GAME_SIZE) / 2 + 419, 781);
  createGrid();
}

function draw() {
  background(220);
  drawGrid();
  infoDiv.html(`<p><b>Score</b>: ${score} | <b>Streak</b>: ${streak} | <b>Highest Streak</b>: ${highest_streak}</p>`);
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let i = Math.floor(mouseX / width * gridSize);
    let j = Math.floor(mouseY / height * gridSize);
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

function createTileset(tilesetName, tileSize, bgColor, borderColor, tilesetImg) {
  let tileset = {
    name : tilesetName,
    size : tileSize,
    bg : bgColor,
    bd : borderColor,
    a : [],
    b : [],
    c : [],
    d : []
  };
  for (let x = 0; x < tilesetImg.width; x += tileSize) {
    let tile = createImage(tileSize, tileSize);
    tile.copy(tilesetImg, x, 0, tileSize, tileSize, 0, 0, tileSize, tileSize);
    tileset.a.push(tile);
  }
  for (let x = 0; x < tilesetImg.width; x += tileSize) {
    let tile = createImage(tileSize, tileSize);
    tile.copy(tilesetImg, x, tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize);
    tileset.b.push(tile);
  }
  for (let x = 0; x < tilesetImg.width; x += tileSize) {
    let tile = createImage(tileSize, tileSize);
    tile.copy(tilesetImg, x, 2 * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize);
    tileset.c.push(tile);
  }
  for (let x = 0; x < tilesetImg.width; x += tileSize) {
    let tile = createImage(tileSize, tileSize);
    tile.copy(tilesetImg, x, 3 * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize);
    tileset.d.push(tile);
  }
  return tileset;
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
    let tile_width = width / gridSize;
    let tile_height = height / gridSize;
    rect(this.i * tile_width, this.j * tile_height, tile_width, tile_height);    
    stroke(cur_tileset.bd);
    if (selected === this) { strokeWeight(3); stroke("#05F0FF"); }
    fill(cur_tileset.bg);
    rect(this.i * tile_width, this.j * tile_height, tile_width, tile_height);
    if (this.a >= 0) image(cur_tileset.a[this.a], this.i * tile_width, this.j * tile_height, tile_width, tile_height);
    if (this.b >= 0) image(cur_tileset.b[this.b], this.i * tile_width, this.j * tile_height, tile_width, tile_height);
    if (this.c >= 0) image(cur_tileset.c[this.c], this.i * tile_width, this.j * tile_height, tile_width, tile_height);
    if (this.d >= 0) image(cur_tileset.d[this.d], this.i * tile_width, this.j * tile_height, tile_width, tile_height);
    //fill("#FF00FF"); text(`${this.a} ${this.b} ${this.c} ${this.d}`, this.i * tile_width, this.j * tile_height + 10)
    pop();
  }
}

function createGrid() {
  // Pregenerate list of feature choices to ensure there are 2 of each chosen
  let a = []; let b = []; let c = []; let d = [];
  for (let i = 0; i < (gridSize * gridSize); i += 2) {
    let a_choice = Math.floor(random(0, cur_tileset.a.length));
    a.push(a_choice); a.push(a_choice);
    let b_choice = Math.floor(random(0, cur_tileset.b.length));
    b.push(b_choice); b.push(b_choice);
    let c_choice = Math.floor(random(0, cur_tileset.c.length));
    c.push(c_choice); c.push(c_choice);
    let d_choice = Math.floor(random(0, cur_tileset.d.length));
    d.push(d_choice); d.push(d_choice);
  }
  for (let i = 0; i < gridSize; i++) {
    let row = [];
    for (let j = 0; j < gridSize; j++) {
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
  for (let i = 0; i < gridSize; i++) 
    for (let j = 0; j < gridSize; j++) 
      grid[i][j].draw();
}

function generatePuzzle() {
  gridSize = sizeRadio.value();
  grid = [];
  createGrid();
  selected = null;
  score = 0; streak = 0; highest_streak = 0;
}

function changeTileset() {
  cur_tileset = tilesets.find(ts => ts.name == tilesetSelect.value());
  generatePuzzle();
}
