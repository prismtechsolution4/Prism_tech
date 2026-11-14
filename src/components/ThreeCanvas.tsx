"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions & Mobile Detection
    let width = window.innerWidth;
    let height = window.innerHeight;
    const isMobile = width < 768 || window.matchMedia("(pointer: coarse)").matches;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 120);
    camera.position.set(0, 0, 9);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLightBlue = new THREE.PointLight(0x087ff5, 55, 25);
    pointLightBlue.position.set(5, 5, 6);
    scene.add(pointLightBlue);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 40, 25);
    pointLightCyan.position.set(-6, -3, 5);
    scene.add(pointLightCyan);

    // Dynamic interaction state
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isHeroInView = true;

    // -------------------------------------------------------------
    // HERO 3D GEODESIC GLOBE & 4500 PARTICLE GALAXY
    // -------------------------------------------------------------
    const heroGroup = new THREE.Group();
    heroGroup.position.set(width > 900 ? 2.8 : 0, width > 900 ? 0 : -0.2, 0);
    if (width <= 900) {
      heroGroup.scale.setScalar(0.78);
    }
    scene.add(heroGroup);

    // Faceted solid deep cobalt-navy icosahedron
    const heroGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const heroSolidMat = new THREE.MeshPhysicalMaterial({
      color: 0x0e1b2a,
      emissive: 0x084282,
      emissiveIntensity: 0.45,
      metalness: 0.65,
      roughness: 0.2,
      clearcoat: 1,
      flatShading: true,
    });
    const heroSolidMesh = new THREE.Mesh(heroGeo, heroSolidMat);
    heroGroup.add(heroSolidMesh);

    // Wireframe electric blue icosahedron
    const heroWireMat = new THREE.MeshBasicMaterial({
      color: 0x087ff5,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const heroWireMesh = new THREE.Mesh(heroGeo, heroWireMat);
    heroGroup.add(heroWireMesh);

    // Particle Galaxy with custom shader
    const particleCount = isMobile ? 900 : 4500;
    const positions = new Float32Array(particleCount * 3);
    const aRand = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 2.6 + 3.2 * Math.pow(Math.random(), 1.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[3 * i] = r * Math.sin(phi) * Math.cos(theta);
      positions[3 * i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[3 * i + 2] = r * Math.cos(phi);
      aRand[i] = Math.random();
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));

    const particleUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 99) },
      uSize: { value: 1.5 },
      uA: { value: new THREE.Color("#087ff5") },
      uB: { value: new THREE.Color("#38bdf8") },
    };

    const particleMat = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        uniform vec3 uMouse;
        uniform float uSize;
        attribute float aRand;
        varying float vMix;
        void main() {
          vec3 p = position;
          float n = sin(p.x * 1.3 + uTime * 0.6) + cos(p.y * 1.7 + uTime * 0.5) + sin(p.z * 1.5 + uTime * 0.4);
          p += normalize(p) * n * 0.12;
          vec3 d = p - uMouse;
          float push = smoothstep(2.4, 0.0, length(d));
          p += normalize(d + 0.0001) * push * 1.3;
          vMix = aRand;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * (0.5 + aRand) * (30.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uA;
        uniform vec3 uB;
        varying float vMix;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(mix(uA, uB, vMix), a * 0.65);
        }
      `,
      uniforms: particleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    heroGroup.add(particles);

    // -------------------------------------------------------------
    // STRICT HERO-ONLY VISIBILITY CONTROLLER
    // -------------------------------------------------------------
    const heroEl = document.getElementById("hero");
    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroInView = entry.isIntersecting;
        heroGroup.visible = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );

    if (heroEl) {
      observer.observe(heroEl);
    }

    const handlePointerMove = (e: MouseEvent) => {
      if (isMobile || !isHeroInView) return;
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      heroGroup.position.set(width > 900 ? 2.8 : 0, width > 900 ? 0 : -0.2, 0);
      if (width <= 900) {
        heroGroup.scale.setScalar(0.78);
      } else {
        heroGroup.scale.setScalar(1);
      }
    };

    if (!isMobile) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }
    window.addEventListener("resize", handleResize);

    // -------------------------------------------------------------
    // ANIMATION LOOP (Strictly active only on Hero)
    // -------------------------------------------------------------
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      // If hero is scrolled out of view, skip 3D rendering completely
      if (!isHeroInView) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Smooth pointer damping
      pointer.x += (pointer.targetX - pointer.x) * (delta * 4);
      pointer.y += (pointer.targetY - pointer.y) * (delta * 4);

      // Camera pointer response
      camera.position.set(0.7 * pointer.x, 0.4 * pointer.y, 9);
      camera.lookAt(0, 0, 0);

      // 1. HERO 3D GLOBE REVOLUTION:
      heroSolidMesh.rotation.set(
        0.15 * elapsed + 0.35 * pointer.y,
        0.22 * elapsed + 0.35 * pointer.x,
        0
      );
      heroWireMesh.rotation.copy(heroSolidMesh.rotation);

      // Subtle breathing scale
      const breathe = 1 + 0.03 * Math.sin(1.4 * elapsed);
      heroSolidMesh.scale.setScalar(breathe);
      heroWireMesh.scale.setScalar(1.04 * breathe);

      // Update particle uniforms
      particleUniforms.uTime.value = elapsed;
      particleUniforms.uMouse.value.set(5.5 * pointer.x, 3.2 * pointer.y, 1.2);

      renderer.render(scene, camera);

      if (!isReduced) {
        animId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      if (!isMobile) {
        window.removeEventListener("pointermove", handlePointerMove);
      }
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
