//
// Zootropo
//

var nElementos = 24;
var incrementoAnguloEntreFrames = 0, anguloTotal = 0;
var anguloEntreDosElementos = 2 * Math.PI / nElementos;
var incrementoAngulo = anguloEntreDosElementos / 10;
var pOrtografica = false;
var texturaSeleccionada = 0;

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


	setUniform("Light.La", [1.0, 1.0, 1.0]);
	setUniform("Light.Ld", [1.0, 1.0, 1.0]);
	setUniform("Light.Ls", [1.0, 1.0, 1.0]);
	setUniform("Light.Lp", [0.0, 0.0, 0.0]); // en coordenadas del ojo
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

  for (var i = 0; i < nElementos; i++) {
    var amplitud = 0.1;
    var oscillation = Math.sin(anguloTotal + i * Math.PI / nElementos) * amplitud;
    mat4.fromTranslation(matT_IT_TAPA,[0,0.38 + oscillation,0]);
    mat4.fromTranslation(matT_IT_TOP, [0, 0.24 + oscillation, 0]);
    mat4.fromTranslation(matT_IT_ESFERA, [0, 0.40 + oscillation, 0]);
    mat4.fromTranslation(matT_Handle, [0.09, 0.31 + oscillation, 0]);
    mat4.fromYRotation(matYR,  anguloEntreDosElementos * i);
    mat4.fromYRotation(matRY_IT_BOT, anguloTotal);


    setMaterial(Perl);
    setUniform("myTexture", 0); // NUEVO
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texturesId[texturaSeleccionada]);
    drawModel(concat(cameraMatrix, matYR2, matYR, matT, matYR, matS), italianaAbajo);


    setMaterial(Esmerald);
    setUniform("myTexture", 1); // NUEVO
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texturesId[texturaSeleccionada]);
    drawModel(concat(cameraMatrix, matRY_IT_BOT, matYR, matT_IT_TOP, matT, matYR, matS),italianaArriba);


    setMaterial(Polished_silver);
    setUniform("myTexture", 0); // NUEVO
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texturesId[texturaSeleccionada]);
    drawModel(concat(cameraMatrix, matYR2, matYR, matT, matYR, matT_IT_TAPA, matT_XR_TAPA, matS),italianaTapa);


    setMaterial(Jade);
    setUniform("myTexture", 1); // NUEVO
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texturesId[texturaSeleccionada]);
    drawModel(concat(cameraMatrix, matYR2, matYR, matT_IT_ESFERA, matT, matYR, matS_ESFERA),esfera);

    setMaterial(Ruby);
    setUniform("myTexture", 0); // NUEVO
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texturesId[texturaSeleccionada]);
    drawModel(concat(cameraMatrix, matYR2, matYR,matT,matYR,matT_Handle,matRZ_Handle,matRY_Handle, matS_Handle,matS),cubo);
  }
}

function drawModel(mat,model)
{
  setUniform("modelViewMatrix", concat(mat));
  setUniform("normalMatrix", getNormalMatrix(mat));
  draw(model);

}

function giraZootropo () {

  anguloTotal += incrementoAnguloEntreFrames;
  drawScene();

}

function drawScene() {

  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  if (pOrtografica)
  {
	  setUniform ("projectionMatrix", getOrthoProjectionMatrix());
  }
  else
	{
		setUniform ("projectionMatrix", getPerspectiveProjectionMatrix());
	}


  drawZootropo();

}

function initKeyboardHandler () {

  var angulo_html = document.getElementById("angulo");
  var pOrtografica_html = document.getElementById("proyeccion");



  document.addEventListener("keydown",
  function (event) {
	  switch (event.key) {
		case 'w': incrementoAnguloEntreFrames += incrementoAngulo; break;
		case 's': incrementoAnguloEntreFrames -= incrementoAngulo; break;
		  case 'o': pOrtografica = true; break;
		  case 'p': pOrtografica = false; break;
	  }
	  angulo_html.innerHTML = (incrementoAnguloEntreFrames * 180 / Math.PI).toFixed(1);
        switch (pOrtografica) {
            case true: pOrtografica_html.innerHTML = "Ortografica"; break;
            case false: pOrtografica_html.innerHTML = "Perspectiva"; break;

        }
  }, false);



}

if (initWebGL()) {
  initShaders("myVertexShader","myFragmentShader");
  initAttributesRefs("VertexPosition", "VertexNormal", "VertexTexcoords"); // NUEVO
  initUniformRefs("modelViewMatrix","projectionMatrix", "normalMatrix", "Material.Ka","Material.Kd","Material.Ks","Material.shininess", "Light.La","Light.Ld","Light.Ls","Light.Lp", "myTexture"); // NUEVO
  initPrimitives(plano,cubo,tapa,cono,cilindro,esfera,italianaAbajo,italianaArriba,italianaTapa);
  initRendering("DEPTH_TEST","CULL_FACE");
  gl.clearColor(0.15,0.25,0.35,1.0);
  initHandlers();
  initLight();
  initTextures("dots.png","bee.png"); // NUEVO
  requestAnimationFrame(drawScene);
  initKeyboardHandler();
  setInterval (giraZootropo, 40);
}