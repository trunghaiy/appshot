import { Img, staticFile, interpolate, useCurrentFrame } from "remotion";

export const AppIcon: React.FC<{
  src: string;
  size?: number;
  glow?: boolean;
  glowColor?: string;
}> = ({ src, size = 120, glow = false, glowColor = "rgba(0, 122, 255, 0.4)" }) => {
  const frame = useCurrentFrame();
  const cornerRadius = size * 0.22;

  const glowPulse = glow
    ? interpolate(Math.sin(frame * 0.08), [-1, 1], [0.4, 0.8])
    : 0;

  return (
    <Img
      src={src.startsWith("http") ? src : staticFile(src)}
      width={size}
      height={size}
      style={{
        borderRadius: cornerRadius,
        boxShadow: glow
          ? `0 0 ${20 + glowPulse * 40}px ${glowColor}, 0 20px 40px rgba(0,0,0,0.2)`
          : "0 20px 40px rgba(0,0,0,0.2)",
      }}
    />
  );
};
