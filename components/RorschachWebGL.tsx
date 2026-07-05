'use client'

import { useEffect, useRef, useState } from 'react'

interface RorschachWebGLProps {
  width?: number
  height?: number
  sharpness?: number
  density?: number
  scale?: number
  symmetry?: number
  details?: number
  speed?: number
}

const VERT_SHADER = `
attribute vec2 aCoords;
uniform vec2 uCoordsAdjustment;
varying vec2 vUv;
varying vec2 vCanvasUV;
void main(void) {
  gl_Position = vec4(aCoords, 0, 1);
  vUv = aCoords * uCoordsAdjustment;
  vCanvasUV = aCoords;
}
`

const FRAG_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

uniform float uTime;
uniform float uSharpness;
uniform float uThreshold;
uniform float uScale;
uniform float uSymetry;
uniform float uMaxDetails;

varying vec2 vUv;
varying vec2 vCanvasUV;

vec3 random(vec3 i) {
  const vec3 seed1 = vec3(31.06, 19.86, 30.19);
  const vec3 seed2 = vec3(6640.0, 5790.4, 10798.861);
  return fract(sin(dot(i, seed1)) * seed2) - 0.5;
}

float gradientNoise(const vec3 coords) {
  vec3 floorCoords = floor(coords);
  vec3 fractCoords = fract(coords);

  vec3 coords000 = floorCoords + vec3(0,0,0);
  vec3 coords001 = floorCoords + vec3(0,0,1);
  vec3 coords010 = floorCoords + vec3(0,1,0);
  vec3 coords011 = floorCoords + vec3(0,1,1);
  vec3 coords100 = floorCoords + vec3(1,0,0);
  vec3 coords101 = floorCoords + vec3(1,0,1);
  vec3 coords110 = floorCoords + vec3(1,1,0);
  vec3 coords111 = floorCoords + vec3(1,1,1);

  vec3 g000 = random(coords000);
  vec3 g001 = random(coords001);
  vec3 g010 = random(coords010);
  vec3 g011 = random(coords011);
  vec3 g100 = random(coords100);
  vec3 g101 = random(coords101);
  vec3 g110 = random(coords110);
  vec3 g111 = random(coords111);

  float n000 = dot(g000, fractCoords - vec3(0,0,0));
  float n001 = dot(g001, fractCoords - vec3(0,0,1));
  float n010 = dot(g010, fractCoords - vec3(0,1,0));
  float n011 = dot(g011, fractCoords - vec3(0,1,1));
  float n100 = dot(g100, fractCoords - vec3(1,0,0));
  float n101 = dot(g101, fractCoords - vec3(1,0,1));
  float n110 = dot(g110, fractCoords - vec3(1,1,0));
  float n111 = dot(g111, fractCoords - vec3(1,1,1));

  vec3 c = fractCoords*fractCoords*fractCoords*(fractCoords*(6.0*fractCoords - 15.0) + 10.0);

  float nx00 = mix(n000, n100, c.x);
  float nx01 = mix(n001, n101, c.x);
  float nx10 = mix(n010, n110, c.x);
  float nx11 = mix(n011, n111, c.x);
  float nxx0 = mix(nx00, nx10, c.y);
  float nxx1 = mix(nx01, nx11, c.y);
  return mix(nxx0, nxx1, c.z);
}

float layeredNoise(const vec3 coords) {
  float result = 0.0;
  float amplitude = 0.5;
  float sc = 2.5;
  for (int i = 0; i < 5; i++) {
    float noise = gradientNoise(coords * sc);
    result += amplitude * noise * smoothstep(0.0, 1.0, uMaxDetails - float(i));
    amplitude *= 0.5;
    sc *= 2.3;
  }
  return result;
}

float computeInkIntensity(vec2 uv, float noiseMask) {
  uv *= uScale;
  const float SEED = 0.0;
  vec3 coordsR = vec3(uv.x, uv.y + SEED, 0.02 * uTime);
  coordsR.x = abs(coordsR.x);
  float noiseR = layeredNoise(coordsR) + 0.5;

  vec3 coordsS = vec3(uv, 0.001 * uTime);
  float noiseS = gradientNoise(coordsS * 25.0);
  float factor = 0.03 + 0.08 * (1.0 - smoothstep(0.0, 0.08, abs(uv.x)));
  factor *= 1.0 - uSymetry;

  float inkNoise = noiseR + factor * noiseS - noiseMask;
  return smoothstep(-uSharpness, 0.0, inkNoise - uThreshold);
}

void main(void) {
  vec3 bg = vec3(1.0);
  vec3 ink = vec3(0.1, 0.1, 0.2);

  float noiseMask = smoothstep(0.6, 2.0, max(abs(vCanvasUV.x), abs(vCanvasUV.y)));
  float inkIntensity = computeInkIntensity(vUv, noiseMask);
  vec3 color = mix(bg, ink, inkIntensity);
  gl_FragColor = vec4(color, 1.0);
}
`

export default function RorschachWebGL({
  width = 700,
  height = 450,
  sharpness = 0.5,
  density = 0.5,
  scale = 1.0,
  symmetry = 0.95,
  details = 0.8,
  speed = 1.0,
}: RorschachWebGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { antialias: true })
    if (!gl) return
    glRef.current = gl

    // Compile shaders
    function compileShader(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type)
      if (!shader) return null
      gl!.shaderSource(shader, source)
      gl!.compileShader(shader)
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error('Shader error:', gl!.getShaderInfoLog(shader))
        gl!.deleteShader(shader)
        return null
      }
      return shader
    }

    const vert = compileShader(gl.VERTEX_SHADER, VERT_SHADER)
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAG_SHADER)
    if (!vert || !frag) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program error:', gl.getProgramInfoLog(program))
      return
    }
    programRef.current = program
    gl.useProgram(program)

    // Full-screen quad
    const vertices = new Float32Array([-1,-1, 1,-1, -1,1, 1,1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const aCoords = gl.getAttribLocation(program, 'aCoords')
    gl.enableVertexAttribArray(aCoords)
    gl.vertexAttribPointer(aCoords, 2, gl.FLOAT, false, 0, 0)

    startTimeRef.current = performance.now() / 1000

    function render() {
      if (!gl || !program) return

      const t = (performance.now() / 1000 - startTimeRef.current) * speed

      gl.viewport(0, 0, canvas!.width, canvas!.height)

      const uTime = gl.getUniformLocation(program, 'uTime')
      const uSharpness = gl.getUniformLocation(program, 'uSharpness')
      const uThreshold = gl.getUniformLocation(program, 'uThreshold')
      const uScale = gl.getUniformLocation(program, 'uScale')
      const uSymetry = gl.getUniformLocation(program, 'uSymetry')
      const uMaxDetails = gl.getUniformLocation(program, 'uMaxDetails')
      const uCoordsAdj = gl.getUniformLocation(program, 'uCoordsAdjustment')

      gl.uniform1f(uTime, t)
      gl.uniform1f(uSharpness, sharpness)
      gl.uniform1f(uThreshold, 0.55 - density * 0.3)
      gl.uniform1f(uScale, scale)
      gl.uniform1f(uSymetry, symmetry)
      gl.uniform1f(uMaxDetails, details)

      // Aspect ratio adjustment
      const aspect = canvas!.width / canvas!.height
      gl.uniform2f(uCoordsAdj, aspect > 1 ? aspect : 1, aspect > 1 ? 1 : 1 / aspect)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      gl.deleteProgram(program)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
    }
  }, [width, height, sharpness, density, scale, symmetry, details, speed])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: '100%', maxWidth: `${width}px`, height: 'auto', borderRadius: '16px' }}
    />
  )
}
