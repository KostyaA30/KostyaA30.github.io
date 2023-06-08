import { matr4 } from "./mth/matr4.js"
import { vec3 } from "./mth/vec3.js"
import { vec4 } from "./mth/vec4.js"

let canvas, gl, indOfV;

export function initGL() {
    canvas = document.getElementById('gl3dCanvas');

    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    let vs, fs;

    const ft1 = fetch("./vert.glsl")
      .then((res) => res.text())
      .then((data) => {
        vs = data;
    });
    const ft2 = fetch("./frag.glsl")
      .then((res) => res.text())
      .then((data) => {
        fs = data;
    });
    const allData = Promise.all([ft1, ft2]);

    allData.then((res) => {
        if (!initShaders(gl, vs, fs)) {
            console.log('Failed to intialize shaders.');
            return;
        }

        indOfV = initVertexBuffers(gl);
        if (indOfV < 0) {
            console.log('Failed to set the vertex information');
            return;
        }

        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.DEPTH_TEST);

        let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix');
        let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix');
        let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_normalMatrix');
        let u_LightColor = gl.getUniformLocation(gl.program, 'u_lightCol');
        let u_LightPosition = gl.getUniformLocation(gl.program, 'u_lightPos');
        let u_AmbientLight = gl.getUniformLocation(gl.program, 'u_lightAmb');
        if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight) { 
          console.log('Failed to get the storage location');
          return;
        }
      
        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
        gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
      
        let modelMatrix = matr4(); 
        let mvpMatrix = matr4();   
        let normalMatrix = matr4();
      
        modelMatrix.setRotate(90, 0, 1, 0); 
        mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
        mvpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
        mvpMatrix.mulmatrself(modelMatrix);
        normalMatrix.inverse(modelMatrix);
        normalMatrix = normalMatrix.transpose();
      
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.toArray());
      
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.toArray());
      
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.toArray());
    });

}

function initShaders(gl, vshader, fshader) {
    let program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('Failed to create program');
        return false;
    }

    gl.useProgram(program);
    gl.program = program;

    return true;
}

function createProgram(gl, vshader, fshader) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    
    if (!vertexShader || !fragmentShader) {
        return undefined;
    }

    let program = gl.createProgram();
    if (!program) {
        return undefined;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        let error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return undefined;
    }

    return program;
}

function loadShader(gl, type, source) {
    let shader = gl.createShader(type);
    if (shader == undefined) {
        console.log('unable to create shader');
        return undefined;
    }

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        let error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader (' + type + '): ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initVertexBuffers(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    let vertices = new Float32Array([
         1.0,  1.0,  1.0,  -1.0,  1.0,  1.0,  -1.0, -1.0,  1.0,   1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,   1.0, -1.0,  1.0,   1.0, -1.0, -1.0,   1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,   1.0,  1.0, -1.0,  -1.0,  1.0, -1.0,  -1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,  -1.0,  1.0, -1.0,  -1.0, -1.0, -1.0,  -1.0, -1.0,  1.0,
        -1.0, -1.0, -1.0,   1.0, -1.0, -1.0,   1.0, -1.0,  1.0,  -1.0, -1.0,  1.0,
         1.0, -1.0, -1.0,  -1.0, -1.0, -1.0,  -1.0,  1.0, -1.0,   1.0,  1.0, -1.0 
    ]);

    let colors = new Float32Array([
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,  
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,  
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,  
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,  
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,  
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　 
    ]);

    let normals = new Float32Array([
         0.0,  0.0, 1.0,   0.0,  0.0, 1.0,   0.0,  0.0,  1.0,   0.0,  0.0,  1.0, 
         1.0,  0.0, 0.0,   1.0,  0.0, 0.0,   1.0,  0.0,  0.0,   1.0,  0.0,  0.0, 
         0.0,  1.0, 0.0,   0.0,  1.0, 0.0,   0.0,  1.0,  0.0,   0.0,  1.0,  0.0, 
        -1.0,  0.0, 0.0,  -1.0,  0.0, 0.0,  -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0, 
         0.0, -1.0, 0.0,   0.0, -1.0, 0.0,   0.0, -1.0,  0.0,   0.0, -1.0,  0.0, 
         0.0,  0.0,-1.0,   0.0,  0.0,-1.0,   0.0,  0.0, -1.0,   0.0,  0.0, -1.0  
    ]);

    let indices = new Uint8Array([
         0,  1,  2,   0,  2,  3, 
         4,  5,  6,   4,  6,  7, 
         8,  9, 10,   8, 10, 11, 
        12, 13, 14,  12, 14, 15, 
        16, 17, 18,  16, 18, 19, 
        20, 21, 22,  20, 22, 23  
    ]);

    let fsize = vertices.BITES_PER_ELEMENT;
    if (!initArrayBuffer(gl, 'in_pos', vertices, 3, gl.FLOAT, fsize * 9, 0))
        return -1;
    if (!initArrayBuffer(gl, 'in_color', colors, 3, gl.FLOAT, fsize * 9, fsize * 3))
        return -1;
    if (!initArrayBuffer(gl, 'in_norm', normals, 3, gl.FLOAT, fsize * 9, fsize * 6))
        return -1;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, attribute, data, num, type, stride, offset) {
    let buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    let in_attribute = gl.getAttribLocation(gl.program, attribute);
    if (in_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(in_attribute, num, type, false, stride, offset);
    gl.enableVertexAttribArray(in_attribute);

    return true;
}

export function Render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, indOfV, gl.UNSIGNED_BYTE, 0);
}