import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const VARIANTS = {
  glass: {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  solid: {
    background: "#FFFFFF",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.06)",
  },
  dark: {
    background: "#1A1A2E",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
} as const;

export const FloatingCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
  variant?: "glass" | "solid" | "dark";
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, variant = "glass", className, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { mass: 0.8, damping: 14, stiffness: 120 },
  });

  return (
    <div
      className={className}
      style={{
        borderRadius: 16,
        padding: 24,
        ...VARIANTS[variant],
        opacity: entrance,
        transform: `translateY(${(1 - entrance) * 20}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
