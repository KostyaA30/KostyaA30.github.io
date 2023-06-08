#version 300 es
in highp vec4 in_pos;
uniform vec4 u_trans;

void main() {
    gl_Position = in_pos + u_trans;
}