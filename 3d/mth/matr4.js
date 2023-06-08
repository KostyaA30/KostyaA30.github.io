import { vec3 } from "./vec3.js";
import { vec4 } from "./vec4.js";

class _matr4{
    constructor(m = null) {
        if (m == null) {
            this.m = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        } else if (typeof m == "object" && m.length == 4) {
            this.set(m[0], m[1], m[2], m[3]);
        } else {
            this.m = m;
        }
    }

    setIdentity() {
        this.m = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    }

    set(a1, a2, a3, a4)
    {
        this.m = [[a1, a2, a3, a4], [a1, a2, a3, a4], [a1, a2, a3, a4], [a1, a2, a3, a4]];
    }

    setall(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16)
    {
        this.m = [[a1, a2, a3, a4], [a5, a6, a7, a8], [a9, a10, a11, a12], [a13, a14, a15, a16]];
    }

    mulmatrself( other ) {
        let i, ai0, ai1, ai2, ai3;
          
        for (i = 0; i < 4; i++) {
            ai0 = this.m[0][i];
            ai1 = this.m[1][i];
            ai2 = this.m[2][i];
            ai3 = this.m[3][i];
            this.m[0][i] = ai0 * other.m[0][0] + ai1 * other.m[0][1] + ai2 * other.m[0][2] + ai3 * other.m[0][3];
            this.m[1][i] = ai0 * other.m[1][0] + ai1 * other.m[1][1] + ai2 * other.m[1][2] + ai3 * other.m[1][3];
            this.m[2][i] = ai0 * other.m[2][0] + ai1 * other.m[2][1] + ai2 * other.m[2][2] + ai3 * other.m[2][3];
            this.m[3][i] = ai0 * other.m[3][0] + ai1 * other.m[3][1] + ai2 * other.m[3][2] + ai3 * other.m[3][3];
        }
        
        return this;
    }

    mulvec3(v) {
        v1 = new vec3();

        v1.x = v.x * this.m[0][0] + v.y * this.m[1][0] + v.z * this.m[2][0] + this[3][0];
        v1.y = v.x * this.m[0][1] + v.y * this.m[1][1] + v.z * this.m[2][1] + this[3][1];
        v1.z = v.x * this.m[0][2] + v.y * this.m[1][2] + v.z * this.m[2][2] + this[3][2];

        return v1;
    }

    mulvec4(v) {
        v1 = new vec4();

        v1.x = v.x * this.m[0][0] + v.y * this.m[1][0] + v.z * this.m[2][0] + v.w * this[3][0];
        v1.y = v.x * this.m[0][1] + v.y * this.m[1][1] + v.z * this.m[2][1] + v.w * this[3][1];
        v1.z = v.x * this.m[0][2] + v.y * this.m[1][2] + v.z * this.m[2][2] + v.w * this[3][2];
        v1.w = v.x * this.m[0][3] + v.y * this.m[1][3] + v.z * this.m[2][3] + v.w * this[3][3];

        return v1;
    }

    translate(x, y, z) {
        this.m[3][0] += this.m[0][0] * x + this.m[1][0] * y + this.m[2][0] * z;
        this.m[3][1] += this.m[0][1] * x + this.m[1][1] * y + this.m[2][1] * z;
        this.m[3][2] += this.m[0][2] * x + this.m[1][2] * y + this.m[2][2] * z;
        this.m[3][3] += this.m[0][3] * x + this.m[1][3] * y + this.m[2][3] * z;
        return this;
    }

    transpose() {
        let r = [[], [], [], []];

        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                r[i][j] = this.m[j][i];
        return matr4(r);
    }
    
    determ3x3(A11, A12, A13,
        A21, A22, A23,
        A31, A32, A33 ) {
        return A11 * A22 * A33 -
            A11 * A23 * A32 -
            A12 * A21 * A33 +
            A12 * A23 * A31 +
            A13 * A21 * A32 - 
            A13 * A22 * A31;
    }

    determ() {
      let det =
        this.m[0][0] * this.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3],
                                      this.m[2][1], this.m[2][2], this.m[2][3],
                                      this.m[3][1], this.m[3][2], this.m[3][3]) - 
        this.m[0][1] * this.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3],
                                      this.m[2][0], this.m[2][2], this.m[2][3],
                                      this.m[3][0], this.m[3][2], this.m[3][3]) +
        this.m[0][2] * this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3],
                                      this.m[2][0], this.m[2][1], this.m[2][3],
                                      this.m[3][0], this.m[3][1], this.m[3][3]) -
        this.m[0][3] * this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2],
                                      this.m[2][0], this.m[2][1], this.m[2][2],
                                      this.m[3][0], this.m[3][1], this.m[3][2]);
      
      
      return det;
    }

    inverse() {
        let r = [[], [], [], []];
        let det = this.determ();
    
        if (det == 0)
        {
          let m = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    
          return mat4(m);
        }
    
        r[0][0] =
          this.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3],
                         this.m[2][1], this.m[2][2], this.m[2][3],
                         this.m[3][1], this.m[3][2], this.m[3][3]) / det;
        r[1][0] =
          -this.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3],
                          this.m[2][0], this.m[2][2], this.m[2][3],
                          this.m[3][0], this.m[3][2], this.m[3][3]) / det;
        r[2][0] =
          this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3],
                         this.m[2][0], this.m[2][1], this.m[2][3],
                         this.m[3][0], this.m[3][1], this.m[3][3]) / det;
        r[3][0] =
          -this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2],
                          this.m[2][0], this.m[2][1], this.m[2][2],
                          this.m[3][0], this.m[3][1], this.m[3][2]) / det;
    
        r[0][1] =
          -this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                          this.m[2][1], this.m[2][2], this.m[2][3],
                          this.m[3][1], this.m[3][2], this.m[3][3]) / det;
        r[1][1] =
          this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                         this.m[2][0], this.m[2][2], this.m[2][3],
                         this.m[3][0], this.m[3][2], this.m[3][3]) / det;
        r[2][1] =
          -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                          this.m[2][0], this.m[2][1], this.m[2][3],
                          this.m[3][0], this.m[3][1], this.m[3][3]) / det;
        r[3][1] =
          this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                         this.m[2][0], this.m[2][1], this.m[2][2],
                         this.m[3][0], this.m[3][1], this.m[3][2]) / det;
    
        r[0][2] =
          this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                         this.m[1][1], this.m[1][2], this.m[1][3],
                         this.m[3][1], this.m[3][2], this.m[3][3]) / det;
        r[1][2] =
          -this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                          this.m[1][0], this.m[1][2], this.m[1][3],
                          this.m[3][0], this.m[3][2], this.m[3][3]) / det;
        r[2][2] =
          this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                         this.m[1][0], this.m[1][1], this.m[1][3],
                         this.m[3][0], this.m[3][1], this.m[3][3]) / det;
        r[3][2] =
          -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                          this.m[1][0], this.m[1][1], this.m[1][2],
                          this.m[3][0], this.m[3][1], this.m[3][2]) / det;
    
        r[0][3] =
          -this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                          this.m[1][1], this.m[1][2], this.m[1][3],
                          this.m[2][1], this.m[2][2], this.m[2][3]) / det;
       
        r[1][3] =
          this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                         this.m[1][0], this.m[1][2], this.m[1][3],
                         this.m[2][0], this.m[2][2], this.m[2][3]) / det;
        r[2][3] =
          -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                          this.m[1][0], this.m[1][1], this.m[1][3],
                          this.m[2][0], this.m[2][1], this.m[2][3]) / det;
        r[3][3] =
          this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                         this.m[1][0], this.m[1][1], this.m[1][2],
                         this.m[2][0], this.m[2][1], this.m[2][2]) / det;
        this.m = r;

        return this;
    }
    setPerspective(fovy, aspect, near, far) {
        let rd, s, ct;
      
        if (near === far || aspect === 0) {
          throw 'null frustum';
        }
        if (near <= 0) {
          throw 'near <= 0';
        }
        if (far <= 0) {
          throw 'far <= 0';
        }
      
        fovy = Math.PI * fovy / 180 / 2;
        s = Math.sin(fovy);
        if (s === 0) {
          throw 'null frustum';
        }
      
        rd = 1 / (far - near);
        ct = Math.cos(fovy) / s;

        this.setall(ct / aspect, 0, 0, 0,
            0, ct, 0, 0,
            0, 0, -(far + near) * rd, -1,
            0, 0, -2 * near * far * rd, 0);

        return this;
    }

    setRotate(angle, x, y, z) {
        let s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;
      
        angle = Math.PI * angle / 180;
        
        s = Math.sin(angle);
        c = Math.cos(angle);
      
        if (0 !== x && 0 === y && 0 === z) {
            if (x < 0) {
                s = -s;
            }
            this.setall(1, 0, 0, 0,
                0, c, s, 0,
                0, -s, c, 0,
                0, 0, 0, 1);
        } else if (0 === x && 0 !== y && 0 === z) {
            if (y < 0) {
                s = -s;
            }
            this.setall(c, 0, s, 0,
                0, 1, 0, 0,
                -s, 0, c, 0,
                0, 0, 0, 1);
        } else if (0 === x && 0 === y && 0 !== z) {
            if (z < 0) {
                s = -s;
            }
            this.setall(c, -s, 0, 0,
                s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1);
        } else {
            len = Math.sqrt(x * x + y * y + z * z);
            if (len !== 1) {
                rlen = 1 / len;
                x *= rlen;
                y *= rlen;
                z *= rlen;
            }
            nc = 1 - c;
            xy = x * y;
            yz = y * z;
            zx = z * x;
            xs = x * s;
            ys = y * s;
            zs = z * s;
        
            this.setall(x * y * nc + c, xy * nc + zs, zx * nc - ys, 0,
                xy * nc - zs, x * y * nc + c, yz * nc + xs, 0,
                zx * nc + ys, yz * nc - xs, z * z * nc + c, 0,
                0, 0, 0, 1);
        }
      
        return this;
    }

    setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        let fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
      
        fx = centerX - eyeX;
        fy = centerY - eyeY;
        fz = centerZ - eyeZ;
      
        rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;
      
        sx = fy * upZ - fz * upY;
        sy = fz * upX - fx * upZ;
        sz = fx * upY - fy * upX;
      
        rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
        sx *= rls;
        sy *= rls;
        sz *= rls;
      
        ux = sy * fz - sz * fy;
        uy = sz * fx - sx * fz;
        uz = sx * fy - sy * fx;

        this.setall(sx, ux, -fx, 0,
            sy, uy, -fy, 0,
            sz, uz, -fz, 0,
            0, 0, 0, 1);

        return this.translate(-eyeX, -eyeY, -eyeZ);
    }

    lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        return this.mulmatrself(new _matr4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
    }

    toArray() {
        return [].concat(...this.m);
    }
}

export function matr4(...arg) {
    return new _matr4(...arg);
}