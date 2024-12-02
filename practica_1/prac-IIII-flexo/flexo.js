//
// Programa ejemplo para utilizar una cámara interactiva
//
console.log("Práctica 4 - Flexo");

var alfa = beta = 0.0;
function initKeyboardHandler() {
    document.addEventListener('keydown',
        function (event) {
            switch (event.key) {
                case 'a':
                    alfa += 0.08;
                    if (alfa > 1.05) alfa = 1.05;
                    break;
                case 'A':
                    alfa -= 0.08;
                    if (alfa < -1.05) alfa = -1.05;
                    break;
                case 'd':
                    beta += 0.25;
                    break;
                case 'D':
                    beta -= 0.25;
                    break;
            }

            requestAnimationFrame(drawScene);
        }, false);
}


function drawFlexo () {

    // obtiene la matriz de transformación de la cámara
    var cameraMatrix = getCameraMatrix();
  
    // crear plano
    var planoS  = mat4.create();
    var planoT  = mat4.create();
    mat4.fromScaling(planoS, [2,2,2]);
    mat4.fromTranslation(planoT, [0,0,0]);
    setUniform("modelViewMatrix", concat(cameraMatrix,planoT,planoS));
    draw(plano);

    // crear base
    var baseS = mat4.create();
    var baseRX = mat4.create();
    var baseRY = mat4.create();
    mat4.fromScaling(baseS, [0.30,0.30,0.15]);
    mat4.fromXRotation(baseRX, -Math.PI/2);
    mat4.fromYRotation(baseRY, beta);
    setUniform("modelViewMatrix", concat(cameraMatrix,baseRY,baseRX,baseS));
    draw(cono);

    //crear primer brazo
    var brazo1T = mat4.create();
    var brazo1S = mat4.create();
    var brazo1RX = mat4.create();
    var brazo1RZ = mat4.create();
    mat4.fromTranslation(brazo1T, [0,0.15,0]);
    mat4.fromScaling(brazo1S, [0.04,0.04,0.7]);
    mat4.fromXRotation(brazo1RX, -Math.PI/2);
    mat4.fromZRotation(brazo1RZ, alfa);
    setUniform("modelViewMatrix", concat(cameraMatrix,brazo1T,baseRY,brazo1RZ,brazo1RX,brazo1S));
    draw(cilindro);

    //crear segundo brazo encima del primero
    var brazo2T = mat4.create();
    var brazo2S = mat4.create();
    var brazo2RX = mat4.create();
    var brazo2RZ = mat4.create();
    mat4.fromTranslation(brazo2T, [0,0.70,0]);
    mat4.fromScaling(brazo2S, [0.04,0.04,0.7]);
    mat4.fromXRotation(brazo2RX, -Math.PI/2);
    mat4.fromZRotation(brazo2RZ, -2*alfa);
    setUniform("modelViewMatrix", concat(cameraMatrix,brazo1T,baseRY,brazo1RZ,brazo2T,brazo2RZ,brazo2RX,brazo2S));
    draw(cilindro);

    //crear cono en la punta del brazo
    var conoT = mat4.create();
    var conoS = mat4.create();
    var conoRX = mat4.create();
    mat4.fromTranslation(conoT, [0,0.90,0]);
    mat4.fromScaling(conoS, [0.20,0.20,0.20]);
    mat4.fromXRotation(conoRX, 1.57);
    setUniform("modelViewMatrix", concat(cameraMatrix,baseRY,brazo1T,brazo1RZ,brazo2T,brazo2RZ,conoT,conoRX,conoS));
    draw(cono);

    //crear esferas en las articulaciones
    var esfera1T = mat4.create();
    var esfera1S = mat4.create();
    mat4.fromTranslation(esfera1T, [0,0.15,0]);
    mat4.fromScaling(esfera1S, [0.05,0.05,0.05]);
    setUniform("modelViewMatrix", concat(cameraMatrix,esfera1T,baseRY,esfera1S));
    draw(esfera);

    var esfera2T = mat4.create();
    var esfera2S = mat4.create();
    mat4.fromTranslation(esfera2T, [0,0.70,0]);
    mat4.fromScaling(esfera2S, [0.05,0.05,0.05]);
    setUniform("modelViewMatrix", concat(cameraMatrix,brazo1T,baseRY,brazo1RZ,esfera2T,esfera2S));
    draw(esfera);

    var esfera3T = mat4.create();
    var esfera3S = mat4.create();
    mat4.fromTranslation(esfera3T, [0,0.70,0]);
    mat4.fromScaling(esfera3S, [0.05,0.05,0.05]);
    setUniform("modelViewMatrix", concat(cameraMatrix, brazo1T, baseRY, brazo1RZ, brazo2T, brazo2RZ, esfera3T, esfera3S));
    draw(esfera);
}


//
// Gobierna el ciclo de dibujado de la escena
//
function drawScene() {
  
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  
  // establece la matriz de transformación de la proyección
  setUniform ("projectionMatrix", getPerspectiveProjectionMatrix());
  
  drawFlexo ();
    console.log("Alfa: ",alfa,"/","Beta: ",beta);
}

if (initWebGL()) {
  initShaders("myVertexShader","myFragmentShader");
  initAttributesRefs("VertexPosition");
  initUniformRefs("modelViewMatrix","projectionMatrix");

  initPrimitives(plano,cubo,tapa,cono,cilindro,esfera);
  initRendering("DEPTH_TEST","CULL_FACE");
  initHandlers();
    requestAnimationFrame(drawScene);
  initKeyboardHandler();

}