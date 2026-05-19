import { Composition } from "remotion";
import { AppPreview } from "./AppPreview";
import { appConfig } from "./app-config";
import { getTotalDuration } from "./config";
import "./styles.css";

export const RemotionRoot: React.FC = () => {
  const totalDuration = getTotalDuration(appConfig);

  return (
    <Composition
      id="AppPreview"
      component={AppPreview}
      durationInFrames={totalDuration}
      fps={appConfig.video.fps}
      width={appConfig.video.width}
      height={appConfig.video.height}
    />
  );
};
