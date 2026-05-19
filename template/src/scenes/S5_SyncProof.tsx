import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AmbientBackground, PhoneFrame, Caption, FadeIn } from "../components";
import { StatusBarIcons } from "../components";
import { appConfig } from "../app-config";

const syncedNotes = [
  { title: "Q3 product roadmap priorities", type: "text", time: "Just now", synced: true },
  { title: "Voice note · 0:34", type: "voice", time: "2 min ago", synced: true },
  { title: "Revenue Summary (scan)", type: "scan", time: "5 min ago", synced: true },
  { title: "Team standup notes", type: "text", time: "1h ago", synced: true },
];

export const S5_SyncProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { brand } = appConfig;

  const laptopEnter = spring({
    frame,
    fps,
    delay: 25,
    config: { mass: 1, damping: 14, stiffness: 80 },
  });

  const syncPulse = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.4, 1]
  );

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="light" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Phone */}
        <PhoneFrame device="iphone-16-pro" scale={0.72} screenBackground={brand.background}>
          <div style={{ width: "100%", height: "100%", position: "relative", padding: "60px 20px 20px" }}>
            {/* Status bar */}
            <div style={{ position: "absolute", top: 16, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: brand.textPrimary }}>9:41</span>
              <StatusBarIcons color={brand.textPrimary} />
            </div>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: brand.primary }} />
              <span style={{ fontSize: 18, fontWeight: 700, color: brand.textPrimary, fontFamily: "system-ui" }}>
                Kernio AI
              </span>
              <div style={{ flex: 1 }} />
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(74, 222, 128, 0.1)", borderRadius: 6,
                padding: "3px 8px",
              }}>
                <div style={{ width: 5, height: 5, borderRadius: 3, background: brand.success }} />
                <span style={{ fontSize: 10, color: brand.success }}>Synced</span>
              </div>
            </div>

            {/* Notes list */}
            {syncedNotes.map((note, i) => (
              <FadeIn key={i} delay={10 + i * 8} distance={12}>
                <div style={{
                  background: brand.surface, borderRadius: 10,
                  border: `1px solid #5A6B80`,
                  padding: 12, marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 16 }}>
                    {note.type === "text" ? "📝" : note.type === "voice" ? "🎙️" : "📷"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: brand.textPrimary }}>{note.title}</div>
                    <div style={{ fontSize: 10, color: brand.textSecondary, marginTop: 2 }}>{note.time}</div>
                  </div>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: brand.success }} />
                </div>
              </FadeIn>
            ))}
          </div>
        </PhoneFrame>

        {/* Sync connection line + laptop silhouette */}
        <FadeIn delay={20} distance={20}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            {/* Animated sync arrows */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: syncPulse }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={brand.primary} strokeWidth="2" strokeLinecap="round">
                <polyline points="7 17 2 12 7 7" />
                <polyline points="17 7 22 12 17 17" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: brand.primary }}>Syncing</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={brand.primary} strokeWidth="2" strokeLinecap="round">
                <polyline points="7 17 2 12 7 7" />
                <polyline points="17 7 22 12 17 17" />
              </svg>
            </div>

            {/* Laptop mockup */}
            <div style={{
              opacity: laptopEnter,
              transform: `translateY(${(1 - laptopEnter) * 15}px)`,
            }}>
              <div style={{
                width: 320, background: brand.surface,
                borderRadius: 12, border: `1px solid #5A6B80`,
                padding: 16, position: "relative",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: brand.primary }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: brand.textPrimary }}>Kernio AI</span>
                  <span style={{ fontSize: 11, color: brand.textSecondary }}>— Web Dashboard</span>
                </div>

                {syncedNotes.slice(0, 3).map((note, i) => (
                  <FadeIn key={i} delay={35 + i * 6} distance={8}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "6px 0",
                      borderBottom: i < 2 ? `1px solid rgba(90, 107, 128, 0.3)` : "none",
                    }}>
                      <span style={{ fontSize: 12 }}>
                        {note.type === "text" ? "📝" : note.type === "voice" ? "🎙️" : "📷"}
                      </span>
                      <span style={{ fontSize: 12, color: brand.textPrimary, flex: 1 }}>{note.title}</span>
                      <div style={{ width: 5, height: 5, borderRadius: 3, background: brand.success }} />
                    </div>
                  </FadeIn>
                ))}
              </div>
              {/* Laptop base */}
              <div style={{
                width: 360, height: 12, background: "#334155",
                borderRadius: "0 0 8px 8px", margin: "0 auto",
                marginTop: -1,
              }} />
            </div>
          </div>
        </FadeIn>
      </div>

      <Caption text="Works offline. Syncs everywhere." delay={5} />
    </div>
  );
};
