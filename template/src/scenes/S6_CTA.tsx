import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { AmbientBackground, AppIcon, AppStoreBadge, Caption, FadeIn } from "../components";
import { appConfig } from "../app-config";

export const S6_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { brand } = appConfig;

  const taglineEnter = spring({
    frame,
    fps,
    delay: 15,
    config: { mass: 0.8, damping: 14, stiffness: 100 },
  });

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="light" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* App Icon */}
        <FadeIn delay={5} distance={30}>
          <AppIcon src="icon.png" size={140} glow glowColor="rgba(56, 189, 248, 0.4)" />
        </FadeIn>

        {/* Tagline */}
        <div style={{
          opacity: taglineEnter,
          transform: `translateY(${(1 - taglineEnter) * 15}px)`,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 42,
            fontWeight: 700,
            color: brand.textPrimary,
            lineHeight: 1.2,
            fontFamily: "system-ui",
          }}>
            Capture every idea
          </div>
          <div style={{
            fontSize: 42,
            fontWeight: 700,
            color: brand.primary,
            lineHeight: 1.2,
            fontFamily: "system-ui",
            marginTop: 4,
          }}>
            type, speak, or scan.
          </div>
        </div>

        {/* Pills */}
        <FadeIn delay={25} distance={15}>
          <div style={{ display: "flex", gap: 12 }}>
            {["AI Transcription", "Offline-First"].map((pill) => (
              <div
                key={pill}
                style={{
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  borderRadius: 999,
                  padding: "10px 22px",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 500, color: brand.primary }}>
                  {pill}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Store badges */}
        <FadeIn delay={35} distance={20}>
          <AppStoreBadge platform="both" delay={35} />
        </FadeIn>
      </div>

      <Caption text="Capture ideas your way." delay={5} />
    </div>
  );
};
