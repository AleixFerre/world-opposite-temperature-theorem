import FastNoiseLite from './assets/FastNoiseLite.js';

const noiseLevel = 6;
const noiseRadius = 0.4;
const increment = 0.001;
const peixet = 0;
let amount;
let img;
let img_a;
let font;
let phi;

let fastNoise;

let fpsSpan;
let pointsTexture;

//per pixel
const width = 1600;
const height = 1600;
const size = 5;

const rows = Math.floor(width/size);
const columns = Math.floor(height/size);

const grid = Array(rows).fill().map(() => 
               Array(columns));

//---------

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;

function preload() {
  img = loadImage("assets/globe.jpg");
  img_a = loadImage("assets/globe_a.png");
  font = loadFont('assets/Roboto-Regular.ttf');
  pointsTexture = loadImage('assets/pointsTextures.png');
}

function setup() {
  amount = TAU / increment;
  console.log(TAU / increment);
  //createCanvas(windowWidth, windowHeight - 60, WEBGL);
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

  pointsTexture = createImage(floor(width), floor(height), 'black');

  createCanvas(windowWidth, windowHeight - 60, WEBGL);
    translate(-width / 2, -height / 2);
    //background(0);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 60);
}

function draw() {
  background(33);
  orbitControl();

  background(0);
  stroke(255);
  strokeWeight(2);
  let pos = []
  pos = [50,50,50+frameCount*0.001];
  //pos = [50,50,50];
  fillGrid(pos);
  //createPointsPerPixel(pos);
  
  pointsTexture = createImage(floor(width), floor(height), img_a);
  pointsTexture.copy(img_a,0,0,img_a.width,img_a.height,0,0,width,height);
  pointsTexture.loadPixels();
  //createPoints(pos, pointsTexture);
  createPointsPerPixel(pos,pointsTexture);
  pointsTexture.updatePixels();
  //texture(pointsTexture);

  noStroke();
  noFill();
  texture(pointsTexture);
  sphere(400, 32, 32);

  if (frameCount % 1 === 0) {
    fpsSpan.elt.innerHTML = `FPS: ${floor(frameRate() * 100) / 100}`;
  }

  //noLoop();
  //pointsTexture.save('pointsTextures', 'png');

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


//-----------------------------

/** CREATORS */
function createPointsPerPixel(pos,img){

  for(let i = 0; i < rows/2; i++){
    for(let j = 0; j < columns; j++){
      let k = rows/2+i;
      let l = columns-1-j;
      let ka = (k+1)%rows;
      let la = (l-1)%columns;
      let ia = (i+1)%rows;
      let ja = (j+1)%columns;

      if(isIntersectionZone([grid[i][j],grid[ia][j],grid[i][ja],grid[ia][ja]],
                            [grid[k][l],grid[ka][l],grid[k][la],grid[ka][la]])){
        renderPointsInZone(i*size,j*size,pos,img);
      }
    }
  }

}
function renderPointsInZone(x,y,pos,img){
  const temp_array = Array(size+1).fill().map(() => Array(size+1));
  const temp_array_oposat = Array(size+1).fill().map(() => Array(size+1));
  for(let i = 0; i<size+1;i++){
    for(let j = 0; j<size+1;j++){
      const [original,oposat] = createPointPairAtPosition(x+i,y+j,pos);
      temp_array[i][j] = original;
      temp_array_oposat[i][j] = oposat;
    }
  }
  for(let i = 0; i<size;i++){
    for(let j = 0; j<size;j++){
      if(isIntersectionZone([temp_array[i][j],temp_array[i+1][j],temp_array[i][j+1],temp_array[i+1][j+1]],
                            [temp_array_oposat[i][j],temp_array_oposat[i+1][j],temp_array_oposat[i][j+1],temp_array_oposat[i+1][j+1]])){
        paintImage(x+i, y+j,2,img);
        paintImage(width/2+x+i, height-y-1-j,2,img);
      }
    }
  }

  
}
function paintImage(x,y,size,img){
  for(let i = 0; i < size; i++){
    for(let j = 0; j < size; j++){
      img.set(x+i, y+j,255);
    }
  }
}
function createPointPairAtPosition(x,y,pos){
  let phi = y/width*PI;
  let t = x/width*TAU;
  return  createPointPair(t,phi,pos)
}
function createPointPair(t,phi,pos){
  const sp = sin(phi);const cp = cos(phi);
  const st = sin(t);const ct = cos(t);
  const spp = sin(phi+TAU/2);const cpp = cos(phi+TAU/2);
  const stt = sin(t+TAU/2);const ctt = cos(t)+TAU/2;


  const point_original = noiseLevel * fastNoise.GetNoise( 
                        noiseRadius * sp * ct + pos[0],
                        noiseRadius * sp * st + pos[1],
                        noiseRadius * cp + pos[2]);
  const point_inverse = noiseLevel * fastNoise.GetNoise(
                        noiseRadius * spp * ct + pos[0],
                        noiseRadius * spp * st + pos[1],
                        noiseRadius * cpp + pos[2]);
  return [point_original,point_inverse];
} 

/** -------------------------- */


/** OTHER */

function isIntersection(x,x2,y,y2){
  if (x == y) return true;
  if (x+peixet > y-peixet && x2-peixet < y2+peixet) return true;
  if (x-peixet < y+peixet && x2+peixet > y2-peixet) return true;
  return false;
}
function isIntersectionZone(a,b){
  /*
  if(isIntersection(a[0],a[1],b[0],b[1])) return true;
  if(isIntersection(a[0],a[2],b[0],b[2])) return true;
  if(isIntersection(a[3],a[1],b[3],b[1])) return true;
  if(isIntersection(a[3],a[2],b[3],b[2])) return true;
  

  if(isIntersection(a[0],a[3],b[0],b[3])) return true;
  */
  if(isIntersection(a[0],a[1],b[0],b[1])) return true;
  if(isIntersection(a[0],a[2],b[0],b[2])) return true;
  if(isIntersection(a[3],a[1],b[3],b[1])) return true;
  if(isIntersection(a[3],a[2],b[3],b[2])) return true;
  return false;
}
function fillGrid(pos){
  for(let i = 0; i < rows/2; i++){
    for(let j = 0; j < columns; j++){
      const [original,oposat] = createPointPairAtPosition(i*size,j*size,pos);
      grid[i][j] = original; 
      grid[rows/2+i][columns-1-j] = oposat;
    }
  }
}
//-------------


