import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AmbientBackground, Caption, FadeIn, FloatingCard } from "../components";
import { appConfig } from "../app-config";

const lostIdeas = [
  { emoji: "📝", label: "Napkin scribble", detail: "Can't read my own writing..." },
  { emoji: "🎙️", label: "Voice memo", detail: "0:47 · Untranscribed" },
  { emoji: "📄", label: "Crumpled receipt", detail: "Had a great idea on the back..." },
];

export const S1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { brand } = appConfig;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="dark" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {lostIdeas.map((item, i) => {
          const enterDelay = 10 + i * 18;
          const shakeStart = 60;
          const shakeAmount = frame > shakeStart
            ? interpolate(frame, [shakeStart, shakeStart + 8], [0, 3], { extrapolateRight: "clamp" })
              * Math.sin((frame - shakeStart) * 1.5 + i * 2)
            : 0;

          const crackProgress = spring({
            frame,
            fps,
            delay: 75 + i * 6,
            config: { mass: 0.6, damping: 10, stiffness: 200 },
          });

          const exitOpacity = 1 - crackProgress;
          const exitScale = 1 - crackProgress * 0.15;
          const exitRotate = crackProgress * (i % 2 === 0 ? 5 : -5);

          return (
            <FadeIn key={i} delay={enterDelay} distance={30}>
              <div
                style={{
                  opacity: exitOpacity,
                  transform: `translateX(${shakeAmount}px) scale(${exitScale}) rotate(${exitRotate}deg)`,
                }}
              >
                <FloatingCard delay={enterDelay} variant="dark" style={{ width: 380, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 32 }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: brand.textPrimary }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 14, color: brand.textSecondary, marginTop: 2 }}>
                        {item.detail}
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <Caption text="Great ideas deserve better than this." delay={5} />
    </div>
  );
};
