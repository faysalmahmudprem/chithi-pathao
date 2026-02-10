import { useCallback, useEffect, useState } from "react";
import { Heart, Flower } from "lucide-react";
import { useTheme } from "./ThemeContext";

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  isFilled: boolean;
  rotation: number;
}

const FloatingHearts = () => {
  const { theme } = useTheme();
  const [petals, setPetals] = useState<Petal[]>([]);

  // Use Flower icon for dark/elegant themes, Heart for others
  const isRoseTheme = theme === "dark" || theme === "elegant";

  const createPetal = useCallback((id: number): Petal => ({
    id,
    left: Math.random() * 100,
    size: 10 + Math.random() * 30,
    duration: 6 + Math.random() * 10,
    delay: Math.random() * 5,
    opacity: 0.1 + Math.random() * 0.3,
    isFilled: Math.random() > 0.5,
    rotation: Math.random() * 360,
  }), []);

  useEffect(() => {
    setPetals(Array.from({ length: 20 }, (_, i) => createPetal(i)));
  }, [createPetal]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute animate-petal-fall text-valentine-pink/40"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            opacity: petal.opacity,
          }}
        >
          {isRoseTheme ? (
            <Flower
              size={petal.size}
              fill={petal.isFilled ? "currentColor" : "none"}
              strokeWidth={1.5}
              style={{ transform: `rotate(${petal.rotation}deg)` }}
            />
          ) : (
            <Heart
              size={petal.size}
              fill={petal.isFilled ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          )}
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
