import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface ProgressBarProps {
  progress: number;
  delay?: number;
  duration?: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  borderRadius?: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  delay = 0,
  duration = 30,
  color = "#007AFF",
  backgroundColor = "rgba(0,0,0,0.06)",
  height = 8,
  borderRadius,
  label,
  showPercentage = false,
}) => {
  const frame = useCurrentFrame();
  const resolvedRadius = borderRadius ?? height / 2;

  const animatedProgress = interpolate(
    frame,
    [delay, delay + duration],
    [0, progress],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#64748B",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            flex: 1,
            height,
            backgroundColor,
            borderRadius: resolvedRadius,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${animatedProgress}%`,
              height: "100%",
              backgroundColor: color,
              borderRadius: resolvedRadius,
            }}
          />
        </div>
        {showPercentage && (
          <div
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              color: "#64748B",
              minWidth: 40,
              textAlign: "right",
            }}
          >
            {Math.round(animatedProgress)}%
          </div>
        )}
      </div>
    </div>
  );
};
