# Smart Display Dashboard

A production-grade, dynamic, context-aware dashboard custom-built for a 1080p (1920x1080) portable monitor in Chromium Kiosk Mode.

---

## Features & Dynamic Modes

The dashboard implements a hierarchical **State Machine** that automatically adapts the display based on time, calendar, media, and F1 race week:

1. **Race Weekend Mode (Priority 1):**
   * Automatically activates from **Thursday 00:00 through Sunday 23:59 IST** of an F1 race week.
   * Full session breakdown (FP1, FP2, FP3, Qualifying, Sprint, Grand Prix) converted accurately into **Indian Standard Time (IST - UTC+5:30)**.
   * Live countdown timer to the upcoming session.
   * 2024/2025/2026 Driver Championship Standings with official team colors.
   * **Override Safety:** When audio plays during an F1 race weekend, the audio banner stays compact in the corner, prioritizing telemetry unless explicitly overridden.

2. **Evening / Now-Playing Mode (Priority 2):**
   * Activates when the speaker is `playing` or between **Sunset and 23:00**.
   * Responsive album art extraction and deep vibrant backdrop glow.
   * Animated audio spectrum visualizer, track scrub bar, and playback controls.
   * Evening ambient lighting scene and sleep timer details.

3. **Morning Mode (Priority 3):**
   * Activates between **06:00 and 12:00**.
   * High-productivity morning briefing: large clock, sunrise timing, detailed weather with rain probability and UV index, AQI warning.
   * Today's calendar agenda and interactive to-do checklist.
   * Financial markets morning radar (Nifty 50, Sensex, Gold 24K, USD/INR).

4. **Ambient Mode (Priority 4 - Default Idle):**
   * Full-screen 15-second photo carousel with image preloading (10s in advance).
   * **Aspect Ratio Engine ($R = \text{width} / \text{height}$):**
     * **Landscape ($R \ge 1.6$):** Rendered with `object-cover` centered at `50% 35%`.
     * **Standard / Squarish ($1.2 \le R < 1.6$):** Rendered centered with mild background blur.
     * **Portrait ($R < 1.2$):** Rendered uncropped with dual-blur mirrored wings (`filter: blur(40px) brightness(0.38)`).
     * **UI Widget Shift:** When a portrait photo is displayed, clock and weather overlays automatically relocate into the left and right blurred sidebands so the photo is never obscured.
   * 5-minute inactivity timeout: automatically returns to full-screen ambient mode if idle in the afternoon.

---

## Quick Start

### 1. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
```bash
npm run build
npm run preview
```

### 3. Launch in Chromium Kiosk Mode
```bash
./scripts/run-kiosk.sh http://localhost:3000
```

### 4. Display Sleep / Wake via DPMS
```bash
./scripts/manage-dpms.sh sleep   # Turn off portable monitor
./scripts/manage-dpms.sh wake    # Wake portable monitor
```

---

## Controls & Shortcuts

* **`M`**: Toggle the floating Kiosk Quick Control bar (manual mode switcher, F1 simulation toggle, photo navigation).
* **`S`**: Open Settings Modal (Home Assistant URL & Long-Lived Token, Weather City / Coordinates, Display parameters).
