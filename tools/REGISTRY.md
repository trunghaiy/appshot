# Appshot Tool & Platform Registry

Quick-reference for all CLI commands, post-processing tools, device presets, and store submission specs used in the appshot workflow.

## Remotion CLI

| Command | Purpose |
|---------|---------|
| `remotion studio` / `npm run dev` | Preview in browser at localhost:3000 |
| `remotion render AppPreview out/AppPreview.mp4` / `npm run build` | Render to MP4 |
| `remotion render AppPreview out/AppPreview.gif --image-format png` / `npm run build:gif` | Render to GIF |
| `remotion still CompositionId --frame 0 --image-format png --output out/screenshot.png` | Render a single frame (for screenshots) |
| `remotion render AppPreview out/landscape.mp4 --width 1920 --height 886` | Custom dimensions |

## Post-Processing (optional)

| Tool | Command | Purpose |
|------|---------|---------|
| ffmpeg | `ffmpeg -i input.mp4 -vf scale=886:1920 output.mp4` | Resize for store submission |
| ffmpeg | `ffmpeg -i input.mp4 -c:v libx264 -profile:v high -pix_fmt yuv420p output.mp4` | Ensure H.264 compatibility |

## Device Presets Reference

These are the 4 built-in device presets defined in `template/src/config.ts`:

| Preset | Screen Width | Screen Height | Notch Type | Bezel Radius |
|--------|-------------|--------------|------------|-------------|
| `iphone-16-pro` | 393 | 852 | dynamic-island | 55 |
| `iphone-15` | 375 | 812 | dynamic-island | 52 |
| `ipad-pro-13` | 1024 | 1366 | none | 20 |
| `pixel-9` | 412 | 915 | punch-hole | 40 |

## Store Submission Specs

### iOS App Store — Videos

| Device | Dimensions | Duration | Format |
|--------|-----------|----------|--------|
| iPhone 6.7" | 886x1920 | 15-30s | H.264, MP4/MOV |
| iPhone 6.1" | 886x1920 | 15-30s | H.264, MP4/MOV |
| iPad 13" | 1200x1600 | 15-30s | H.264, MP4/MOV |

### iOS App Store — Screenshots

| Device | Dimensions (portrait) | Required |
|--------|----------------------|----------|
| iPhone 6.9" | 1320x2868 | Yes (mandatory primary) |
| iPhone 6.7" | 1290x2796 | Optional |
| iPhone 6.5" | 1242x2688 | Optional (legacy) |
| iPad 13" | 2064x2752 | Required if app supports iPad |

### Google Play — Screenshots

| Device | Dimensions (portrait) | Notes |
|--------|----------------------|-------|
| Phone | 1080x1920 | Recommended standard |
| 7" Tablet | 1200x1920 | If app targets 7" tablets |
| 10" Tablet | 1600x2560 | If app targets 10" tablets |

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| remotion | ^4.0.0 | Video framework |
| @remotion/cli | ^4.0.0 | CLI renderer |
| @remotion/player | ^4.0.0 | Browser preview |
| @remotion/transitions | ^4.0.459 | Scene transitions |
| react | ^18.3.1 | UI framework |
| tailwindcss | ^3.4.0 | Styling |
| typescript | ^5.5.0 | Type checking |
