import { interpolate, useCurrentFrame } from "remotion";

export const TypeWriter: React.FC<{
  text: string;
  startFrame: number;
  charsPerFrame?: number;
  className?: string;
  cursor?: boolean;
  cursorColor?: string;
}> = ({ text, startFrame, charsPerFrame = 2, className, cursor = true, cursorColor = "#2196F3" }) => {
  const frame = useCurrentFrame();

  const totalFrames = Math.ceil(text.length / charsPerFrame);
  const charsToShow = Math.floor(
    interpolate(frame, [startFrame, startFrame + totalFrames], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const visibleText = text.slice(0, charsToShow);
  const isTyping = frame >= startFrame && charsToShow < text.length;

  return (
    <span className={className}>
      {visibleText}
      {cursor && isTyping && (
        <span
          className="inline-block w-[2px] align-middle"
          style={{
            height: "1.1em",
            background: cursorColor,
            opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
            marginLeft: 1,
          }}
        />
      )}
    </span>
  );
};
