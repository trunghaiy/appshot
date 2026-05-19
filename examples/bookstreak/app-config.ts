import type { AppConfig } from "../../template/src/config";

export const appConfig: AppConfig = {
  app: {
    name: "BookStreak",
    tagline: "Build a reading habit that survives missed days.",
    icon: "app-icon.png",
    platform: "ios",
  },
  brand: {
    primary: "#E67E22",
    primaryLight: "#FDF2E9",
    background: "#FAFAF8",
    surface: "#FFFFFF",
    textPrimary: "#2D2D2D",
    textSecondary: "#6B7280",
    success: "#27AE60",
    danger: "#E74C3C",
    accent: "#B8590E",
  },
  video: {
    fps: 30,
    width: 1080,
    height: 1920,
    device: "iphone-15",
    backgroundMusic: "background-music.mp3",
    backgroundMusicVolume: 0.3,
  },
  scenes: [
    {
      type: "pain-point",
      durationInFrames: 120,
      caption: "Every other app does this.",
      props: {
        headline: "Daily Streak",
        items: Array.from({ length: 14 }, (_, i) => ({
          label: `Day ${i + 1}`,
          filled: true,
        })).concat([{ label: "Day 15", filled: false }]),
        counterStart: 14,
        counterEnd: 0,
        counterLabel: "Days",
      },
    },
    {
      type: "feature-showcase",
      durationInFrames: 120,
      caption: "BookStreak keeps your streak alive.",
      props: {
        cards: [
          {
            title: "You're becoming a consistent reader",
            subtitle: "Your Reader Identity",
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
      caption: "Log any book in 5 seconds.",
      props: {
        screenTitle: "Currently Reading",
        steps: [
          { label: "Current page", value: "243", typeFrames: [18, 22, 26] },
        ],
        successMessage: "Page 243 saved!",
        buttonLabel: "Save Progress",
      },
    },
    {
      type: "social-proof",
      durationInFrames: 180,
      caption: "Watch yourself become a reader.",
      props: {
        screenTitle: "Insights",
        statValue: "Top 12%",
        statLabel: "of BookStreak readers",
        showHeatMap: true,
        timeline: [
          { week: "Week 1", label: "Curious Reader" },
          { week: "Week 4", label: "Habit Builder" },
          { week: "Week 12", label: "Consistent Reader" },
        ],
      },
    },
    {
      type: "call-to-action",
      durationInFrames: 120,
      caption: "Free to start. Your streak is waiting.",
      props: {
        tagline: "Build a reading habit",
        taglineHighlight: "that survives missed days.",
        pills: ["Flexible Streaks", "Compassionate Recovery"],
      },
    },
  ],
};
