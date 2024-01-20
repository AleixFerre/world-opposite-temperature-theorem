const noiseLevel = 200;
const noiseRadius = 1.5;
const increment = 0.005;

let theta = 0;
let first = true;

const gif = false;
let numbers = [];
let numbers2 = [];

const color_numbers1 = [248, 3, 252];
const color_numbers2 = [34, 227, 9];
const color_intersections = [94, 93, 227];

const sketch_graph = (p) => {
  p.setup = function () {
    const amount = p.TAU / increment;
    p.createCanvas(Math.floor(amount), noiseLevel, p.WEBGL);
    if (gif) {
      const d = p.TAU / 0.01;
      p.saveGif("graph_intersections.gif", d, { units: "frames" });
    }
  };

  p.draw = function () {
    p.background(255);
    numbers = createArray(p,theta);
    numbers2 = shiftArray(numbers,numbers.length / 2);

    p.stroke(...color_numbers1);p.strokeWeight(1);renderNumbers(numbers, p);
    p.stroke(...color_numbers2);p.strokeWeight(1);renderNumbers(numbers2, p);

    p.stroke(...color_intersections);p.strokeWeight(5);renderIntersection(numbers, numbers2, p);

    clearNumbers();
    theta += 0.01;
    
    if (theta > p.TAU) {
      theta -= p.TAU;
    }
    
  };

  function renderNumbers(num, p) {
    p.push();
    p.translate(-p.width / 2, -p.height / 2);

    p.noFill();
    p.beginShape();
    drawGraph(num, p);
    p.endShape();
    p.pop();
  }
};

const sketch_earth = (p) => {
  p.preload = function () {
    p.img = p.loadImage("assets/globe.jpg");
  };

  p.setup = function () {
    p.createCanvas(400, 400, p.WEBGL);
  };

  p.draw = function () {
    p.background(0);

    p.rotateY(p.frameCount * 0.01);
    p.texture(p.img);
    p.noStroke();
    p.sphere(100);

    p.rotateX(theta);
    p.fill("orange");
    p.torus(110, 3);
  };
};

const sketch_texture = (p) => {
  p.setup = function () {
    p.amount = p.TAU / increment;
    p.createCanvas(p.amount, p.amount, p.WEBGL);
    p.background(0);
    numbers = createArray(p,theta);
    numbers2 = shiftArray(numbers,numbers.length / 2);
    console.log(numbers);
    
  };

  p.draw = function () {
    
    p.stroke(255);
    p.strokeWeight(2);
    p.noFill();
    p.circle(20, 20);
    numbers = createArray(p,theta);
    numbers2 = shiftArray(numbers,numbers.length / 2);
    if(first){
      //renderIntersectionTextureF(numbers,numbers2,p);
      first = false;
    }
    renderIntersectionTexture(numbers, numbers2, p);
  };
};


/** -------------------------- */


/** DRAW */
new p5(sketch_graph);
//new p5(sketch_earth);
new p5(sketch_texture);



/** -------------------------- */



/** CREATORS */

function createArray(p,t){
  const pos = [50,50,50]
  const l_array = []
  for (let phi = 0; phi < p.TAU; phi += increment) {
    const x = noiseRadius * p.sin(phi) * p.cos(t);
    const y = noiseRadius * p.sin(phi) * p.sin(t);
    const z = noiseRadius * p.cos(phi);
    l_array.push(noiseLevel * p.noise(x + pos[0], y + pos[1], z + pos[2]));
  }
  return l_array
}
function shiftArray(array,n){
  let l_array = [];
  for(let x = 0; x < array.length; x++){
    l_array.push(array[((x+Math.floor(n))%array.length)]);
  }
  return l_array;
}

/** RENDERS */

function renderIntersection(num, num2, p) {
  p.push();
  p.translate(-p.width / 2, -p.height / 2);
  for (let x = 0; x < num.length - 1; x++) {
    if (num[x] == num2[x]) p.point(x, num[x]);
    if (num[x] > num2[x] && num[x + 1] < num2[x + 1]) p.point(x, (num[x] + num2[x]) / 2);
    if (num[x] < num2[x] && num[x + 1] > num2[x + 1]) p.point(x, (num[x] + num2[x]) / 2);
  }
  p.pop();
}
function renderIntersectionTexture(num, num2, p) {
  p.stroke(255);
  p.strokeWeight(5);
  p.push();
  p.translate(-p.width / 2, -p.height / 2);
  for (let x = 0; x < num.length - 1; x++) {
    
    if (num[x] == num2[x]) renderITPoints(p.frameCount, x);
    if (num[x] > num2[x] && num[x + 1] < num2[x + 1]) renderITPoints(p.frameCount, x/num.length*p.amount,p);
    if (num[x] < num2[x] && num[x + 1] > num2[x + 1]) renderITPoints(p.frameCount, x/num.length*p.amount,p);
    
  }
  p.pop();
}
function renderITPoints(x,y,p) {
  if(!p)return;
  p.point(x*2, y*2);
  p.point((x*2+p.amount/2)%p.amount, p.amount-y*2);
}

function renderIntersectionTextureF(num, num2, p) {
  console.log(p);
  if(!p)return;
  for(let i = 0; i<p.TAU; i+=0.001){
    num=createArray(p,i);
    num2=shiftArray(num,num.length);
    renderIntersectionTexture(num, num2, p)
  }
}

function renderFullIntersectionTexture(p) { // TODO
  let num = [];
  let num2 = [];
  for(let i = 0; i<p.TAU; i+=0.1){
    num=createArray(p,i);
    num2=shiftArray(num,num.length);
    renderIntersectionTexture(num, num2, p)
  }
  p.pop();
}

/** OTHER */

function drawGraph(num, p) {
  for (let i = 0; i < num.length; i++) {
    p.vertex(i, num[i]);
  }
}
function clearNumbers() {
  numbers.length = numbers2.length = 0;
}
function renderNumbers(num, p) {
  console.log(weight);
  p.strokeWeight(weight);
  p.stroke(...color);
  p.push();
  p.translate(-p.width / 2, -p.height / 2);

  p.noFill();
  p.beginShape();
  drawGraph(num, p);
  p.endShape();
  p.pop();
}