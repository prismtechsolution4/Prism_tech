"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { servicesData } from "@/data/content";

const NODE_PALETTE = ["#087FF5", "#38bdf8", "#60a5fa", "#2563eb"];

interface Services3DNetworkProps {
  activeService: number;
  onSelectService: (index: number) => void;
}

export default function Services3DNetwork({
  activeService,
  onSelectService,
}: Services3DNetworkProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = container.clientWidth || 550;
    let height = container.clientHeight || 550;
    const isMobile = width < 768 || window.matchMedia("(pointer: coarse)").matches;

    // 1. Scene & Camera Setup (Scoped directly to this container)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.8);

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
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLightBlue = new THREE.PointLight(0x087ff5, 45, 20);
    pointLightBlue.position.set(4, 4, 5);
    scene.add(pointLightBlue);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 35, 20);
    pointLightCyan.position.set(-4, -3, 4);
    scene.add(pointLightCyan);

    // Dynamic interaction state
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let hoveredIndex = -1;

    // -------------------------------------------------------------
    // SERVICES 3D PLANETARY NODE NETWORK WITH SATURN RINGS
    // -------------------------------------------------------------
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Center wireframe icosahedron
    const centerIcoGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const centerIcoMat = new THREE.MeshBasicMaterial({
      color: 0x087ff5,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const centerIcoMesh = new THREE.Mesh(centerIcoGeo, centerIcoMat);
    networkGroup.add(centerIcoMesh);

    // Center emissive core sphere
    const centerCoreGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const centerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x0e1b2a,
      emissive: 0x087ff5,
      emissiveIntensity: 0.85,
    });
    const centerCoreMesh = new THREE.Mesh(centerCoreGeo, centerCoreMat);
    networkGroup.add(centerCoreMesh);

    // Outer planetary nodes
    const nodeCount = servicesData.length;
    const nodeGroups: THREE.Group[] = [];
    const ringLinePoints: number[] = [];
    const spokeLines: THREE.Line[] = [];
    const nodeHitMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = -Math.PI / 2 + (i / nodeCount) * Math.PI * 2;
      const pos = new THREE.Vector3(2.85 * Math.cos(angle), 2.3 * Math.sin(angle), 0);

      // Diamond perimeter coordinates
      const nextAngle = -Math.PI / 2 + (((i + 1) % nodeCount) / nodeCount) * Math.PI * 2;
      const nextPos = new THREE.Vector3(2.85 * Math.cos(nextAngle), 2.3 * Math.sin(nextAngle), 0);
      ringLinePoints.push(pos.x, pos.y, pos.z, nextPos.x, nextPos.y, nextPos.z);

      // Node Group
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(pos);

      // Inner icosahedron
      const nodeIcoGeo = new THREE.IcosahedronGeometry(0.26, 1);
      const nodeIcoMat = new THREE.MeshStandardMaterial({
        color: NODE_PALETTE[i],
        emissive: NODE_PALETTE[i],
        emissiveIntensity: 0.75,
        flatShading: true,
      });
      const nodeIco = new THREE.Mesh(nodeIcoGeo, nodeIcoMat);
      nodeGroup.add(nodeIco);

      // Saturn tilted ring
      const ringGeo = new THREE.TorusGeometry(0.44, 0.012, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: NODE_PALETTE[i],
        transparent: true,
        opacity: 0.5,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(ringMesh);

      // Invisible hit sphere for clicking & hovering
      const hitGeo = new THREE.SphereGeometry(0.75, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { serviceIndex: i };
      nodeGroup.add(hitMesh);
      nodeHitMeshes.push(hitMesh);

      networkGroup.add(nodeGroup);
      nodeGroups.push(nodeGroup);

      // Spoke connecting line
      const spokeGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        pos,
      ]);
      const spokeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(NODE_PALETTE[i]),
        transparent: true,
        opacity: 0.3,
      });
      const spokeLine = new THREE.Line(spokeGeo, spokeMat);
      networkGroup.add(spokeLine);
      spokeLines.push(spokeLine);
    }

    // Outer diamond perimeter line
    const perimeterGeo = new THREE.BufferGeometry();
    perimeterGeo.setAttribute("position", new THREE.Float32BufferAttribute(ringLinePoints, 3));
    const perimeterMat = new THREE.LineBasicMaterial({
      color: 0x087ff5,
      transparent: true,
      opacity: 0.25,
    });
    const perimeterLine = new THREE.LineSegments(perimeterGeo, perimeterMat);
    networkGroup.add(perimeterLine);

    // 16 Ambient dust particles
    for (let i = 0; i < 16; i++) {
      const dAngle = (i / 16) * Math.PI * 2;
      const dDist = 3.6 + (i % 3) * 0.6;
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
        ((i % 4) - 2) * 0.6
      );
      networkGroup.add(dustMesh);
    }

    // Raycasting for interactive node clicks
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      pointer.targetX = (clientX / width) * 2 - 1;
      pointer.targetY = -(clientY / height) * 2 + 1;

      mouseCoord.x = pointer.targetX;
      mouseCoord.y = pointer.targetY;

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObjects(nodeHitMeshes, true);

      if (intersects.length > 0) {
        hoveredIndex = intersects[0].object.userData.serviceIndex ?? -1;
        container.style.cursor = "pointer";
      } else {
        hoveredIndex = -1;
        container.style.cursor = "";
      }
    };

    const handleClick = () => {
      if (hoveredIndex !== -1) {
        onSelectService(hoveredIndex);
      }
    };

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 550;
      height = container.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    // Pause when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let animId: number;
    const clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();

    const animate = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Smooth pointer damping
      pointer.x += (pointer.targetX - pointer.x) * (delta * 4);
      pointer.y += (pointer.targetY - pointer.y) * (delta * 4);

      // Revolve network with pointer & time
      networkGroup.rotation.y = 0.1 * Math.sin(0.25 * elapsed) + 0.08 * pointer.x;
      networkGroup.rotation.x = -0.05 * pointer.y;

      // Center wireframe rotation
      centerIcoMesh.rotation.set(0.2 * elapsed, 0.3 * elapsed, 0);

      // Update nodes, rings & spoke lines
      nodeGroups.forEach((group, idx) => {
        const isActive = activeService === idx;
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
          mat.opacity = isActive ? 0.95 : 0.3;
        }

        // Project local 3D node position to container's 2D space for crisp HTML labels
        group.getWorldPosition(tempVec);
        tempVec.y -= 0.65; // Position label slightly below node
        tempVec.project(camera);

        const screenX = (tempVec.x * 0.5 + 0.5) * width;
        const screenY = (-(tempVec.y * 0.5) + 0.5) * height;

        const label = labelRefs.current[idx];
        if (label) {
          label.style.transform = `translate3d(${screenX}px, ${screenY}px, 0px) translate(-50%, -50%)`;
          label.style.opacity = isActive ? "1" : isHovered ? "0.9" : "0.6";
        }
      });

      renderer.render(scene, camera);

      if (!isReduced) {
        animId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      centerIcoGeo.dispose();
      centerIcoMat.dispose();
      centerCoreGeo.dispose();
      centerCoreMat.dispose();
    };
  }, [activeService, onSelectService]);

  return (
    <div className="relative flex h-[320px] sm:h-[420px] md:h-[520px] w-full max-w-[560px] items-center justify-center">
      {/* 3D WebGL Canvas Layer (strictly scoped inside Section 3) */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 overflow-hidden"
      />

      {/* 3D Service Node Labels (strictly contained within this local container) */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {servicesData.map((srv, idx) => (
          <div
            key={srv.id}
            ref={(el) => {
              labelRefs.current[idx] = el;
            }}
            onClick={() => onSelectService(idx)}
            className="pointer-events-auto absolute top-0 left-0 cursor-pointer select-none transition-opacity duration-200"
            style={{
              willChange: "transform, opacity",
              opacity: 0,
            }}
          >
            <span
              className={`font-display text-[11px] font-medium tracking-[0.18em] whitespace-nowrap uppercase transition-all duration-200 ${
                activeService === idx
                  ? "text-white font-bold drop-shadow-[0_0_12px_rgba(8,127,245,0.9)]"
                  : "text-white/60 hover:text-white"
              }`}
              style={{ textShadow: "0 1px 8px #000" }}
            >
              {srv.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
