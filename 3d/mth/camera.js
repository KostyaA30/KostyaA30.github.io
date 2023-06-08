import {mat4, vec3} from "./mat4.js";

class _camera {
  constructor() {
    this.projSize = 0.1;
    this.projDist = 0.1;
    this.projFarClip = 1800;

    this.frameW = 30;
    this.frameH = 30;
    
    this.matrView = mat4();
    this.matrProj = mat4();
    this.matrVP = mat4();

    this.loc = vec3();   
    this.at = vec3();    
    this.dir = vec3();   
    this.up = vec3();    
    this.right = vec3(); 
    this.setDef();
   
  }
  
  set(loc, at, up) {
    this.matrView.setView(loc, at, up);
    this.loc = vec3(loc);
    this.at = vec3(at);
    this.dir.set(-this.matrView.m[0][2],
                 -this.matrView.m[1][2],
                 -this.matrView.m[2][2]);
    this.up.set(this.matrView.m[0][1],
               this.matrView.m[1][1],
               this.matrView.m[2][1]);
    this.right.set(this.matrView.m[0][0],
                   this.matrView.m[1][0],
                   this.matrView.m[2][0]);
    this.matrVP = mat4(this.matrView).mul(this.matrProj);
  }
  setProj(projSize, projDist, projFarClip) {
    let rx = projSize, ry = projSize;

    this.projDist = projDist;
    this.projSize = projSize;
    this.projFarClip = projFarClip;

    if (this.frameW > this.frameH)
      rx *= this.frameW / this.frameH;
    else
      ry *= this.frameH / this.frameW;
    this.matrProj.setFrustum(-rx / 2.0, rx / 2.0, -ry / 2.0, ry / 2.0, projDist, projFarClip);
    
    this.matrVP = mat4(this.matrView).mul(this.matrProj);
  }

  setSize(frameW, frameH) {
    if (frameW < 1)
      frameW = 1;
    if (frameH < 1)
      frameH = 1;
    this.frameW = frameW;
    this.frameH = frameH;
    this.setProj(this.projSize, this.projDist, this.projFarClip);
  } 

  setDef() {
    this.loc.set(0, 0, 8);
    this.at.set(0, 0, 0);
    this.dir.set(0, 0, -1);
    this.up.set(0, 1, 0);
    this.right.set(1, 0, 0);

    this.projDist = 0.1;
    this.projSize = 0.1;
    this.projFarClip = 1800;

    this.frameW = 30;
    this.frameH = 30;

    this.set(this.loc, this.at, this.up);
    this.setProj(this.projSize, this.projDist, this.projFarClip);
    this.setSize(this.frameW, this.frameH);
  }
}

export function camera(...args) {
  return new _camera(args);
}