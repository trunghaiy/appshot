import { useCurrentFrame, useVideoConfig, interpolate, staticFile } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { PhoneFrame } from "../components/PhoneFrame";
import { Caption } from "../components/Caption";
import type { BrandColors, DevicePreset } from "../config";

export type ScreenshotAnimation =
  | "pan-up"
  | "pan-down"
  | "zoom-in"
  | "zoom-out"
  | "none";

export interface ScreenshotProps {
  caption: string;
  brand: BrandColors;
  image: string;
  animation?: ScreenshotAnimation;
  device?: DevicePreset;
  phoneScale?: number;
}

export const Screenshot: React.FC<ScreenshotProps> = ({
  caption,
  brand,
  image,
  animation = "pan-up",
  device = "iphone-15",
  phoneScale = 1.8,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let imageTransform = "";
  let imageScale = 1;

  switch (animation) {
    case "pan-up":
      imageTransform = `translateY(${interpolate(progress, [0, 1], [0, -15])}%)`;
      imageScale = 1.2;
      break;
    case "pan-down":
      imageTransform = `translateY(${interpolate(progress, [0, 1], [-15, 0])}%)`;
      imageScale = 1.2;
      break;
    case "zoom-in":
      imageScale = interpolate(progress, [0, 1], [1, 1.15]);
      break;
    case "zoom-out":
      imageScale = interpolate(progress, [0, 1], [1.15, 1]);
      break;
    case "none":
      break;
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="medium" />

      <div className="relative z-10">
        <PhoneFrame delay={0} scale={phoneScale} device={device} screenBackground={brand.background}>
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={staticFile(image)}
              style={{
                width: "100%",
                height: "auto",
                minHeight: "100%",
                objectFit: "cover",
                transform: `${imageTransform} scale(${imageScale})`,
                transformOrigin: "center center",
              }}
            />
          </div>
        </PhoneFrame>
      </div>

      <Caption text={caption} delay={8} />
    </div>
  );
};
