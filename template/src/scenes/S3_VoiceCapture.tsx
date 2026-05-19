import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AmbientBackground, PhoneFrame, Caption, FadeIn } from "../components";
import { StatusBarIcons } from "../components";
import { appConfig } from "../app-config";

function AnimatedWaveform({ brand, frame }: { brand: typeof appConfig.brand; frame: number }) {
  const barCount = 40;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const phase = i * 0.4 + frame * 0.12;
    const amplitude = 0.3 + 0.7 * Math.abs(Math.sin(phase)) * Math.abs(Math.cos(phase * 0.3 + i * 0.2));
    const height = 8 + amplitude * 52;
    return height;
  });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 80 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: h,
            borderRadius: 2,
            background: `linear-gradient(180deg, ${brand.primary} 0%, ${brand.accent || brand.primary} 100%)`,
            opacity: 0.6 + 0.4 * (h / 60),
            transition: "height 0.05s ease",
          }}
        />
      ))}
    </div>
  );
}

export const S3_VoiceCapture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { brand } = appConfig;

  const timerSeconds = Math.min(Math.floor(frame / 30), 12);
  const timerDisplay = `0:${timerSeconds.toString().padStart(2, "0")}`;

  const transcriptReveal = spring({
    frame,
    fps,
    delay: 90,
    config: { mass: 0.8, damping: 14, stiffness: 100 },
  });

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="deep" />

      <div className="relative z-10 flex flex-col items-center">
        <PhoneFrame device="iphone-16-pro" screenBackground={brand.background}>
          <div style={{ width: "100%", height: "100%", position: "relative", padding: "60px 20px 20px" }}>
            {/* Status bar */}
            <div style={{ position: "absolute", top: 16, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: brand.textPrimary }}>9:41</span>
              <StatusBarIcons color={brand.textPrimary} />
            </div>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={brand.textPrimary} strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <FadeIn delay={5} distance={8}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(56, 189, 248, 0.1)", borderRadius: 8,
                  padding: "4px 10px",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: "#F87171" }} />
                  <span style={{ fontSize: 11, color: "#F87171", fontWeight: 500 }}>REC</span>
                </div>
              </FadeIn>
            </div>

            {/* Language chip */}
            <FadeIn delay={10} distance={10}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: brand.surface, borderRadius: 8, border: `1px solid #5A6B80`,
                padding: "4px 10px", marginBottom: 20,
              }}>
                <span style={{ fontSize: 11, color: brand.textSecondary }}>EN</span>
                <span style={{ fontSize: 11, color: brand.textSecondary }}>Auto</span>
              </div>
            </FadeIn>

            {/* Timer */}
            <FadeIn delay={8} distance={15}>
              <div style={{ textAlign: "center", marginBottom: 40, marginTop: 40 }}>
                <div style={{
                  fontSize: 56, fontWeight: 300, color: brand.textPrimary,
                  fontFamily: "system-ui", letterSpacing: 2,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {timerDisplay}
                </div>
              </div>
            </FadeIn>

            {/* Waveform */}
            <FadeIn delay={12} distance={10}>
              <div style={{ marginBottom: 40 }}>
                <AnimatedWaveform brand={brand} frame={frame} />
              </div>
            </FadeIn>

            {/* Controls */}
            <FadeIn delay={15} distance={15}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
                {/* Pause button */}
                <div style={{
                  width: 48, height: 48, borderRadius: 24,
                  background: brand.surface, border: `1px solid #5A6B80`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={brand.textPrimary}>
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                </div>

                {/* Stop button */}
                <div style={{
                  width: 64, height: 64, borderRadius: 32,
                  background: "#F87171",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(248, 113, 113, 0.4)",
                }}>
                  <div style={{ width: 22, height: 22, borderRadius: 4, background: "white" }} />
                </div>
              </div>
            </FadeIn>

            {/* Transcript preview (fades in late) */}
            <div style={{
              position: "absolute", bottom: 30, left: 20, right: 20,
              opacity: transcriptReveal,
              transform: `translateY(${(1 - transcriptReveal) * 20}px)`,
            }}>
              <div style={{
                background: brand.surface, borderRadius: 12,
                border: `1px solid #5A6B80`, padding: 14,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: brand.accent || brand.primary, fontWeight: 600 }}>AI TRANSCRIPT</span>
                </div>
                <div style={{ fontSize: 13, color: brand.textPrimary, lineHeight: 1.6 }}>
                  "We need to ship the mobile app before end of quarter, and the key blocker is..."
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>

      <Caption text="Speak freely. AI transcribes it." delay={5} />
    </div>
  );
};
