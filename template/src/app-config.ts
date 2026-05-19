import type { AppConfig } from "./config";

export const appConfig: AppConfig = {
  app: {
    name: "Kernio AI",
    tagline: "Capture every idea — type, speak, or scan.",
    icon: "icon.png",
    platform: "both",
  },
  brand: {
    primary: "#38BDF8",
    primaryLight: "#1E293B",
    background: "#0F172A",
    surface: "#1E293B",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    success: "#4ADE80",
    danger: "#F87171",
    accent: "#A78BFA",
  },
  video: {
    fps: 30,
    width: 1080,
    height: 1920,
    device: "iphone-16-pro",
  },
};
