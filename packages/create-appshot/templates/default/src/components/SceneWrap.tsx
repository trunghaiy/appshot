import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const FADE = 12;

export const SceneWrap: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
}> = ({ children, durationInFrames, fadeIn = true, fadeOut = true }) => {
  const frame = useCurrentFrame();

  const enterOpacity = fadeIn
    ? interpolate(frame, [0, FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const exitOpacity = fadeOut
    ? interpolate(frame, [durationInFrames - FADE, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ opacity: Math.min(enterOpacity, exitOpacity) }}>
      {children}
    </AbsoluteFill>
  );
};
