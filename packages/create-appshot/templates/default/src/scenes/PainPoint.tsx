import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Caption } from "../components/Caption";
import type { BrandColors } from "../config";

export interface PainPointProps {
  headline: string;
  caption: string;
  items: { label: string; filled: boolean }[];
  counterStart: number;
  counterEnd: number;
  counterLabel: string;
  brand: BrandColors;
}

export const PainPoint: React.FC<PainPointProps> = ({
  headline,
  caption,
  items,
  counterStart,
  counterEnd,
  counterLabel,
  brand,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardEnter = spring({
    frame,
    fps,
    delay: 0,
    config: { mass: 0.8, damping: 14, stiffness: 100 },
  });

  const breakFrame = 55;
  const counterValue = frame < breakFrame + 10
    ? counterStart
    : Math.max(counterEnd, Math.round(interpolate(frame, [breakFrame + 10, breakFrame + 30], [counterStart, counterEnd], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })));

  const redFlash = frame > breakFrame - 2 && frame < breakFrame + 15
    ? interpolate(frame, [breakFrame - 2, breakFrame + 3, breakFrame + 15], [0, 0.4, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const shakeIntensity = frame > breakFrame && frame < breakFrame + 30
    ? interpolate(frame, [breakFrame, breakFrame + 10, breakFrame + 30], [0, 8, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const shakeX = Math.sin(frame * 2.5) * shakeIntensity;
  const shakeY = Math.cos(frame * 3.1) * shakeIntensity * 0.5;

  const crackProgress = frame > breakFrame + 10
    ? interpolate(frame, [breakFrame + 10, breakFrame + 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f1528 100%)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="relative z-10"
        style={{
          opacity: cardEnter,
          transform: `scale(${0.9 + cardEnter * 0.1}) translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <div
          style={{
            width: 600,
            background: "#FFFFFF",
            borderRadius: 28,
            padding: "40px 48px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {redFlash > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `rgba(231, 76, 60, ${redFlash})`,
                zIndex: 10,
                borderRadius: 28,
              }}
            />
          )}

          {crackProgress > 0 && (
            <svg
              width="600"
              height="400"
              viewBox="0 0 600 400"
              style={{ position: "absolute", top: 0, left: 0, zIndex: 11, pointerEvents: "none" }}
            >
              <path
                d={`M 180 0 L 200 ${80 * crackProgress} L 240 ${140 * crackProgress} L 220 ${200 * crackProgress} L 260 ${280 * crackProgress} L 240 ${350 * crackProgress} L 270 400`}
                stroke="rgba(231, 76, 60, 0.6)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${crackProgress * 500}`}
              />
            </svg>
          )}

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 22, color: "#9CA3AF", fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
              {headline}
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                color: counterValue <= counterEnd ? brand.danger : brand.textPrimary,
                lineHeight: 1,
              }}
            >
              {counterValue} {counterLabel}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {items.map((item, i) => {
              const dotEnter = spring({
                frame, fps, delay: 8 + i * 1.2,
                config: { mass: 0.3, damping: 10, stiffness: 150 },
              });

              const greenFade = frame > breakFrame + 5 && item.filled
                ? interpolate(frame, [breakFrame + 5, breakFrame + 25], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                : 1;

              return (
                <div
                  key={i}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    background: !item.filled
                      ? `rgba(231, 76, 60, 0.15)`
                      : `rgba(52, 199, 89, ${greenFade})`,
                    border: !item.filled
                      ? "2px solid rgba(231, 76, 60, 0.6)"
                      : "2px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: dotEnter,
                    transform: `scale(${0.7 + dotEnter * 0.3})`,
                  }}
                >
                  {item.filled && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9L8 13L14 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: greenFade }} />
                    </svg>
                  )}
                  {!item.filled && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M5 5L13 13M13 5L5 13" stroke="#E74C3C" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Caption text={caption} delay={8} />
    </div>
  );
};
