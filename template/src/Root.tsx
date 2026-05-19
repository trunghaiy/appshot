import { Composition } from "remotion";
import { KernioAIPreview } from "./KernioAIPreview";
import { appConfig } from "./app-config";
import "./styles.css";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AppPreview"
      component={KernioAIPreview}
      durationInFrames={750}
      fps={appConfig.video.fps}
      width={appConfig.video.width}
      height={appConfig.video.height}
    />
  );
};
