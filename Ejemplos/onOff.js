
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

  // establece si encendido o apagado
  program.ModeIndex             = gl.getUniformLocation( program, "mode");
  gl.uniform1i (program.ModeIndex, false);

}

function initRendering() {
  
  gl.clearColor(0.15,0.15,0.15,1.0);
  gl.enable(gl.DEPTH_TEST);
  
  setShaderLight();
  
}

function setFlickering(value) {

  if (Math.random()> value)
    gl.uniform1i (program.ModeIndex, false);
  else
    gl.uniform1i (program.ModeIndex, true);
  
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
  setFlickering  (0.0);
  drawSolidWithoutTexcoords (examplePlane);
  
  // el cono
  mat4.fromRotation         (auxMatrixA, -Math.PI/2.0, [1.0,0.0,0.0]);
  mat4.fromScaling          (auxMatrixB, [0.1, 0.1, 0.5]);
  mat4.multiply             (modelMatrix, auxMatrixA, auxMatrixB);
  mat4.multiply             (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix  (modelViewMatrix);
  setShaderNormalMatrix     (getNormalMatrix(modelViewMatrix));
  setShaderMaterial         (Yellow_plastic);
  setFlickering  (0.05);
  drawSolidWithoutTexcoords (exampleCone);
  
  // la esfera
  mat4.fromTranslation      (auxMatrixA, [0.3,0.2,0.0]);
  mat4.fromScaling          (auxMatrixB, [0.2, 0.2, 0.2]);
  mat4.multiply             (modelMatrix, auxMatrixA, auxMatrixB);
  mat4.multiply             (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix  (modelViewMatrix);
  setShaderNormalMatrix     (getNormalMatrix(modelViewMatrix));
  setShaderMaterial         (Red_plastic);
  setFlickering  (0.25);
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
  setFlickering  (0.05);
  drawSolidWithoutTexcoords (exampleCube);
  
}

function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // se obtiene la matriz de transformacion de la proyeccion y se envia al shader
  setShaderProjectionMatrix(getProjectionMatrix());

  drawObjects();

}

function initMyWebGL() {
  
  initWebGL();
  setInterval(drawScene, 40);
  //requestAnimationFrame(drawScene);
  
}

initMyWebGL();
