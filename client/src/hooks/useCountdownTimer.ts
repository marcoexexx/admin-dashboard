import { useEffect, useRef, useState } from "react";

export function useCountdownTimer(initialTime: number) {
  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef<number | null>(null);

  const stopCountdown = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startCountdown = () => {
    stopCountdown();
    intervalRef.current = window.setInterval(() => {
      setTime(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
  };

  useEffect(() => {
    startCountdown();
    return () => {
      stopCountdown();
    };
  }, []);

  return { time };
}
