var unCuadradoVC = {        // estructura de vértices compartidos

    // tipo de primitiva gráfica con el que se ha de dibujar este modelo
    primitiva : WebGLRenderingContext.TRIANGLES,

    "vertices" : [            // vector de vértices, atributo de posición
        -0.5, -0.5, 0.0,          // v0
        0.5, -0.5, 0.0,          // v1
        0.5,  0.5, 0.0,          // v2
        -0.5,  0.5, 0.0],         // v3

    "indices" : [             // vector de índices
        0, 1, 2,                // t0
        0, 2, 3]                // t1

};

var unCuadradoCI = {          // estructura de caras independientes

    // tipo de primitiva gráfica con el que se ha de dibujar este modelo
    primitiva : WebGLRenderingContext.TRIANGLES,

    "vertices" : [            // hay un único vector, atributo de posición
        -0.5, -0.5, 0.0,          // t0 v0
        0.5, -0.5, 0.0,          // t0 v1
        0.5,  0.5, 0.0,          // t0 v2
        -0.5, -0.5, 0.0,          // t1 v0
        0.5,  0.5, 0.0,          // t1 v2
        -0.5,  0.5, 0.0]          // t1 v3

};

var j10VC = {

    primitiva : WebGLRenderingContext.TRIANGLES,

    "vertices" : [
        // PRISM
        0.0,0.0,0.5,  //0
        -0.5,0.0,0.0,   //1
        0.0,0.0,-0.5,   //2
        0.5,0.0,0.0,    //3
        0.0,0.5,0.0,    //4
        //UNDERSIDE
        0.4,-0.5,0.5,   //5
        0.4,-0.5,-0.5,  //6
        -0.4,-0.5,-0.5, //7
        -0.4,-0.5,0.5,  //8

    ],

    "indices" : [
        0,1,4,
        1,2,4,
        2,3,4,
        3,0,4,

        0,5,8,
        0,3,5,
        6,5,3,
        3,2,6,
        2,7,6,
        
    ]

};

var j10CI = {

    primitiva : WebGLRenderingContext.TRIANGLES,

    "vertices" : [ ]

};

var j10VCstrip = {

    primitiva : WebGLRenderingContext.TRIANGLE_STRIP,

    "vertices" : [ ],

    "indices" : [ ]

};

var j10CIstrip = {

    primitiva : WebGLRenderingContext.TRIANGLE_STRIP,

    "vertices" : [ ]

};