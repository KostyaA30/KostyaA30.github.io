// import { Timer } from './timer.js';

let canvas,
    gl,
    shaderProgram,
    countOfDrawArrayElem,
    time_loc = -2;
    // frameBuffer,
    // posBuffer,
    // frameVertexArray,
    // frameScale,
    // myTimer;

// let SetColor = [1, 0, 0];

// const frameUniformBufferIndex = 5;

// let frameData = [-2, 4, -2, 4, 0, 0, 0, 0, 0.35, 0.03, 0.35, 0.03, 0, 1, 0, 0];

export function initGL() {
    canvas = document.getElementById('glCanvas');
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.3, 0.47, 0.8, 1);

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    let vs, fs;

    const ft1 = fetch("/vert.glsl")
      .then((res) => res.text())
      .then((data) => {
        vs = data;
    });
    const ft2 = fetch("/frag.glsl")
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

        // time_loc = gl.GetUniformLocation(shaderProgram, "Time");

        // frameBuffer = gl.createBuffer();
        // gl.BindBuffer(gl.UNIFORM_BUFFER, frameBuffer);
        // gl.bufferData(gl.UNIFORM_BUFFER, 12 * 4, gl.STATIC_DRAW);

        // Float32Array.getUniformBuffer(
        //     shaderProgram,
        //     gl.getUniformBlockIndex(shaderProgram, "frameBuffer"),
        //     frameUniformBufferIndex
        // );

        // myTimer = new Timer();
    });

    // VG4
    // END
}

// var indices = new Uint16Array([0, 1, 3, 2]);

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

    // vg4
    // frameVertexArray = gl.createVertexArray();
    // gl.bindVertexArray(frameVertexArray);
    // end

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(posLoc); // 0

    //let Tx = 0.5, Ty = 0.5, Tz = 0.0;

    //gl.uniform4f(uniTrans, Tx, Ty, Tz, 0.0);

    gl.useProgram(shaderProgram);

    return n;
}

export function Render() {
    // VG4
    // if (time_loc == -2) return;

    // if (myTimer != undefined) {
    //     myTimer.response('fps');
    // }
    // let color_loc = gl.getUniformnLocation();
    // if (color_loc != -1) {
    //     gl.uniform3fv(color_loc, new new Float32Array(SetColor));
    // }

    // if (time_loc != -1 && myTimer != undefined) {
    //     gl.uniform1f(time_loc, myTimer.localTime);
    // }
    // gl.BindBuffer(gl.UNIFORM_BUFFER, frameUniformBufferIndex, frameBuffer);
    // END

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, countOfDrawArrayElem); // _STRIP
}


// #version 300 es
// /**/
// precision highp float;
// out highp vec4 o_color;

// in vec4 color;
// in vec2 tpos;
// uniform float Time;

// uniform frameBuffer
// {
//   vec4 BufData[4];
// };

// vec2 mul( vec2 z1, vec2 z2 )
// {
//     return vec2(z1.x * z2.x - z1.y * z2.y, z1.x * z2.y + z1.y * z2.x);
// }
// float Jul( vec2 z, vec2 z0 )
// {
//     for (int i = 0; i < 256; i++)
//     {
//         if (dot(z, z) > 4.0)
//           return float(i);
//         z = mul(z, z) + z0;
//     }
//     return 256.0;
// }
// vec2 Rot( float A, vec2 v )
// {
//     return mat2(vec2(cos(A), -sin(A)), vec2(sin(A), cos(A))) * v;
// }

// void main( void )
// {

//   vec2 tp = (tpos + 1.0) / 2.0 * BufData[0].yw + BufData[0].xz;
//   vec2 p = Rot(Time * BufData[3].z * acos(-1.0) / 180.0, tp) * 1.0;
//   float c = Jul(p, vec2(BufData[2].x + BufData[2].y * sin(Time), BufData[2].z + BufData[2].w * sin(Time + BufData[3].x))) / 256.0;
//   o_color = mod(color * c * BufData[3].y, vec4(1, 1, 1, 1));
// }

// #version 300 es
// precision highp float;
// in vec4 in_pos;

// out vec4 color;
// out vec2 tpos;
// uniform float Time;

// void main() {
//     gl_Position = in_pos;
//     tpos = in_pos.xy;
//     color = vec4(1, 0, 0, 1);
// }