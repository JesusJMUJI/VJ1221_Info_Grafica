
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
  
  program.vertexVelocityAttribute = gl.getAttribLocation( program, "VertexVelocity");
  gl.enableVertexAttribArray(program.vertexVelocityAttribute);
  
  program.vertexStartTimeAttribute = gl.getAttribLocation( program, "VertexStartTime");
  gl.enableVertexAttribArray(program.vertexStartTimeAttribute);
  
  program.modelViewMatrixIndex  = gl.getUniformLocation( program, "modelViewMatrix");
  program.projectionMatrixIndex = gl.getUniformLocation( program, "projectionMatrix");
  
  program.TiempoIndex           = gl.getUniformLocation( program, "Time");
  program.PointSizeIndex        = gl.getUniformLocation( program, "PointSize");

  gl.uniform1f (program.TiempoIndex,    0.0);
  gl.uniform1f (program.PointSizeIndex, 3.0);

}

function initRendering() {
  
  gl.clearColor(0.0,0.0,0.0,1.0);
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

function drawParticleSystem() {
  
  gl.bindBuffer (gl.ARRAY_BUFFER, program.idBufferVertices);
  gl.vertexAttribPointer (program.vertexVelocityAttribute,   3, gl.FLOAT, false, 4*4,   0);
  gl.vertexAttribPointer (program.vertexStartTimeAttribute,  1, gl.FLOAT, false, 4*4,   3*4);
  
  gl.drawArrays (gl.POINTS, 0, nParticles);
  
}

function drawObjects() {

  
  // se calcula la matriz de transformación del modelo
  var modelMatrix = mat4.create();
  mat4.fromTranslation (modelMatrix, [-0.5, -0.5, 0.0]);
  
  // se opera la matriz de transformacion de la camara con la del modelo y se envia al shader
  var modelViewMatrix = mat4.create();
  mat4.multiply     (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix(modelViewMatrix);

  drawParticleSystem();
  
}

function updateTime(){
  
  time += 0.01;
  gl.uniform1f (program.TiempoIndex, time);
  requestAnimationFrame(drawScene);

}

function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // se obtiene la matriz de transformacion de la proyeccion y se envia al shader
  setShaderProjectionMatrix(getProjectionMatrix());
  
  drawObjects();
  
}

function initMyHandlers() {

  var filename = document.getElementsByName("TextureFilename");

  filename[0].addEventListener("change", changeTextureHandler(), false);
  
  function changeTextureHandler() {
    return function(){
      if (this.files[0]!= undefined) {
        loadTextureFromFile(this.files[0]);
      }
    };
  }

  var range = document.getElementsByName("PointSize");

  range[0].addEventListener("mousemove",
                            function(){
                              gl.uniform1f(program.PointSizeIndex, range[0].value);
                              requestAnimationFrame(drawScene);
                            },
                            false);
}

function loadTextureFromFile(filename) {

  var reader = new FileReader(); // Evita que Chrome se queje de SecurityError al cargar la imagen elegida por el usuario
  
  reader.addEventListener("load",
                          function() {
                            var image = new Image();
                            image.addEventListener("load",
                                                   function() {
                                                     setTexture(image);
                                                  },
                                                   false);
                            image.src = reader.result;
                          },
                          false);
  
  reader.readAsDataURL(filename);

}

function setTexture (image) {
  
  // creación de la textura
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  
  // datos de la textura
  gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // parámetros de filtrado
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  // parámetros de repetición (ccordenadas de textura mayores a uno)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  
  // creación del mipmap
  gl.generateMipmap(gl.TEXTURE_2D);
  
  // se activa la unidad cero y se le asigna el objeto textura
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // se obtiene la referencia a la variable de tipo sampler2D en el shader
  program.textureIndex = gl.getUniformLocation(program, 'myTexture');
  
  // se asocia la variable de tipo sampler2D a una unidad de textura
  gl.uniform1i(program.textureIndex, 0);

  setInterval(updateTime, 40);
  
}

function initMyWebGL() {
  
  initWebGL();
  initMyHandlers();
  initParticleSystem();
  
}

initMyWebGL();
