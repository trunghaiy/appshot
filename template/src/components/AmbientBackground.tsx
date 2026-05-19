import { interpolate, useCurrentFrame } from "remotion";
import type { BrandColors } from "../config";

interface OrbConfig {
  color: string;
  size: number;
  x: number;
  y: number;
  speed: number;
}

type Variant = "light" | "medium" | "deep" | "dark";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildConfig(brand: BrandColors, variant: Variant) {
  const p = brand.primary;
  const pl = brand.primaryLight;

  const configs: Record<Variant, { gradient: string; orbs: OrbConfig[]; dotColor: string }> = {
    light: {
      gradient: `linear-gradient(180deg, ${brand.background} 0%, ${pl} 50%, ${brand.background} 100%)`,
      orbs: [
        { color: hexToRgba(p, 0.1), size: 600, x: 30, y: 25, speed: 0.08 },
        { color: hexToRgba(p, 0.06), size: 500, x: 70, y: 65, speed: -0.05 },
        { color: hexToRgba(p, 0.08), size: 400, x: 50, y: 80, speed: 0.06 },
      ],
      dotColor: "rgba(0,0,0,0.02)",
    },
    medium: {
      gradient: `linear-gradient(180deg, #FFFFFF 0%, ${pl} 40%, ${brand.background} 100%)`,
      orbs: [
        { color: hexToRgba(p, 0.08), size: 700, x: 20, y: 30, speed: 0.06 },
        { color: hexToRgba(pl, 0.12), size: 550, x: 75, y: 60, speed: -0.04 },
        { color: hexToRgba(p, 0.06), size: 450, x: 45, y: 15, speed: 0.07 },
      ],
      dotColor: "rgba(0,0,0,0.015)",
    },
    deep: {
      gradient: `linear-gradient(180deg, ${pl} 0%, ${brand.background} 50%, ${p} 100%)`,
      orbs: [
        { color: hexToRgba(p, 0.15), size: 650, x: 25, y: 20, speed: 0.07 },
        { color: hexToRgba(p, 0.1), size: 500, x: 65, y: 70, speed: -0.05 },
        { color: hexToRgba(pl, 0.12), size: 400, x: 80, y: 40, speed: 0.04 },
      ],
      dotColor: "rgba(0,0,0,0.02)",
    },
    dark: {
      gradient: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f1528 100%)",
      orbs: [
        { color: "rgba(255,255,255,0.03)", size: 600, x: 30, y: 25, speed: 0.08 },
        { color: "rgba(255,255,255,0.02)", size: 500, x: 70, y: 65, speed: -0.05 },
      ],
      dotColor: "rgba(255,255,255,0.03)",
    },
  };

  return configs[variant];
}

export const AmbientBackground: React.FC<{
  brand: BrandColors;
  variant?: Variant;
}> = ({ brand, variant = "light" }) => {
  const frame = useCurrentFrame();
  const config = buildConfig(brand, variant);

  return (
    <div className="absolute inset-0" style={{ background: config.gradient }}>
      {config.orbs.map((orb, i) => {
        const offsetX = Math.sin(frame * orb.speed * 0.02) * 40;
        const offsetY = Math.cos(frame * orb.speed * 0.025) * 30;
        const scale = interpolate(
          Math.sin(frame * 0.008 + i),
          [-1, 1],
          [0.9, 1.1]
        );

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: "blur(60px)",
            }}
          />
        );
      })}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${config.dotColor} 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};
