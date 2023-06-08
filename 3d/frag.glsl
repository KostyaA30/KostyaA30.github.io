#version 300 es

#ifdef GL_ES
    precision mediump float;
#endif

uniform vec3 u_lightCol;
uniform vec3 u_lightPos;
uniform vec3 u_lightAmb;
in vec3 v_norm;
in vec3 v_pos;
in vec4 v_color;
out vec4 out_color;

void main() {
    vec3 normal = normalize(v_norm);
    vec3 lightDir = normalize(u_lightPos - v_pos);
    float nDotL = max(dot(lightDir, normal), 0.0);

    vec3 diffuse = u_lightCol * v_color.rgb * nDotL;
    vec3 ambient = u_lightAmb * v_color.rgb;

    out_color = vec4(diffuse + ambient, v_color.a);
}