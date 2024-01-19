const noiseLevel = 100;
const noiseRadius = 10;
const increment = 0.01;

let theta = 0;

const gif = false;
const numbers = [];
const numbers2 = [];

const color_numbers1 = [248, 3, 252];
const color_numbers2 = [34, 227, 9];
const color_intersections = [94, 93, 227];

const sketch_graph = (p) => {
  p.setup = function () {
    const amount = p.TAU / increment;
    p.createCanvas(p.floor(amount), noiseLevel, p.WEBGL);
    if (gif) {
      const d = p.TAU / 0.01;
      p.saveGif("graph_intersections.gif", d, { units: "frames" });
    }
  };

  p.draw = function () {
    p.background(255);

    for (let phi = 0; phi < p.TAU; phi += 0.01) {
      const x = noiseRadius * p.sin(phi) * p.cos(theta);
      const y = noiseRadius * p.sin(phi) * p.sin(theta);
      const z = noiseRadius * p.cos(phi);
      numbers.push(noiseLevel * p.noise(x + 50, y + 50, z + 50));
    }
    for (let i = p.floor(numbers.length / 2); i < numbers.length; i++) {
      numbers2.push(numbers[i]);
    }
    for (let i = 0; i < p.floor(numbers.length / 2); i++) {
      numbers2.push(numbers[i]);
    }

    p.strokeWeight(1);

    p.stroke(...color_numbers1);
    renderNumbers(numbers, p);

    p.stroke(...color_numbers2);
    renderNumbers(numbers2, p);

    p.stroke(...color_intersections);
    p.strokeWeight(5);
    renderIntersection(numbers, numbers2, p);

    clearNumbers();
    theta += 0.01;
    if (theta > p.TAU) theta = 0;
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
  };

  p.draw = function () {
    p.stroke(255);
    p.strokeWeight(5);
    p.noFill();
    p.circle(20, 20);

    renderIntersectionTexture(numbers, numbers2, p);
    if (p.frameCount > p.amount) {
      console.log("sacabao");
      p.noLoop();
    }
  };
};

// Create the multiple p5 instances
new p5(sketch_graph);
new p5(sketch_earth);
new p5(sketch_texture);

function renderNumbers(num, p) {
  p.push();
  p.translate(-p.width / 2, -p.height / 2);

  p.noFill();
  p.beginShape();
  drawGraph(num, p);
  p.endShape();
  p.pop();
}

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
  p.strokeWeight(10);
  p.push();
  p.translate(-p.width / 2, -p.height / 2);
  for (let x = 0; x < num.length - 1; x++) {
    if (num[x] == num2[x]) p.point(p.frameCount, num[x]);
    if (num[x] > num2[x] && num[x + 1] < num2[x + 1]) p.point(p.frameCount, (num[x] + num2[x]) / 2);
    if (num[x] < num2[x] && num[x + 1] > num2[x + 1]) p.point(p.frameCount, (num[x] + num2[x]) / 2);
  }
  p.pop();
}

function drawGraph(num, p) {
  for (let i = 0; i < num.length; i++) {
    p.vertex(i, num[i]);
  }
}

function clearNumbers() {
  numbers.length = numbers2.length = 0;
}
