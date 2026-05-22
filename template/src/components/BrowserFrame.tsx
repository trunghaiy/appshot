import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const variants = {
  light: {
    titleBarBg: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
    titleBarBorder: "#E2E8F0",
    outerBorder: "1px solid rgba(0,0,0,0.08)",
    addressBarBg: "rgba(0,0,0,0.04)",
    urlColor: "#94a3b8",
    contentBg: "#FFFFFF",
  },
  dark: {
    titleBarBg: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
    titleBarBorder: "#334155",
    outerBorder: "1px solid #334155",
    addressBarBg: "rgba(255,255,255,0.06)",
    urlColor: "#FFFFFF",
    contentBg: "#0F172A",
  },
} as const;

export const BrowserFrame: React.FC<{
  children: React.ReactNode;
  url?: string;
  delay?: number;
  className?: string;
  scale?: number;
  variant?: "light" | "dark";
}> = ({
  children,
  url = "app.example.com",
  delay = 0,
  className,
  scale = 1,
  variant = "light",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay,
    config: { mass: 1.2, damping: 16, stiffness: 80 },
  });

  const v = variants[variant];

  return (
    <div
      className={className}
      style={{
        opacity: enter,
        transform: `scale(${0.92 + enter * 0.08}) scale(${scale})`,
      }}
    >
      <div
        className="overflow-hidden"
        style={{
          borderRadius: 12,
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)",
          border: v.outerBorder,
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{
            background: v.titleBarBg,
            borderBottom: `1px solid ${v.titleBarBorder}`,
          }}
        >
          {/* macOS traffic lights */}
          <div className="flex" style={{ gap: 6 }}>
            <div
              className="rounded-full"
              style={{ width: 12, height: 12, background: "#FF5F57" }}
            />
            <div
              className="rounded-full"
              style={{ width: 12, height: 12, background: "#FEBC2E" }}
            />
            <div
              className="rounded-full"
              style={{ width: 12, height: 12, background: "#28C840" }}
            />
          </div>

          {/* Address bar */}
          <div
            className="ml-3 flex-1 rounded-md px-3 py-1"
            style={{ background: v.addressBarBg }}
          >
            <span
              className="font-mono"
              style={{ fontSize: 13, color: v.urlColor }}
            >
              {url}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          className="relative overflow-hidden"
          style={{ background: v.contentBg }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
