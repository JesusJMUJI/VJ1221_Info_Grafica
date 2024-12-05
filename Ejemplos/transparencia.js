
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
  program.transpaIndex          = gl.getUniformLocation( program, "alpha");
  gl.uniform1f(program.transpaIndex, 0.5);

}

function initRendering() {
  
  gl.clearColor(0.75,0.75,0.75,1.0);
  gl.enable(gl.DEPTH_TEST);
  
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//   gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  
  setShaderLight();

}

function drawTrasparentObjects(translation) {

  var modelMatrix       = mat4.create();
  var modelViewMatrix   = mat4.create();
  var scalingMatrix     = mat4.create();
  var translationMatrix = mat4.create();
  var rotationMatrix    = mat4.create();
  
  // el cilindro pequeño
  mat4.fromRotation    (rotationMatrix, Math.PI/2.0, [1.0, 0.0, 0.0]);
  mat4.fromScaling     (scalingMatrix, [0.3, 1.0, 0.3]);
  mat4.multiply        (modelMatrix, scalingMatrix, rotationMatrix);
  mat4.fromTranslation (translationMatrix, translation);
  mat4.multiply        (modelMatrix, translationMatrix, modelMatrix);
  mat4.fromTranslation (translationMatrix, [0.0, -0.5, 0.0]);
  mat4.multiply        (modelMatrix, translationMatrix, modelMatrix);
  mat4.multiply        (modelViewMatrix, getCameraMatrix(), modelMatrix);
  
  setShaderModelViewMatrix (modelViewMatrix);
  setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
  setShaderMaterial        (Red_plastic);
  drawSolid                (exampleCylinder);

  // el cilindro grande
  mat4.fromRotation    (rotationMatrix, Math.PI/2.0, [1.0, 0.0, 0.0]);
  mat4.fromScaling     (scalingMatrix, [0.5, 1.5, 0.5]);
  mat4.multiply        (modelMatrix, scalingMatrix, rotationMatrix);
  mat4.fromTranslation (translationMatrix, translation);
  mat4.multiply        (modelMatrix, translationMatrix, modelMatrix);
  mat4.multiply        (modelViewMatrix, getCameraMatrix(), modelMatrix);
  
  setShaderModelViewMatrix (modelViewMatrix);
  setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
  setShaderMaterial        (Yellow_plastic);
  drawSolid                (exampleCylinder);
  
  // el cono
  mat4.fromRotation    (rotationMatrix, -Math.PI/2.0, [1.0, 0.0, 0.0]);
  mat4.fromScaling     (scalingMatrix, [0.5, 0.5, 0.5]);
  mat4.multiply        (modelMatrix, scalingMatrix, rotationMatrix);
  mat4.fromTranslation (translationMatrix, translation);
  mat4.multiply        (modelMatrix, translationMatrix, modelMatrix);
  mat4.multiply        (modelViewMatrix, getCameraMatrix(), modelMatrix);
  
  setShaderModelViewMatrix (modelViewMatrix);
  setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
  setShaderMaterial        (Green_plastic);
  drawSolid                (exampleCone);
  
}

function drawTablero () {

  var modelMatrix       = mat4.create();
  var modelViewMatrix   = mat4.create();
  var scalingMatrix     = mat4.create();
  var translationMatrix = mat4.create();
  
  mat4.fromScaling     (scalingMatrix,     [5.0,  1.0, 5.0]);
  mat4.fromTranslation (translationMatrix, [0.0, -0.5, 0.0]);
  mat4.multiply        (modelMatrix, translationMatrix, scalingMatrix);
  mat4.multiply        (modelViewMatrix, getCameraMatrix(), modelMatrix);
  
  setShaderModelViewMatrix (modelViewMatrix);
  setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
  
  setShaderMaterial (Black_plastic);
  gl.uniform1i      (program.tableroIndex, true);
  drawSolid         (examplePlane);
  gl.uniform1i      (program.tableroIndex, false);

}

function drawScene() {
  
  
  // se inicializan los buffers de color y de profundidad
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // se obtiene la matriz de transformacion de la proyeccion y se envia al shader
  setShaderProjectionMatrix( getProjectionMatrix() );
  
  // se dibujan los objetos opacos en primer lugar
  drawTablero();
  
  // Los objetos transparentes
  gl.depthMask (false);              // impido que se actualice el buffer de profundidad
  gl.enable    (gl.BLEND);           // habilito la trasparencia (en la GPU)
  
  // primer metodo, simplemente dibujo
  drawTrasparentObjects([-1.3, 1.0, 0.0]);
  
  // segundo metodo, dibujo pero primero solicito que se eliminen las caras traseras
  gl.enable             (gl.CULL_FACE);
  gl.cullFace           (gl.BACK);
  drawTrasparentObjects ([0.0, 1.0, 0.0]);
  gl.disable            (gl.CULL_FACE);
  
  // tercer metodo, dibujo dos veces, la primera ordeno eliminar las caras frontales
  // y la segunda ordeno eliminar las traseras
  gl.enable             (gl.CULL_FACE);
  gl.cullFace           (gl.FRONT);
  drawTrasparentObjects ([1.3, 1.0, 0.0]);
  gl.cullFace           (gl.BACK);
  drawTrasparentObjects ([1.3, 1.0, 0.0]);
  gl.disable            (gl.CULL_FACE);
  
  gl.depthMask(true);              // permito escribir en el buffer de profundidad
  gl.disable(gl.BLEND);            // impido la trasparencia
  
}

function initMyHandlers() {
  
  var range = document.getElementsByName("Transparency");
  
  range[0].addEventListener("mousemove",
                            function(){
                            gl.uniform1f(program.transpaIndex, parseFloat(range[0].value) / 100.0);
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
