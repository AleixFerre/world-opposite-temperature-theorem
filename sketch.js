let myShader;

function preload() {
  // load each shader file (don't worry, we will come back to these!)
  myShader = loadShader('shaders/shader.vert', 'shaders/shader.frag');
}

function setup() {
  // the canvas has to be created with WEBGL mode
  createCanvas(windowWidth, windowHeight, WEBGL);

  textGraphics = createGraphics(windowWidth, windowHeight);
}

function draw() {
  background(255);

  // shader() sets the active shader, which will be applied to what is drawn next
  shader(myShader);

  myShader.setUniform('tex0', textGraphics);
  myShader.setUniform('time', millis());
  myShader.setUniform('userMouse', [mouseX / width, 1.0 - mouseY / height]);

  // apply the shader to a rectangle taking up the full canvas
  rect(0, 0, width, height);
}