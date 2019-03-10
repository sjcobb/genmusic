"strict mode";
var DRAW_MODE = "gl.LINE_STRIP";
var SHAPE_VERTEX = 2;
var EMIT_RATE = 1;
var AUTO_ROTATE = [0.2,-0.2,0];
var particleList = [];
var addqueue = [];
var totalFrames = 0;
var startTime = 0;
var GRAVITY_STRENGTH = 0.00008;
const devianceg = 0.00005;
const deviancev = 0.0003
const seed = 25565;

var removal = [];
var PARTICLE_LIFE = 560;
var INITIAL_VELOCITY = 0;
var VELOCITY_VARIANCE = 0.05;
var AUTO_ROTATE_TOGGLE = 1;

var Particle = function(x,y,z,c,t){
  this.x = x;
  this.y = y+1.5;
  this.z = z;
  this.v = [0.0,0.0,0.0];
  this.c = c;
  this.t = t;
}


var varydist = 2;
function squareRandom(number,min,max,voicelocation,lifespan)
{

  let outs = [];
  let x,y,z,cr,cg,cb;
  //4 locations +x,+z, +x,-z , +z,-x, -x,-z

  squarelocation = voicelocation % 4;

  switch(squarelocation)
  {
  	case 0: 

  	for (var i = 0; i < number; i++) {
	    x = Math.random() * (max - min) + min + varydist
	    y = Math.random() * (max - min) + min
	    z = Math.random() * (max - min) + min + varydist
	    cr = PolyUnits[voicelocation].colorred;
      cg = PolyUnits[voicelocation].colorblue;
      cb = PolyUnits[voicelocation].colorgreen;

	    outs.push(new Particle(x,y,z,[cr,cg,cb],lifespan));
  	} 
  	break;

    case 1: 

  	for (var i = 0; i < number; i++) {
	    x = Math.random() * (max - min) + min + varydist
	    y = Math.random() * (max - min) + min
	    z = Math.random() * (max - min) + min - varydist
	    cr = PolyUnits[voicelocation].colorred;
      cg = PolyUnits[voicelocation].colorblue;
      cb = PolyUnits[voicelocation].colorgreen;

	    outs.push(new Particle(x,y,z,[cr,cg,cb],lifespan));
  	} 
  	break;

  	case 2: 

  	for (var i = 0; i < number; i++) {
	    x = Math.random() * (max - min) + min - varydist
	    y = Math.random() * (max - min) + min
	    z = Math.random() * (max - min) + min -varydist
	    cr = PolyUnits[voicelocation].colorred;
      cg = PolyUnits[voicelocation].colorblue;
      cb = PolyUnits[voicelocation].colorgreen;

	    outs.push(new Particle(x,y,z,[cr,cg,cb],lifespan));
  	} 
  	break;

  	case 3: 

  	for (var i = 0; i < number; i++) {
	    x = Math.random() * (max - min) + min - varydist
	    y = Math.random() * (max - min) + min
	    z = Math.random() * (max - min) + min + varydist
	    cr = PolyUnits[voicelocation].colorred;
      cg = PolyUnits[voicelocation].colorblue;
      cb = PolyUnits[voicelocation].colorgreen;

	    outs.push(new Particle(x,y,z,[cr,cg,cb],lifespan));
  	} 
  	break;



  }

  
  return outs;
}


function emitLocation(voicelocation)
{
	//get locations
	particleList = particleList.concat(squareRandom(EMIT_RATE,0.5,-0.5,voicelocation,PARTICLE_LIFE));
}




function randomInitParticles(number,min,max)
{

  let outs = [];
  let x, y, z, cr, cg, cb;
  for (var i = 0; i < number; i++) {
    x = Math.random() * (max - min) + min
    y = Math.random() * (max - min) + min
    z = Math.random() * (max - min) + min
    cr = Math.random()
    cg = Math.random()
    cb = Math.random()

    outs.push(new Particle(x,y,z,[cr,cg,cb],PARTICLE_LIFE));
  }
  return outs;
}

function updateParticles(g)
{


  if (addqueue.length > 0)
  {
    particleList = particleList.concat(addqueue);
    addqueue = null;
    addqueue = [];
  }

  for (var i = 0; i < particleList.length; i++) {
    particleList[i].v[1] -= g + (Math.random() - 0.5) * 2 * devianceg;
    particleList[i].v[0] -= (Math.random() - 0.5) * 2 * deviancev;
    particleList[i].v[2] -= (Math.random() - 0.5) * 2 * deviancev;

    particleList[i].x += particleList[i].v[0];
    particleList[i].y += particleList[i].v[1];
    particleList[i].z += particleList[i].v[2];

    particleList[i].t -= 1;


    if ((particleList[i].t) <= 0)
    {
      removal.push(i);
    }
  }
  for (var j = 0; j < removal.length; j++) {
    particleList.splice(removal[j],SHAPE_VERTEX);

  }
  removal = null;
  removal = [];

}

function giveVertexBuffer(particles)
{
  if (!particles) return [];
  let outp = [];
  var els = [];
  for (var i = 0; i < particles.length; i++) {
    outp.push(particles[i].x);
    outp.push(particles[i].y);
    outp.push(particles[i].z);
    outp.push(particles[i].c[0]);
    outp.push(particles[i].c[1]);
    outp.push(particles[i].c[2]);


  }
  return outp;
}


function giveParticleOrder(particles)
{
  if (!particles) return [];
  let out = [];
  for (var i = 0; i < particles.length; i++) {
    out.push(i);
  }
  return out;
}


function randomVelocities(particles,min,max)
{
  for (var i = 0; i < particles.length; i++) {

    particles[i].v[0] = Math.random() * (max - min) + min;
    particles[i].v[1] = Math.random() * (max - min) + min;
    particles[i].v[2] = Math.random() * (max - min) + min;
  }
}



var vertexShaderText =
[
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  '',
  'void main()',
  '{',
  'fragColor=vertColor;',
  'gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
  'gl_PointSize = 7.0;',
  '}'
].join('\n');

var fragmentShaderText =
[
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  '',
  'void main()',
  '{',
  'gl_FragColor=vec4(fragColor,1.0);',
  '}'
].join("\n");



var InitDemo = function(){



  const canvas = document.querySelector('#glCanvas');
  const gl = canvas.getContext('webgl');
  if (!gl)
  {
    gl = canvas.getContext('experimental-webgl');
  }


  gl.clearColor(1.0,0.7,1.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader,vertexShaderText);
  gl.shaderSource(fragmentShader,fragmentShaderText);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }
  if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  //creates a program:

  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
    console.error('ERROR compiling program!', gl.getProgramInfoLog(program));
    return;
  }

  var boxVertices = giveVertexBuffer(particleList);

  // var boxVertices =
  // [ // X, Y, Z           R, G, B
  //  // Top
  //  -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
  //  -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
  //  1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
  // ];

  var boxIndices =giveParticleOrder(particleList);

  var boxVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

  var boxIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    positionAttribLocation, //attribute location
    3,//number of elements per attribute
    gl.FLOAT,//type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, //number of bytes 4*2
    //size of an indiviudal vertexShader
    0//offset from beginning of a single vertex to this attribute
  )
  gl.vertexAttribPointer(
    colorAttribLocation, //attribute location
    3,//number of elements per attribute
    gl.FLOAT,//type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, //number of bytes 4*2
    //size of an indiviudal vertexShader
    3 * Float32Array.BYTES_PER_ELEMENT//offset from beginning of a single vertex to this attribute
  )

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);
  gl.useProgram(program);

  var matWorldUniformLocation = gl.getUniformLocation(program,'mWorld');
  var matViewUniformLocation = gl.getUniformLocation(program,'mView');
  var matProjUniformLocation = gl.getUniformLocation(program,'mProj');

  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix,[0,0,-8],[0,0,0],[0,1,0]);
  var raidanvalue
  mat4.perspective(projMatrix,0.7853981633974483,canvas.width/canvas.height, 0.1, 1000.0);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


  //MAIN RENDER LOOP
  var identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);
  //console.log(particleList);

  //particleList = particleList.concat(randomInitParticles(40,1.5,-1.5));

  gl.clearColor(Math.random()/0.5,Math.random()/0.5,Math.random()/0.5, 1.0);
  var angle = 0;
  var totalFrames = 0;
  var startTime = performance.now();
  var loop = function(){
    totalFrames++;
    angle = performance.now() / 2000 / 6 * 2 * Math.PI;
    elapsed = performance.now() - startTime;
    if (elapsed > 250)
    {
      //gl.clearColor(Math.random()/0.5,Math.random()/0.5,Math.random()/0.5, 1.0);
      fps = totalFrames/(elapsed/1000);
      document.getElementById("fps").value = fps;
      totalFrames = 0;
      startTime = performance.now();
      document.getElementById("vcount").value = particleList.length;
    }

    
    if (AUTO_ROTATE_TOGGLE)
    {

    mat4.rotate(worldMatrix, identityMatrix, angle,[AUTO_ROTATE[0],AUTO_ROTATE[1], AUTO_ROTATE[2]]);
    }

    //mat4.rotate(worldMatrix, identityMatrix, angle*0.7, [-4,0,3]);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);


    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    //particleList = particleList.concat(EmitSquare(EMIT_RATE,-1.0,1.0));
    //emitTriangle();
    //UPDATE PARTICLE POSITION HERE

    updateParticles(GRAVITY_STRENGTH);

    boxVertices = giveVertexBuffer(particleList);
    boxIndices = giveParticleOrder(particleList);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    gl.drawElements(eval(DRAW_MODE), boxIndices.length, gl.UNSIGNED_SHORT, 0);
    
    setTimeout(()=>{window.requestAnimationFrame(loop)},10);
  };
  window.requestAnimationFrame(loop);

};