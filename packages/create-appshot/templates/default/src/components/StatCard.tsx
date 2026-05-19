import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { BrandColors } from "../config";

export const StatCard: React.FC<{
  label: string;
  before: number;
  after: number;
  suffix?: string;
  delay?: number;
  brand: BrandColors;
}> = ({ label, before, after, suffix = "", delay = 0, brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { mass: 0.8, damping: 14, stiffness: 120 },
  });

  const counterProgress = spring({
    frame,
    fps,
    delay: delay + 10,
    config: { mass: 0.6, damping: 18, stiffness: 80 },
  });

  const currentValue = Math.round(
    interpolate(counterProgress, [0, 1], [before, after])
  );

  return (
    <div
      style={{
        opacity: entrance,
        transform: `translateY(${(1 - entrance) * 40}px)`,
      }}
    >
      <div
        className="flex flex-col items-center gap-3 rounded-2xl px-10 py-8"
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        <span
          className="text-sm font-medium uppercase tracking-wider"
          style={{ color: brand.textSecondary }}
        >
          {label}
        </span>

        <span
          className="text-lg line-through"
          style={{ color: brand.textSecondary, opacity: 0.6 }}
        >
          {before}{suffix}
        </span>

        <span
          className="text-5xl font-bold"
          style={{ color: brand.primary }}
        >
          {currentValue}{suffix}
        </span>
      </div>
    </div>
  );
};
