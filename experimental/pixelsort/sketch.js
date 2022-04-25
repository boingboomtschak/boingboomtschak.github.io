let PADDING = 10;

let fileInput, thresholdTitle, thresholdSlider, generateButton, sortFnSelect, sortPassSelect, progressTitle;
let srcImage = null;
let dstImage = null;
let threshold = null;
let srcGfx, shaderGfx, dstGfx;
let pixSortShader;
let iteration = 0;

function preload() {
  pixSortShader = loadShader('pixsort.vert', 'pixsort.frag');
}

function setup() {
  srcGfx = createCanvas(windowWidth / 2 - 2, windowHeight - 2);
  srcGfx.style('border', '1px solid black');
  dstGfx = createGraphics(windowWidth / 2 - 2, windowHeight - 2);
  dstGfx.show();
  dstGfx.position(windowWidth / 2, 0);
  dstGfx.style('border', '1px solid black');
  dstGfx.id("dstGfx");
  backgroundDiv = createDiv();
  backgroundDiv.style('background-color', '#FFFFFF');
  backgroundDiv.style('border', '1px solid #000000');
  backgroundDiv.position(0, 0);
  backgroundDiv.style('width', '240px');
  backgroundDiv.style('height', '122px');
  fileInput = createFileInput(handleFileInput);
  fileInput.position(0, 0);
  thresholdSlider = createSlider(0, 255, 128);
  thresholdSlider.position(0, 20);
  thresholdTitle = createP(`Threshold: ${thresholdSlider.value()}`);
  thresholdTitle.position(135, 10);
  sortFnSelect = createSelect();
  sortFnSelect.position(0, 40);
  sortFnSelect.option('Lightness');
  sortFnSelect.option('Red');
  sortFnSelect.option('Green');
  sortFnSelect.option('Blue');
  let sortFnTitle = createP('Sorting channel');
  sortFnTitle.position(90, 29);
  sortPassSelect = createSelect();
  sortPassSelect.position(0, 60);
  sortPassSelect.option("Left");
  sortPassSelect.option("Right");
  sortPassSelect.option("Top");
  sortPassSelect.option("Bottom");
  let sortPassTitle = createP('Sorting direction');
  sortPassTitle.position(70, 49);
  generateButton = createButton("Generate");
  generateButton.position(0, 80);
  generateButton.mousePressed(generate);
  progressTitle = createP('No image loaded.');
  progressTitle.position(75, 69);
  let downloadButton = createButton("Download");
  downloadButton.position(0, 100);
  downloadButton.mousePressed(() => { if (dstImage) dstImage.save('pixelsorted', 'png'); });
  let copyClipboardButton = createButton("Copy to clipboard");
  copyClipboardButton.position(72, 100);
  copyClipboardButton.mousePressed(copyClipboard);
}

function draw() {
  background(200);
  dstGfx.background(200);
  thresholdTitle.html(`Threshold: ${thresholdSlider.value()}`);
  if (srcImage) {
    if (progressTitle.html() != 'Ready!') progressTitle.html('Ready!');
    let dispWidth, dispHeight, hPadding, vPadding;
    if (srcImage.width / srcImage.height > width / height) {
      dispWidth = width - (PADDING * 2);
      dispHeight = dispWidth * (srcImage.height / srcImage.width);
      hPadding = PADDING;
      vPadding = (height - dispHeight) / 2;
    } else {
      dispHeight = height - (PADDING * 2);
      dispWidth = dispHeight * (srcImage.width / srcImage.height);
      vPadding = PADDING;
      hPadding = (width - dispWidth) / 2;
    }
    image(srcImage, hPadding, vPadding, dispWidth, dispHeight);
  }
  if (dstImage) {
    shaderGfx.shader(pixSortShader);
    pixSortShader.setUniform('image', dstImage);
    pixSortShader.setUniform('threshold', thresholdSlider.value());
    pixSortShader.setUniform('resolution', [dstImage.width, dstImage.height]);
    pixSortShader.setUniform('iteration', iteration);
    shaderGfx.noStroke();
    shaderGfx.rect(-1 * (shaderGfx.width / 2), -1 * (shaderGfx.height / 2), shaderGfx.width, shaderGfx.height);
    let dispWidth, dispHeight, hPadding, vPadding;
    if (shaderGfx.width / shaderGfx.height > dstGfx.width / dstGfx.height) {
      dispWidth = dstGfx.width - (PADDING * 2);
      dispHeight = dispWidth * (shaderGfx.height / dstImage.width);
      hPadding = PADDING;
      vPadding = (dstGfx.height - dispHeight) / 2;
    } else {
      dispHeight = dstGfx.height - (PADDING * 2);
      dispWidth = dispHeight * (shaderGfx.width / dstImage.height);
      vPadding = PADDING;
      hPadding = (dstGfx.width - dispWidth) / 2;
    }
    dstGfx.image(shaderGfx, hPadding, vPadding, dispWidth, dispHeight);
    copyGfxToImage(shaderGfx, dstImage);
    iteration++;
  }
}

function windowResized() {
  resizeCanvas(windowWidth / 2 - 2, windowHeight - 2); 
  dstGfx.canvas.remove();
  dstGfx = createGraphics(windowWidth / 2 - 2, windowHeight - 2);
  dstGfx.show();
  dstGfx.position(windowWidth / 2, 0);
  dstGfx.style('border', '1px solid black');
  //dstGfx.position(windowWidth / 2, 0);
  //dstGfx.size(windowWidth / 2 - 2, windowHeight - 2);
  padding = 10;
}

function keyPressed() {
  if (keyCode === 71) generate(); // G
  else if (keyCode === 67) { // C
    let _gfx = createGraphics(dstImage.width, dstImage.height);
    _gfx.image(dstImage, 0, 0, dstImage.width, dstImage.height);
    _gfx.elt.toBlob((blob) => {
      navigator.clipboard.write([new ClipboardItem({'image/png' : blob})]);
    }); 
  } else if (keyCode === 82) {
    if (srcImage && dstImage)
      dstImage.copy(srcImage, 0, 0, srcImage.width, srcImage.height, 0, 0, dstImage.width, dstImage.height);
  }
}

function copyGfxToImage(gfx, image) {
  let ctx = gfx.canvas.getContext('webgl');
  let gfxData = new Uint8Array(gfx.width * gfx.height * 4);
  ctx.readPixels(0, 0, gfx.width, gfx.height, ctx.RGBA, ctx.UNSIGNED_BYTE, gfxData);
  image.loadPixels();
  for (let x = 0; x < image.width; x++) {
    for (let y = 0; y < image.height; y++) {
      const img_i = (x + y * image.width) * 4;
      const gfx_i = (x + (image.height - 1 - y) * image.width) * 4;
      image.pixels[img_i] = gfxData[gfx_i];
      image.pixels[img_i + 1] = gfxData[gfx_i + 1];
      image.pixels[img_i + 2] = gfxData[gfx_i + 2];
      image.pixels[img_i + 3] = gfxData[gfx_i + 3];
    }
  }
  image.updatePixels();
}

function mouseWheel(event) {
  if (width < height) PADDING = constrain(PADDING + (event.delta / 10), -width, width / 2 - 2);
  else PADDING = constrain(PADDING + (event.delta / 10), -height, height / 2 - 2);
}

function handleFileInput(file) {
  if (file.type === 'image') {
    let file = fileInput.elt.files[0];
    srcImage = loadImage(URL.createObjectURL(file), () => {
      dstImage = createImage(srcImage.width, srcImage.height);
      dstImage.copy(srcImage, 0, 0, srcImage.width, srcImage.height, 0, 0, dstImage.width, dstImage.height);
      PADDING = 10;
      progressTitle.html('Working...');
      threshold = createThreshold(srcImage, thresholdSlider.value());
      shaderGfx = createGraphics(dstImage.width, dstImage.height, WEBGL);
      //pixelsort(dstImage);
      iteration = 0;
    });
  }
}

function generate() {
  if (srcImage && dstImage) {
    dstImage.copy(srcImage, 0, 0, srcImage.width, srcImage.height, 0, 0, srcImage.width, srcImage.height);
    progressTitle.html('Working...');
    pixelsort(dstImage);
  }
}

function copyClipboard() {
  let _gfx = createGraphics(dstImage.width, dstImage.height);
  _gfx.image(dstImage, 0, 0, dstImage.width, dstImage.height);
  _gfx.elt.toBlob((blob) => {
    navigator.clipboard.write([new ClipboardItem({'image/png' : blob})]);
  });
}

function createThreshold(img, threshold) {
  img.loadPixels();
  thr = createImage(img.width, img.height);
  thr.loadPixels();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      const ind = (i + j * img.width) * 4;
      const lightness = Math.round((img.pixels[ind] + img.pixels[ind + 1] + img.pixels[ind + 2]) / 3);
      if (lightness < threshold) {
        thr.pixels[ind] = 0;
        thr.pixels[ind + 1] = 0;
        thr.pixels[ind + 2] = 0;
        thr.pixels[ind + 3] = 255;
      } else {
        thr.pixels[ind] = 255;
        thr.pixels[ind + 1] = 255;
        thr.pixels[ind + 2] = 255;
        thr.pixels[ind + 3] = 255;
      }
    }
  }
  thr.updatePixels();
  return thr;
}

class Pixel {
  constructor(r, g, b) {
    this.r = r; this.g = g; this.b = b;
    this.l = Math.round((this.r + this.g + this.b) / 3);
  }
}

function pixelsort(image) {
  threshold = createThreshold(image, thresholdSlider.value());
  image.loadPixels();
  let sortFn;
  switch(sortFnSelect.value()) {
    case 'Lightness':
      sortFn = (a, b) => (a.l > b.l) ? 1 : -1; 
      break;
    case 'Red':
      sortFn = (a, b) => (a.r > b.r) ? 1 : -1;
      break;
    case 'Green':
      sortFn = (a, b) => (a.g > b.g) ? 1 : -1; 
      break;
    case 'Blue':
      sortFn = (a, b) => (a.b > b.b) ? 1 : -1;  
      break;
  }
  let sortPass = sortPassSelect.value();
  if (sortPass == 'Left') {
    for (let y = 0; y < image.height; y++) {
      const stack = [];
      for (let x = 0; x < image.width; x++) {
        let ind = (x + y * image.width) * 4;
        if (threshold.pixels[ind] == 0) {
          if (stack.length > 0) {
            stack.sort(sortFn);
            for (let s = 0; s < stack.length; s++) {
              let offset = ((x - s - 1) + y * image.width) * 4;
              image.pixels[offset] = stack[s].r;
              image.pixels[offset + 1] = stack[s].g;
              image.pixels[offset + 2] = stack[s].b;
            }
            stack.length = 0;
          }
        } else {
          stack.push(new Pixel(
            image.pixels[ind], 
            image.pixels[ind + 1], 
            image.pixels[ind + 2]
          ));
        }
      }
      if (stack.length > 0) {
        stack.sort(sortFn);
        for (let s = 0; s < stack.length; s++) {
          let offset = ((image.width - s - 1) + y * image.width) * 4;
          image.pixels[offset] = stack[s].r;
          image.pixels[offset + 1] = stack[s].g;
          image.pixels[offset + 2] = stack[s].b;
        }
        stack.length = 0;
      }
    }
  }
  if (sortPass == 'Right') {
    for (let y = image.height - 1; y >= 0; y--) {
      const stack = [];
      for (let x = image.width - 1; x >= 0; x--) {
        let ind = (x + y * image.width) * 4;
        if (threshold.pixels[ind] == 0) {
          if (stack.length > 0) {
            stack.sort(sortFn);
            for (let s = 0; s < stack.length; s++) {
              let offset = ((x + s + 1) + y * image.width) * 4;
              image.pixels[offset] = stack[s].r;
              image.pixels[offset + 1] = stack[s].g;
              image.pixels[offset + 2] = stack[s].b;
            }
            stack.length = 0;
          }
        } else {
          stack.push(new Pixel(
            image.pixels[ind],
            image.pixels[ind + 1],
            image.pixels[ind + 2]
          ));
        }
      }
      if (stack.length > 0) {
        stack.sort(sortFn);
        for (let s = 0; s < stack.length; s++) {
          let offset = (s + y * image.width) * 4;
          image.pixels[offset] = stack[s].r;
          image.pixels[offset + 1] = stack[s].g;
          image.pixels[offset + 2] = stack[s].b;
        }
        stack.length = 0;
      }
    }
  }
  if (sortPass == 'Top') {
    for (let x = 0; x < image.width; x++) {
      const stack = [];
      for (let y = 0; y < image.height; y++) {
        let ind = (x + y * image.width) * 4;
        if (threshold.pixels[ind] == 0) {
          if (stack.length > 0) {
            stack.sort(sortFn);
            for (let s = 0; s < stack.length; s++) {
              let offset = (x + (y - s - 1) * image.width) * 4;
              image.pixels[offset] = stack[s].r;
              image.pixels[offset + 1] = stack[s].g;
              image.pixels[offset + 2] = stack[s].b;
            }
            stack.length = 0;
          }
        } else {
          stack.push(new Pixel(
            image.pixels[ind],
            image.pixels[ind + 1],
            image.pixels[ind + 2]
          ));
        }
      }
      if (stack.length > 0) {
        stack.sort(sortFn);
        for (let s = 0; s < stack.length; s++) {
          let offset = (x + (image.height - 1 - s) * image.width) * 4;
          image.pixels[offset] = stack[s].r;
          image.pixels[offset + 1] = stack[s].g;
          image.pixels[offset + 2] = stack[s].b;
        }
        stack.length = 0;
      }
    }
  }
  if (sortPass == 'Bottom') {
    for (let x = image.width - 1; x >= 0; x--) {
      const stack = [];
      for (let y = image.height - 1; y >= 0; y--) {
        let ind = (x + y * image.width) * 4;
        if (threshold.pixels[ind] == 0) {
          if (stack.length > 0) {
            stack.sort(sortFn);
            for (let s = 0; s < stack.length; s++) {
              let offset = (x + (y + s + 1) * image.width) * 4;
              image.pixels[offset] = stack[s].r
              image.pixels[offset + 1] = stack[s].g;
              image.pixels[offset + 2] = stack[s].b;
            }
            stack.length = 0;
          }
        } else {
          stack.push(new Pixel(
            image.pixels[ind],
            image.pixels[ind + 1],
            image.pixels[ind + 2]
          ));
        }
      }
      if (stack.length > 0) {
        stack.sort(sortFn);
        for (let s = 0; s < stack.length; s++) {
          let offset = (x + (s) * image.width) * 4;
          image.pixels[offset] = stack[s].r;
          image.pixels[offset + 1] = stack[s].g;
          image.pixels[offset + 2] = stack[s].b;
        }
        stack.length = 0;
      }
    }
  }
  image.updatePixels();
}
