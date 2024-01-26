const noiseLevel = 3;
const noiseRadius = 1.3;
const increment = 0.01;
const peixet = 0.001;

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
    numbers = createArray(p,theta,[50,50,50]);
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
  p.preload = function () {
    p.img = p.loadImage("assets/globe.jpg");
  };
  p.setup = function () {
    p.amount = p.TAU / increment;
    p.createCanvas(p.amount, p.amount, p.WEBGL);
    p.translate(-p.width / 2, -p.height / 2);
    p.background(0);
    //p.image(p.img,0,0,p.amount, p.amount);
    //numbers = createArray(p,theta,[50,50,(50+p.frameCount)]);
    //numbers2 = shiftArray(numbers,numbers.length / 2);
    
  };

  p.draw = function () {
    p.background(0);
    p.stroke(0);
    p.strokeWeight(2);
    numbers = createArray(p,theta,[50,50,50]);
    numbers2 = shiftArray(numbers,numbers.length / 2);

    renderIntersectionTextureF(p);
    //p.noLoop();
    //renderIntersectionTexture(numbers, numbers2, p);
  };
};

const sketch_texture_points = (p) => {
  let points = [];
  p.preload = function () {
    p.img = p.loadImage("assets/globe.jpg");
  };
  p.setup = function () {
    p.amount = p.TAU / increment;
    console.log(p.TAU / increment);
    p.createCanvas(p.amount, p.amount, p.WEBGL);
    p.translate(-p.width / 2, -p.height / 2);
    p.background(0);
    //p.image(p.img,0,0,p.amount, p.amount);
    //numbers = createArray(p,theta,[50,50,(50+p.frameCount)]);
    //numbers2 = shiftArray(numbers,numbers.length / 2);

    points = createPoints(p,[50,50,50]);
    //console.log(createPoints(p,[50,50,50]));
    
  };

  p.draw = function () {
    console.log("A");
    p.background(0);
    p.stroke(255);
    p.strokeWeight(2);
    renderPointArray(createPoints(p,[50,50,50+p.frameCount*0.005]),p);
    //renderAndCreatePoints(p,[50,50,50+p.frameCount*0.01]);

    //p.noLoop();
    //renderIntersectionTexture(numbers, numbers2, p);
  };
};


/** -------------------------- */


/** DRAW */
//new p5(sketch_graph);
//new p5(sketch_earth);
//new p5(sketch_texture);
new p5(sketch_texture_points);



/** -------------------------- */



/** CREATORS */

function createPoints(p,pos){
  const l_points = [];
  const l_increment_t = increment;
  let l_increment_phi = increment;

  let last_point_original = 0;
  let last_point_inverse = 0;
  let point_original = 0;
  let point_inverse = 0;

  for(let t = l_increment_t; t < p.TAU; t += l_increment_t){
    phi = 0
    let [last_point_original,last_point_inverse] = createPointPair(t,phi,pos,p);
    for (let phi = l_increment_phi; phi < p.TAU/2; phi += l_increment_phi) {
      let [point_original,point_inverse] = createPointPair(t,phi,pos,p);
      
      if (isIntersection(last_point_original,point_original,last_point_inverse,point_inverse)) {
        l_points.push([t * 1 / increment,phi * 2 / increment ])
      }
      [last_point_original,last_point_inverse] = [point_original,point_inverse];
    }
  }
  for(let phi = l_increment_t; phi < p.TAU/2; phi += l_increment_t){
    t = 0;
    let [last_point_original,last_point_inverse] = createPointPair(t,phi,pos,p);

    for (let t = l_increment_phi; t < p.TAU; t += l_increment_phi) {
      let [point_original,point_inverse] = createPointPair(t,phi,pos,p);
      
      if (isIntersection(last_point_original,point_original,last_point_inverse,point_inverse)) {
        l_points.push([t * 1 / increment,phi * 2 / increment ])
      }
      [last_point_original,last_point_inverse] = [point_original,point_inverse];
    }
  }
  return l_points
}
function createPointPair(t,phi,pos,p){
  const sp = p.sin(phi);
  const st = p.sin(t);
  const spp = p.sin(phi+p.TAU/2);
  const cp = p.cos(phi);
  const ct = p.cos(t);
  
  const cpp = p.cos(phi+p.TAU/2)
  const point_original = noiseLevel * p.noise( 
                        noiseRadius * sp * ct + pos[0],
                        noiseRadius * sp * st + pos[1],
                        noiseRadius * cp + pos[2]);
  const point_inverse = noiseLevel * p.noise(
                        noiseRadius * spp * ct + pos[0],
                        noiseRadius * spp * ct + pos[1],
                        noiseRadius * cpp + pos[2]);
  return [point_original,point_inverse];
}
function createArray(p,t,pos){
  //const pos = [50,50,50]
  const l_array = []
  for (let phi = 0; phi < p.TAU; phi += increment) {
    const x = noiseRadius * p.sin(phi) * p.cos(t);
    const y = noiseRadius * p.sin(phi) * p.sin(t);
    const z = noiseRadius * p.cos(phi);
    l_array.push(noiseLevel * p.noise(x + pos[0], y + pos[1], z + pos[2]));
  }
  return l_array
}
function createArray2(p,t,pos){
  //const pos = [50,50,50]
  const l_array = []
  for (let phi = 0; phi < p.TAU; phi += increment) {
    const x = noiseRadius * p.sin(t) * p.cos(phi);
    const y = noiseRadius * p.sin(t) * p.sin(phi);
    const z = noiseRadius * p.cos(t);
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
function renderPointArray(points, p) {
  p.push();
  p.translate(-p.width / 2, -p.height / 2);
  for (let x = 0; x < points.length; x++) {
    p.point(points[x][0], points[x][1]);
  }
  p.pop();
}
function renderAndCreatePoints(p,pos){
  const l_increment_t = increment;
  let l_increment_phi = increment;

  let last_point_original = 0;
  let last_point_inverse = 0;
  let point_original = 0;
  let point_inverse = 0;

  for(let t = l_increment_t; t < p.TAU; t += l_increment_t){
    phi = 0
    let [last_point_original,last_point_inverse] = createPointPair(t,phi,pos,p);
    for (let phi = l_increment_phi; phi < p.TAU/2; phi += l_increment_phi) {
      let [point_original,point_inverse] = createPointPair(t,phi,pos,p);
      
      if (isIntersection(last_point_original,point_original,last_point_inverse,point_inverse)) {
        p.point([t * 1 / increment,phi * 2 / increment ]);
      }
      [last_point_original,last_point_inverse] = [point_original,point_inverse];
    }
  }
  for(let phi = l_increment_t; phi < p.TAU/2; phi += l_increment_t){
    t = 0;
    let [last_point_original,last_point_inverse] = createPointPair(t,phi,pos,p);

    for (let t = l_increment_phi; t < p.TAU; t += l_increment_phi) {
      let [point_original,point_inverse] = createPointPair(t,phi,pos,p);
      
      if (isIntersection(last_point_original,point_original,last_point_inverse,point_inverse)) {
        p.point([t * 1 / increment,phi * 2 / increment ])
      }
      [last_point_original,last_point_inverse] = [point_original,point_inverse];
    }
  }
}
function renderIntersectionTexture(num, p, x) {
  p.stroke(255);
  p.strokeWeight(3);
  p.push();
  p.translate(-p.width / 2, -p.height / 2);
  for (let l_x = 0; l_x < num.length - 1; l_x++) {
    const l_y = ((l_x+Math.floor(num.length/2))%num.length)
    const l_y2 = ((l_x+1+Math.floor(num.length/2))%num.length)
    if (num[l_x] == num[l_y]) renderITPoints(x, l_x,p);
    if (num[l_x] > num[l_y] && num[l_x + 1] < num[l_y2]) renderITPoints(x, l_x/num.length*p.amount,p);
    if (num[l_x] < num[l_y] && num[l_x + 1] > num[l_y2]) renderITPoints(x, l_x/num.length*p.amount,p);
    
  }
  p.pop();
}
function renderIntersectionTexture2(num, p, x) {
  p.stroke(255);
  p.strokeWeight(3);
  p.push();
  p.translate(-p.width / 2, -p.height / 2);
  for (let l_x = 0; l_x < num.length - 1; l_x++) {
    const l_y = ((l_x+Math.floor(num.length/2))%num.length)
    const l_y2 = ((l_x+1+Math.floor(num.length/2))%num.length)
    if (num[l_x] == num[l_y]) renderITPoints(l_x*2, x*2,p);
    if (num[l_x] > num[l_y] && num[l_x + 1] < num[l_y2]) renderITPoints(l_x/num.length*p.amount*2,x*2,p);
    if (num[l_x] < num[l_y] && num[l_x + 1] > num[l_y2]) renderITPoints(l_x/num.length*p.amount*2,x*2,p);
    
  }
  p.pop();
}
function renderITPoints(x,y,p) {
  p.point(x*2, y*2);
  //p.point((x*2+p.amount/2)%p.amount, p.amount-y*2);
}
function renderIntersectionTextureF(p) {
  for(let i = 0; i<p.TAU; i+=0.008){
    let x = p.width * i / p.TAU / 2;
    let num=createArray(p,i,[50,50,50+p.frameCount/50]);
    //const num2=shiftArray(num,num.length/2);
    renderIntersectionTexture(num, p, x);
    num=createArray2(p,i,[50,50,50+p.frameCount/50]);
    renderIntersectionTexture2(num, p, x);
  }
}

/** OTHER */

function isIntersection(x,x2,y,y2){
  if (x == y) return true;
  if (x+peixet > y-peixet && x2-peixet < y2+peixet) return true;
  if (x-peixet < y+peixet && x2+peixet > y2-peixet) return true;
  return false;
}
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