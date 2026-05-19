import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { BrandColors } from "../config";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildRamp(brand: BrandColors): string[] {
  return [
    brand.primaryLight,
    hexToRgba(brand.primary, 0.3),
    hexToRgba(brand.primary, 0.5),
    brand.primary,
    hexToRgba(brand.primary, 0.9),
  ];
}

const getIntensity = (week: number, day: number): number => {
  const seed = (week * 7 + day) * 2654435761;
  const hash = ((seed >>> 0) % 100) / 100;
  const recencyBoost = week / 12;
  const base = hash * 0.6 + recencyBoost * 0.4;
  if (hash < 0.15) return 0;
  return Math.min(base, 1);
};

const getColor = (intensity: number, ramp: string[]): string => {
  if (intensity === 0) return ramp[0];
  const idx = Math.min(Math.floor(intensity * (ramp.length - 1)), ramp.length - 1);
  return ramp[idx];
};

export const HeatMap: React.FC<{
  brand: BrandColors;
  delay?: number;
  weeks?: number;
  days?: number;
  cellSize?: number;
  gap?: number;
  monthLabels?: string[];
}> = ({
  brand,
  delay = 0,
  weeks = 13,
  days = 7,
  cellSize = 18,
  gap = 3,
  monthLabels = ["Jan", "Feb", "Mar", "Apr"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ramp = buildRamp(brand);

  const containerEnter = spring({
    frame,
    fps,
    delay,
    config: { mass: 0.8, damping: 14, stiffness: 100 },
  });

  const dayLabels = ["M", "", "W", "", "F", "", "S"];

  return (
    <div style={{ opacity: containerEnter }}>
      <div
        style={{
          display: "flex",
          gap,
          marginBottom: 4,
          marginLeft: 22,
        }}
      >
        {monthLabels.map((month) => (
          <span
            key={month}
            style={{
              fontSize: 9,
              color: brand.textSecondary,
              fontWeight: 500,
              width: (cellSize + gap) * Math.ceil(weeks / monthLabels.length) - gap,
              textAlign: "left",
            }}
          >
            {month}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 2 }}>
        <div style={{ display: "flex", flexDirection: "column", gap, marginRight: 4 }}>
          {dayLabels.map((label, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: cellSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <span style={{ fontSize: 8, color: brand.textSecondary, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap }}>
          {Array.from({ length: weeks }).map((_, weekIdx) => (
            <div key={weekIdx} style={{ display: "flex", flexDirection: "column", gap }}>
              {Array.from({ length: days }).map((_, dayIdx) => {
                const cellIndex = weekIdx * days + dayIdx;
                const intensity = getIntensity(weekIdx, dayIdx);
                const color = getColor(intensity, ramp);

                const cellDelay = delay + 5 + cellIndex * 0.4;
                const cellEnter = spring({
                  frame,
                  fps,
                  delay: cellDelay,
                  config: { mass: 0.2, damping: 10, stiffness: 180 },
                });

                return (
                  <div
                    key={dayIdx}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      borderRadius: 4,
                      background: interpolate(cellEnter, [0, 1], [0, 1]) > 0.5 ? color : ramp[0],
                      opacity: 0.3 + cellEnter * 0.7,
                      transform: `scale(${0.6 + cellEnter * 0.4})`,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 8 }}>
        <span style={{ fontSize: 9, color: brand.textSecondary }}>Less</span>
        {ramp.map((color, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
        ))}
        <span style={{ fontSize: 9, color: brand.textSecondary }}>More</span>
      </div>
    </div>
  );
};
