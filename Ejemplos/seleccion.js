
var picking = {
  "mode"        : false,
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

function queObjetoEs(pixels) {
  
  if (pixels[0] == 25)
    alert('Cubo!');
  else if ((pixels[0] >= 127) && (pixels[0] <= 128))
    if (pixels[1] == 0)
      alert('Esfera!');
    else
      alert('Cono!');
    
  picking.mode = false;
  
}

function drawScene() {
  
  var pixels = new Uint8Array(4);
  
  // se obtiene la matriz de transformacion de la proyeccion y se envia al shader
  setShaderProjectionMatrix(getProjectionMatrix());

  if (picking.mode) {
    
    // dibujo la escena con colores planos
    gl.uniform1i (program.PickingIndex, true);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawObjects();

    // aqui leo el color del pixel
    gl.readPixels(picking.x_in_canvas, picking.y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    console.log(pixels);
    
    gl.uniform1i (program.PickingIndex, false);
  }
  
  // dibujo la escena usando el modelo de phong
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawObjects();

  // leo el color devuelto para saber el objeto seleccionado
  if (picking.mode) 
    queObjetoEs(pixels);

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
                          
                          requestAnimationFrame(drawScene);                          
                          },
                          false);
  
}

function initMyWebGL() {
  
  initWebGL();
  initMyHandlers();
  requestAnimationFrame(drawScene);
  
}

initMyWebGL();
