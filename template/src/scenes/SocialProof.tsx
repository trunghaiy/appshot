import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { PhoneFrame, StatusBarIcons } from "../components/PhoneFrame";
import { HeatMap } from "../components/HeatMap";
import { Caption } from "../components/Caption";
import { FadeIn } from "../components/FadeIn";
import type { BrandColors, DevicePreset } from "../config";

export interface SocialProofProps {
  caption: string;
  brand: BrandColors;
  device?: DevicePreset;
  phoneScale?: number;
  screenTitle: string;
  statValue: string;
  statLabel: string;
  showHeatMap?: boolean;
  timeline?: { week: string; label: string }[];
}

export const SocialProof: React.FC<SocialProofProps> = ({
  caption,
  brand,
  device = "iphone-15",
  phoneScale = 1.8,
  screenTitle,
  statValue,
  statLabel,
  showHeatMap = true,
  timeline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const statEnter = spring({
    frame, fps, delay: 72,
    config: { mass: 0.8, damping: 12, stiffness: 80 },
  });

  const trackDraw = timeline
    ? interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="medium" />

      <div className="relative z-10">
        <PhoneFrame delay={0} scale={phoneScale} device={device} screenBackground={brand.background}>
          <div style={{ width: "100%", height: "100%", background: brand.background, position: "relative", overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "54px 24px 8px",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: brand.textPrimary }}>9:41</span>
              <StatusBarIcons color={brand.textPrimary} />
            </div>

            <FadeIn delay={3} distance={10}>
              <div style={{ padding: "8px 24px 12px" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: brand.textPrimary }}>{screenTitle}</div>
              </div>
            </FadeIn>

            {showHeatMap && (
              <div style={{ padding: "0 16px", marginBottom: 12 }}>
                <FadeIn delay={6} distance={10}>
                  <div
                    style={{
                      background: brand.surface,
                      borderRadius: 16,
                      padding: "14px 12px",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: brand.textPrimary, marginBottom: 10, paddingLeft: 4 }}>
                      Your activity
                    </div>
                    <HeatMap brand={brand} delay={10} weeks={10} days={7} cellSize={22} gap={2} />
                  </div>
                </FadeIn>
              </div>
            )}

            <div style={{ padding: "0 16px", marginBottom: 12 }}>
              <div
                style={{
                  background: brand.surface,
                  borderRadius: 16,
                  padding: "20px 20px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  textAlign: "center",
                  opacity: statEnter,
                  transform: `scale(${0.85 + statEnter * 0.15}) translateY(${(1 - statEnter) * 20}px)`,
                }}
              >
                <div style={{ fontSize: 42, fontWeight: 800, color: brand.primary, lineHeight: 1 }}>
                  {statValue}
                </div>
                <div style={{ fontSize: 14, color: brand.textSecondary, marginTop: 6, fontWeight: 500 }}>
                  {statLabel}
                </div>
              </div>
            </div>

            {timeline && (
              <div style={{ padding: "0 16px" }}>
                <FadeIn delay={100} distance={10}>
                  <div
                    style={{
                      background: brand.surface,
                      borderRadius: 16,
                      padding: "16px 16px 20px",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: brand.textPrimary, marginBottom: 16 }}>
                      Your Journey
                    </div>

                    <div style={{ position: "relative", height: 60, marginLeft: 8, marginRight: 8 }}>
                      <div
                        style={{
                          position: "absolute",
                          top: 16,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: brand.primaryLight,
                          borderRadius: 2,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${trackDraw * 100}%`,
                            background: `linear-gradient(90deg, ${brand.primaryLight}, ${brand.primary})`,
                            borderRadius: 2,
                          }}
                        />
                      </div>

                      {timeline.map((node, i) => {
                        const nodeEnter = spring({
                          frame, fps, delay: 105 + i * 10,
                          config: { mass: 0.6, damping: 14, stiffness: 100 },
                        });
                        const pct = i / (timeline.length - 1);

                        return (
                          <div
                            key={i}
                            style={{
                              position: "absolute",
                              left: `${5 + pct * 85}%`,
                              top: 0,
                              opacity: nodeEnter,
                              transform: `scale(${0.8 + nodeEnter * 0.2})`,
                            }}
                          >
                            <div
                              style={{
                                width: i === timeline.length - 1 ? 18 : 14,
                                height: i === timeline.length - 1 ? 18 : 14,
                                borderRadius: "50%",
                                background: brand.primary,
                                opacity: 0.3 + pct * 0.7,
                                marginBottom: 6,
                              }}
                            />
                            <div style={{ fontSize: 11, color: brand.textSecondary, fontWeight: 500 }}>{node.week}</div>
                            <div style={{ fontSize: 12, color: brand.primary, fontWeight: 600, opacity: 0.5 + pct * 0.5 }}>
                              {node.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </FadeIn>
              </div>
            )}
          </div>
        </PhoneFrame>
      </div>

      <Caption text={caption} delay={8} />
    </div>
  );
};
