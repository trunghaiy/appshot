import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SceneWrap } from "./components/SceneWrap";
import { PainPoint } from "./scenes/PainPoint";
import { FeatureShowcase } from "./scenes/FeatureShowcase";
import { SpeedDemo } from "./scenes/SpeedDemo";
import { SocialProof } from "./scenes/SocialProof";
import { CallToAction } from "./scenes/CallToAction";
import { appConfig } from "./app-config";
import type { SceneConfig } from "./config";
import type { PainPointProps } from "./scenes/PainPoint";
import type { FeatureShowcaseProps } from "./scenes/FeatureShowcase";
import type { SpeedDemoProps } from "./scenes/SpeedDemo";
import type { SocialProofProps } from "./scenes/SocialProof";
import type { CallToActionProps } from "./scenes/CallToAction";

function renderScene(scene: SceneConfig, index: number) {
  const brand = appConfig.brand;
  const props = scene.props;

  switch (scene.type) {
    case "pain-point":
      return <PainPoint brand={brand} caption={scene.caption} {...(props as Omit<PainPointProps, "brand" | "caption">)} />;
    case "feature-showcase":
      return <FeatureShowcase brand={brand} caption={scene.caption} {...(props as Omit<FeatureShowcaseProps, "brand" | "caption">)} />;
    case "speed-demo":
      return <SpeedDemo brand={brand} caption={scene.caption} {...(props as Omit<SpeedDemoProps, "brand" | "caption">)} />;
    case "social-proof":
      return <SocialProof brand={brand} caption={scene.caption} {...(props as Omit<SocialProofProps, "brand" | "caption">)} />;
    case "call-to-action":
      return (
        <CallToAction
          brand={brand}
          caption={scene.caption}
          appName={appConfig.app.name}
          appIcon={appConfig.app.icon}
          platform={appConfig.app.platform}
          {...(props as Omit<CallToActionProps, "brand" | "caption" | "appName" | "appIcon" | "platform">)}
        />
      );
    default:
      return null;
  }
}

export const AppPreview: React.FC = () => {
  const { scenes, video } = appConfig;
  let offset = 0;

  return (
    <AbsoluteFill style={{ background: appConfig.brand.background }}>
      {video.backgroundMusic && (
        <Audio
          src={staticFile(video.backgroundMusic)}
          volume={video.backgroundMusicVolume ?? 0.3}
        />
      )}

      {scenes.map((scene, i) => {
        const from = offset;
        offset += scene.durationInFrames;
        const isFirst = i === 0;
        const isLast = i === scenes.length - 1;

        return (
          <Sequence key={i} from={from} durationInFrames={scene.durationInFrames}>
            <SceneWrap
              durationInFrames={scene.durationInFrames}
              fadeIn={!isFirst}
              fadeOut={!isLast}
            >
              {renderScene(scene, i)}
            </SceneWrap>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
