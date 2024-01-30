let myShader;
const l_width = 1600;
const l_height = 1600;

function preload() {
  // load each shader file (don't worry, we will come back to these!)
  myShader = loadShader('shaders/shader.vert', 'shaders/shader.frag');
  img_a = loadImage("assets/globe_a.png");
}

function setup() {
  // the canvas has to be created with WEBGL mode
  createCanvas(l_width, l_height, WEBGL);

  //textGraphics = createGraphics(windowWidth, windowHeight);
  buffer = createGraphics(l_width, l_height, WEBGL);
  buffer.noStroke();
}

function draw() {
  background(33);
  orbitControl();
  buffer.background(0,0,0,0);
  //image(buffer, 0, 0, 50, 50);
  buffer.image(img_a,-l_width/2,-l_height/2,l_width,l_height);;
  buffer.shader(myShader);
  // shader() sets the active shader, which will be applied to what is drawn next
  //shader(myShader);
  
  //pointsTexture = createImage(l_width, l_height, 0);

  myShader.setUniform('width', l_width);
  myShader.setUniform('height', l_height);
  myShader.setUniform('time', millis()/15);

  //myShader.copyToContext(pointsTexture);

  // apply the shader to a rectangle taking up the full canvas
  texture(buffer);
  
  //buffer.rect(0,0,l_width, l_height);
  buffer.rect(0,0,l_width, l_height);
  sphere(400, 32, 32);
  //rect(0, 0, l_width, l_height);
}