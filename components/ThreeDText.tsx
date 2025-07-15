"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SimpleCube() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      30,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const cubes: THREE.LineSegments[] = [];
    const numCubes = 20;

    for (let i = 0; i < numCubes; i++) {
      const size = Math.random() * 1.5 + 0.5;
      const geometry = new THREE.BoxGeometry(size, size, size);
      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const cube = new THREE.LineSegments(edges, material);

      cube.position.x = (Math.random() - 0.5) * 40; // -30 to 30
      cube.position.y = (Math.random() - 0.5) * 40; // -30 to 30
      cube.position.z = (Math.random() - 0.5) * 40; // -30 to 30

      cube.rotation.x = Math.random() * Math.PI * 2;
      cube.rotation.y = Math.random() * Math.PI * 2;
      cube.rotation.z = Math.random() * Math.PI * 2;

      scene.add(cube);
      cubes.push(cube);
    }

    const animate = () => {
      requestAnimationFrame(animate);

      cubes.forEach((cube) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute opacity-50 left-0 top-0 w-full h-full min-h-[400px]"
    />
  );
}
