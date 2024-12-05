
var myFbo, program, programPlane;

var OFFSCREEN_WIDTH = 600*2, OFFSCREEN_HEIGHT = 600*2;

var examplePlane2 = {

  "vertices" : [-1.0, 1.0, 0.0, 0.0, 1.0,
                 1.0, 1.0, 0.0, 1.0, 1.0,
                 1.0,-1.0, 0.0, 1.0, 0.0,
                -1.0,-1.0, 0.0, 0.0, 0.0],

  "indices" :  [ 0, 2, 1, 0, 3, 2]

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
  
  programPlane = gl.createProgram();
  gl.attachShader(programPlane, vertexShader);
  gl.attachShader(programPlane, fragmentShader);
  
  gl.linkProgram(programPlane);

  gl.useProgram(programPlane);
  
  programPlane.vertexPositionAttribute = gl.getAttribLocation( programPlane, "VertexPosition");
  gl.enableVertexAttribArray(programPlane.vertexPositionAttribute);
  
  programPlane.vertexTexcoordsAttribute = gl.getAttribLocation ( programPlane, "VertexTexcoords");
  gl.enableVertexAttribArray(programPlane.vertexTexcoordsAttribute);
  
  programPlane.textureIndex             = gl.getUniformLocation( programPlane, "myTexture");
  gl.uniform1i(programPlane.textureIndex, 0);
  programPlane.brightnessIndex          = gl.getUniformLocation( programPlane, "Brightness");
  gl.uniform1f(programPlane.brightnessIndex, 1.0);
  programPlane.saturationIndex          = gl.getUniformLocation( programPlane, "Saturation");
  gl.uniform1f(programPlane.saturationIndex, 0.5);
  programPlane.contrastIndex            = gl.getUniformLocation( programPlane, "Contrast");
  gl.uniform1f(programPlane.contrastIndex, 0.5);

  
  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById("myVertexShaderFBO").text);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vertexShader));
    return null;
  }
    
  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById("myFragmentShaderFBO").text);
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

  gl.useProgram(program);
  
}

function initRendering() { 

  gl.clearColor(0.15,0.15,0.15,1.0);
  gl.enable(gl.DEPTH_TEST);
  
  setShaderLight();

}

function drawExamplePlane2(model) {
    
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer (programPlane.vertexPositionAttribute,  3, gl.FLOAT, false, 5*4,   0);
  gl.vertexAttribPointer (programPlane.vertexTexcoordsAttribute, 2, gl.FLOAT, false, 5*4, 3*4);

  gl.bindBuffer   (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.drawElements (gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

}

function drawTanque () {
  
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

function drawScene() {
    
  gl.bindFramebuffer (gl.FRAMEBUFFER, myFbo);                     // Change the drawing destination to FBO
  gl.viewport        (0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);   // Set viewport for FBO
  gl.clear           (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear FBO

  gl.useProgram(program);
  
  setShaderProjectionMatrix(getProjectionMatrix());
  
  drawTanque();

  gl.bindFramebuffer (gl.FRAMEBUFFER, null);                      // Change the drawing destination to color buffer
  gl.viewport        (0, 0, 600, 600);
  gl.clear           (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffer

  gl.useProgram(programPlane);
  drawExamplePlane2(examplePlane2);
      
}

function initMyHandlers() {


  var widgets = document.getElementsByTagName("input");

  for (var i = 0; i < widgets.length; i++) {
    widgets[i].addEventListener("mousemove",
    function(){
      switch (this.getAttribute("name")) {
        case "Brightness": gl.uniform1f (programPlane.brightnessIndex, parseFloat(this.value)/25.0 ); break;
        case "Saturation": gl.uniform1f (programPlane.saturationIndex, parseFloat(this.value)/100.0); break;
        case "Contrast":   gl.uniform1f (programPlane.contrastIndex,   parseFloat(this.value)/100.0); break;
      }
      requestAnimationFrame(drawScene);
    },
    false);
  }

}        

function initFramebufferObject() {
  
  // Create a texture object and set its size and parameters
  var texture = gl.createTexture();
  gl.bindTexture  (gl.TEXTURE_2D, texture);
  gl.texImage2D   (gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT,
                   0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.REPEAT);
  
  // Create a renderbuffer object and Set its size and parameters
  var depthBuffer = gl.createRenderbuffer(); // En OpenGL ES es genRenderbuffers
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT32F, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
  
  // Create a framebuffer object (FBO)
  var framebuffer = gl.createFramebuffer(); // En OpenGL ES es genFramebuffers
  gl.bindFramebuffer        (gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D   (gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);  // buffer de color
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);// buffer de profundidad
  framebuffer.texture = texture;
  
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
    alert("FBO no creado correctamente");
  
  return framebuffer;
  
}

function initMyWebGL() {
    
  initWebGL();
  initMyHandlers();
  
  initBuffers(examplePlane2);
  
  // Initialize framebuffer object (FBO)
  myFbo = initFramebufferObject();
  
  // Set a texture object to the texture unit
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture  (gl.TEXTURE_2D, myFbo.texture);

  requestAnimationFrame(drawScene);
  
}

initMyWebGL();
