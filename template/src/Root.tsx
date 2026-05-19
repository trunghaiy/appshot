import { Composition } from "remotion";
import { AbsoluteFill } from "remotion";
import { appConfig } from "./app-config";
import "./styles.css";

const Placeholder: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "#F5F5F7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif",
    }}
  >
    <div style={{ textAlign: "center", color: "#86868B" }}>
      <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 16, color: "#1D1D1F" }}>
        {appConfig.app.name}
      </div>
      <div style={{ fontSize: 24 }}>
        Run the appshot skill to generate scenes
      </div>
    </div>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AppPreview"
      component={Placeholder}
      durationInFrames={150}
      fps={30}
      width={appConfig.video.width}
      height={appConfig.video.height}
    />
  );
};
