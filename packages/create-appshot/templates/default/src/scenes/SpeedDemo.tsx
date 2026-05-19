import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { PhoneFrame, StatusBarIcons } from "../components/PhoneFrame";
import { Caption } from "../components/Caption";
import type { BrandColors, DevicePreset } from "../config";

export interface SpeedDemoStep {
  label: string;
  value: string;
  typeFrames: number[];
}

export interface SpeedDemoProps {
  caption: string;
  brand: BrandColors;
  device?: DevicePreset;
  phoneScale?: number;
  screenTitle: string;
  steps: SpeedDemoStep[];
  successMessage: string;
  buttonLabel: string;
}

export const SpeedDemo: React.FC<SpeedDemoProps> = ({
  caption,
  brand,
  device = "iphone-15",
  phoneScale = 1.8,
  screenTitle,
  steps,
  successMessage,
  buttonLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const step = steps[0];
  const chars = step.value.split("");
  const typedValue = chars
    .filter((_, i) => frame > step.typeFrames[i])
    .join("");

  const allTyped = typedValue.length === chars.length;
  const showSave = allTyped;
  const saveTapFrame = step.typeFrames[step.typeFrames.length - 1] + 10;

  const saveTap = frame > saveTapFrame && frame < saveTapFrame + 8
    ? interpolate(frame, [saveTapFrame, saveTapFrame + 3, saveTapFrame + 7], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const toastEnter = spring({
    frame, fps, delay: saveTapFrame + 5,
    config: { mass: 0.5, damping: 12, stiffness: 120 },
  });
  const showToast = frame > saveTapFrame + 4;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="light" />

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

            <div style={{ padding: "8px 24px 0" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: brand.textPrimary, marginBottom: 12 }}>
                {screenTitle}
              </div>
            </div>

            <div style={{ padding: "0 24px" }}>
              <div style={{ textAlign: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: brand.textSecondary }}>{step.label}</span>
              </div>
              <div
                style={{
                  background: brand.background,
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 16,
                  border: `2px solid ${brand.primary}`,
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: 32, fontWeight: 700, color: brand.textPrimary, fontVariantNumeric: "tabular-nums" }}>
                  {typedValue || "—"}
                </span>
              </div>

              {showSave && (
                <div
                  style={{
                    background: `linear-gradient(135deg, ${brand.primary}, ${brand.primary}DD)`,
                    borderRadius: 14,
                    padding: "14px 0",
                    textAlign: "center",
                    transform: `scale(${saveTap})`,
                    boxShadow: `0 4px 12px ${brand.primary}50`,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
                    {buttonLabel}
                  </span>
                </div>
              )}
            </div>

            {showToast && (
              <div
                style={{
                  position: "absolute",
                  top: 60,
                  left: "50%",
                  transform: `translate(-50%, ${(1 - toastEnter) * -20}px)`,
                  opacity: toastEnter,
                  background: brand.success,
                  borderRadius: 14,
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: `0 8px 24px ${brand.success}50`,
                  zIndex: 60,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
                  {successMessage}
                </span>
              </div>
            )}
          </div>
        </PhoneFrame>
      </div>

      <Caption text={caption} delay={6} />
    </div>
  );
};
