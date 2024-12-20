var myGamma = 1.0;

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
  
  // Gamma correction
  program.gammaIndex            = gl.getUniformLocation( program, "Gamma");
  gl.uniform1f (program.gammaIndex, myGamma);
  
}

function initRendering() { 

  gl.clearColor(0.95,0.95,0.95,1.0);
  gl.enable(gl.DEPTH_TEST);
  
  setShaderLight();

}

function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // se obtiene la matriz de transformacion de la proyeccion y se envia al shader
  setShaderProjectionMatrix (getProjectionMatrix());
  
  // suelo
  var modelMatrix     = mat4.create();
  var modelViewMatrix = mat4.create();
  mat4.fromTranslation(modelMatrix,[0.0,-0.1,0.0]);
  mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
  mat4.fromScaling(modelMatrix, [4,1,4]);
  mat4.multiply(modelViewMatrix, modelViewMatrix, modelMatrix);
  
  setShaderModelViewMatrix (modelViewMatrix);
  setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
  setShaderMaterial        (Brass);
  
  drawSolidWithoutTexcoords(examplePlane);

  // ruedas
  setShaderMaterial(Chrome);
  for (var i = 0; i < 5; i++) {
    mat4.identity  (modelMatrix);
    mat4.translate (modelMatrix,modelMatrix, [0.2*i,0.0,0.0]);
    mat4.scale     (modelMatrix,modelMatrix, [0.1,0.1,0.8]);
    mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
    setShaderModelViewMatrix (modelViewMatrix);
    setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
    drawSolidWithoutTexcoords(exampleCylinder);
  }
  
  // tapas de las ruedas
  for (var i = 0; i < 5; i++) {
    mat4.identity  (modelMatrix);
    mat4.translate (modelMatrix,modelMatrix, [0.2*i,0.0,0.0]);
    mat4.rotate    (modelMatrix,modelMatrix, 3.14, [0.0,1.0,0.0]);
    mat4.scale     (modelMatrix,modelMatrix, [0.1,0.1,1.0]);
    mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
    setShaderModelViewMatrix (modelViewMatrix);
    setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
    drawSolidWithoutTexcoords(exampleCover);
    mat4.identity  (modelMatrix);
    mat4.translate (modelMatrix,modelMatrix, [0.2*i,0.0,0.8]);
    mat4.scale     (modelMatrix,modelMatrix, [0.1,0.1,1.0]);
    mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
    setShaderModelViewMatrix (modelViewMatrix);
    setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
    drawSolidWithoutTexcoords(exampleCover);
  }
        
  // cuerpo
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[-0.1,0.1,0.0]);
  mat4.scale(modelMatrix,modelMatrix, [1.0,0.2,0.8]);
  mat4.translate(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix (modelViewMatrix);
  setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
  setShaderMaterial        (Polished_copper);
  drawSolidWithoutTexcoords(exampleCube);
        
  // torreta
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[0.7,0.3,0.2]);
  mat4.scale(modelMatrix,modelMatrix, [0.2,0.2,0.4]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix (modelViewMatrix);
  setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
  setShaderMaterial        (Gold);
  drawSolidWithoutTexcoords(exampleCylinder);

  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[0.7,0.3,0.2]);
  mat4.rotate    (modelMatrix,modelMatrix, 3.14, [0.0,1.0,0.0]);
  mat4.scale(modelMatrix,modelMatrix, [0.2,0.2,1.0]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix (modelViewMatrix);
  setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
  drawSolidWithoutTexcoords(exampleCover);

  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[0.7,0.3,0.6]);
  mat4.scale(modelMatrix,modelMatrix, [0.2,0.2,1.0]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix (modelViewMatrix);
  setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
  drawSolidWithoutTexcoords(exampleCover);
        
  // cañon
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[0.7,0.3,0.4]);
  mat4.rotate(modelMatrix,modelMatrix, -Math.PI/8, [0,0,1]);
  mat4.rotate(modelMatrix,modelMatrix, -Math.PI/2.0, [0.0,1.0,0.0]);
  mat4.scale(modelMatrix,modelMatrix, [0.03,0.03,0.8]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix (modelViewMatrix);
  setShaderNormalMatrix    (getNormalMatrix(modelViewMatrix));
  drawSolidWithoutTexcoords(exampleCylinder);
      
}

function initMyHandlers() {
  
  var htmlGamma = document.getElementById("Gamma");
  htmlGamma.innerHTML = myGamma.toFixed(1);
  
  var range = document.getElementById("GammaRange");

  range.addEventListener("mousemove",
    function(){
      myGamma = parseFloat(range.value)/10.0;
      htmlGamma.innerHTML = myGamma.toFixed(1);
      gl.uniform1f (program.gammaIndex, myGamma);
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
