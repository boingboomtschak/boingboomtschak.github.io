// Globals
let playing;

// Setup
function setup() {
  // Create canvas, register mouse pressed event
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(playOscillator);
  
  // Set up Fast Fourier Transform for waveform analysis
  fft = new p5.FFT(0.8, 1024);
  
  // Create effect, filter, and oscillator and connect them
  rev = new p5.Reverb();
  lp = new p5.LowPass();
  osc = new p5.Oscillator('square');
  osc.disconnect();
  osc.connect(rev);
  rev.disconnect();
  rev.connect(lp);
}

// Draw loop
function draw() {
  // Set background
  background(220);
  
  // Constrain and map mouse input to oscillator and low pass frequency
  osc_freq = constrain(map(mouseX, 0, width, 100, 500), 100, 500);
  lp_freq = constrain(map(mouseY, height, 0, 10, 500), 10, 500);
  
  // Draw text on top left corner
  text('tap to play', 20, 20);
  text('oscillator frequency: ' + osc_freq.toFixed(2), 20, 40);
  text('low pass frequency: ' + lp_freq.toFixed(2), 20, 60);
  text('playing: ' + playing, 20, 80);
  
  // Grab FFT waveform and draw across Canvas
  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(20);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);
    circle(x, y, 2);
  }
  endShape();

  // If synth playing (mouse held) set oscillator and low pass frequency to constrain/mapped values
  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(osc_freq, 0.1);
    lp.freq(lp_freq, 0.1);
  }
}

function playOscillator() {
  // Set oscillator amplitude to 1, start oscillator, and update playing variable
  osc.amp(1);
  osc.start();
  playing = true;
}

function mouseReleased() {
  // Set oscillator amplitude to 0, and update playing variable
  osc.amp(0);
  playing = false;
}