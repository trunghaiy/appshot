import { Sequence } from "remotion";
import { SceneWrap } from "./components";
import { S1_Hook } from "./scenes/S1_Hook";
import { S2_TextCapture } from "./scenes/S2_TextCapture";
import { S3_VoiceCapture } from "./scenes/S3_VoiceCapture";
import { S4_ScanCapture } from "./scenes/S4_ScanCapture";
import { S5_SyncProof } from "./scenes/S5_SyncProof";
import { S6_CTA } from "./scenes/S6_CTA";

const scenes = [
  { component: S1_Hook, duration: 120 },
  { component: S2_TextCapture, duration: 120 },
  { component: S3_VoiceCapture, duration: 150 },
  { component: S4_ScanCapture, duration: 120 },
  { component: S5_SyncProof, duration: 120 },
  { component: S6_CTA, duration: 120 },
];

export const KernioAIPreview: React.FC = () => {
  let offset = 0;
  return (
    <>
      {scenes.map(({ component: Scene, duration }, i) => {
        const from = offset;
        offset += duration;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <SceneWrap durationInFrames={duration}>
              <Scene />
            </SceneWrap>
          </Sequence>
        );
      })}
    </>
  );
};
