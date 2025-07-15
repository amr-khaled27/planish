"use client";
import { Heart } from "lucide-react";
import { motion } from "motion/react";

export default function AnimatedHeart() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 10,
        bounce: 0.7,
        duration: 0.8,
      }}
      className="inline"
    >
      <Heart size={32} fill="#f87171" className="text-red-400" />
    </motion.div>
  );
}
