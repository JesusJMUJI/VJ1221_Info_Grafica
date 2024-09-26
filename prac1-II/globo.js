//
// Programa ejemplo para utilizar una cámara interactiva
//


function drawGlobo () {

    // obtiene la matriz de transformación de la cámara
    var cameraMatrix = getCameraMatrix();
  
    // calcula la matriz de transformación del modelo
    var matS  = mat4.create();
    var matRx = mat4.create();

    // dibujo la base
    mat4.fromScaling   (matS, [1, 1, 0.25]);
    mat4.fromXRotation (matRx, -Math.PI/2);
    setUniform ("modelViewMatrix", concat (cameraMatrix, matRx, matS));
    draw(cono);

}


//
// Gobierna el ciclo de dibujado de la escena
//
function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  
  // establece la matriz de transformación de la proyección
  setUniform ("projectionMatrix", getPerspectiveProjectionMatrix());
  
  drawGlobo ();
  
}

if (initWebGL()) {

  initShaders("myVertexShader","myFragmentShader");
  initAttributesRefs("VertexPosition");
  initUniformRefs("modelViewMatrix","projectionMatrix");

  initPrimitives(plano,cubo,tapa,cono,cilindro,esfera);
  initRendering("DEPTH_TEST","CULL_FACE");
  initHandlers();
  
  requestAnimationFrame(drawScene);

}