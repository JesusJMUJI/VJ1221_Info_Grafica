
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
  program.vertexTexcoordsAttribute = gl.getAttribLocation ( program, "VertexTexcoords");
  gl.enableVertexAttribArray(program.vertexTexcoordsAttribute);

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

  // variables propias de esta demo
  program.tableroIndex          = gl.getUniformLocation( program, "tablero");
  gl.uniform1f(program.transpaIndex, 0.5);

}

function initRendering() {
  
  gl.clearColor(0.75,0.75,0.75,1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  setShaderLight();

}

function drawObjects(translation, fs, simetric) {

  var modelMatrixCylinder = mat4.create();
  var modelMatrixCone     = mat4.create();
  var modelViewMatrix     = mat4.create();

  // el cono
  if (simetric)
    mat4.scale   (modelMatrixCone, modelMatrixCone, [1, -1, 1]);
  mat4.translate (modelMatrixCone, modelMatrixCone, translation);
  mat4.scale     (modelMatrixCone, modelMatrixCone, [0.5, 0.5, 0.5]);
  mat4.rotate    (modelMatrixCone, modelMatrixCone, -Math.PI/2.0, [1.0, 0.0, 0.0]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrixCone);
  
  setShaderModelViewMatrix(modelViewMatrix);
  setShaderNormalMatrix(getNormalMatrix(modelViewMatrix));
  
  setShaderMaterial (Green_plastic);
  drawSolid   (exampleCone);

  // el cilindro
  if (simetric)
    mat4.scale   (modelMatrixCylinder, modelMatrixCylinder, [1, -1, 1]);
  mat4.translate (modelMatrixCylinder, modelMatrixCylinder, translation);
  mat4.scale     (modelMatrixCylinder, modelMatrixCylinder, [0.5, fs, 0.5]);
  mat4.rotate    (modelMatrixCylinder, modelMatrixCylinder, Math.PI/2.0, [1.0, 0.0, 0.0]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrixCylinder);
  
  setShaderModelViewMatrix(modelViewMatrix);
  setShaderNormalMatrix(getNormalMatrix(modelViewMatrix));
  
  setShaderMaterial (Yellow_plastic);
  drawSolid   (exampleCylinder);
  
}

function drawTablero () {

  var modelMatrix     = mat4.create();
  var modelViewMatrix = mat4.create();

  mat4.identity  (modelMatrix);
  mat4.translate (modelMatrix, modelMatrix, [0.0, 0.0, -1.0]);
  mat4.scale     (modelMatrix, modelMatrix, [5.0, 1.0, 5.0]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  
  setShaderModelViewMatrix(modelViewMatrix);
  setShaderNormalMatrix(getNormalMatrix(modelViewMatrix));
  
  setShaderMaterial  (White_plastic);
  gl.uniform1i (program.tableroIndex, true);
  drawSolid    (examplePlane);
  gl.uniform1i (program.tableroIndex, false);

}

function drawScene() {

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  
  setShaderProjectionMatrix(getProjectionMatrix());
  
  gl.disable(gl.DEPTH_TEST);
  gl.colorMask(false,false,false,false);
  
  gl.enable(gl.STENCIL_TEST);
  gl.stencilOp(gl.REPLACE,gl.REPLACE,gl.REPLACE);
  gl.stencilFunc(gl.ALWAYS,1,0xFFFFFFFF);

  drawTablero();
  
  gl.enable(gl.DEPTH_TEST);
  gl.colorMask(true,true,true,true);
  gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
  gl.stencilFunc(gl.EQUAL,1,0xFFFFFFFF);

  drawObjects ([0.0, 1.0, 0.0],1.0,true);
  drawObjects ([0.0, 0.75, -2.0],0.75,true);
  drawObjects ([1.0, 0.5, -1.0],0.5,true);
  drawObjects ([-1.0, 0.25, -1.0],0.25,true);

  gl.disable(gl.STENCIL_TEST);

  drawObjects ([0.0, 1.0, 0.0],1.0,false);
  drawObjects ([0.0, 0.75, -2.0],0.75,false);
  drawObjects ([1.0, 0.5, -1.0],0.5,false);
  drawObjects ([-1.0, 0.25, -1.0],0.25,false);
    
  gl.enable  (gl.BLEND);
  drawTablero();
  gl.disable (gl.BLEND);            // impido la trasparencia (en la GPU)

}

function initMyWebGL() {
  
  initWebGL();
  
  requestAnimationFrame(drawScene);
  
}

initMyWebGL();
