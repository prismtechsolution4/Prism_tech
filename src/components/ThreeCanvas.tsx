"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { servicesData, productsData } from "@/data/content";
import { serviceSelectionEvent, productProgressEvent, productSelectionEvent } from "@/lib/events";

const STAGE_SPACING = 20;
const NODE_PALETTE = ["#087FF5", "#38bdf8", "#60a5fa", "#2563eb"];

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const pointLightGreen = new THREE.PointLight(0x087ff5, 55, 25);
    pointLightGreen.position.set(5, 5, 6);
    scene.add(pointLightGreen);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 40, 25);
    pointLightCyan.position.set(-6, -3, 5);
    scene.add(pointLightCyan);

    // Dynamic interaction state
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let currentStage = 0;
    let targetStage = 0;
    let currentActiveIndex = 0;
    let hoveredIndex = -1;

    // -------------------------------------------------------------
    // STAGE 0: HERO 3D GEODESIC GLOBE & PARTICLE GALAXY
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

    // Particle Galaxy with custom shader (Optimized for mobile)
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
    // STAGE 1: SERVICES 3D PLANETARY NODE NETWORK WITH SATURN RINGS
    // -------------------------------------------------------------
    const servicesGroup = new THREE.Group();
    servicesGroup.position.set(width > 900 ? 4.0 : 0, -STAGE_SPACING, 0);
    scene.add(servicesGroup);

    // Center wireframe icosahedron
    const centerIcoGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const centerIcoMat = new THREE.MeshBasicMaterial({
      color: 0x087ff5,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const centerIcoMesh = new THREE.Mesh(centerIcoGeo, centerIcoMat);
    servicesGroup.add(centerIcoMesh);

    // Center emissive core sphere
    const centerCoreGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const centerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x0e1b2a,
      emissive: 0x087ff5,
      emissiveIntensity: 0.8,
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
      color: 0x087ff5,
      transparent: true,
      opacity: 0.22,
    });
    const perimeterLine = new THREE.LineSegments(perimeterGeo, perimeterMat);
    servicesGroup.add(perimeterLine);

    // 16 Ambient dust particles
    for (let i = 0; i < 16; i++) {
      const dAngle = (i / 16) * Math.PI * 2;
      const dDist = 4.2 + (i % 3) * 0.8;
      const dustGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const dustMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x38bdf8 : 0x087ff5,
        transparent: true,
        opacity: 0.45,
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
    // STAGE 2: PRODUCTS 3D PERSPECTIVE CAROUSEL & CARDS (AT Y = -40)
    // -------------------------------------------------------------
    const productsGroup = new THREE.Group();
    productsGroup.position.set(width > 900 ? 2.6 : 0, -STAGE_SPACING * 2, 0);
    scene.add(productsGroup);

    const carouselGroup = new THREE.Group();
    carouselGroup.position.set(0, 0, -5);
    productsGroup.add(carouselGroup);

    // Dedicated Stage 2 Product Lighting (Electric blue + Cyan accents)
    const stage2PointLight = new THREE.PointLight(0x087ff5, 90, 30);
    stage2PointLight.position.set(3, 2, 6);
    productsGroup.add(stage2PointLight);

    const stage2CyanLight = new THREE.PointLight(0x38bdf8, 65, 30);
    stage2CyanLight.position.set(7, -1, 5);
    productsGroup.add(stage2CyanLight);

    // Preload textures
    const textureLoader = new THREE.TextureLoader();
    const productTextures: { [key: string]: THREE.Texture } = {};
    productsData.forEach((p) => {
      p.gallery.forEach((src) => {
        if (!productTextures[src]) {
          const tex = textureLoader.load(src);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
          productTextures[src] = tex;
        }
      });
    });

    const cardGeo = new THREE.PlaneGeometry(3, 4);
    const cardEdgesGeo = new THREE.EdgesGeometry(cardGeo);
    const cardTintGeo = new THREE.PlaneGeometry(2.8, 3.8);
    const screenGeo = new THREE.PlaneGeometry(2.4, 1.8);
    const screenEdgesGeo = new THREE.EdgesGeometry(screenGeo);

    // Border strip geometries for prominent luminous frames
    const hBorderGeo = new THREE.PlaneGeometry(3.04, 0.04);
    const vBorderGeo = new THREE.PlaneGeometry(0.04, 4.04);

    const productCardGroups: THREE.Group[] = [];

    productsData.forEach((p, idx) => {
      const angle = (idx / productsData.length) * Math.PI * 2;
      const brandColor = new THREE.Color(p.color || "#087FF5");
      const cardGroup = new THREE.Group();
      cardGroup.position.set(5 * Math.sin(angle), 0, 5 * Math.cos(angle));
      cardGroup.rotation.set(0, angle, 0);

      // 1. Dark physical glass backing card
      const backMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a1424,
        transparent: true,
        opacity: 0.88,
        roughness: 0.12,
        metalness: 0.35,
        clearcoat: 1,
        side: THREE.DoubleSide,
      });
      const backMesh = new THREE.Mesh(cardGeo, backMat);
      cardGroup.add(backMesh);

      // 2. Subtle brand tint plane
      const tintMat = new THREE.MeshBasicMaterial({
        color: brandColor,
        transparent: true,
        opacity: 0.08,
      });
      const tintMesh = new THREE.Mesh(cardTintGeo, tintMat);
      tintMesh.position.set(0, 0, 0.01);
      cardGroup.add(tintMesh);

      // 3. High-visibility luminous glowing frame borders (Top, Bottom, Left, Right)
      const frameMat = new THREE.MeshBasicMaterial({
        color: brandColor,
        toneMapped: false,
      });
      const topBorder = new THREE.Mesh(hBorderGeo, frameMat);
      topBorder.position.set(0, 2.0, 0.02);
      cardGroup.add(topBorder);

      const bottomBorder = new THREE.Mesh(hBorderGeo, frameMat);
      bottomBorder.position.set(0, -2.0, 0.02);
      cardGroup.add(bottomBorder);

      const leftBorder = new THREE.Mesh(vBorderGeo, frameMat);
      leftBorder.position.set(-1.5, 0, 0.02);
      cardGroup.add(leftBorder);

      const rightBorder = new THREE.Mesh(vBorderGeo, frameMat);
      rightBorder.position.set(1.5, 0, 0.02);
      cardGroup.add(rightBorder);

      // Outer wireframe outline
      const borderLineMat = new THREE.LineBasicMaterial({
        color: brandColor,
        transparent: true,
        opacity: 0.9,
      });
      const borderLine = new THREE.LineSegments(cardEdgesGeo, borderLineMat);
      borderLine.position.set(0, 0, 0.02);
      cardGroup.add(borderLine);

      // Soft ambient blue aura behind the card
      const auraMat = new THREE.MeshBasicMaterial({
        color: brandColor,
        transparent: true,
        opacity: 0.12,
      });
      const auraMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.18, 4.18), auraMat);
      auraMesh.position.set(0, 0, -0.01);
      cardGroup.add(auraMesh);

      // 4. Two screenshots stacked vertically
      const topTex = productTextures[p.gallery[0]] || textureLoader.load(p.gallery[0]);
      const bottomTex = productTextures[p.gallery[1]] || textureLoader.load(p.gallery[1]);

      const topScreenMat = new THREE.MeshBasicMaterial({
        map: topTex,
        toneMapped: false,
      });
      const topMesh = new THREE.Mesh(screenGeo, topScreenMat);
      topMesh.position.set(0, 0.95, 0.03);
      cardGroup.add(topMesh);

      // Screenshot frame outline
      const screenLineMat = new THREE.LineBasicMaterial({
        color: brandColor,
        transparent: true,
        opacity: 0.45,
      });
      const topScreenBorder = new THREE.LineSegments(screenEdgesGeo, screenLineMat);
      topScreenBorder.position.set(0, 0.95, 0.035);
      cardGroup.add(topScreenBorder);

      const bottomScreenMat = new THREE.MeshBasicMaterial({
        map: bottomTex,
        toneMapped: false,
      });
      const bottomMesh = new THREE.Mesh(screenGeo, bottomScreenMat);
      bottomMesh.position.set(0, -0.95, 0.03);
      cardGroup.add(bottomMesh);

      const bottomScreenBorder = new THREE.LineSegments(screenEdgesGeo, screenLineMat);
      bottomScreenBorder.position.set(0, -0.95, 0.035);
      cardGroup.add(bottomScreenBorder);

      carouselGroup.add(cardGroup);
      productCardGroups.push(cardGroup);

      // 5. Floating intermediate wireframe rectangle between cards (matching reference design)
      const midAngle = angle + (Math.PI / productsData.length);
      const wireGroup = new THREE.Group();
      wireGroup.position.set(5.1 * Math.sin(midAngle), 0, 5.1 * Math.cos(midAngle));
      wireGroup.rotation.set(0, midAngle, 0);

      const midWireGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.6, 3.6));
      const midWireMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x087ff5 : 0x38bdf8,
        transparent: true,
        opacity: 0.75,
      });
      const midWireLine = new THREE.LineSegments(midWireGeo, midWireMat);
      wireGroup.add(midWireLine);
      carouselGroup.add(wireGroup);
    });

    let targetCarouselAngle = 0;
    let currentCarouselAngle = 0;

    const unsubProductProgress = productProgressEvent.subscribe((progress) => {
      targetCarouselAngle = -progress * ((productsData.length - 1) / productsData.length) * Math.PI * 2;
    });

    const unsubProductSelection = productSelectionEvent.subscribe((idx) => {
      const progress = idx / (productsData.length - 1);
      targetCarouselAngle = -progress * ((productsData.length - 1) / productsData.length) * Math.PI * 2;
    });

    // -------------------------------------------------------------
    // STAGE 3: SECURITY SURVEILLANCE RADAR GRID (AT Y = -60)
    // -------------------------------------------------------------
    const securityGroup = new THREE.Group();
    securityGroup.position.set(0, -STAGE_SPACING * 3, 0);
    scene.add(securityGroup);

    const radarPlaneGeo = new THREE.PlaneGeometry(32, 32);
    const radarUniforms = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#087ff5") },
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
      color: 0x087ff5,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    contactGroup.add(knotMesh);

    const knotRingGeo = new THREE.TorusGeometry(3.4, 0.015, 8, 120);
    const knotRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
    });
    const knotRingMesh = new THREE.Mesh(knotRingGeo, knotRingMat);
    contactGroup.add(knotRingMesh);

    // -------------------------------------------------------------
    // STRICT SECTION ISOLATION & SCROLL CONTROLLERS
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    // Strict per-section visibility tracking: each visual is 100% confined to its own section
    let isHeroInView = true;
    let isServicesInView = false;
    let isProductsInView = false;
    let isSecurityInView = false;
    let isContactInView = false;

    const visibilityHandlers: Record<string, (visible: boolean) => void> = {
      hero: (v) => {
        isHeroInView = v;
        if (v) targetStage = 0;
      },
      services: (v) => {
        isServicesInView = v;
        if (v) targetStage = 1;
        if (!v) {
          labelRefs.current.forEach((l) => {
            if (l) l.style.opacity = "0";
          });
        }
      },
      products: (v) => {
        isProductsInView = v;
        if (v) targetStage = 2;
      },
      security: (v) => {
        isSecurityInView = v;
        if (v) targetStage = 3;
      },
      contact: (v) => {
        isContactInView = v;
        if (v) targetStage = 4;
      },
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const handler = visibilityHandlers[entry.target.id];
          if (handler) {
            handler(entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.05,
      }
    );

    const sectionIds = ["hero", "services", "products", "security", "contact"];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    const handlePointerMove = (e: MouseEvent) => {
      if (isMobile) return;
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Only perform raycasting if services group is in active view
      if (!isServicesInView) {
        if (hoveredIndex !== -1) {
          hoveredIndex = -1;
          document.body.style.cursor = "";
        }
        return;
      }

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
      servicesGroup.position.x = width > 900 ? 4.0 : 0;
      productsGroup.position.x = width > 900 ? 2.6 : 0;
    };

    if (!isMobile) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

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

      // Strict per-section visibility gating: Zero bleed into other sections!
      heroGroup.visible = isHeroInView;
      servicesGroup.visible = isServicesInView;
      productsGroup.visible = isProductsInView;
      securityGroup.visible = isSecurityInView;
      contactGroup.visible = isContactInView;

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
          mat.color.set(isActive ? NODE_PALETTE[idx] : "#38bdf8");
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
            const isVisible = servicesGroup.visible && Math.abs(currentStage - 1) < 0.5;
            label.style.transform = `translate3d(${screenX}px, ${screenY}px, 0px) translate(-50%, -50%)`;
            label.style.opacity = isVisible ? (isActive ? "1" : "0.55") : "0";
          }
        } else {
          const label = labelRefs.current[idx];
          if (label) {
            label.style.opacity = "0";
          }
        }
      });

      // 2.5 PRODUCTS 3D PERSPECTIVE CAROUSEL ANIMATION:
      if (productsGroup.visible) {
        currentCarouselAngle += (targetCarouselAngle - currentCarouselAngle) * (delta * 4.5);
        carouselGroup.rotation.y = currentCarouselAngle;

        productsGroup.rotation.y = 0.06 * pointer.x;
        productsGroup.rotation.x = -0.04 * pointer.y;

        productCardGroups.forEach((card, idx) => {
          const cardAngle = (idx / productsData.length) * Math.PI * 2 + currentCarouselAngle;
          const cosVal = Math.max(0, Math.cos(cardAngle));
          const targetScale = 0.85 + 0.25 * cosVal;
          card.scale.set(targetScale, targetScale, targetScale);
          card.position.y = 0.12 * Math.sin(0.8 * elapsed + 1.7 * idx);
        });
      }

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
      sectionObserver.disconnect();
      unsubSelection();
      unsubProductProgress();
      unsubProductSelection();
      if (!isMobile) {
        window.removeEventListener("pointermove", handlePointerMove);
      }
      window.removeEventListener("click", handleClick);
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
        className="fixed inset-0 z-0 pointer-events-none"
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
