// import { Timer } from './timer.js';

let canvas,
    gl,
    shaderProgram,
    countOfDrawArrayElem;

export function initGL() {
    canvas = document.getElementById('glCanvas');
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.3, 0.47, 0.8, 1);

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
        initShaders(gl, vs, fs);
        if (shaderProgram == undefined) {
            console.log('Failed to intialize shaders.');
            return;
        }
    
        countOfDrawArrayElem = initVertexBuffers(gl);
        if (countOfDrawArrayElem < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
    });
}


function initShaders( gl, vs, fs ) {
    const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

    if (!vertexSh || !fragmentSh) {
        return;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexSh);
    gl.attachShader(shaderProgram, fragmentSh);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(shaderProgram);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(shaderProgram);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
    }
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return undefined;
    }

    return shader;
}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
    ]);
    const n = 4; 

    const posLoc = gl.getAttribLocation(shaderProgram, 'in_pos');
    if (posLoc < 0) {
        console.log('Failed to get the storage location of in_pos');
        return -1;
    }
    
    const uniTrans = gl.getAttribLocation(shaderProgram, 'u_trans');

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(posLoc); 

    gl.useProgram(shaderProgram);

    return n;
}

export function Render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, countOfDrawArrayElem); // _STRIP
}