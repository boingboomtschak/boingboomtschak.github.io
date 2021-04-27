const MINE_PROB = 0.6;
const WSQUARES = 20;
const HSQUARES = 20;

const board = [];
let wSize, hSize, mines, flagged;

// ------------------------

class Space {
  constructor(x, y, sx, sy, m) {
    this.x = x; // x position
    this.y = y; // y position
    this.sx = sx; // size of space in x dimension
    this.sy = sy; // size of space in y dimension
    this.mine = m; // bool if space is mine
    this.covered = true; // covered or not
    this.flagged = false;
    this.end = false;
  }
  draw() {
    push();
    if (this.covered) {
      // Draw covered square
      fill(128);
      rect(this.x, this.y, this.sx, this.sy);
      if (this.flagged) {
        fill(0);
        strokeWeight(((this.sx + this.sy) / 2)*0.1);
        line(this.x + this.sx / 2, this.y + this.sy*0.2, this.x + this.sx / 2,  this.y + this.sy*0.8);
        fill(255, 0, 0);
        strokeWeight(((this.sx + this.sy) / 2)*0.05);
        triangle(this.x + this.sx / 2, this.y + this.sy*0.2, this.x + this.sx / 2, this.y + this.sy / 2, this.x + this.sx, this.y + this.sy / 4);
      }
    } else {
      // Draw uncovered square
      if (this.end) {
        fill(255, 0, 0);
      } else {
        fill(255);
      }
      rect(this.x, this.y, this.sx, this.sy);
      if (this.flagged && !this.mine) {
        fill(0);
        stroke(0);
        // Draw mine
        ellipse(this.x + this.sx / 2, this.y + this.sy / 2, this.sx*0.6, this.sy*0.6)
        strokeWeight(((this.sx + this.sy) / 2)*0.15);
        line(this.x + this.sx*0.2, this.y + this.sy*0.2, this.x + this.sx*0.8, this.y + this.sy*0.8);
        line(this.x + this.sx*0.8, this.y + this.sy*0.2, this.x + this.sx*0.2, this.y + this.sy*0.8);
        line(this.x + this.sx / 2, this.y + this.sx*0.15, this.x + this.sx / 2, this.y + this.sy*0.85);
        line(this.x + this.sx*0.15, this.y + this.sy / 2, this.x + this.sx * 0.85, this.y + this.sy / 2);
        fill(255, 0, 0);
        stroke(255, 0, 0);
        line(this.x + this.sx*0.2, this.y + this.sy*0.2, this.x + this.sx*0.8, this.y + this.sy*0.8);
        line(this.x + this.sx*0.2, this.y + this.sy*0.8, this.x + this.sx*0.8, this.y + this.sy*0.2);
      } else if (this.mine && !this.flagged) {
        fill(0);
        // Draw mine
        ellipse(this.x + this.sx / 2, this.y + this.sy / 2, this.sx*0.6, this.sy*0.6)
        strokeWeight(((this.sx + this.sy) / 2)*0.15);
        line(this.x + this.sx*0.2, this.y + this.sy*0.2, this.x + this.sx*0.8, this.y + this.sy*0.8);
        line(this.x + this.sx*0.8, this.y + this.sy*0.2, this.x + this.sx*0.2, this.y + this.sy*0.8);
        line(this.x + this.sx / 2, this.y + this.sx*0.15, this.x + this.sx / 2, this.y + this.sy*0.85);
        line(this.x + this.sx*0.15, this.y + this.sy / 2, this.x + this.sx * 0.85, this.y + this.sy / 2);
      } else if (this.mine && this.flagged) {
        fill(128);
        rect(this.x, this.y, this.sx, this.sy);
        fill(0);
        stroke(0);
        strokeWeight(((this.sx + this.sy) / 2)*0.1);
        line(this.x + this.sx / 2, this.y + this.sy*0.2, this.x + this.sx / 2,  this.y + this.sy*0.8);
        fill(255, 0, 0);
        strokeWeight(((this.sx + this.sy) / 2)*0.05);
        triangle(this.x + this.sx / 2, this.y + this.sy*0.2, this.x + this.sx / 2, this.y + this.sy / 2, this.x + this.sx, this.y + this.sy / 4);
      } else if (this.danger > 0) {
        // Draw danger level
        fill(0);
        textSize(this.sy);
        text(this.danger, this.x + this.sy*0.4, this.y + this.sy*0.8);
      }
    }
    pop();
  }
  findDanger(board, bx, by) {
    // If space is mine, set danger to -1
    if (this.mine) {
      this.danger = -1;
      return;
    }
    this.danger = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for(let dy = -1; dy <= 1; dy++) {
        if (dx != 0 || dy != 0) {
          if (bx + dx >= 0 && 
              bx + dx < WSQUARES && 
              by + dy >= 0 && 
              by + dy < HSQUARES) {
            if(board[bx + dx][by + dy].mine) {
              this.danger++;
            }
          }
          
        }
      }
    }
  }
}

// ------------------------

function setup() {
  createCanvas(500, 500);
  //createCanvas(windowWidth, windowHeight);
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  wSize = (width*0.9 - width*0.1) / WSQUARES;
  hSize = (height*0.9 - height*0.2) / HSQUARES;
  console.log(`wSize : ${wSize} | hSize : ${hSize}`);
  for (i = 0; i < WSQUARES; i++) {
    let row = [];
    for (j = 0; j < HSQUARES; j++) {
      let m = Boolean(round(random(0, MINE_PROB)));
      let s = new Space(width*0.1+i*wSize,
                        height*0.2+j*hSize,
                        wSize,
                        hSize,
                        m);
      row.push(s);
    }
    board.push(row);
  }
  mines = calcMines(board);
  console.log(`Mines: ${mines}`);
  for (i = 0; i < WSQUARES; i++) {
    for (j = 0; j < HSQUARES; j++) {
      board[i][j].findDanger(board, i, j);
    }
  }
  flagged = 0;
}

function draw() {
  background(220);
  drawBoard();
  board.forEach(r => r.forEach(s => s.draw()));
}

function mouseReleased() {
  if (mouseButton == CENTER) {
    return;
  }
  if (mouseX > width*0.8 && mouseX < width*0.85 && mouseY > height*0.08 && mouseY < height*0.13) {
    // Clicking reset button
    // Clearing out board
    while (board.length > 0) {
      board.splice(0, 1);
    }
    // Setting up new game
    for (i = 0; i < WSQUARES; i++) {
      let row = [];
      for (j = 0; j < HSQUARES; j++) {
        let m = Boolean(round(random(0, MINE_PROB)));
        let s = new Space(width*0.1+i*wSize,
                          height*0.2+j*hSize,
                          wSize,
                          hSize,
                          m);
        row.push(s);
      }
      board.push(row);
    }
    mines = calcMines(board);
    console.log(`Mines: ${mines}`);
    for (i = 0; i < WSQUARES; i++) {
      for (j = 0; j < HSQUARES; j++) {
        board[i][j].findDanger(board, i, j);
      }
    }
    flagged = 0;
    return;
  }
  // Check if mouse is inside the board
  if (mouseX < width*0.9 && mouseX > width*0.1 && mouseY < height*0.9 && mouseY > height*0.2) {
    // Find x and y index for board array from mouseX and mouseY
    let x = floor((mouseX - width*0.1) / wSize);
    let y = floor((mouseY - height*0.2) / hSize);
    // Flag spaces on right click
    if (mouseButton == RIGHT) {
      if (!board[x][y].covered) {
        return;
      }
      if (board[x][y].flagged) {
        board[x][y].flagged = false;
        flagged--;
      } else {
        board[x][y].flagged = true;
        flagged++;
      }
      return;
    }
    if (board[x][y].flagged) {
      return;
    }
    board[x][y].covered = false;
    if (board[x][y].mine) {
      board[x][y].end = true;
      // Uncover board if player clicks on mine
      board.forEach(r => r.forEach(s => {
        s.covered = false;
      }));
    } else if (board[x][y].danger == 0) {
      // Recursively uncover spaces with 0 danger and their periphery as they are guaranteed to have no mines
      recurUncover(board, x, y);
    }
  }
}

/*
function keyPressed() {
  /* if (keyCode == 82) {
    // "R" is pressed (debug)
    // Uncover all spaces
    board.forEach(r => r.forEach(s => s.covered = false));
  } else if (keyCode == 71) {
    // "G" is pressed (debug)
    // Randomly set new mines in all uncovered spaces
    board.forEach(r => r.forEach(s => { 
      if (s.covered) {
        s.mine = Boolean(round(random(0, MINE_PROB)));
      }
    }));
    mines = calcMines(board);
    // Recalculate danger for each space
    for (i = 0; i < WSQUARES; i++) {
      for (j = 0; j < HSQUARES; j++) {
        board[i][j].findDanger(board, i, j);
      }
    }
    // Uncover new empty blocks
    for (i = 0; i < WSQUARES; i++) {
      for (j = 0; j < HSQUARES; j++) {
        if (!board[i][j].covered) {
          recurUncover(board, i, j);
        }
      }
    }
  } 
} 
*/

// ------------------------ 

function drawBoard() {
  push();
  fill(255);
  rect(width*0.1, height*0.05, width*0.8, height*0.12);
  rect(width*0.1, height*0.2, width*0.8, height*0.7);
  fill(255, 0, 0);
  square(width*0.8, height*0.08, width*0.05);
  fill(0);
  textSize(12);
  text("Reset", width*0.797, height*0.155)
  textSize(24);
  text(`Mines: ${mines - flagged}`, width*0.11, height*0.125);
  pop();
  
}

function calcMines(board) {
  sum = 0;
  for (i = 0; i < WSQUARES; i++) {
    for (j = 0; j < HSQUARES; j++) {
      if (board[i][j].mine) {
        sum++;
      }
    }
  }
  return sum;
}

function recurUncover(board, bx, by) {
  for (let dx = -1; dx <= 1; dx++) {
    for(let dy = -1; dy <= 1; dy++) {
      if (dx != 0 || dy != 0) {
        if (bx + dx >= 0 && 
            bx + dx < WSQUARES && 
            by + dy >= 0 && 
            by + dy < HSQUARES) {
          if (board[bx + dx][by + dy].covered && 
              !board[bx + dx][by + dy].flagged) {
            board[bx + dx][by + dy].covered = false;
            if(board[bx + dx][by + dy].danger == 0) {
              recurUncover(board, bx + dx, by + dy);
            }
          }
        }
      }
    }
  }
}

