"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { servicesData } from "@/data/content";
import { serviceSelectionEvent } from "@/lib/events";

const STAGE_SPACING = 20;
const NODE_PALETTE = ["#7ed33f", "#22e5ff", "#a3e635", "#facc15"];

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeService, setActiveService] = useState<number>(0);

  const handleSelectService = useCallback((index: number) => {
    setActiveService(index);
    if (servicesData[index]) {
      serviceSelectionEvent.emit(servicesData[index].title);
    }
  }, []);

  useEffect(() => {
    const unsub = serviceSelectionEvent.subscribe((title) => {
      const idx = servicesData.findIndex((s) => s.title === title);
      if (idx !== -1) {
        setActiveService(idx);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 120);
    camera.position.set(0, 0, 9);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const pointLightGreen = new THREE.PointLight(0x7ed33f, 60, 25);
    pointLightGreen.position.set(5, 5, 6);
    scene.add(pointLightGreen);

    const pointLightCyan = new THREE.PointLight(0x22e5ff, 45, 25);
    pointLightCyan.position.set(-6, -3, 5);
    scene.add(pointLightCyan);

    // Dynamic interaction state
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let currentStage = 0;
    let targetStage = 0;
    let currentActiveIndex = 0;
    let hoveredIndex = -1;

    // -------------------------------------------------------------
    // STAGE 0: HERO 3D GEODESIC GLOBE & 6500 PARTICLE GALAXY
    // -------------------------------------------------------------
    const heroGroup = new THREE.Group();
    heroGroup.position.set(width > 900 ? 2.8 : 0, 0, 0);
    scene.add(heroGroup);

    // Faceted solid dark emerald icosahedron
    const heroGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const heroSolidMat = new THREE.MeshPhysicalMaterial({
      color: 0x0b2a1c,
      emissive: 0x1b7a3a,
      emissiveIntensity: 0.55,
      metalness: 0.6,
      roughness: 0.15,
      clearcoat: 1,
      flatShading: true,
    });
    const heroSolidMesh = new THREE.Mesh(heroGeo, heroSolidMat);
    heroGroup.add(heroSolidMesh);

    // Wireframe cyan icosahedron
    const heroWireMat = new THREE.MeshBasicMaterial({
      color: 0x22e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const heroWireMesh = new THREE.Mesh(heroGeo, heroWireMat);
    heroGroup.add(heroWireMesh);

    // 6500 Particle Galaxy with custom shader
    const particleCount = width < 800 ? 2500 : 6500;
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
      uA: { value: new THREE.Color("#7ed33f") },
      uB: { value: new THREE.Color("#22e5ff") },
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
    // STAGE 1: SERVICES 3D PLANETARY NODE NETWORK WITH SATURN RINGS
    // -------------------------------------------------------------
    const servicesGroup = new THREE.Group();
    servicesGroup.position.set(width > 900 ? 4.0 : 0, -STAGE_SPACING, 0);
    scene.add(servicesGroup);

    // Center wireframe icosahedron
    const centerIcoGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const centerIcoMat = new THREE.MeshBasicMaterial({
      color: 0x7ed33f,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const centerIcoMesh = new THREE.Mesh(centerIcoGeo, centerIcoMat);
    servicesGroup.add(centerIcoMesh);

    // Center emissive core sphere
    const centerCoreGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const centerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x0b2a1c,
      emissive: 0x7ed33f,
      emissiveIntensity: 0.9,
    });
    const centerCoreMesh = new THREE.Mesh(centerCoreGeo, centerCoreMat);
    servicesGroup.add(centerCoreMesh);

    // Outer planetary nodes
    const nodeCount = servicesData.length;
    const nodeGroups: THREE.Group[] = [];
    const ringLinePoints: number[] = [];
    const spokeLines: THREE.Line[] = [];
    const nodeHitMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < nodeCount; i++) {
      // Angle: -PI/2 puts Node 0 (Consultancy) at bottom, Node 1 at right, Node 2 at top, Node 3 at left
      const angle = -Math.PI / 2 + (i / nodeCount) * Math.PI * 2;
      const pos = new THREE.Vector3(3.1 * Math.cos(angle), 2.5 * Math.sin(angle), 0);

      // Diamond perimeter coordinates
      const nextAngle = -Math.PI / 2 + (((i + 1) % nodeCount) / nodeCount) * Math.PI * 2;
      const nextPos = new THREE.Vector3(3.1 * Math.cos(nextAngle), 2.5 * Math.sin(nextAngle), 0);
      ringLinePoints.push(pos.x, pos.y, pos.z, nextPos.x, nextPos.y, nextPos.z);

      // Node Group
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(pos);

      // Inner icosahedron
      const nodeIcoGeo = new THREE.IcosahedronGeometry(0.26, 1);
      const nodeIcoMat = new THREE.MeshStandardMaterial({
        color: NODE_PALETTE[i],
        emissive: NODE_PALETTE[i],
        emissiveIntensity: 0.7,
        flatShading: true,
      });
      const nodeIco = new THREE.Mesh(nodeIcoGeo, nodeIcoMat);
      nodeGroup.add(nodeIco);

      // Saturn tilted ring
      const ringGeo = new THREE.TorusGeometry(0.46, 0.012, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: NODE_PALETTE[i],
        transparent: true,
        opacity: 0.45,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(ringMesh);

      // Invisible hit sphere for clicking & hovering
      const hitGeo = new THREE.SphereGeometry(0.8, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { serviceIndex: i };
      nodeGroup.add(hitMesh);
      nodeHitMeshes.push(hitMesh);

      servicesGroup.add(nodeGroup);
      nodeGroups.push(nodeGroup);

      // Spoke connecting line
      const spokeGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        pos,
      ]);
      const spokeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(NODE_PALETTE[i]),
        transparent: true,
        opacity: 0.25,
      });
      const spokeLine = new THREE.Line(spokeGeo, spokeMat);
      servicesGroup.add(spokeLine);
      spokeLines.push(spokeLine);
    }

    // Outer diamond perimeter line
    const perimeterGeo = new THREE.BufferGeometry();
    perimeterGeo.setAttribute("position", new THREE.Float32BufferAttribute(ringLinePoints, 3));
    const perimeterMat = new THREE.LineBasicMaterial({
      color: 0x22e5ff,
      transparent: true,
      opacity: 0.18,
    });
    const perimeterLine = new THREE.LineSegments(perimeterGeo, perimeterMat);
    servicesGroup.add(perimeterLine);

    // 16 Ambient dust particles
    for (let i = 0; i < 16; i++) {
      const dAngle = (i / 16) * Math.PI * 2;
      const dDist = 4.2 + (i % 3) * 0.8;
      const dustGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const dustMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x22e5ff : 0x7ed33f,
        transparent: true,
        opacity: 0.4,
      });
      const dustMesh = new THREE.Mesh(dustGeo, dustMat);
      dustMesh.position.set(
        Math.cos(dAngle) * dDist * 1.15,
        Math.sin(dAngle) * dDist * 0.8,
        ((i % 4) - 2) * 0.7
      );
      servicesGroup.add(dustMesh);
    }

    // -------------------------------------------------------------
    // STAGE 3: SECURITY SURVEILLANCE RADAR GRID (AT Y = -60)
    // -------------------------------------------------------------
    const securityGroup = new THREE.Group();
    securityGroup.position.set(0, -STAGE_SPACING * 3, 0);
    scene.add(securityGroup);

    const radarPlaneGeo = new THREE.PlaneGeometry(32, 32);
    const radarUniforms = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#3df08a") },
    };
    const radarMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          vec2 p = (vUv - 0.5) * 2.0;
          float r = length(p);
          if (r > 1.0) discard;
          float f = fract(r * 10.0 - uTime * 0.3);
          float ring = 1.0 - smoothstep(0.0, 0.05, min(f, 1.0 - f));
          vec2 g = abs(fract(p * 12.0 + 0.5) - 0.5) / 0.05;
          float grid = 1.0 - min(min(g.x, g.y), 1.0);
          float angle = atan(p.y, p.x);
          float sweep = fract((angle - uTime * 1.5) / (2.0 * 3.14159));
          float sweepIntensity = pow(sweep, 8.0) * 0.8;
          vec3 col = uColor * (ring * 0.6 + grid * 0.15 + sweepIntensity);
          float alpha = (ring * 0.6 + grid * 0.15 + sweepIntensity) * (1.0 - r);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      uniforms: radarUniforms,
      transparent: true,
      depthWrite: false,
    });
    const radarMesh = new THREE.Mesh(radarPlaneGeo, radarMat);
    radarMesh.rotation.x = -Math.PI / 2;
    radarMesh.position.y = -1.5;
    securityGroup.add(radarMesh);

    // -------------------------------------------------------------
    // STAGE 4: CONTACT / FOOTER TORUS KNOT (AT Y = -80)
    // -------------------------------------------------------------
    const contactGroup = new THREE.Group();
    contactGroup.position.set(-5, -STAGE_SPACING * 4, -6);
    scene.add(contactGroup);

    const knotGeo = new THREE.TorusKnotGeometry(1.7, 0.4, 160, 18, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x7ed33f,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    contactGroup.add(knotMesh);

    const knotRingGeo = new THREE.TorusGeometry(3.4, 0.015, 8, 120);
    const knotRingMat = new THREE.MeshBasicMaterial({
      color: 0x22e5ff,
      transparent: true,
      opacity: 0.5,
    });
    const knotRingMesh = new THREE.Mesh(knotRingGeo, knotRingMat);
    contactGroup.add(knotRingMesh);

    // -------------------------------------------------------------
    // INTERACTION & SCROLL CONTROLLERS
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      mouseCoord.x = pointer.targetX;
      mouseCoord.y = pointer.targetY;

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObjects(nodeHitMeshes, true);

      if (intersects.length > 0) {
        hoveredIndex = intersects[0].object.userData.serviceIndex ?? -1;
        document.body.style.cursor = "pointer";
      } else {
        hoveredIndex = -1;
        document.body.style.cursor = "";
      }
    };

    const handleClick = () => {
      if (hoveredIndex !== -1) {
        handleSelectService(hoveredIndex);
      }
    };

    // Smoothstep stage calculation matching live site
    const sectionIds = ["hero", "services", "products", "security", "contact"];
    const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
    const smoothstep = (t: number) => t * t * (3 - 2 * t);

    const getDocTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = sectionIds.map((id) => document.getElementById(id));
      if (elements.some((el) => !el)) return;

      const tops = elements.map((el) => getDocTop(el!));

      let stage = 0;
      for (let i = 0; i < tops.length - 1; i++) {
        const start = tops[i];
        const end = tops[i + 1];
        if (scrollY > start) {
          const progress = clamp01((scrollY - start) / (end - start));
          stage = i + smoothstep(progress);
        }
      }
      targetStage = stage;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      heroGroup.position.x = width > 900 ? 2.8 : 0;
      servicesGroup.position.x = width > 900 ? 4.0 : 0;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    handleScroll();

    // Cross-component sync of activeService state
    const unsubSelection = serviceSelectionEvent.subscribe((title) => {
      const idx = servicesData.findIndex((s) => s.title === title);
      if (idx !== -1) {
        currentActiveIndex = idx;
      }
    });

    // -------------------------------------------------------------
    // CAMERA RIG & ANIMATION LOOP
    // -------------------------------------------------------------
    const pD = [9, 11, 10, 9, 10];
    const pO = [0, 0.5, 0, 5, 0];
    const pF = [0, 0, 0, -1.5, 0];
    const lerpArr = (arr: number[], t: number) => {
      const n = Math.min(arr.length - 2, Math.floor(t));
      const frac = t - n;
      return arr[n] + (arr[n + 1] - arr[n]) * frac;
    };

    let animId: number;
    const clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();
    const lookAtTarget = new THREE.Vector3();

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Smooth pointer damping
      pointer.x += (pointer.targetX - pointer.x) * (delta * 4);
      pointer.y += (pointer.targetY - pointer.y) * (delta * 4);

      // Smooth stage damping
      currentStage += (targetStage - currentStage) * (delta * 3.5);

      // Camera position & orientation
      const stageY = -currentStage * STAGE_SPACING;
      camera.position.set(
        0.7 * pointer.x,
        stageY + lerpArr(pO, currentStage) + 0.4 * pointer.y,
        lerpArr(pD, currentStage)
      );
      lookAtTarget.set(0, stageY + lerpArr(pF, currentStage), 0);
      camera.lookAt(lookAtTarget);

      // Visibility toggling
      heroGroup.visible = Math.abs(currentStage - 0) < 1.25;
      servicesGroup.visible = Math.abs(currentStage - 1) < 1.25;
      securityGroup.visible = Math.abs(currentStage - 3) < 1.25;
      contactGroup.visible = Math.abs(currentStage - 4) < 1.25;

      // 1. HERO 3D GLOBE REVOLUTION:
      // Revolve with respect to mouse pointer coordinates + time
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

      // 2. SERVICES 3D PLANETARY NODE NETWORK REVOLUTION:
      // Revolve entire network with mouse pointer & time
      servicesGroup.rotation.y = 0.1 * Math.sin(0.25 * elapsed) + 0.08 * pointer.x;
      servicesGroup.rotation.x = -0.05 * pointer.y;

      // Center wireframe icosahedron rotation
      centerIcoMesh.rotation.set(0.2 * elapsed, 0.3 * elapsed, 0);

      // Outer nodes scaling, rings, and spoke lines
      nodeGroups.forEach((group, idx) => {
        const isActive = currentActiveIndex === idx;
        const isHovered = hoveredIndex === idx;
        const targetScale = isActive ? 1.35 : isHovered ? 1.15 : 1;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);

        // Ring spin
        const ring = group.children[1] as THREE.Mesh;
        if (ring) {
          ring.rotation.z = elapsed * 0.4 + idx;
        }

        // Spoke line illumination
        const spoke = spokeLines[idx];
        if (spoke) {
          const mat = spoke.material as THREE.LineBasicMaterial;
          mat.color.set(isActive ? NODE_PALETTE[idx] : "#22e5ff");
          mat.opacity = isActive ? 0.95 : 0.25;
        }

        // Project 3D node position to 2D screen coordinates for label tracking
        if (servicesGroup.visible) {
          group.getWorldPosition(tempVec);
          tempVec.y -= 0.68; // Position label slightly below node
          tempVec.project(camera);

          const screenX = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
          const screenY = (-(tempVec.y * 0.5) + 0.5) * window.innerHeight;

          const label = labelRefs.current[idx];
          if (label) {
            const isVisible = Math.abs(currentStage - 1) < 0.65;
            label.style.transform = `translate3d(${screenX}px, ${screenY}px, 0px) translate(-50%, -50%)`;
            label.style.opacity = isVisible ? (isActive ? "1" : "0.55") : "0";
          }
        }
      });

      // 3. SECURITY RADAR ANIMATION:
      if (securityGroup.visible) {
        radarUniforms.uTime.value = elapsed;
      }

      // 4. CONTACT TORUS KNOT ANIMATION:
      if (contactGroup.visible) {
        knotMesh.rotation.set(0.12 * elapsed, 0.18 * elapsed, 0);
        knotRingMesh.rotation.set(Math.PI / 2 + 0.2 * Math.sin(0.3 * elapsed), 0.1 * elapsed, 0);
      }

      renderer.render(scene, camera);

      if (!isReduced) {
        animId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      unsubSelection();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [handleSelectService]);

  return (
    <>
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={mountRef}
        className="fixed inset-0 z-0 pointer-events-auto"
        aria-hidden="true"
      />

      {/* 3D Pinned Service Labels (Overlay with pointer cursor) */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        {servicesData.map((srv, idx) => (
          <div
            key={srv.id}
            ref={(el) => {
              labelRefs.current[idx] = el;
            }}
            onClick={() => handleSelectService(idx)}
            className="pointer-events-auto absolute top-0 left-0 cursor-pointer select-none transition-opacity duration-200"
            style={{
              willChange: "transform, opacity",
              opacity: 0,
            }}
          >
            <span
              className={`font-display text-[11px] font-medium tracking-[0.18em] whitespace-nowrap uppercase transition-colors ${
                activeService === idx
                  ? "text-white drop-shadow-[0_0_12px_rgba(126,211,63,0.8)]"
                  : "text-white/55 hover:text-white"
              }`}
              style={{ textShadow: "0 1px 10px #000" }}
            >
              {srv.title}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
