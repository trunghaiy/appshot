import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Caption: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  maxWidth?: number;
}> = ({ text, delay = 0, fontSize = 44, maxWidth = 820 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerEnter = spring({
    frame,
    fps,
    delay,
    config: { mass: 0.8, damping: 14, stiffness: 100 },
  });

  const words = text.split(" ");

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-50 flex justify-center pb-40"
      style={{ opacity: containerEnter, transform: `translateY(${(1 - containerEnter) * 15}px)` }}
    >
      <div
        className="rounded-2xl px-10 py-5"
        style={{
          background: "rgba(45, 45, 45, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth,
        }}
      >
        <p
          className="text-center font-semibold leading-tight text-white"
          style={{ fontSize }}
        >
          {words.map((word, i) => {
            const wordEnter = spring({
              frame,
              fps,
              delay: delay + 3 + i * 1.5,
              config: { mass: 0.3, damping: 12, stiffness: 150 },
            });

            return (
              <span
                key={i}
                className="inline-block"
                style={{
                  opacity: wordEnter,
                  transform: `translateY(${(1 - wordEnter) * 8}px)`,
                  marginRight: "0.3em",
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};
