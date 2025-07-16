"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CTAButtonProps {
  text: string;
}

export default function CTAButton({ text }: CTAButtonProps) {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async () => {
    let route = "";
    if (text === "See How It Works") {
      route = "/#features";
      router.push(route);
      return;
    } else if (text === "Get Started") {
      route = "/app";
    }

    if (!user) {
      await signInWithGoogle();
    }
    if (route) {
      setIsNavigating(true);
      router.push(route);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-gradient-to-br ${
        loading || isNavigating ? "to-gray-400" : "from-accent to-cyan-500"
      } text-white p-4 rounded-lg font-semibold text-lg transition-all duration-500 hover:rounded-2xl w-fit hover:scale-105 shadow-lg hover:shadow-xl`}
      disabled={loading || isNavigating}
    >
      {loading || isNavigating ? (
        <div className="flex items-center space-x-2 w-[157px] h-[28px]">
          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
          <span>{isNavigating ? "Launching ..." : "Signing in..."}</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
}
