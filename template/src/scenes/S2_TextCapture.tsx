import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AmbientBackground, PhoneFrame, Caption, FadeIn, TypeWriter } from "../components";
import { StatusBarIcons } from "../components";
import { appConfig } from "../app-config";

const filterChips = ["All", "Text", "Voice", "Scan", "Tagged"];

const existingNotes = [
  { type: "text", title: "Meeting notes — Sprint planning", time: "2h ago", preview: "Discussed Q3 priorities and..." },
  { type: "voice", title: "Voice note · 0:34", time: "Yesterday", preview: "Quick idea about the onboarding..." },
];

export const S2_TextCapture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { brand } = appConfig;

  const showEditor = spring({
    frame,
    fps,
    delay: 50,
    config: { mass: 0.8, damping: 14, stiffness: 100 },
  });

  const editorSlide = interpolate(showEditor, [0, 1], [852, 0]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="medium" />

      <div className="relative z-10 flex flex-col items-center">
        <PhoneFrame device="iphone-16-pro" screenBackground={brand.background}>
          <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
            {/* Home Screen Layer */}
            <div style={{ width: "100%", height: "100%", padding: "60px 20px 20px" }}>
              {/* Status bar */}
              <div style={{ position: "absolute", top: 16, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: brand.textPrimary }}>9:41</span>
                <StatusBarIcons color={brand.textPrimary} />
              </div>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: brand.primary }} />
                <span style={{ fontSize: 20, fontWeight: 700, color: brand.textPrimary, fontFamily: "system-ui" }}>
                  Kernio AI
                </span>
              </div>
              <div style={{ fontSize: 12, color: brand.textSecondary, marginBottom: 16 }}>
                Monday, 19 May
              </div>

              {/* Search bar */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: brand.surface, border: `1px solid ${brand.primaryLight}`,
                borderRadius: 12, padding: "10px 14px", marginBottom: 14,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brand.textSecondary} strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span style={{ fontSize: 13, color: brand.textSecondary }}>Search notes...</span>
              </div>

              {/* Filter chips */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {filterChips.map((chip, i) => (
                  <div key={chip} style={{
                    padding: "5px 12px", borderRadius: 999,
                    background: i === 0 ? brand.primary : "transparent",
                    border: i === 0 ? "none" : `1px solid #5A6B80`,
                    fontSize: 11, fontWeight: 500,
                    color: i === 0 ? brand.background : brand.textSecondary,
                  }}>
                    {chip}
                  </div>
                ))}
              </div>

              {/* Note cards */}
              {existingNotes.map((note, i) => (
                <FadeIn key={i} delay={8 + i * 10} distance={15}>
                  <div style={{
                    background: brand.surface, borderRadius: 12,
                    border: `1px solid #5A6B80`,
                    padding: 14, marginBottom: 10,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: brand.textPrimary }}>{note.title}</span>
                    </div>
                    <div style={{ fontSize: 12, color: brand.textSecondary }}>{note.preview}</div>
                    <div style={{ fontSize: 10, color: brand.textSecondary, marginTop: 6, opacity: 0.7 }}>{note.time}</div>
                  </div>
                </FadeIn>
              ))}

              {/* FAB */}
              <div style={{
                position: "absolute", bottom: 20, right: 20,
                width: 52, height: 52, borderRadius: 18,
                background: brand.primary,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 16px rgba(56, 189, 248, 0.4)`,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={brand.background} strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </div>

            {/* Editor Overlay (slides up) */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: brand.background,
              transform: `translateY(${editorSlide}px)`,
              padding: "60px 20px 20px",
            }}>
              {/* Status bar */}
              <div style={{ position: "absolute", top: 16, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: brand.textPrimary }}>9:41</span>
                <StatusBarIcons color={brand.textPrimary} />
              </div>

              {/* Editor header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={brand.textPrimary} strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span style={{ fontSize: 13, color: brand.textSecondary }}>Auto-saved</span>
              </div>

              {/* Title area */}
              <div style={{ marginBottom: 16 }}>
                <TypeWriter
                  text="Q3 product roadmap priorities"
                  startFrame={60}
                  charsPerFrame={1.5}
                  className="block"
                  cursorColor={brand.primary}
                />
                <style>{`
                  .block { font-size: 22px; font-weight: 700; color: ${brand.textPrimary}; font-family: system-ui; }
                `}</style>
              </div>

              {/* Body typing */}
              <div style={{ fontSize: 15, color: brand.textSecondary, lineHeight: 1.7 }}>
                <TypeWriter
                  text="1. Ship mobile app by end of June\n2. Integrate AI-powered search\n3. Launch document scanning"
                  startFrame={80}
                  charsPerFrame={1.2}
                  cursorColor={brand.primary}
                />
              </div>

              {/* Formatting bar */}
              <FadeIn delay={65} distance={10}>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: brand.surface, borderTop: `1px solid #5A6B80`,
                  padding: "10px 20px", display: "flex", gap: 20, alignItems: "center",
                }}>
                  {["B", "I", "H", "•", "#"].map((btn) => (
                    <span key={btn} style={{
                      fontSize: 16, fontWeight: btn === "B" ? 700 : 500,
                      fontStyle: btn === "I" ? "italic" : "normal",
                      color: brand.textSecondary,
                    }}>
                      {btn}
                    </span>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </PhoneFrame>
      </div>

      <Caption text="Type it down in seconds." delay={5} />
    </div>
  );
};
