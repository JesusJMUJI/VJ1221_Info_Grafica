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

    // cilindro horiz
    var matTCBase = mat4.create();
    var matSCBase = mat4.create();
    var matRCBase = mat4.create();
    mat4.fromYRotation (matRCBase, -1.5708 );
    mat4.fromTranslation(matTCBase, [0.3, 0.31, 0]);
    mat4.fromScaling(matSCBase, [0.0625,0.0625,1]);
    setUniform("modelViewMatrix",concat(cameraMatrix,matTCBase,matRCBase,matSCBase));
    draw(cilindro);

    // cilindro diag
    var matTCDiag = mat4.create();
    var matSCDiag = mat4.create();
    var matRYCDiag = mat4.create();
    var matRXCDiag = mat4.create();
    var matRZCDiag = mat4.create();

    mat4.fromYRotation (matRYCDiag, 0 );
    mat4.fromXRotation (matRXCDiag, -1.57 );
    mat4.fromZRotation (matRZCDiag, -0.401426 );
    mat4.fromTranslation(matTCDiag, [-0.7, 0.31, 0]);
    mat4.fromScaling(matSCDiag, [0.0625,0.0625,3.0]);

    setUniform("modelViewMatrix",concat(cameraMatrix,matTCDiag,matRZCDiag,matRYCDiag,matRXCDiag,matSCDiag));
    draw(cilindro);

    //esfera
    var matTCEsfera = mat4.create();
    var matSCEsfera = mat4.create();
    var matREsfera = mat4.create();

    var matRxEsfera = mat4.create();
    var matRyEsfera = mat4.create();
    var matRzEsfera = mat4.create();

    // mat4.fromYRotation (matRyEsfera, 0 );
    // mat4.fromXRotation (matRxEsfera, -1.57 );
    mat4.fromZRotation (matRzEsfera, -0.401426 );

    mat4.fromTranslation(matTCEsfera, [0,1.6, 0]);
    mat4.fromScaling(matSCEsfera, [1.2,1.2,1.2]);
    setUniform("modelViewMatrix",concat(cameraMatrix,matTCEsfera,matRzEsfera,matRyEsfera,matRxEsfera,matSCEsfera));
    draw(esfera);

    //esferitas

    var matTCEsferita = mat4.create();
    var matSCEsferita = mat4.create();
    var matREsferita = mat4.create();

    mat4.fromTranslation(matTCEsferita, [0.3, 0.31, 0]);
    mat4.fromScaling(matSCEsferita, [0.0625,0.0625,0.0625]);
    mat4.fromYRotation (matREsferita, -1.5708 );
    setUniform("modelViewMatrix",concat(cameraMatrix,matTCEsferita,matREsferita,matSCEsferita));
    draw(esfera);

    mat4.fromTranslation(matTCEsferita, [-0.7, 0.31, 0]);
    mat4.fromScaling(matSCEsferita, [0.0625,0.0625,0.0625]);
    mat4.fromYRotation (matREsferita, -1.5708 );
    setUniform("modelViewMatrix",concat(cameraMatrix,matTCEsferita,matREsferita,matSCEsferita));
    draw(esfera);

    mat4.fromTranslation(matTCEsferita, [-0.75, 3, 0]);
    mat4.fromScaling(matSCEsferita, [0.0625,0.0625,0.0625]);
    setUniform("modelViewMatrix",concat(cameraMatrix,matRZCDiag,matTCEsferita,matSCEsferita));
    draw(esfera);

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