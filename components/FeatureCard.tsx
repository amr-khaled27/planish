"use client";

import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState, useRef, MouseEvent } from "react";

interface FeatureCardProps {
  iconName: string;
  title: string;
  description: string;
  iconColor?: string;
}

export default function FeatureCard({
  iconName,
  title,
  description,
  iconColor = "text-primary",
}: FeatureCardProps) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[iconName];
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  if (!Icon) {
    console.error(`Icon "${iconName}" not found`);
    return null;
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = -((y - centerY) / centerY) * 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`bg-[#111827] py-12 rounded-xl shadow-lg p-6 flex flex-col items-center relative overflow-hidden transition-all duration-300 transform-gpu
        ${isHovering ? "shadow-2xl" : "hover:shadow-xl"}`}
      style={{
        transform: isHovering
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "transform 0.2s ease-out",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {isHovering && (
        <div
          className="absolute pointer-events-none bg-gradient-radial from-primary/20 to-transparent opacity-70 w-[150px] h-[150px] rounded-full blur-xl transition-opacity"
          style={{
            left: `${mousePosition.x - 75}px`,
            top: `${mousePosition.y - 75}px`,
          }}
        />
      )}
      <div className={`${iconColor} mb-6 text-4xl relative z-10`}>
        <Icon size={42} strokeWidth={1.5} />
      </div>
      <h4 className="text-xl font-semibold mb-2 relative z-10">{title}</h4>
      <p className="text-gray-500 text-center relative z-10">{description}</p>
    </div>
  );
}
