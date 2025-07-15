"use client";

import { useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { setTokenInCookie, removeTokenFromCookie } from "@/utils/auth";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshToken = async () => {
    if (user) {
      try {
        const idToken = await user.getIdToken(true);
        setTokenInCookie(idToken);
        return idToken;
      } catch (error) {
        console.error("Couldn't refresh your session:", error);
        return null;
      }
    }
    return null;
  };

  const refreshTokenViaAPI = async () => {
    if (user) {
      try {
        const currentToken = await user.getIdToken(false);

        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to refresh token via API");
        }

        const data = await response.json();

        return await refreshToken();
      } catch (error) {
        return await refreshToken();
      }
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        try {
          const idToken = await user.getIdToken();
          setTokenInCookie(idToken);
        } catch (error) {
          removeTokenFromCookie();
        }
      } else {
        removeTokenFromCookie();
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {}
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    logout,
    refreshToken,
    refreshTokenViaAPI,
  };
};
