import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { AppIcon } from "../components/AppIcon";
import { AppStoreBadge } from "../components/AppStoreBadge";
import { Caption } from "../components/Caption";
import type { BrandColors } from "../config";

export interface CallToActionProps {
  appName: string;
  appIcon: string;
  tagline: string;
  taglineHighlight?: string;
  caption: string;
  brand: BrandColors;
  platform?: "ios" | "android" | "both";
  pills?: string[];
}

export const CallToAction: React.FC<CallToActionProps> = ({
  appName,
  appIcon,
  tagline,
  taglineHighlight,
  caption,
  brand,
  platform = "ios",
  pills,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconEnter = spring({ frame, fps, delay: 5, config: { mass: 1, damping: 14, stiffness: 80 } });
  const nameEnter = spring({ frame, fps, delay: 15, config: { mass: 0.8, damping: 14, stiffness: 100 } });
  const taglineEnter = spring({ frame, fps, delay: 25, config: { mass: 0.8, damping: 14, stiffness: 100 } });
  const pillsEnter = spring({ frame, fps, delay: 40, config: { mass: 0.6, damping: 12, stiffness: 100 } });

  const orbScale = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.95, 1.05]);

  function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="deep" />

      <div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          left: "50%",
          top: "42%",
          transform: `translate(-50%, -50%) scale(${orbScale})`,
          background: `radial-gradient(circle, ${hexToRgba(brand.primary, 0.2)} 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-12">
        <div
          style={{
            opacity: iconEnter,
            transform: `scale(${0.8 + iconEnter * 0.2})`,
            marginBottom: 20,
          }}
        >
          <AppIcon src={appIcon} size={120} glow glowColor={hexToRgba(brand.primary, 0.4)} />
        </div>

        <div
          style={{
            opacity: nameEnter,
            transform: `translateY(${(1 - nameEnter) * 15}px)`,
            fontSize: 42,
            fontWeight: 800,
            color: brand.textPrimary,
            letterSpacing: -0.5,
            marginBottom: 16,
          }}
        >
          {appName}
        </div>

        <div
          style={{
            opacity: taglineEnter,
            transform: `translateY(${(1 - taglineEnter) * 20}px)`,
            fontSize: 40,
            fontWeight: 700,
            color: brand.textPrimary,
            textAlign: "center",
            lineHeight: 1.25,
            marginBottom: 32,
            maxWidth: 800,
          }}
        >
          {tagline}
          {taglineHighlight && (
            <>
              <br />
              <span style={{ color: brand.primary }}>{taglineHighlight}</span>
            </>
          )}
        </div>

        {pills && pills.length > 0 && (
          <div
            style={{
              opacity: pillsEnter,
              transform: `translateY(${(1 - pillsEnter) * 15}px)`,
              display: "flex",
              gap: 16,
              marginBottom: 32,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {pills.map((label, i) => {
              const pillEnter = spring({ frame, fps, delay: 42 + i * 4, config: { mass: 0.5, damping: 12, stiffness: 120 } });

              return (
                <div
                  key={i}
                  style={{
                    opacity: pillEnter,
                    transform: `scale(${0.9 + pillEnter * 0.1})`,
                    background: "rgba(255, 255, 255, 0.7)",
                    borderRadius: 16,
                    padding: "14px 28px",
                    border: `1px solid ${brand.primary}30`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <span style={{ fontSize: 22, fontWeight: 600, color: brand.primary }}>{label}</span>
                </div>
              );
            })}
          </div>
        )}

        <AppStoreBadge platform={platform} delay={55} />
      </div>

      <Caption text={caption} delay={8} />
    </div>
  );
};
