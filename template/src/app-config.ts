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
  scenes: [
    {
      type: "pain-point",
      durationInFrames: 120,
      caption: "The problem everyone faces.",
      props: {
        headline: "Daily Streak",
        items: Array.from({ length: 14 }, (_, i) => ({ label: `Day ${i + 1}`, filled: true }))
          .concat([{ label: "Day 15", filled: false }]),
        counterStart: 14,
        counterEnd: 0,
        counterLabel: "Days",
      },
    },
    {
      type: "feature-showcase",
      durationInFrames: 120,
      caption: "Your app solves it beautifully.",
      props: {
        cards: [
          {
            title: "Your key feature here",
            subtitle: "Category",
            highlight: "12-week streak",
          },
          {
            title: "This Week",
            items: [
              { label: "M", active: true },
              { label: "T", active: true },
              { label: "W", active: false },
              { label: "T", active: true },
              { label: "F", active: true },
              { label: "S", active: false },
              { label: "S", active: true },
            ],
          },
        ],
      },
    },
    {
      type: "speed-demo",
      durationInFrames: 120,
      caption: "Fast and effortless.",
      props: {
        screenTitle: "Quick Action",
        steps: [
          { label: "Enter value", value: "243", typeFrames: [18, 22, 26] },
        ],
        successMessage: "Saved!",
        buttonLabel: "Save",
      },
    },
    {
      type: "social-proof",
      durationInFrames: 180,
      caption: "See your progress grow.",
      props: {
        screenTitle: "Insights",
        statValue: "Top 12%",
        statLabel: "of all users",
        showHeatMap: true,
        timeline: [
          { week: "Week 1", label: "Beginner" },
          { week: "Week 4", label: "Regular" },
          { week: "Week 12", label: "Power User" },
        ],
      },
    },
    {
      type: "call-to-action",
      durationInFrames: 120,
      caption: "Free to start.",
      props: {
        tagline: "Build your habit",
        taglineHighlight: "that actually sticks.",
        pills: ["Feature A", "Feature B"],
      },
    },
  ],
};
