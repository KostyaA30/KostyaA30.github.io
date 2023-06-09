export class UBO {
    constructor(gl, blockName, blockPoint, bufSize, arrayCalc) {
        this.items = [];
        this.keys = [];

        for (let i = 0; i < arrayCalc.length; i++) {
            this.items[arrayCalc[i].name] = {
                offset: arrayCalc[i].offset,
                dataLen: arrayCalc[i].dataLen,
                chunkLen: arrayCalc[i].chunkLen
            };
            this.keys[i] = arrayCalc[i].name;
        }

        this.gl = gl;
        this.blockName = blockName;
        this.blockPoint = blockPoint;

        this.buf = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.buf);
        gl.bufferData(gl.UNIFORM_BUFFER, bufSize, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, blockPoint, this.buf);
    }

    update(name, data) {
        if (!(data instanceof Float32Array)) {
            if (Array.isArray(data)) data = new Float32Array(data);
            else data = new Float32Array([data]);
        }

        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buf);
        this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, this.items[name].offset, data, 0, null);
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
        return this;
    }

    static create(gl, blockName, blockPoint, array) {
        let bufSize = UBO.calculate(array);
        UBO.Cache[blockName] = new UBO(gl, blockName, blockPoint, bufSize, array);
        //UBO.debugVisualize(UBO.Cache[blockName]);
    }

    static getSize(type) {
        switch (type) {
            case "mat4":
                return 16 * 4;
            case "mat3":
                return 16 * 3;
            case "vec2":
                return 8;
            case "f":
            case "i":
            case "b":
                return 4;
            case "vec3":
            case "vec4":
                return 16;
            default:
                return 0;
        }
    }

    static calculate(array) {
        let chunk = 16,
            tsize = 0,
            offset = 0,
            size = 0;

        for (let i = 0; i < array.length; i++) {
            if (!array[i].arraylen || array[i].arraylen == 0) size = UBO.getSize(array[i].type);
            else size = array[i].arraylen * 16;

            tsize = chunk - size;

            if (tsize < 0 && chunk < 16) {
                offset += chunk;
                if (i > 0) array[i - 1].chunkLen += chunk;
                chunk = 16;
            } else if (tsize < 0 && chunk == 16) {
            } else if (tsize == 0) chunk = 16;
            else chunk -= size;

            array[i].offset = offset;
            array[i].chunkLen = size;
            array[i].dataLen = size;

            offset += size;
        }

        if (offset % 16 != 0) {
            array[array.length - 1].chunkLen += chunk;
            offset += chunk;
        }

        console.log("UBO Buffer Size ", offset);
        return offset;
    }

    static debugVisualize(ubo) {
        let str = "",
            chunk = 0,
            tchunk = 0,
            itm = null;

        for (let i = 0; i < ubo.keys.length; i++) {
            itm = ubo.items[ubo.keys[i]];
            console.log(ubo.keys[i], itm);

            chunk = itm.chunkLen / 4;
            for (let x = 0; x < chunk; x++) {
                str += x == 0 || x == chunk - 1 ? "|." + i + "." : "|...";
                tchunk++;
                if (tchunk % 4 == 0) str += "| ~ ";
            }
        }

        if (tchunk % 4 != 0) str += "|";

        console.log(str);
    }
}

UBO.Cache = [];