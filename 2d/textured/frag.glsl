#version 300 es

#ifdef GL_ES
    precision mediump float;
#endif

uniform sampler2D u_Sampler;
in vec2 v_TexCoord;
out vec4 out_color;

void main() {
    out_color = texture(u_Sampler, v_TexCoord);
}