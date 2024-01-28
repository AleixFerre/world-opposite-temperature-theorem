const noiseLevel = 3;
const noiseRadius = 1.3;
const increment = 0.01;
const peixet = 0;

//per pixel
const width = 1600;
const height = 1600;
const size = 2

const rows = Math.floor(width/size);
const columns = Math.floor(height/size);

const grid = Array(rows).fill().map(() => 
               Array(columns));

//---------

const sketch_texture_points_smart = (p) => {
  p.setup = function () {
    p.createCanvas(width, height, p.WEBGL);
    p.translate(-p.width / 2, -p.height / 2);
    p.background(0);
  };

  p.draw = function () {
    //p.translate(-p.width / 2, -p.height / 2);
    p.background(0);
    p.stroke(255);
    p.strokeWeight(2);
    let pos = []
    pos = [50,50,50+p.frameCount*0.001];
    pos = [50,50,50];
    fillGrid(pos,p);
    createPointsPerPixel(pos,p);
  };
};


/** -------------------------- */

new p5(sketch_texture_points_smart);

/** -------------------------- */



/** CREATORS */
function createPointsPerPixel(pos,p){

  for(let i = 0; i < rows/2-1; i++){
    for(let j = 0; j < columns-1; j++){
      k = rows/2+i;
      l = columns-1-j;
      if(isIntersectionZone([grid[i][j],grid[i+1][j],grid[i][j+1],grid[i+1][j+1]],
                            [grid[k][l],grid[k+1][l],grid[k][l-1],grid[k+1][l-1]])){
        renderPointsInZone(i*size,j*size,pos,p);
      }
    }
  }

}
function renderPointsInZone(x,y,pos,p){
  p.push();
  p.translate(-p.width / 2, -p.height / 2);
  p.point(x, y);
  p.point(width/2+x, height-y-1);
  p.pop();
}
function createPointPairAtPosition(x,y,pos,p){
  phi = y/width*p.PI;
  t = x/width*p.TAU;
  return  createPointPair(t,phi,pos,p)
}
function createPointPair(t,phi,pos,p){
  const sp = p.sin(phi);const cp = p.cos(phi);
  const st = p.sin(t);const ct = p.cos(t);
  const spp = p.sin(phi+p.TAU/2);const cpp = p.cos(phi+p.TAU/2);
  const stt = p.sin(t+p.TAU/2);const ctt = p.cos(t)+p.TAU/2;


  const point_original = noiseLevel * p.noise( 
                        noiseRadius * sp * ct + pos[0],
                        noiseRadius * sp * st + pos[1],
                        noiseRadius * cp + pos[2]);
  const point_inverse = noiseLevel * p.noise(
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
  if(isIntersection(a[1],a[2],b[1],b[2])) return true;
  if(isIntersection(a[1],a[3],b[1],b[3])) return true;
  return false;
}
function fillGrid(pos,p){
  for(let i = 0; i < rows/2; i++){
    for(let j = 0; j < columns; j++){
      const [original,oposat] = createPointPairAtPosition(i*size,j*size,pos,p);
      grid[i][j] = original; 
      grid[rows/2+i][columns-1-j] = oposat;
    }
  }
}
//-------------


