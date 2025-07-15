"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

export default function StudyPage() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const WORK_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;
    if (isActive && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      setSessionCount(sessionCount + 1);
      setIsWorkSession(!isWorkSession);
      const nextDuration = isWorkSession ? BREAK_TIME : WORK_TIME;
      setMinutes(Math.floor(nextDuration / 60));
      setSeconds(nextDuration % 60);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds, isWorkSession, sessionCount]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsWorkSession(true);
    setMinutes(25);
    setSeconds(0);
    setSessionCount(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-timer-card-bg rounded-2xl shadow-xl p-8 w-full max-w-md text-center border border-timer-card-border"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Study Timer</h1>

        <div className="mb-6">
          <div
            className={`text-sm font-medium px-3 py-1 rounded-full inline-block mb-4 ${
              isWorkSession
                ? "bg-timer-work-bg text-timer-work-text"
                : "bg-timer-break-bg text-timer-break-text"
            }`}
          >
            {isWorkSession ? "🍅 Work Session" : "☕ Break Time"}
          </div>

          <div className="text-6xl font-mono font-bold text-foreground mb-4">
            {formatTime(minutes, seconds)}
          </div>

          <div className="text-sm text-muted-foreground">
            Session #{sessionCount + 1}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={toggleTimer}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isActive
                ? "bg-timer-pause hover:bg-timer-pauseHover"
                : "bg-accent hover:bg-accent/80"
            }`}
          >
            {isActive ? "Pause" : "Start"}
          </button>

          <button
            onClick={resetTimer}
            className="px-6 py-3 rounded-lg font-semibold text-secondary-foreground bg-secondary hover:bg-secondary/80 transition-colors border border-border"
          >
            Reset
          </button>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          <p>25 min work • 5 min break • repeat</p>
        </div>
      </motion.div>
    </div>
  );
}
