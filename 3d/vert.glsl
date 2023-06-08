#version 300 es

in vec4 in_pos;
in vec4 in_color;
in vec4 in_norm;
uniform mat4 u_mvpMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_normalMatrix;
out vec4 v_color;
out vec3 v_norm;
out vec3 v_pos;

void main() {
    gl_Position = u_mvpMatrix * in_pos;
    v_pos = vec3(u_modelMatrix * in_pos);
    v_norm = normalize(vec3(u_normalMatrix * in_norm));
    v_color = in_color;
    // vec3 normal = normalize(vec3(in_norm.xyz));
    // float ndotL = max(dot(u_lightDir, normal), 0.0);
    // vec3 diffuse = u_lightDif * in_color.rgb * ndotL;
    // vec3 ambient = u_lightAmb * in_color.rgb;
    // v_color = vec4(diffuse + ambient, in_color.a);
}