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
        0.0,0.7,0.0,    //V0
        0,0,0.7,        //V1
        0.7,0,0,        //V2
        0,0,-0.7,       //V3
        -0.7,0,0,       //V4
        //UNDERSIDE
        -0.5,-0.7,0.5, //V5
        0.5,-0.7,0.5,  //V6
        0.5,-0.7,-0.5, //V7
        -0.5,-0.7,-0.5  //V8
    ],

    "indices" : [
        // PRISM
        1,2,0,
        2,3,0,
        3,4,0,
        4,1,0,
        // UNDERSIDE
        4,5,1,
        5,6,1,
        6,2,1,
        6,7,2,
        7,3,2,
        7,8,3,
        3,8,4,
        5,4,8,

        8,6,5,
        8,7,6,
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