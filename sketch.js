const noiseLevel = 100;
const noiseRadius = 10;
const increment = 0.01;

let theta = 0;

const gif = false;
const numbers = [];
const numbers2 = [];

function setup() {
  const amount = TAU / increment;
  createCanvas(floor(amount), noiseLevel, WEBGL);
  if (gif) {
    const d = TAU / 0.01;
    saveGif("graph_intersections.gif", d, { units: "frames" });
  }
}

function draw() {
  background(255);

  for (let phi = 0; phi < TAU; phi += 0.01) {
    const x = noiseRadius * sin(phi) * cos(theta);
    const y = noiseRadius * sin(phi) * sin(theta);
    const z = noiseRadius * cos(phi);
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
  