import FastNoiseLite from './assets/FastNoiseLite.js';

const noiseLevel = 3;
const noiseRadius = 1.3;
const increment = 0.001;
const peixet = 0.001;
let amount;
let img;
let font;
let phi;

let fastNoise;

let fpsSpan;
let pointsTexture;

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;

function preload() {
  img = loadImage("assets/globe.jpg");
  font = loadFont('assets/Roboto-Regular.ttf');
  pointsTexture = loadImage('assets/pointsTextures.png');
}

function setup() {
  amount = TAU / increment;
  console.log(TAU / increment);
  createCanvas(windowWidth, windowHeight - 60, WEBGL);
  frameRate(150);

  fastNoise = new FastNoiseLite();
  fastNoise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2)
  fastNoise.SetSeed(123);
  fastNoise.SetFrequency(1);

  // pointsTexture = createImage(floor(amount), floor(amount), 'black');
  // pointsTexture.loadPixels();
  // createPoints([50, 50, 50], pointsTexture);
  // pointsTexture.updatePixels();
  // texture(pointsTexture);

  // pointsTexture.save('pointsTextures', 'png')

  fpsSpan = createSpan('FPS: ');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 60);
}

function draw() {
  background(33);
  orbitControl();

  noStroke();
  texture(pointsTexture);
  sphere(400, 32, 32);

  if (frameCount % 30 === 0) {
    fpsSpan.elt.innerHTML = `FPS: ${floor(frameRate() * 100) / 100}`;
  }
}


function createPoints(pos, newImg) {
  const l_increment_t = increment;
  let l_increment_phi = increment;

  for (let t = l_increment_t; t < TAU; t += l_increment_t) {
    phi = 0
    let [last_point_original, last_point_inverse] = createPointPair(t, phi, pos)
    for (let phi = l_increment_phi; phi < TAU; phi += l_increment_phi) {
      let [point_original, point_inverse] = createPointPair(t, phi, pos)
      if (isIntersection(last_point_original, point_original, last_point_inverse, point_inverse)) {
        const projX = floor(t / increment);
        const projY = floor(phi / increment);
        newImg.set(projX, projY, color(255));
      }
      [last_point_original, last_point_inverse] = [point_original, point_inverse];
    }
  }
}

function createPointPair(t, phi, pos) {
  const sp = sin(phi);
  const st = sin(t);
  const spp = sin(phi + TAU / 2);
  const cp = cos(phi);
  const ct = cos(t);
  const cpp = cos(phi + TAU / 2);

  const point_original = noiseLevel * fastNoise.GetNoise(
    noiseRadius * sp * ct + pos[0],
    noiseRadius * sp * st + pos[1],
    noiseRadius * cp + pos[2]);
  const point_inverse = noiseLevel * fastNoise.GetNoise(
    noiseRadius * spp * ct + pos[0],
    noiseRadius * spp * st + pos[1],
    noiseRadius * cpp + pos[2]);

  return [point_original, point_inverse];
}

function isIntersection(x, x2, y, y2) {
  if (x == y) return true;
  if (x + peixet > y - peixet && x2 - peixet < y2 + peixet) return true;
  if (x - peixet < y + peixet && x2 + peixet > y2 - peixet) return true;
  return false;
}
function drawGraph(num) {
  for (let i = 0; i < num.length; i++) {
    vertex(i, num[i]);
  }
}
function clearNumbers() {
  numbers.length = numbers2.length = 0;
}
function renderNumbers(num) {
  strokeWeight(weight);
  stroke(...color);
  push();
  translate(-width / 2, -height / 2);

  noFill();
  beginShape();
  drawGraph(num);
  endShape();
  pop();
}
