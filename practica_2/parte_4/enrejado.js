//
//
//

var modeloSeleccionado = cubo;

function initMyHandlers() {

  var ranges = document.getElementsByName("range");

  for (var i = 0; i < ranges.length; i++) {
    ranges[i].addEventListener("mousemove",
    function(){
      switch (this.getAttribute("id")) {
        case "ScaleS":
        case "ScaleT":     setUniform("Scale", [ranges[0].value, ranges[1].value]); break;
        case "ThresholdS":
        case "ThresholdT": setUniform("Threshold", [ranges[2].value/100.0, ranges[3].value/100.0]); break;
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

  setUniform("Light.La", [1.0, 1.0, 1.0]);
  setUniform("Light.Ld", [1.0, 1.0, 1.0]);
  setUniform("Light.Ls", [1.0, 1.0, 1.0]);
  setUniform("Light.Lp", [0.0, 0.0, 0.0]); // en coordenadas del ojo

}

//
// Dibujado de la escena
//
function drawScene() {

  var matS = mat4.create();
  var modelViewMatrix = mat4.create();
  var cameraMatrix = getCameraMatrix();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  setUniform ("projectionMatrix", getPerspectiveProjectionMatrix());

  mat4.fromScaling (matS, [0.5, 0.5, 0.5]);
  modelViewMatrix = concat (cameraMatrix, matS);
  setUniform ("modelViewMatrix", modelViewMatrix);

  setUniform ("normalMatrix", getNormalMatrix(modelViewMatrix));
  setMaterial(Bronze);

  draw(modeloSeleccionado);

}

if (initWebGL()) {

  initShaders("myVertexShader","myFragmentShader");

  initAttributesRefs("VertexPosition","VertexNormal","VertexTexcoords");

  initUniformRefs("modelViewMatrix","projectionMatrix","normalMatrix",
  "Material.Ka","Material.Kd","Material.Ks","Material.shininess",
  "Light.La","Light.Ld","Light.Ls","Light.Lp",
  "Scale","Threshold");                                                     // NUEVO

  initPrimitives(plano,cubo,tapa,cono,cilindro,esfera);

  initRendering("DEPTH_TEST");
  initHandlers();
  initMyHandlers();                                                         // NUEVO
  initLight();

  setUniform("Scale", [1.0,1.0]);
  setUniform("Threshold", [1.0, 1.0]);

  requestAnimationFrame(drawScene);

}