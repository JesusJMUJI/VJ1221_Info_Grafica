//
// 
//

var modeloSeleccionado = cubo;

function initMyHandlers() {
  
  var colors = document.getElementsByName("color");

  colors[0].addEventListener("change",
    function(){
      var myColor = this.value.substr(1); // para eliminar el # del #FCA34D
  
      var r = myColor.charAt(0) + '' + myColor.charAt(1);
      var g = myColor.charAt(2) + '' + myColor.charAt(3);
      var b = myColor.charAt(4) + '' + myColor.charAt(5);
      
      r = parseInt(r, 16) / 255.0;
      g = parseInt(g, 16) / 255.0;
      b = parseInt(b ,16) / 255.0;
    
      setUniform("StripeColor", [r, g, b]);

      requestAnimationFrame(drawScene);
    },
  false);

  var ranges = document.getElementsByName("range");

  for (var i = 0; i < ranges.length; i++) {
    ranges[i].addEventListener("mousemove",
    function(){
      switch (this.getAttribute("id")) {
        case "StripeWidth": setUniform("StripeWidth", [this.value/100.0]); break;
        case "StripeScale": setUniform("StripeScale", [this.value]);       break;
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
  "StripeColor","StripeWidth","StripeScale");                               // NUEVO
  
  initPrimitives(plano,cubo,tapa,cono,cilindro,esfera);
  
  initRendering("DEPTH_TEST");
  initHandlers();
  initMyHandlers();                                                         // NUEVO
  initLight();

  requestAnimationFrame(drawScene);
  
}