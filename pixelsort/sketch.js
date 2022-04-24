let fileInput, thresholdTitle, thresholdSlider, generateButton, sortFnSelect, sortPassSelect, progressTitle;
let srcImage = null;
let dstImage = null;
let threshold = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
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
  background(255);
  thresholdTitle.html(`Threshold: ${thresholdSlider.value()}`);
  if(srcImage) progressTitle.html('Ready!');
  if (srcImage) image(srcImage, 0, 0, width / 3, height);
  if (threshold) image(threshold, (width / 3), 0, width / 3, height);
  if (dstImage) image(dstImage, (width / 3) * 2, 0, width / 3, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (keyCode === 71) generate(); // G
  else if (keyCode === 67) { // C
    let _gfx = createGraphics(dstImage.width, dstImage.height);
    _gfx.image(dstImage, 0, 0, dstImage.width, dstImage.height);
    _gfx.elt.toBlob((blob) => {
      navigator.clipboard.write([new ClipboardItem({'image/png' : blob})]);
    }); 
  }
}

function handleFileInput(file) {
  if (file.type === 'image') {
    let file = fileInput.elt.files[0];
    srcImage = loadImage(URL.createObjectURL(file), () => {
      dstImage = createImage(srcImage.width, srcImage.height);
      dstImage.copy(srcImage, 0, 0, srcImage.width, srcImage.height, 0, 0, srcImage.width, srcImage.height);
      progressTitle.html('Working...');
      pixelsort(dstImage);
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
