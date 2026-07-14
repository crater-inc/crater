// APOLLOS Contact 背景：静かに揺らぐ紺のネビュラ（雲・宇宙の余韻）
/** @resolution */
uniform vec2 u_resolution;
/** @time */
uniform float u_time;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.025;

  // ゆっくり流れる多層ノイズ
  float n = noise(uv * 3.0 + vec2(t, t * 0.5));
  n += 0.5 * noise(uv * 6.0 - vec2(t * 0.7, t));
  n /= 1.5;

  vec3 base = vec3(0.045, 0.055, 0.085);  // ink-dark に近い紺
  vec3 glow = vec3(0.10, 0.20, 0.38);     // 青の発光
  vec3 col = mix(base, glow, smoothstep(0.42, 0.92, n) * 0.55);

  // 中央をわずかに明るく、周辺を落とすビネット
  float d = distance(uv, vec2(0.5, 0.45));
  col *= 1.0 - d * 0.55;

  gl_FragColor = vec4(col, 1.0);
}
