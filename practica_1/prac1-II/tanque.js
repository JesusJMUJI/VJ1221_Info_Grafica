//
// Programa ejemplo para utilizar transformaciones geométricas
//




//
// Gobierna el ciclo de dibujado de la escena
//
function drawScene() {
       
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  // Crea una matriz de tipo mat4 y devuelve la matriz identidad
  var matrixCameraRotation  = mat4.create();
  var matS  = mat4.create();

  // Obtiene la transformación de rotación de acuerdo a la interacción del usuario
  matrixCameraRotation = getRotationMatrix();

  // Crea una transformación de escalado
  mat4.fromScaling (matS, [1.0, 0.2, 0.6]);

  // Establece como matriz de transformación del modelo: matrixCameraRotation * matS
  setUniform ("modelMatrix", concat(matrixCameraRotation, matS));

  // Dibuja la primitiva cubo
  draw(cubo);

  //------- CILINDRO
  var matTC = mat4.create();
  var matSC = mat4.create();
  var iCil = -4;
  mat4.fromTranslation(matTC, [iCil, -2, -0.5]);
  mat4.fromScaling(matSC, [0.1,0.1,0.6]);
  setUniform("modelMatrix",concat(matrixCameraRotation,matSC,matTC));
  draw(cilindro);
  for (var j = 0; j < 4; j++) {
    mat4.fromTranslation(matTC, [iCil += 2, -2, -0.5]);
    setUniform("modelMatrix",concat(matrixCameraRotation,matSC,matTC));
    draw(cilindro);
  }

  //---- TAPAS
  var matTransTapa = mat4.create();
  var matScaleTapa = mat4.create();
  var iTapa = -4;

  mat4.fromTranslation(matTransTapa,[iTapa,-2,3]);
  mat4.fromScaling(matScaleTapa, [0.1,0.1,0.1]);
  setUniform("modelMatrix",concat(matrixCameraRotation,matScaleTapa,matTransTapa));
  draw(tapa);

  var matTransTapaAtras = mat4.create();
  var matRotationTapaAtras = mat4.create();
  var matScaleTapaAtras = mat4.create();
  var iTapaAtras = -4;

  mat4.fromTranslation(matTransTapaAtras, [iTapaAtras,-2,3]);
  mat4.fromYRotation(matRotationTapaAtras, Math.PI);
  mat4.fromScaling(matScaleTapaAtras, [0.1,0.1,0.1]);

  setUniform("modelMatrix",concat(matrixCameraRotation,matRotationTapaAtras,matScaleTapaAtras,matTransTapaAtras));
  draw(tapa);
  for (var j = 0; j < 4; j++) {
    mat4.fromTranslation(matTransTapa, [iTapa+=2,-2,3]);
    setUniform("modelMatrix",concat(matrixCameraRotation,matScaleTapa,matTransTapa));
    draw(tapa);
    mat4.fromTranslation(matTransTapaAtras, [iTapaAtras+=2,-2,3]);
    setUniform("modelMatrix",concat(matrixCameraRotation,matRotationTapaAtras,matScaleTapaAtras,matTransTapaAtras))
    draw(tapa);
  }

  //------Esfera
  var matSEsfera = mat4.create();
  var matREsfera = mat4.create();
  var matTEsfera = mat4.create();

  mat4.fromScaling(matSEsfera, [0.2,0.2,0.2])
  mat4.fromTranslation(matTEsfera, [1,0.5,0])

  setUniform("modelMatrix",concat(matrixCameraRotation,matREsfera,matSEsfera,matTEsfera))
  draw(esfera);

  //--- Cañon
  var matSCanon = mat4.create();
  var matRYCanon = mat4.create();
  var matRZCanon = mat4.create();
  var matTCanon = mat4.create();

  mat4.fromScaling(matSCanon, [0.03,0.03,0.6]);
  mat4.fromYRotation(matRYCanon, -1.57);
  mat4.fromZRotation(matRZCanon, -0.3);
  mat4.fromTranslation(matTCanon, [0.2,0.1,0]);

  var matXY = concat(matRZCanon,matRYCanon);

  setUniform("modelMatrix",concat(matrixCameraRotation,matTCanon,matXY,matRZCanon,matSCanon))
  draw(cilindro);

  //-- Tapa canon
  var matSTapaCanon = mat4.create();
  var matRYTapaCanon = mat4.create();
  var matRTapaCanon = mat4.create();
  var matTTapaCanon = mat4.create();

  mat4.fromScaling(matSTapaCanon, [0.03,0.03,0.03]);
  mat4.fromYRotation(matRYTapaCanon, -1.57);
  mat4.fromZRotation(matRTapaCanon, -0.3);
  mat4.fromTranslation(matTTapaCanon, [-0.37,0.275,0]);

  var matXYTapaCanon = concat(matRTapaCanon,matRYTapaCanon);

  setUniform("modelMatrix",concat(matrixCameraRotation,matTTapaCanon,matXYTapaCanon,matRTapaCanon,matSTapaCanon))
  draw(tapa);

}

if (initWebGL()) {

  initShaders("myVertexShader","myFragmentShader");
  initAttributesRefs("VertexPosition");
  initUniformRefs("modelMatrix");

  initPrimitives(plano,cubo,tapa,cono,cilindro,esfera);
  initRendering("DEPTH_TEST","CULL_FACE");
  initHandlers();

  requestAnimationFrame(drawScene);
  
}