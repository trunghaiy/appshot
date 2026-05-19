import type { AppConfig } from "./config";

export const appConfig: AppConfig = {
  app: {
    name: "MyApp",
    tagline: "Your app tagline here",
    icon: "app-icon.png",
    platform: "ios",
  },
  brand: {
    primary: "#007AFF",
    primaryLight: "#E5F1FF",
    background: "#F5F5F7",
    surface: "#FFFFFF",
    textPrimary: "#1D1D1F",
    textSecondary: "#86868B",
    success: "#34C759",
    danger: "#FF3B30",
  },
  video: {
    fps: 30,
    width: 1080,
    height: 1920,
    device: "iphone-15",
  },
};
