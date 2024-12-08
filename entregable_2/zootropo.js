//
// Zootropo
//

var nElementos = 24;
var incrementoAnguloEntreFrames = 0, anguloTotal = 0;
var anguloEntreDosElementos = 2 * Math.PI / nElementos;
var incrementoAngulo = anguloEntreDosElementos / 10;
var pOrtografica = false;
var texturaSeleccionada = 0;
function initMyHandlers() {
  var ranges = document.getElementsByName("range");

  for (var i = 0; i < ranges.length; i++) {
    ranges[i].addEventListener("mousemove",
        function(){
          switch (this.getAttribute("id")) {
            case "ScaleS":
            case "ScaleT":     setUniform("Scale", [ranges[0].value, ranges[1].value]);
              console.log(ranges[0].value, ranges[1].value);
              break;
            case "ThresholdS":
            case "ThresholdT": setUniform("Threshold", [ranges[2].value/100.0, ranges[3].value/100.0]);
              console.log(ranges[2].value/100.0, ranges[3].value/100.0);
              break;
          }
          requestAnimationFrame(drawScene);
        },
        false);
  }
}
//
// Establece las propiedades de material según establece el modelo de ilumnación de Phong
//
function setMaterial (M) {

	setUniform ("Material.Ka",        M.ambient);
	setUniform ("Material.Kd",        M.diffuse);
	setUniform ("Material.Ks",        M.specular);
	setUniform ("Material.shininess", M.shininess);

}
//
// Establece las propiedades de la fuente de luz según establece el modelo de ilumnación de Phong
//
function initLight () {
	// var LpInicial = vec3.fromValues (0.0, 0.0, 0.25);
	// var LpFinal = vec3.transformMat4 (vec3.create(), LpInicial, mvCono);


  setUniform("Light.La", [1.0, 1.0, 1.0]); // Increased ambient light intensity
  setUniform("Light.Ld", [1.0, 1.0, 1.0]); // Increased diffuse light intensity
  setUniform("Light.Ls", [1.0, 1.0, 1.0]); // Increased specular light intensity
  setUniform("Light.Lp", [0.0, 0.0, 0.0]); // Light position in eye coordinates
	// setUniform("Light.Lp", LpFinal);

}


function drawZootropo () {
  var modelViewMatrix = mat4.create();
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  setUniform ("projectionMatrix", getPerspectiveProjectionMatrix());
  var cameraMatrix = getCameraMatrix();

  var matT_IT_TOP = mat4.create();
  var matRY_IT_BOT = mat4.create();
  var matT_Detach = mat4.create();
  mat4.fromTranslation(matT_IT_TOP, [0, 0.14 + anguloTotal * 0.05, 0]);
  mat4.fromYRotation(matRY_IT_BOT, anguloTotal);
  mat4.fromTranslation(matT_Detach, [0, anguloTotal * 0.05, 0]);
  var matYR  = mat4.create();
  var matYR2 = mat4.create();
  var matS   = mat4.create();
  var matT   = mat4.create();
  mat4.fromScaling(matS, [0.25, 0.7, 0.25]);
  mat4.fromTranslation(matT, [1, 0, 0]);
  mat4.fromYRotation(matYR2, anguloTotal);
  var matT_IT_TAPA = mat4.create();
  var matT_XR_TAPA = mat4.create();
  mat4.fromTranslation(matT_IT_TAPA, [0, 0.28, 0]);
  mat4.fromZRotation(matT_XR_TAPA, 0);
  var matT_IT_ESFERA = mat4.create();
  mat4.fromTranslation(matT_IT_ESFERA, [0, 0.30, 0]);
  var matS_ESFERA = mat4.create();
  mat4.fromScaling(matS_ESFERA, [0.02, 0.03, 0.02]);
  var matT_Handle = mat4.create();
  var matS_Handle = mat4.create();
  var matRY_Handle = mat4.create();
  var matRZ_Handle = mat4.create();
  mat4.fromTranslation(matT_Handle, [0, 0, 0]);
  mat4.fromScaling(matS_Handle, [0.12, 0.2, 0.2]);
  mat4.fromYRotation(matRY_Handle, 1.57);
  mat4.fromXRotation(matRZ_Handle, 0);

  var mat_T_hexagono_inferior = mat4.create();
  var mat_S_hexagono_inferior = mat4.create();
  mat4.fromTranslation(mat_T_hexagono_inferior, [0, 0.24 - 0.1, 0]);

  for (var i = 0; i < nElementos; i++) {

    var amplitud = 0.1;
    var t = i / nElementos;
    // var oscillation = Math.sin(anguloTotal + i *  Math.PI / nElementos) * amplitud;
    var oscillation = Math.sin(t * 2 * Math.PI) * amplitud;
    mat4.fromTranslation(matT_IT_TAPA,[0,0.38 + oscillation,0]);
    mat4.fromTranslation(matT_IT_TOP, [0, 0.24 + oscillation, 0]);
    mat4.fromTranslation(matT_IT_ESFERA, [0, 0.40 + oscillation, 0]);
    mat4.fromTranslation(matT_Handle, [0.09, 0.31 + oscillation, 0]);
    mat4.fromYRotation(matYR,  anguloEntreDosElementos * i);
    mat4.fromYRotation(matRY_IT_BOT, anguloTotal);

    drawModel(concat(cameraMatrix,matYR2, matYR, matT, matYR, matS),rellenoPiezasItaliana,Black_plastic,texturaSeleccionada);

    drawModel(concat(cameraMatrix, matYR2, matYR, matT, matYR, matS), italianaAbajo, White_plastic,0);

    drawModel(concat(cameraMatrix, matRY_IT_BOT, matYR, mat_T_hexagono_inferior, matT, matYR, matS),rellenoPiezasItaliana,White_plastic,texturaSeleccionada);

    drawModel(concat(cameraMatrix, matRY_IT_BOT, matYR, matT_IT_TOP, matT, matYR, matS),italianaArriba,White_plastic,texturaSeleccionada);

    drawModel(concat(cameraMatrix, matYR2, matYR, matT, matYR, matT_IT_TAPA, matT_XR_TAPA, matS),italianaTapa,White_plastic,4);

    drawModel(concat(cameraMatrix, matYR2, matYR, matT_IT_ESFERA, matT, matYR, matS_ESFERA),esfera,Gold,2);

    drawModel(concat(cameraMatrix, matYR2, matYR,matT,matYR,matT_Handle,matRZ_Handle,matRY_Handle, matS_Handle,matS),cubo,Obsidian,texturaSeleccionada);
  }
}

function drawModel(matrix,model,material,texture)
{
  setUniform("modelViewMatrix", concat(matrix));
  setUniform("normalMatrix", getNormalMatrix(matrix));
  setMaterial(material)
  setUniform("myTexture", 3); // NUEVO
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texturesId[texture]);
  draw(model);

}

function giraZootropo () {

  anguloTotal += incrementoAnguloEntreFrames;
  drawScene();

}
function updateLight () {
  //local positions
  let lightCenter = vec3.fromValues(0,0,0);
  let lightTarget = vec3.fromValues(0,0,-1);

  let lightMVM = concat(mat4.fromZRotation(mat4.create(),Math.PI/4),mat4.fromTranslation(mat4.create(),[10,0,0]));

  //transform light positions to world using light matrix
  let worldCenter = vec3.create();
  let worldTarget = vec3.create();
  vec3.transformMat4(worldCenter, lightCenter, lightMVM);
  vec3.transformMat4(worldTarget, lightTarget, lightMVM);


  //Transforming the positions to eye space
  let EyeSpaceLightDir = vec3.create();
  let cameraMatrix = getCameraMatrix();
  let EyeSpaceLightCenter = vec3.create();
  let EyeSpaceLightTarget = vec3.create();
  vec3.transformMat4(EyeSpaceLightCenter, worldCenter, cameraMatrix);
  vec3.transformMat4(EyeSpaceLightTarget, worldTarget, cameraMatrix);

  //final direction calculation
  vec3.sub(EyeSpaceLightDir,EyeSpaceLightTarget,EyeSpaceLightCenter);

  setUniform("Light.La", [1.0, 1.0, 1.0]);
  setUniform("Light.Ld", [1.0, 1.0, 1.0]);
  setUniform("Light.Ls", [1.0, 1.0, 1.0]);
  setUniform("Light.Lp", EyeSpaceLightTarget);

}

function drawScene() {
  console.log("Drawing scene with projection:", pOrtografica ? "Orthographic" : "Perspective");
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (pOrtografica) {
    setUniform("projectionMatrix", getOrthoProjectionMatrix());
  } else {
    setUniform("projectionMatrix", getPerspectiveProjectionMatrix());
  }

  updateLight();
  drawZootropo();
}

function initKeyboardHandler() {
  var angulo_html = document.getElementById("angulo");
  var pOrtografica_html = document.getElementById("proyeccion");

  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case 'w':
        incrementoAnguloEntreFrames += incrementoAngulo;
        break;
      case 's':
        incrementoAnguloEntreFrames -= incrementoAngulo;
        break;
      case 'o':
        pOrtografica = true;
        requestAnimationFrame(drawScene);
        break;
      case 'p':
        pOrtografica = false;
        requestAnimationFrame(drawScene);
        break;
    }
    angulo_html.innerHTML = (incrementoAnguloEntreFrames * 180 / Math.PI).toFixed(1);
    pOrtografica_html.innerHTML = pOrtografica ? "Ortografica" : "Perspectiva";
  }, false);
}

if (initWebGL()) {
  initShaders("myVertexShader","myFragmentShader");
  initAttributesRefs("VertexPosition", "VertexNormal", "VertexTexcoords"); // NUEVO
  initUniformRefs("modelViewMatrix","projectionMatrix", "normalMatrix", "Material.Ka","Material.Kd","Material.Ks","Material.shininess", "Light.La","Light.Ld","Light.Ls","Light.Lp", "myTexture", "Scale", "Threshold"); // NUEVO
  initPrimitives(plano,cubo,tapa,cono,cilindro,esfera,italianaAbajo,italianaArriba,italianaTapa,rellenoPiezasItaliana);
  initRendering("DEPTH_TEST");
  gl.clearColor(0.15,0.25,0.35,1.0);
  initHandlers();
  initMyHandlers(); // NUEVO
  initLight();
  initTextures("bee.png", "damas.png","dots.png","emoji.png","figure.png");
  setUniform("Scale", [1.0, 1.0]); // NUEVO
  setUniform("Threshold", [1.0, 1.0]); // NUEVO
  requestAnimationFrame(drawScene);
  initKeyboardHandler();
  setInterval (giraZootropo, 40);
}