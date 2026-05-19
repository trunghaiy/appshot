import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AmbientBackground, PhoneFrame, Caption, FadeIn } from "../components";
import { StatusBarIcons } from "../components";
import { appConfig } from "../app-config";

export const S4_ScanCapture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { brand } = appConfig;

  const scanPhase = interpolate(frame, [0, 35, 50, 120], [0, 0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ocrReveal = spring({
    frame,
    fps,
    delay: 55,
    config: { mass: 0.8, damping: 14, stiffness: 100 },
  });

  const scanLineY = interpolate(frame, [10, 45], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="medium" />

      <div className="relative z-10 flex flex-col items-center">
        <PhoneFrame device="iphone-16-pro" screenBackground={brand.background}>
          <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
            {/* Scanner viewfinder phase */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              opacity: 1 - scanPhase,
              background: "#111827",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              {/* Status bar */}
              <div style={{ position: "absolute", top: 16, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>9:41</span>
                <StatusBarIcons color="white" />
              </div>

              {/* Camera viewfinder */}
              <div style={{
                width: 320, height: 420, borderRadius: 16,
                border: "2px solid rgba(56, 189, 248, 0.6)",
                position: "relative", overflow: "hidden",
                background: "rgba(255,255,255,0.03)",
              }}>
                {/* Document mockup inside viewfinder */}
                <div style={{
                  position: "absolute", top: 20, left: 20, right: 20, bottom: 20,
                  background: "rgba(255,255,255,0.08)", borderRadius: 8,
                  padding: 16,
                }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{
                      height: 6, marginBottom: 10,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.12)",
                      width: i === 0 ? "60%" : i === 7 ? "40%" : "90%",
                    }} />
                  ))}
                </div>

                {/* Scanning line */}
                <div style={{
                  position: "absolute", left: 0, right: 0,
                  top: `${scanLineY}%`,
                  height: 2,
                  background: `linear-gradient(90deg, transparent 0%, ${brand.primary} 50%, transparent 100%)`,
                  boxShadow: `0 0 20px ${brand.primary}`,
                }} />

                {/* Corner marks */}
                {[
                  { top: 0, left: 0 }, { top: 0, right: 0 },
                  { bottom: 0, left: 0 }, { bottom: 0, right: 0 },
                ].map((pos, i) => (
                  <div key={i} style={{
                    position: "absolute", ...pos, width: 24, height: 24,
                    borderColor: brand.primary,
                    borderTopWidth: pos.top !== undefined ? 3 : 0,
                    borderBottomWidth: pos.bottom !== undefined ? 3 : 0,
                    borderLeftWidth: pos.left !== undefined ? 3 : 0,
                    borderRightWidth: pos.right !== undefined ? 3 : 0,
                    borderStyle: "solid",
                  }} />
                ))}
              </div>

              <FadeIn delay={5} distance={10}>
                <span style={{ fontSize: 14, color: brand.textSecondary, marginTop: 20 }}>
                  Scanning document...
                </span>
              </FadeIn>
            </div>

            {/* OCR result phase */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              opacity: ocrReveal,
              transform: `translateY(${(1 - ocrReveal) * 30}px)`,
              background: brand.background,
              padding: "60px 20px 20px",
            }}>
              {/* Status bar */}
              <div style={{ position: "absolute", top: 16, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: brand.textPrimary }}>9:41</span>
                <StatusBarIcons color={brand.textPrimary} />
              </div>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={brand.textPrimary} strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: brand.success }} />
                  <span style={{ fontSize: 12, color: brand.success }}>Synced</span>
                </div>
              </div>

              {/* Scanned badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(167, 139, 250, 0.1)", borderRadius: 8,
                padding: "4px 10px", marginBottom: 12,
              }}>
                <span style={{ fontSize: 14 }}>{"📷"}</span>
                <span style={{ fontSize: 11, color: brand.accent || brand.primary, fontWeight: 500 }}>
                  Scanned Document
                </span>
              </div>

              {/* Title */}
              <div style={{ fontSize: 20, fontWeight: 700, color: brand.textPrimary, marginBottom: 16, fontFamily: "system-ui" }}>
                Quarterly Review — Revenue Summary
              </div>

              {/* OCR extracted text */}
              <div style={{ fontSize: 14, color: brand.textSecondary, lineHeight: 1.8 }}>
                <p style={{ marginBottom: 12 }}>
                  Total Revenue: $2.4M (+18% YoY)
                </p>
                <p style={{ marginBottom: 12 }}>
                  Active Users: 12,450
                </p>
                <p style={{ marginBottom: 12 }}>
                  Churn Rate: 3.2% (down from 4.1%)
                </p>
                <p style={{ marginBottom: 12 }}>
                  Key highlight: Mobile adoption grew 42% after launch of the companion app.
                </p>
              </div>

              {/* Tag */}
              <div style={{
                display: "inline-flex", gap: 6, marginTop: 8,
              }}>
                <div style={{
                  background: "rgba(56, 189, 248, 0.1)", borderRadius: 8,
                  padding: "4px 10px",
                }}>
                  <span style={{ fontSize: 11, color: brand.primary }}>#quarterly-review</span>
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>

      <Caption text="Scan any document. Text extracted." delay={5} />
    </div>
  );
};
