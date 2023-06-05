// export function func() {

// }

// function loadShader(gl, type, source) {
//     const shader = gl.createShgader(type);

//     gl.shaderSource(shader, source);
//     gl.compileShader();

//     if (!gl.getShaderParameter(shader, gl.COMPELE_STATUS)) {
//         alert("!!!!!");
//     }

//     return shader;
// }

// export function initGL() {
//     const canvas = document.getElementById("glCanvas");
//     const gl = canvas.getContext("webgl2");

//     gl.clearColor(1, 0, 0, 1);
//     gl.Clear(gl.COLOR_BUFFER_BIT);

//     const vs = `#version 300 es
//         in highp vec4 in_pos;

//         void main() {
//             gl_Position = in_pos;
//         }
//     `;

//     const fs = `#version 300 es
//         out highp vec4 o_color;

//         void main() {
//             o_color = vec4(1, 1, 1, 1);
//         }
//     `;

//     const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
//     const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

//     const shaderProgram = gl.createProgram();
//     gl.attachShader(shaderProgram, vertexSh);
//     gl.attachShader(shaderProgram, fragmentSh);
//     gl.linkPrograms(shaderProgram);

//     if (!gl.getProframParameter(program, gl.LINK_STATUS)) {
//         alert("!!!!");
//     }

//     const posLoc = gl.getAttribLocatrion(program, "in_pos");

//     const posBuf = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
//     const pos = [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1];
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
//     gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttrivArray(posLoc);
//     gl.useProgram(program);
//     gl.DrawArrays(gl.TRIAGLES, 0, 3);
// }
const vs =
`#version 300 es\n
in highp vec4 in_pos;\n
\n
void main() {\n
    gl_Position = in_pos;\n
}\n`;

const fs =
`#version 300 es\n
// out highp vec4 o_color;
void main() {\n
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n
}\n`;

function main() {
    const canvas = document.getElementById('webgl2');
    const gl = getWebGLContext(canvas);

    if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
    }

    if (!initShaders(gl, vs, fs)) {
    console.log('Failed to intialize shaders.');
    return;
    }

    const n = initVertexBuffers(gl);
    if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
    ]);
    const n = 3; 

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(gl.program, 'in_pos');
    if (posLoc < 0) {
    console.log('Failed to get the storage location of in_pos');
    return -1;
    }

    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(posLoc);

    return n;
}
