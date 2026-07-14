precision mediump float;

/* @resolution */
uniform vec2 u_resolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  v += 0.5000 * noise(p); p *= 2.0;
  v += 0.2500 * noise(p); p *= 2.0;
  v += 0.1250 * noise(p); p *= 2.0;
  v += 0.0625 * noise(p); p *= 2.0;
  v += 0.0312 * noise(p); p *= 2.0;
  v += 0.0156 * noise(p);
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv.y = 1.0 - uv.y;

  float c1   = fbm(uv * 2.0);
  float c2   = fbm(uv * 3.5 + vec2(8.3, 2.8));
  float warp = fbm(uv * 1.5 + vec2(5.2, 1.3)) * 0.3;
  float cloud = fbm(uv * 2.0 + warp + c1 * 0.15 + c2 * 0.1);
  cloud = 0.4 + 0.6 * cloud;

  vec3 voidDark  = vec3(0.05, 0.06, 0.11);
  vec3 cloudBody = vec3(0.18, 0.22, 0.36);
  vec3 cloudRim  = vec3(0.32, 0.40, 0.58);

  vec3 col = mix(voidDark, cloudBody, smoothstep(0.30, 0.65, cloud));
  col = mix(col, cloudRim, smoothstep(0.60, 0.90, cloud) * 0.50);

  vec2 lp = uv - vec2(0.50, 0.18);
  lp.x *= 0.60;
  col += vec3(0.06, 0.12, 0.24) * exp(-dot(lp, lp) * 5.0) * 1.2;

  vec2 vp = (uv - 0.5) * vec2(1.40, 1.60);
  float vig = clamp(1.0 - dot(vp, vp), 0.0, 1.0);
  col *= 0.08 + 0.92 * vig * vig;

  col *= 1.0 - smoothstep(0.55, 1.0, uv.y) * 0.75;

  gl_FragColor = vec4(col, 1.0);
}
