import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './WobbleCanvas.css'

const VERT_SRC = `
varying vec2 vUv;
uniform mediump float u_time;
uniform mediump vec2 u_mouse;
uniform mediump float u_strength;
uniform mediump vec2 u_echoCenter;
uniform mediump float u_echoAmp;
uniform mediump float u_echoTime;

void main() {
  vUv = uv;
  vec3 pos = position;

  float idleWave = sin(pos.x * 2.1 + u_time * 0.22) * 0.07;
  idleWave += sin(pos.y * 2.8 - u_time * 0.18) * 0.05;
  idleWave += sin((pos.x + pos.y) * 3.4 + u_time * 0.12) * 0.03;

  vec2 m = vec2(u_mouse.x, 1.0 - u_mouse.y);
  vec2 toMouse = vUv - m;
  float mouseDist = length(toMouse);
  float mouseFalloff = exp(-mouseDist * 5.5);
  float swirl = sin((pos.x - pos.y) * 4.5 + u_time * 0.8) * mouseFalloff;

  vec2 echoToPoint = vUv - u_echoCenter;
  float echoDist = length(echoToPoint);
  float echoRing = sin(echoDist * 38.0 - u_echoTime * 9.0) * exp(-echoDist * 11.0) * u_echoAmp;
  vec2 echoDir = echoDist > 0.0001 ? normalize(echoToPoint) : vec2(0.0);

  pos.z += idleWave + swirl * u_strength + echoRing * 0.38;
  pos.x += toMouse.x * mouseFalloff * u_strength * 0.8;
  pos.y += toMouse.y * mouseFalloff * u_strength * 0.8;
  pos.x += echoDir.x * echoRing * 0.075;
  pos.y += echoDir.y * echoRing * 0.075;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const FRAG_SRC = `
precision mediump float;

uniform mediump vec3 u_color;
uniform mediump float u_alpha;
uniform mediump float u_time;
uniform mediump vec2 u_mouse;
uniform mediump float u_lineDensity;
uniform mediump float u_lineWidth;
uniform mediump vec2 u_echoCenter;
uniform mediump float u_echoAmp;
uniform mediump float u_echoTime;
varying vec2 vUv;

void main() {
  vec2 m = vec2(u_mouse.x, 1.0 - u_mouse.y);
  float base = vUv.y * u_lineDensity;
  float flow = sin(vUv.x * 8.0 + u_time * 0.35) * 0.35;
  float lineShape = abs(fract(base + flow) - 0.5);
  float aa = fwidth(lineShape) * 1.5;
  float lineMask = 1.0 - smoothstep(u_lineWidth, u_lineWidth + aa, lineShape);

  float glow = exp(-length(vUv - m) * 4.0) * 0.2;
  float echoDist = length(vUv - u_echoCenter);
  float rippleBand = abs(fract(echoDist * 12.0 - u_echoTime * 2.8) - 0.5);
  float ripple = (1.0 - smoothstep(0.08, 0.18, rippleBand)) * exp(-echoDist * 6.0) * u_echoAmp;
  float alpha = (lineMask * 0.8 + glow + ripple * 0.55) * u_alpha;
  gl_FragColor = vec4(u_color, alpha);
}
`

interface WobbleCanvasProps {
	color?: string
	gradientStart?: string
	gradientEnd?: string
	alpha?: number
	lineWidth?: number
	cellSize?: number
	className?: string
}

function hexToRgb(hex: string): [number, number, number] {
	const r = parseInt(hex.slice(1, 3), 16) / 255
	const g = parseInt(hex.slice(3, 5), 16) / 255
	const b = parseInt(hex.slice(5, 7), 16) / 255
	return [r, g, b]
}

export default function WobbleCanvas({
	color,
	gradientStart = '#fff',
	gradientEnd = '#67c04d',
	alpha = 1,
	lineWidth = 0.09,
	cellSize = 0.03,
	className
}: WobbleCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const mouseTargetRef = useRef(new THREE.Vector2(0.5, 0.5))
	const mouseRef = useRef(new THREE.Vector2(0.5, 0.5))
	const echoCenterRef = useRef(new THREE.Vector2(0.5, 0.5))
	const echoAmpRef = useRef(0)
	const echoTimeRef = useRef(0)
	const lastElapsedRef = useRef(0)
	const rafRef = useRef(0)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true
		})
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setClearColor(0x000000, 0)

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 50)
		;(camera as unknown as { position: THREE.Vector3 }).position.set(0, 0, 4.4)

		const geometry = new THREE.PlaneGeometry(8, 5.2, 220, 180)
		const colorValue = color ?? gradientStart ?? gradientEnd
		const material = new THREE.ShaderMaterial({
			vertexShader: VERT_SRC,
			fragmentShader: FRAG_SRC,
			transparent: true,
			depthWrite: false,
			blending: THREE.NormalBlending,
			uniforms: {
				u_time: { value: 0 },
				u_mouse: { value: mouseRef.current.clone() },
				u_strength: { value: 1.8 },
				u_echoCenter: { value: echoCenterRef.current.clone() },
				u_echoAmp: { value: 0 },
				u_echoTime: { value: 0 },
				u_color: { value: new THREE.Color(...hexToRgb(colorValue)) },
				u_alpha: { value: alpha },
				u_lineDensity: { value: Math.max(30, Math.min(80, 1 / Math.max(cellSize, 0.012))) },
				u_lineWidth: { value: Math.max(0.003, Math.min(0.08, lineWidth)) }
			}
		})
		const mesh = new THREE.Mesh(geometry, material)
		;(mesh as unknown as { rotation: THREE.Euler }).rotation.z = -0.1
		scene.add(mesh as unknown as THREE.Object3D)

		const clock = new THREE.Clock()

		const onMouseMove = (e: MouseEvent) => {
			mouseTargetRef.current.set(
				e.clientX / Math.max(window.innerWidth, 1),
				e.clientY / Math.max(window.innerHeight, 1)
			)
		}

		const onTouchMove = (e: TouchEvent) => {
			if (e.touches.length > 0) {
				const touch = e.touches[0]
				mouseTargetRef.current.set(
					touch.clientX / Math.max(window.innerWidth, 1),
					touch.clientY / Math.max(window.innerHeight, 1)
				)
			}
		}

		const onClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null
			if (!target) return
			const trigger = target.closest(
				'button, [role="button"], input[type="button"], input[type="submit"]'
			) as HTMLElement | null
			if (!trigger) return

			const rect = trigger.getBoundingClientRect()
			const centerX = rect.left + rect.width / 2
			const centerY = rect.top + rect.height / 2
			const canvasRect = canvas.getBoundingClientRect()
			const normalizedX = (centerX - canvasRect.left) / Math.max(canvasRect.width, 1)
			const normalizedY = (centerY - canvasRect.top) / Math.max(canvasRect.height, 1)
			echoCenterRef.current.set(
				THREE.MathUtils.clamp(normalizedX, 0, 1),
				THREE.MathUtils.clamp(1 - normalizedY, 0, 1)
			)
			echoAmpRef.current = 1
			echoTimeRef.current = 0
		}

		const onResize = () => {
			const width = window.innerWidth
			const height = window.innerHeight
			camera.aspect = width / height
			camera.updateProjectionMatrix()
			renderer.setSize(width, height)
		}
		window.addEventListener('resize', onResize)

		function render() {
			const elapsed = clock.getElapsedTime()
			const delta = Math.max(0, elapsed - lastElapsedRef.current)
			lastElapsedRef.current = elapsed
			mouseRef.current.lerp(mouseTargetRef.current, 0.06)
			echoTimeRef.current += delta
			echoAmpRef.current *= Math.pow(0.965, delta * 60)
			if (echoAmpRef.current < 0.001) echoAmpRef.current = 0
			material.uniforms.u_time.value = elapsed
			material.uniforms.u_mouse.value.copy(mouseRef.current)
			material.uniforms.u_echoCenter.value.copy(echoCenterRef.current)
			material.uniforms.u_echoAmp.value = echoAmpRef.current
			material.uniforms.u_echoTime.value = echoTimeRef.current
			renderer.render(scene, camera)
			rafRef.current = requestAnimationFrame(render)
		}
		render()

		window.addEventListener('mousemove', onMouseMove, { passive: true })
		window.addEventListener('touchmove', onTouchMove, { passive: true })
		window.addEventListener('click', onClick, true)

		return () => {
			cancelAnimationFrame(rafRef.current)
			window.removeEventListener('resize', onResize)
			window.removeEventListener('mousemove', onMouseMove)
			window.removeEventListener('touchmove', onTouchMove)
			window.removeEventListener('click', onClick, true)
			geometry.dispose()
			material.dispose()
			renderer.dispose()
		}
	}, [color, gradientStart, gradientEnd, alpha, lineWidth, cellSize])

	return <canvas ref={canvasRef} className={`wobble-canvas ${className || ''}`.trim()} />
}
