let myShader;
const fpsCounter = document.getElementById('fps');

const textureResMult = 2;
let _w, _h;

function preload() {
  // load each shader file (don't worry, we will come back to these!)
  myShader = loadShader('shaders/shader.vert', 'shaders/shader.frag');
  img_a = loadImage("assets/globe_a.png");
}

function setup() {
  // the canvas has to be created with WEBGL mode
  createCanvas(windowWidth, windowHeight - 40, WEBGL);
  setFrameRate(200);

  _w = windowWidth * textureResMult;
  _h = (windowHeight - 40) * textureResMult;
  console.log(_w, _h);
  buffer = createGraphics(_w, _h, WEBGL);
}

function draw() {
  background(33);
  orbitControl();

  fpsCounter.innerHTML = 'FPS: ' + floor(frameRate());

  buffer.background(0, 0);
  buffer.image(img_a, -_w / 2, -_h / 2, _w, _h);
  buffer.shader(myShader);

  myShader.setUniform('width', _w);
  myShader.setUniform('height', _h);
  myShader.setUniform('time', millis() / 15);

  texture(buffer);

  buffer.rect(0, 0, _w, _h);
  noStroke();
  sphere(350);
}
