
var time = 0.0;

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
  //program.vertexNormalAttribute = gl.getAttribLocation ( program, "VertexNormal");
  program.normalMatrixIndex     = gl.getUniformLocation( program, "normalMatrix");
  //gl.enableVertexAttribArray(program.vertexNormalAttribute);
  
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

  program.KIndex                = gl.getUniformLocation( program, "K");
  program.VelocityIndex         = gl.getUniformLocation( program, "Velocity");
  program.AmpIndex              = gl.getUniformLocation( program, "Amp");
  program.TiempoIndex           = gl.getUniformLocation( program, "Time");
  
  gl.uniform1f (program.KIndex,        50.0);
  gl.uniform1f (program.VelocityIndex,  1.0);
  gl.uniform1f (program.AmpIndex,       0.01);
  gl.uniform1f (program.TiempoIndex,    0.0);

}

function initRendering() {
  
  gl.clearColor(0.95,0.95,0.95,1.0);
  gl.enable(gl.DEPTH_TEST);
  
  setShaderLight();
  setShaderMaterial    (Yellow_plastic);

}

function drawObjects() {

  var modelMatrix     = mat4.create();
  var modelViewMatrix = mat4.create();
  
  mat4.fromTranslation    (modelMatrix, [-0.5, -0.5, 0.0]);
  mat4.multiply           (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix(modelViewMatrix);
  setShaderNormalMatrix   (getNormalMatrix(modelViewMatrix));
  drawSolidOnlyPosition   (examplePlaneTeselado);

}

function updateTime(){
  
  time += 0.01;
  gl.uniform1f (program.TiempoIndex, time);

  requestAnimationFrame(drawScene);

}

function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // se obtiene la matriz de transformacion de la proyeccion y se envia al shader
  setShaderProjectionMatrix( getProjectionMatrix() );
  
  drawObjects();
  
}

function initMyHandlers() {
  
  var range = document.getElementsByTagName("input");
  
  range[0].addEventListener("mousemove",
                            function(){
                            gl.uniform1f(program.KIndex, parseFloat(range[0].value)/2.0);
                            requestAnimationFrame(drawScene);
                            },
                            false);
  range[1].addEventListener("mousemove",
                            function(){
                            gl.uniform1f(program.VelocityIndex, parseFloat(range[1].value)/5.0);
                            requestAnimationFrame(drawScene);
                            },
                            false);
  range[2].addEventListener("mousemove",
                            function(){
                            gl.uniform1f(program.AmpIndex, parseFloat(range[2].value)/1000.0);
                            requestAnimationFrame(drawScene);
                            },
                            false);

}

function initMyWebGL() {
  
  initWebGL();
  initMyHandlers();

  initBuffers(examplePlaneTeselado);

  setInterval(updateTime, 40);
  
}

initMyWebGL();
