const noiseLevel = 100;
const noiseRadius = 10;
const increment = 0.01;

let theta = 0;

let amount;

const numbers = [];
const numbers2 = [];

function setup() {
  amount = TAU / increment;
  const d = TAU / 0.01;
  createCanvas(floor(amount), noiseLevel, WEBGL);
  // saveGif('yourmoma.gif', d, {units: 'frames'});
}

function draw() {
  background(255);

  for (let fi = 0; fi < TAU; fi += 0.01) {
    const x = noiseRadius * sin(fi) * cos(theta);
    const y = noiseRadius * sin(fi) * sin(theta);
    const z = noiseRadius * cos(fi);
    numbers.push(noiseLevel * noise(x + 50, y + 50, z + 50));
  }
  for (let i = floor(numbers.length / 2); i < numbers.length; i++) {
    numbers2.push(numbers[i]);
  }
  for (let i = 0; i < floor(numbers.length / 2); i++) {
    numbers2.push(numbers[i]);
  }

  strokeWeight(1);

  stroke(248, 3, 252);
  renderNumbers(numbers);

  stroke(34, 227, 9);
  renderNumbers(numbers2);

  stroke(94, 93, 227);
  strokeWeight(5);
  renderIntersection(numbers, numbers2);

  clearNumbers();
  theta += 0.01;
  if (theta > TAU) theta = 0;
  // noLoop();
}

function renderNumbers(num) {
  push();
  translate(-width / 2, -height / 2);

  noFill();
  beginShape();

  drawGraph(num);

  endShape();
  pop();
}

function renderIntersection(num, num2) {
  push();
  translate(-width / 2, -height / 2);
  for (let x = 0; x < num.length - 1; x++) {
    if (num[x] == num2[x]) point(x, num[x]);
    if (num[x] > num2[x] && num[x + 1] < num2[x + 1]) point(x, (num[x] + num2[x]) / 2);
    if (num[x] < num2[x] && num[x + 1] > num2[x + 1]) point(x, (num[x] + num2[x]) / 2);
  }
  pop();
}

function drawGraph(num) {
  for (let i = 0; i < num.length; i++) {
    vertex(i, num[i]);
  }
}

function clearNumbers() {
  numbers.length = numbers2.length = 0;
}
