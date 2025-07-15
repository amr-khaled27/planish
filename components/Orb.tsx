"use client";
import { TagCloud, TagCloudOptions } from "@frank-mayer/react-tag-cloud";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Orb() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current || !sphereRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    // Add a small delay to ensure DOM is fully rendered
    const initThreeJS = () => {
      if (!wrapperRef.current || !sphereRef.current) return;

      const scene = new THREE.Scene();

      const wrapper = wrapperRef.current;
      const wrapperRect = wrapper.getBoundingClientRect();

      // Ensure we have valid dimensions
      if (wrapperRect.width === 0 || wrapperRect.height === 0) {
        return;
      }

      const camera = new THREE.PerspectiveCamera(
        75,
        wrapperRect.width / wrapperRect.height,
        0.1,
        1000
      );
      camera.position.z = 30;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

      renderer.setSize(wrapperRect.width, wrapperRect.height);
      renderer.setClearColor(0x000000, 0); // Transparent background

      // Clear any existing canvas before adding new one
      if (sphereRef.current.firstChild) {
        sphereRef.current.removeChild(sphereRef.current.firstChild);
      }

      sphereRef.current.appendChild(renderer.domElement);

      const particleCount = 2500;
      const particles = new THREE.BufferGeometry();

      const positions = new Float32Array(particleCount * 3);
      const radius = 15;

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }

      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.5,
      });

      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);

      const mouse = new THREE.Vector2();

      const handleMouseMove = (event: MouseEvent) => {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        mouse.x = (x / rect.width) * 2 - 1;
        mouse.y = -(y / rect.height) * 2 + 1;
      };

      document.addEventListener("mousemove", handleMouseMove);

      function render() {
        renderer.render(scene, camera);
      }

      let animationId: number | null = null;

      function animate() {
        if (isVisible) {
          animationId = requestAnimationFrame(animate);
        }

        const targetX = -mouse.y * 0.5 + particleSystem.rotation.x;
        const targetY = mouse.x * 0.5 + particleSystem.rotation.y;

        particleSystem.rotation.x +=
          (targetX - particleSystem.rotation.x) * 0.005;
        particleSystem.rotation.y +=
          (targetY - particleSystem.rotation.y) * 0.005;

        particleSystem.rotation.y += 0.001;

        render();
      }

      const handleResize = () => {
        if (!wrapperRef.current) return;

        const updatedRect = wrapperRef.current.getBoundingClientRect();
        camera.aspect = updatedRect.width / updatedRect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(updatedRect.width, updatedRect.height);
        render();
      };

      window.addEventListener("resize", handleResize);

      if (isVisible && !animationId) {
        animate();
      }

      setLoading(false);

      return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("mousemove", handleMouseMove);
        observer.disconnect();

        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        if (sphereRef.current && renderer.domElement) {
          sphereRef.current.removeChild(renderer.domElement);
        }
      };
    };

    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(initThreeJS, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <div
      ref={wrapperRef}
      className="wrapper relative flex justify-center items-center w-full h-full"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <div
        ref={sphereRef}
        className="sphere absolute inset-0 opacity-50 pointer-events-none z-10"
      ></div>
      <div className="relative z-0 w-full h-full flex items-center justify-center">
        <TagCloud
          options={(w: Window & typeof globalThis): TagCloudOptions => ({
            radius: Math.min(500, w.innerWidth, w.innerHeight) / 2,
            maxSpeed: "normal",
            initSpeed: "normal",
            deceleration: 0,
          })}
          onClickOptions={{ passive: true }}
        >
          {[
            "Deadlines",
            "Study Plan",
            "Focus",
            "😩 Procrastination",
            "Projects",
            "Exams",
            "Reminders",
            "Planner",
            "Time Blocks",
            "😤 Last Minute",
            "Tasks",
            "Assignments",
            "💀 All-Nighter",
            "Schedules",
            "Notes",
            "Checklists",
            "😠 Missing Deadlines",
            "Overdue",
            "📚 Too Much",
            "🔥 Panic Mode",
            "Goals",
          ]}
        </TagCloud>
      </div>
    </div>
  );
}
