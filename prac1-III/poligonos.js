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
        0.0,0.7,0.0,        //V0
        0.0,0.0,0.7,        //V1
        0.7,0.0,0.0,        //V2
        0.0,0.0,-0.7,       //V3
        -0.7,0.0,0.0,       //V4
        //UNDERSIDE
        -0.5,-0.7,0.5,      //V5
        0.5,-0.7,0.5,       //V6
        0.5,-0.7,-0.5,      //V7
        -0.5,-0.7,-0.5      //V8
    ],

    "indices" : [
        // PRISM
        0,1,2, //t0
        2,3,0, //t1
        3,4,0, //t2
        4,1,0, //t3
        // UNDERSIDE
        4,5,1, //t4
        5,6,1, //t5
        6,2,1, //t6
        6,7,2, //t7
        7,3,2, //t8
        7,8,3, //t9
        3,8,4, //t10
        5,4,8, //t11

        8,6,5, //t12
        8,7,6, //t13
    ]

};

var j10CI = {

    primitiva : WebGLRenderingContext.TRIANGLES,

    "vertices" : [
        //t0
        0.0,0.7,0.0, //v0
        0.0,0.0,0.7, //v1
        0.7,0.0,0.0, //v2
        //t1
        0.7,0.0,0.0, //v2
        0.0,0.0,-0.7, //v3
        0.0,0.7,0.0, //v0
        //t2
        0.0,0.0,-0.7, //v3
        -0.7,0.0,0.0, //v4
        0.0,0.7,0.0, //v0
        //t3
        -0.7,0.0,0.0, //v4
        0.0,0.0,0.7, //v1
        0.0,0.7,0.0, //v0

        //t4
        -0.7,0.0,0.0, //v4
        -0.5,-0.7,0.5,//v5
        0.0,0.0,0.7, //v1
        //t5
        -0.5,-0.7,0.5, //v5
        0.5,-0.7,0.5, //v6
        0.0,0.0,0.7, //v1
        //t6
        0.5,-0.7,0.5, //v6
        0.7,0.0,0.0, //v2
        0.0,0.0,0.7, //v1
        //t7
        0.5,-0.7,0.5, //v6
        0.5,-0.7,-0.5, //v7
        0.7,0.0,0.0, //v2
        //t8
        0.5,-0.7,-0.5, //v7
        0.0,0.0,-0.7, //v3
        0.7,0.0,0.0, //v2
        //t9
        0.5,-0.7,-0.5, //v7
        -0.5,-0.7,-0.5, //v8
        0.0,0.0,-0.7, //v3
        //t10
        0.0,0.0,-0.7, //v3
        -0.5,-0.7,-0.5, //v8
        -0.7,0.0,0.0, //v4
        //t11
        -0.5,-0.7,0.5, //v5
        -0.7,0.0,0.0, //v4
        -0.5,-0.7,-0.5, //v8
    ]

};

var j10VCstrip = {

    primitiva : WebGLRenderingContext.TRIANGLE_STRIP,

    "vertices" : [
        // PRISM
        0.0,0.7,0.0,        //V0
        0.0,0.0,0.7,        //V1
        0.7,0.0,0.0,        //V2
        0.0,0.0,-0.7,       //V3
        -0.7,0.0,0.0,       //V4
        //UNDERSIDE
        -0.5,-0.7,0.5,      //V5
        0.5,-0.7,0.5,       //V6
        0.5,-0.7,-0.5,      //V7
        -0.5,-0.7,-0.5      //V8
    ],

    "indices" : [
        1,5,6,1,2,6,2,7,3,8,4,5,1,2,0,2,3,4,0,1
        //ME OLVIDE DE LA BASE JAJAJAJAJAJ
    ]

};

var j10CIstrip = {

    primitiva : WebGLRenderingContext.TRIANGLE_STRIP,

    "vertices" : [ ]

};