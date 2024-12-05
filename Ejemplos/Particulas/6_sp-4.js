
var gl;
var canvas;
var program;
var myphi = 0, zeta = 30, radius = 33, fovy = 0.034;
var time = 0.0;

function getWebGLContext() {
  
  canvas = document.getElementById("myCanvas");
  
  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  
  for (var i = 0; i < names.length; ++i) {
    try {
      return canvas.getContext(names[i]);
    }
    catch(e) {
    }
  }
  
  return null;
  
}

function initShaders() { 
  
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById("myVertexShader").text);
  gl.compileShader(vertexShader);
  
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById("myFragmentShader").text);
  gl.compileShader(fragmentShader);
  
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
  
  gl.useProgram(program);
  
  program.vertexVelocityAttribute = gl.getAttribLocation( program, "VertexVelocity");
  gl.enableVertexAttribArray(program.vertexVelocityAttribute);
  
  program.vertexStartTimeAttribute = gl.getAttribLocation( program, "VertexStartTime");
  gl.enableVertexAttribArray(program.vertexStartTimeAttribute);
  
  program.modelViewMatrixIndex  = gl.getUniformLocation( program, "modelViewMatrix");
  program.projectionMatrixIndex = gl.getUniformLocation( program, "projectionMatrix");
  
  program.TiempoIndex           = gl.getUniformLocation( program, "Time");
  program.PointSizeIndex        = gl.getUniformLocation( program, "PointSize");

  gl.uniform1f (program.TiempoIndex,    0.0);
  gl.uniform1f (program.PointSizeIndex, 1.0);

}

function initRendering() {
  
  gl.clearColor(1.0,1.0,1.0,1.0);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

}

var nParticles    = 10000;
function initParticleSystem() {
  
  var particlesData = [];
  
  for (var i= 0; i < nParticles; i++) {
    
    // velocidad
    var alpha = Math.random();
    var velocity = (0.1 * alpha) + (0.5 * (1.0 - alpha));

    // posicion
    var x = Math.random();
    var y = velocity;
    var z = 0.0;
    
    particlesData[i * 4 + 0] = x;
    particlesData[i * 4 + 1] = y;
    particlesData[i * 4 + 2] = z;
    particlesData[i * 4 + 3] = i * 0.00075;  // instante de nacimiento
  }

  program.idBufferVertices = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, program.idBufferVertices);
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(particlesData), gl.STATIC_DRAW);
}

function setProjection() {
  
  var projectionMatrix  = mat4.create();
  mat4.perspective(projectionMatrix, fovy, 1, 0.1, 100);
  gl.uniformMatrix4fv(program.projectionMatrixIndex,false,projectionMatrix);
  
}

function getCameraMatrix() {
  
  var _phi  = myphi* Math.PI / 180.0;
  var _zeta = zeta * Math.PI / 180.0;
  
  var x = 0, y = 0, z = 0;
  z = radius * Math.cos(_zeta) * Math.cos(_phi);
  x = radius * Math.cos(_zeta) * Math.sin(_phi);
  y = radius * Math.sin(_zeta);
  
  var cameraMatrix = mat4.create();
  mat4.lookAt(cameraMatrix, [x, y, z], [0.5, 0.5, 0], [0, 1, 0]);
  
  return cameraMatrix;
  
}

function drawParticleSystem() {
  
  gl.bindBuffer (gl.ARRAY_BUFFER, program.idBufferVertices);
  gl.vertexAttribPointer (program.vertexVelocityAttribute,   3, gl.FLOAT, false, 4*4,   0);
  gl.vertexAttribPointer (program.vertexStartTimeAttribute,  1, gl.FLOAT, false, 4*4,   3*4);
  
  gl.drawArrays (gl.POINTS, 0, nParticles);
  
}

function drawObjects() {

  gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, getCameraMatrix());
  drawParticleSystem();
  
}

function updateTime(){
  
  time += 0.01;
  gl.uniform1f (program.TiempoIndex, time);
  requestAnimationFrame(drawScene);

}

function drawScene() {
  
  setProjection();
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  drawObjects();
  
}

function initHandlers() {
  
  var mouseDown = false;
  var lastMouseX;
  var lastMouseY;
  
  canvas.addEventListener("mousedown",
                          function(event) {
                          mouseDown  = true;
                          lastMouseX = event.clientX;
                          lastMouseY = event.clientY;
                          },
                          false);
  
  canvas.addEventListener("mouseup",
                          function() {
                          mouseDown           = false;
                          },
                          false);
  
  canvas.addEventListener("mousemove",
                          function (event) {
                          if (!mouseDown) {
                            return;
                          }
                          var newX = event.clientX;
                          var newY = event.clientY;
                          if (event.shiftKey == 1) {
                          if (event.altKey == 1) {              // fovy
                          fovy -= (newY - lastMouseY) / 100.0;
                          if (fovy < 0.001) {
                          fovy = 0.1;
                          }
                          } else {                              // radius
                          radius -= (newY - lastMouseY) / 10.0;
                          if (radius < 0.01) {
                          radius = 0.01;
                          }
                          }
                          } else {                               // position
                          myphi -= (newX - lastMouseX);
                          zeta  += (newY - lastMouseY);
                          if (zeta < -80) {
                          zeta = -80.0;
                          }
                          if (zeta > 80) {
                          zeta = 80;
                          }
                          }
                          lastMouseX = newX
                          lastMouseY = newY;
                          requestAnimationFrame(drawScene);
                          },
                          false);

  var filename = document.getElementsByName("TextureFilename");

  filename[0].addEventListener("change",
                             function(){
                               var reader = new FileReader();
                               reader.onload = function(theFile) {
                                 var image = new Image();
                                 image.onload = function(){
                                   loadTexture(image);
                                   requestAnimationFrame(drawScene);
                                 };
                                 image.src= reader.result;
                               };
                               reader.readAsDataURL(filename[0].files[0]);
                             },
                             false);
  
  var range = document.getElementsByName("PointSize");

  range[0].addEventListener("mousemove",
                            function(){
                              gl.uniform1f(program.PointSizeIndex, range[0].value);
                              requestAnimationFrame(drawScene);
                            },
                            false);
}

function isPowerOfTwo(x) {

  return (x & (x - 1)) == 0;

}

function nextHighestPowerOfTwo(x) {

  --x;
  
  for (var i = 1; i < 32; i <<= 1) {
    x = x | x >> i;
  }
  
  return x + 1;

}

function loadTexture (image) {
  
  var texture = gl.createTexture();

  //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  if (!isPowerOfTwo(image.width) || !isPowerOfTwo(image.height)) {
    // Scale up the texture to the next highest power of two dimensions.
    var canvas    = document.createElement("canvas");
    canvas.width  = nextHighestPowerOfTwo(image.width);
    canvas.height = nextHighestPowerOfTwo(image.height);
    var ctx       = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    image = canvas;
  }
  gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  program.textureIndex = gl.getUniformLocation(program, 'myTexture');
  gl.uniform1i(program.textureIndex, 0);

}


function initWebGL() {
  
  gl = getWebGLContext();
  
  if (!gl) {
    alert("WebGL no está disponible");
    return;
  }
  
  initShaders();
  initParticleSystem();
  initRendering();
  initHandlers();

  setInterval(updateTime, 40);
  
}

initWebGL();
