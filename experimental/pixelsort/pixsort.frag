#define PI 3.1415926538

precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D image;
uniform int threshold;
uniform vec2 resolution;
uniform int iteration;

float grayscale(vec4 col) {
  return (col.r + col.g + col.b) / 3.0;
}

void main() {
  vec4 color = texture2D(image, vTexCoord);
  vec2 pix_size = vec2(1.0) / resolution;
  
  
  if (int(grayscale(color) * 255.0) > threshold) {
    vec2 pos = vTexCoord / pix_size;
    float dir = mod(float(iteration), 2.0) * 2.0 - 1.0;
    if (mod(pos.x, 2.0) < 1.0) { dir = dir * -1.0; }

    if (pos.x + dir > 0.0 && pos.x + dir < resolution.x) {
      vec4 offColor = texture2D(image, vec2(vTexCoord.x + (dir * pix_size.x), vTexCoord.y));

      if (int(grayscale(offColor) * 255.0) > threshold) {
        if ((dir == 1.0 && grayscale(color) > grayscale(offColor)) 
            || (dir == -1.0 && grayscale(color) < grayscale(offColor)))
          color = offColor;
      }
    }
  } 

  gl_FragColor = color; 
}