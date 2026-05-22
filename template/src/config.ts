export type DevicePreset = "iphone-16-pro" | "iphone-15" | "ipad-pro-13" | "pixel-9";
export type BrowserPreset = "chrome-desktop" | "chrome-dark";
export type FramePreset = DevicePreset | BrowserPreset;

export interface BrandColors {
  primary: string;
  primaryLight: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  danger: string;
  accent?: string;
}

export interface AppConfig {
  app: {
    name: string;
    tagline: string;
    icon: string;
    platform: "ios" | "android" | "both" | "web";
    url?: string;
  };
  brand: BrandColors;
  video: {
    fps: number;
    width: number;
    height: number;
    device?: DevicePreset;
    browser?: BrowserPreset;
    backgroundMusic?: string;
    backgroundMusicVolume?: number;
  };
}

export const DEVICE_DIMENSIONS: Record<
  DevicePreset,
  {
    screenWidth: number;
    screenHeight: number;
    bezelRadius: number;
    bezelWidth: number;
    notchType: "dynamic-island" | "notch" | "punch-hole" | "none";
  }
> = {
  "iphone-16-pro": {
    screenWidth: 393,
    screenHeight: 852,
    bezelRadius: 55,
    bezelWidth: 8,
    notchType: "dynamic-island",
  },
  "iphone-15": {
    screenWidth: 375,
    screenHeight: 812,
    bezelRadius: 52,
    bezelWidth: 8,
    notchType: "dynamic-island",
  },
  "ipad-pro-13": {
    screenWidth: 1024,
    screenHeight: 1366,
    bezelRadius: 20,
    bezelWidth: 12,
    notchType: "none",
  },
  "pixel-9": {
    screenWidth: 412,
    screenHeight: 915,
    bezelRadius: 40,
    bezelWidth: 6,
    notchType: "punch-hole",
  },
};

export const BROWSER_DIMENSIONS: Record<
  BrowserPreset,
  { viewportWidth: number; viewportHeight: number; chromeVariant: "light" | "dark" }
> = {
  "chrome-desktop": {
    viewportWidth: 1440,
    viewportHeight: 900,
    chromeVariant: "light",
  },
  "chrome-dark": {
    viewportWidth: 1440,
    viewportHeight: 900,
    chromeVariant: "dark",
  },
};

export const DEFAULT_BRAND: BrandColors = {
  primary: "#007AFF",
  primaryLight: "#E5F1FF",
  background: "#F5F5F7",
  surface: "#FFFFFF",
  textPrimary: "#1D1D1F",
  textSecondary: "#86868B",
  success: "#34C759",
  danger: "#FF3B30",
};
