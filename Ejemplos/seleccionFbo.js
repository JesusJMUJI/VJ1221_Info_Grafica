
var myFbo;
var OFFSCREEN_WIDTH = 600, OFFSCREEN_HEIGHT = 600;

var picking = {
  "x_in_canvas" : 0,
  "y_in_canvas" : 0
};

function initShaders() { 
  
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById("myVertexShader").text);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vertexShader));
    return null;
  }
    
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById("myFragmentShader").text);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fragmentShader));
    return null;
  }
  
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
  
  gl.useProgram(program);
  
  program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);
  
  program.modelViewMatrixIndex  = gl.getUniformLocation( program, "modelViewMatrix");
  program.projectionMatrixIndex = gl.getUniformLocation( program, "projectionMatrix");
  
  // normales
  program.vertexNormalAttribute = gl.getAttribLocation ( program, "VertexNormal");
  program.normalMatrixIndex     = gl.getUniformLocation( program, "normalMatrix");
  gl.enableVertexAttribArray(program.vertexNormalAttribute);
  
  // coordenadas de textura
  //program.vertexTexcoordsAttribute = gl.getAttribLocation ( program, "VertexTexcoords");
  //gl.enableVertexAttribArray(program.vertexTexcoordsAttribute);

  // material
  program.KaIndex               = gl.getUniformLocation( program, "Material.Ka");
  program.KdIndex               = gl.getUniformLocation( program, "Material.Kd");
  program.KsIndex               = gl.getUniformLocation( program, "Material.Ks");
  program.alphaIndex            = gl.getUniformLocation( program, "Material.alpha");
  
  // fuente de luz
  program.LaIndex               = gl.getUniformLocation( program, "Light.La");
  program.LdIndex               = gl.getUniformLocation( program, "Light.Ld");
  program.LsIndex               = gl.getUniformLocation( program, "Light.Ls");
  program.PositionIndex         = gl.getUniformLocation( program, "Light.Position");

  // para establecer si se ha de dibujar la escena de una manera u otra
  program.PickingIndex          = gl.getUniformLocation( program, "picking");
  gl.uniform1i (program.PickingIndex, false);

}

function initRendering() {
  
  gl.clearColor(0.95,0.95,0.95,1.0);
  gl.enable(gl.DEPTH_TEST);
  
  setShaderLight();
  
}

function drawObjects() {

  var auxMatrixA      = mat4.create();
  var auxMatrixB      = mat4.create();
  var modelMatrix     = mat4.create();
  var modelViewMatrix = mat4.create();
  
  // el suelo
  mat4.fromScaling          (modelMatrix, [2.5, 2.5, 2.5]);
  mat4.multiply             (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix  (modelViewMatrix);
  setShaderNormalMatrix     (getNormalMatrix(modelViewMatrix));
  setShaderMaterial         (White_plastic);
  drawSolidWithoutTexcoords (examplePlane);
  
  // el cono
  mat4.fromRotation         (auxMatrixA, -Math.PI/2.0, [1.0,0.0,0.0]);
  mat4.fromScaling          (auxMatrixB, [0.1, 0.1, 0.5]);
  mat4.multiply             (modelMatrix, auxMatrixA, auxMatrixB);
  mat4.multiply             (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix  (modelViewMatrix);
  setShaderNormalMatrix     (getNormalMatrix(modelViewMatrix));
  setShaderMaterial         (Yellow_plastic);
  drawSolidWithoutTexcoords (exampleCone);
  
  // la esfera
  mat4.fromTranslation      (auxMatrixA, [0.3,0.2,0.0]);
  mat4.fromScaling          (auxMatrixB, [0.2, 0.2, 0.2]);
  mat4.multiply             (modelMatrix, auxMatrixA, auxMatrixB);
  mat4.multiply             (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix  (modelViewMatrix);
  setShaderNormalMatrix     (getNormalMatrix(modelViewMatrix));
  setShaderMaterial         (Red_plastic);
  drawSolidWithoutTexcoords (exampleSphere);

  // el cubo
  mat4.fromRotation         (auxMatrixA, -Math.PI/6.0, [0.0,1.0,0.0]);
  mat4.fromTranslation      (auxMatrixB, [-0.4,0.2,0.0]);
  mat4.multiply             (modelMatrix, auxMatrixB, auxMatrixA);
  mat4.fromScaling          (auxMatrixA, [0.4, 0.4, 0.4]);
  mat4.multiply             (modelMatrix, modelMatrix, auxMatrixA);
  mat4.multiply             (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix  (modelViewMatrix);
  setShaderNormalMatrix     (getNormalMatrix(modelViewMatrix));
  setShaderMaterial         (Green_plastic);
  drawSolidWithoutTexcoords (exampleCube);

}

function drawScene() {
  
  // se obtiene la matriz de transformacion de la proyeccion y se envia al shader
  setShaderProjectionMatrix(getProjectionMatrix());

  // dibuja la escena normal
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniform1i (program.PickingIndex, false);
  drawObjects();

  // dibuja la escena en el FBO con colores planos
  gl.bindFramebuffer(gl.FRAMEBUFFER, myFbo);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniform1i (program.PickingIndex, true);
  drawObjects();
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
}

function queObjetoEs(pixels) {
  
  if (pixels[0] == 25)
    alert('Cubo!');
  else if ((pixels[0] >= 127) && (pixels[0] <= 128))
    if (pixels[1] == 0)
      alert('Esfera!');
    else
      alert('Cono!');
  
}

function initMyHandlers() {
  
  var canvas = document.getElementById("myCanvas");
  
  canvas.addEventListener("mouseup",
                          function(event) {
                          
                          // añadido para picking
                          var rect            = event.target.getBoundingClientRect();                         
                          picking.mode        = true;
                          picking.x_in_canvas = (event.clientX - rect.left);
                          picking.y_in_canvas = (rect.bottom   - event.clientY);
                          
                          // aqui leo el color del pixel
                          gl.bindFramebuffer(gl.FRAMEBUFFER, myFbo);                          
                          var pixels = new Uint8Array(4);
                          gl.readPixels(picking.x_in_canvas, picking.y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                          console.log(pixels);
                          
                          // aqui averiguo el objeto
                          queObjetoEs(pixels)
                          
                          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                          },
                          false);
  
}

// FBO con informacion de color y de profundidad
function initFramebufferObject() {

  var depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

  var colorBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, colorBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

  // Create a framebuffer object (FBO)
  var framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer        (gl.FRAMEBUFFER, framebuffer);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorBuffer);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,  gl.RENDERBUFFER, depthBuffer);

  return framebuffer;

}

function initMyWebGL() {
  
  initWebGL();
  initMyHandlers();
  
  // Crea un FBO donde dibujar con colores planos
  myFbo = initFramebufferObject();
  gl.bindFramebuffer (gl.FRAMEBUFFER, null);
  
  requestAnimationFrame(drawScene);
  
}

initMyWebGL();