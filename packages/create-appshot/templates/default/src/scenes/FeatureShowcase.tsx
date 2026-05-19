import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { PhoneFrame, StatusBarIcons } from "../components/PhoneFrame";
import { Caption } from "../components/Caption";
import { FadeIn } from "../components/FadeIn";
import type { BrandColors, DevicePreset } from "../config";

export interface FeatureShowcaseProps {
  caption: string;
  brand: BrandColors;
  device?: DevicePreset;
  phoneScale?: number;
  backgroundVariant?: "light" | "medium" | "deep";
  cards: {
    title: string;
    subtitle?: string;
    highlight?: string;
    items?: { label: string; active: boolean }[];
  }[];
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  caption,
  brand,
  device = "iphone-15",
  phoneScale = 1.8,
  backgroundVariant = "light",
  cards,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant={backgroundVariant} />

      <div className="relative z-10">
        <PhoneFrame delay={5} scale={phoneScale} device={device} screenBackground={brand.background}>
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

            {cards.map((card, cardIdx) => {
              const cardEnter = spring({
                frame, fps, delay: 10 + cardIdx * 15,
                config: { mass: 0.8, damping: 14, stiffness: 100 },
              });

              return (
                <div
                  key={cardIdx}
                  style={{
                    padding: "10px 20px 0",
                    opacity: cardEnter,
                    transform: `translateY(${(1 - cardEnter) * 15}px)`,
                  }}
                >
                  <div
                    style={{
                      background: card.highlight ? brand.primaryLight : brand.surface,
                      borderRadius: 16,
                      padding: "14px 18px",
                      border: card.highlight
                        ? `1px solid ${brand.primary}25`
                        : "1px solid #E5E7EB",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    {card.subtitle && (
                      <div style={{ fontSize: 11, color: brand.textSecondary, fontWeight: 500, marginBottom: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>
                        {card.subtitle}
                      </div>
                    )}
                    <div style={{ fontSize: 18, fontWeight: 700, color: card.highlight ? brand.primary : brand.textPrimary, marginBottom: card.items ? 12 : 0 }}>
                      {card.title}
                    </div>
                    {card.highlight && (
                      <FadeIn delay={20 + cardIdx * 15} distance={6}>
                        <div
                          style={{
                            background: `${brand.primary}18`,
                            borderRadius: 10,
                            padding: "4px 10px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 700, color: brand.primary }}>{card.highlight}</span>
                        </div>
                      </FadeIn>
                    )}
                    {card.items && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
                        {card.items.map((item, i) => {
                          const dotEnter = spring({
                            frame, fps, delay: 20 + cardIdx * 15 + i * 2.5,
                            config: { mass: 0.3, damping: 10, stiffness: 150 },
                          });

                          return (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                                opacity: dotEnter,
                              }}
                            >
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 16,
                                  background: item.active ? brand.primary : "transparent",
                                  border: `2px solid ${item.active ? brand.primary : brand.primary + "50"}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {item.active && (
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span style={{ fontSize: 10, color: brand.textSecondary, fontWeight: 500 }}>{item.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </PhoneFrame>
      </div>

      <Caption text={caption} delay={8} />
    </div>
  );
};
