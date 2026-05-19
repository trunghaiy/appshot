import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const AppStoreBadge: React.FC<{
  platform?: "ios" | "android" | "both";
  delay?: number;
}> = ({ platform = "ios", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        transform: `scale(${0.9 + enter * 0.1})`,
        display: "flex",
        gap: 16,
      }}
    >
      {(platform === "ios" || platform === "both") && (
        <div
          style={{
            background: "#000000",
            borderRadius: 14,
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <svg width="28" height="34" viewBox="0 0 28 34" fill="white">
            <path d="M23.2 17.8c0-3.6 2.9-5.3 3-5.4-1.6-2.4-4.2-2.7-5.1-2.8-2.1-.2-4.2 1.3-5.3 1.3-1.1 0-2.8-1.2-4.6-1.2C8.5 9.8 6 11.2 4.6 13.5c-2.8 4.9-.7 12.1 2 16.1 1.3 1.9 2.9 4.1 5 4 2-.1 2.8-1.3 5.2-1.3 2.4 0 3.1 1.3 5.2 1.3 2.2 0 3.5-2 4.8-3.9 1.5-2.2 2.1-4.3 2.2-4.4 0-.1-4.2-1.6-4.2-6.4zM19.3 7.5c1.1-1.3 1.8-3.2 1.6-5-1.6.1-3.4 1-4.6 2.3-1 1.2-1.9 3-1.6 4.8 1.7.2 3.5-.9 4.6-2.1z" />
          </svg>
          <div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", fontWeight: 400 }}>Download on the</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: "#FFFFFF", marginTop: -2 }}>App Store</div>
          </div>
        </div>
      )}

      {(platform === "android" || platform === "both") && (
        <div
          style={{
            background: "#000000",
            borderRadius: 14,
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <svg width="28" height="30" viewBox="0 0 28 30" fill="none">
            <path d="M1 27.3L14.8 15 1 2.7" fill="#00D2FF" />
            <path d="M1 2.7L18.6 12.6 14.8 15z" fill="#00F076" />
            <path d="M1 27.3L18.6 17.4 14.8 15z" fill="#FF3A44" />
            <path d="M18.6 17.4L22 15.5 18.6 12.6 14.8 15z" fill="#FFB600" />
          </svg>
          <div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 400 }}>GET IT ON</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#FFFFFF", marginTop: -2 }}>Google Play</div>
          </div>
        </div>
      )}
    </div>
  );
};
