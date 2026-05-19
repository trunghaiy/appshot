import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { DevicePreset } from "../config";
import { DEVICE_DIMENSIONS } from "../config";

export const StatusBarIcons: React.FC<{ color?: string }> = ({ color = "#2D2D2D" }) => (
  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <rect x="0" y="9" width="3" height="3" rx="0.5" fill={color} />
      <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill={color} />
      <rect x="9" y="3" width="3" height="9" rx="0.5" fill={color} />
      <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill={color} opacity="0.3" />
    </svg>
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path d="M7 10.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" fill={color} />
      <path d="M3.5 8.5a5 5 0 017 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M1 5.5a8.5 8.5 0 0112 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
    <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
      <rect x="0.5" y="0.5" width="20" height="11" rx="2" stroke={color} strokeWidth="1" fill="none" />
      <rect x="21.5" y="3.5" width="2" height="5" rx="1" fill={color} opacity="0.4" />
      <rect x="2" y="2" width="14" height="8" rx="1" fill={color} />
    </svg>
  </div>
);

export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  device?: DevicePreset;
  delay?: number;
  scale?: number;
  screenBackground?: string;
}> = ({ children, device = "iphone-15", delay = 0, scale = 1, screenBackground = "#FAFAF8" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dims = DEVICE_DIMENSIONS[device];

  const enter = spring({
    frame,
    fps,
    delay,
    config: { mass: 1.2, damping: 16, stiffness: 80 },
  });

  return (
    <div
      style={{
        opacity: enter,
        transform: `scale(${0.92 + enter * 0.08}) scale(${scale})`,
      }}
    >
      <div
        style={{
          width: dims.screenWidth + dims.bezelWidth * 2,
          height: dims.screenHeight + dims.bezelWidth * 2,
          borderRadius: dims.bezelRadius,
          background: "#1A1A1A",
          padding: dims.bezelWidth,
          boxShadow: "0 40px 80px rgba(0,0,0,0.3), 0 15px 30px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        {/* Side buttons */}
        <div style={{ position: "absolute", right: -2, top: 180, width: 3, height: 40, borderRadius: 2, background: "#333" }} />
        <div style={{ position: "absolute", left: -2, top: 160, width: 3, height: 28, borderRadius: 2, background: "#333" }} />
        <div style={{ position: "absolute", left: -2, top: 210, width: 3, height: 50, borderRadius: 2, background: "#333" }} />
        <div style={{ position: "absolute", left: -2, top: 270, width: 3, height: 50, borderRadius: 2, background: "#333" }} />

        <div
          style={{
            width: dims.screenWidth,
            height: dims.screenHeight,
            borderRadius: dims.bezelRadius - dims.bezelWidth,
            overflow: "hidden",
            position: "relative",
            background: screenBackground,
          }}
        >
          {dims.notchType === "dynamic-island" && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                height: 34,
                borderRadius: 20,
                background: "#000000",
                zIndex: 50,
              }}
            />
          )}

          {dims.notchType === "punch-hole" && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 12,
                height: 12,
                borderRadius: 6,
                background: "#000000",
                zIndex: 50,
              }}
            />
          )}

          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
