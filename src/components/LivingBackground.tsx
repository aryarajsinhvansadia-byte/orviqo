"use client";

import { useEffect, useRef } from "react";

/**
 * The living background. A single full-screen WebGL2 fragment shader —
 * a slow, cool nebula in ORVIQO's night palette with a faint corona light
 * that drifts and answers the cursor. Hand-written GLSL, no libraries, so it
 * costs almost nothing to ship and runs at 60fps on a capped DPR.
 *
 * Degrades gracefully: no WebGL2 or prefers-reduced-motion → the CSS night
 * ground shows through untouched. Pauses when the tab is hidden.
 */

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;   // 0..1, smoothed

// --- value noise + fbm ---
float hash(vec2 p){
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++){
    v += a * noise(p);
    p = rot * p * 2.0 + 10.0;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;           // aspect-correct
  float t = u_time * 0.02;

  // two slow-drifting noise fields → soft moving clouds
  vec2 q = vec2(fbm(p * 1.6 + vec2(t, -t * 0.7)),
                fbm(p * 1.6 + vec2(4.2, 1.3) + vec2(-t * 0.6, t)));
  float clouds = fbm(p * 1.9 + q * 1.8 + vec2(t * 0.5, 0.0));

  // ORVIQO night palette
  vec3 night  = vec3(0.039, 0.039, 0.063);   // #0a0a10
  vec3 indigo = vec3(0.070, 0.075, 0.130);   // cool nebula
  vec3 col = mix(night, indigo, smoothstep(0.25, 0.95, clouds) * 0.9);

  // corona light — drifts slowly, and leans toward the cursor
  vec2 drift = vec2(0.5 + 0.28 * sin(u_time * 0.05),
                    0.42 + 0.22 * cos(u_time * 0.037));
  vec2 lightPos = mix(drift, u_mouse, 0.45);
  vec2 d = uv - lightPos;
  d.x *= u_res.x / u_res.y;
  float glow = exp(-dot(d, d) * 6.0);
  vec3 corona = vec3(1.0, 0.545, 0.239);      // #ff8b3d
  col += corona * glow * (0.10 + 0.05 * clouds);

  // a second, cooler far light for depth
  vec2 d2 = uv - vec2(0.18, 0.8);
  d2.x *= u_res.x / u_res.y;
  col += vec3(0.35, 0.45, 0.7) * exp(-dot(d2, d2) * 9.0) * 0.05;

  // gentle vignette keeps edges grounded
  float vig = smoothstep(1.15, 0.35, length(uv - 0.5));
  col *= 0.55 + 0.45 * vig;

  outColor = vec4(col, 1.0);
}`;

const VERT = `#version 300 es
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export default function LivingBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return; // CSS night ground remains

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0.5, y: 0.55, tx: 0.5, ty: 0.55 };
    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // one static frame, no loop
      gl.uniform1f(uTime, 8.0);
      gl.uniform2f(uMouse, 0.5, 0.6);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
