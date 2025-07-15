"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Path() {
  const container = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.2], [0.3, 1]);

  return (
    <motion.div
      ref={container}
      className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
    >
      <svg
        viewBox="0 0 1352 748"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-none sm:max-w-[200%] md:max-w-[150%] lg:max-w-[130%] xl:max-w-[120%] 2xl:max-w-[110%]"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.path
          d="M15 15C39 223 251 733 661 371C973 95.5268 1289 519 1337 733"
          stroke="#F87172"
          strokeWidth="20"
          strokeLinecap="round"
          style={{
            pathLength,
            opacity: pathOpacity,
          }}
          initial={{ pathLength: 0 }}
          className="drop-shadow-sm [stroke-width:20] sm:[stroke-width:25] md:[stroke-width:30]"
        />
      </svg>
    </motion.div>
  );
}
