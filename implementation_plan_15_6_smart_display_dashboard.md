# Implementation Plan: 15.6" Smart Display Dashboard

This document details the architectural design, software stack, state machine, data pipelines, and phase-by-phase roadmap for building and deploying the custom dynamic dashboard.

---

## 1. System Architecture & Tech Stack

```
                     ┌──────────────────────────────────────────────┐
                     │            Local Host / Server               │
                     │ (Home Assistant OS / Supervised or Container)│
                     └──────────────────────┬───────────────────────┘
                                            │
                        ┌───────────────────┴───────────────────┐
                        │                                       │
            WebSocket / REST API                        Local Media Share
                        │                                  (HTTP / WebDAV)
                        ▼                                       ▼
┌───────────────────────────────────────────────┐   ┌───────────────────────┐
│           Dashboard Web Application           │   │  Local Photo Storage  │
│  - React / Tailwind CSS (Single SPA)          │   │  - Unmodified Photos  │
│  - State Machine (Mode switching engine)      │   │  - Auto-thumbnails    │
│  - Canvas / Blur Engine for Portrait Photos   │   └───────────────────────┘
└───────────────────────┬───────────────────────┘
                        │
                        ▼ (Full-screen kiosk output)
┌───────────────────────────────────────────────┐
│     15.6" 1080p Portable Monitor Display      │
│  - Driven via Chromium Kiosk Mode             │
│  - Auto-sleep / DPMS controlled via HA Plug   │
└───────────────────────────────────────────────┘
```

### Stack Recommendation: Custom Web Application over MagicMirror²
While MagicMirror² offers prebuilt modules, a **custom SPA (React + Tailwind CSS + Vite)** running in **Chromium Kiosk Mode** is strongly recommended for this project because:
1. **Fluid Context Transitions:** Seamlessly animating layout shifts between Morning, Evening, Race Weekend, and Ambient modes is significantly easier in a centralized React state tree than coordinating loosely coupled MagicMirror² third-party modules.
2. **Aspect Ratio & Blur Canvas Handling:** Dynamic portrait letterbox blurring and shifting overlay coordinates based on raw image EXIF/aspect ratios requires precise DOM control.
3. **Single Real-Time Data Plane:** Subscribing directly to Home Assistant's WebSocket API (`home-assistant-js-websocket`) enables zero-latency updates for media players, calendar changes, and sensors.

---

## 2. Dynamic Mode Engine & State Machine

The dashboard switches layouts dynamically according to a defined hierarchy of priorities:

```
[ Priority 1: Race Weekend Mode ]
    └── Condition: Current date is Thursday 00:00 through Sunday 23:59 IST of an F1 race week.
    
[ Priority 2: Evening / Now-Playing Mode ]
    └── Condition: Speaker entity state == "playing" OR (Time >= Sunset and Time < 23:00).
    
[ Priority 3: Morning Mode ]
    └── Condition: Time >= 06:00 and Time < 12:00.
    
[ Priority 4: Ambient Mode (Default Idle) ]
    └── Condition: Fallback mode for afternoons, late nights, or idle periods.
```

### State Switching Rules
* **Override Safety:** When media plays during an F1 race weekend, the audio banner remains compact in the corner, prioritizing the race session telemetry unless explicitly overridden.
* **Ambient Timeout:** If no media is playing and no immediate calendar events exist in the afternoon, the dashboard automatically drops into full-screen Ambient photo mode after 5 minutes of inactivity.

---

## 3. Data Integration Specifications

| Feature | Source / API | Update Cadence | Key Entities / Schema |
| :--- | :--- | :--- | :--- |
| **Media (Now Playing)** | HA `media_player` (Cast) | Instant (WebSocket) | `media_title`, `media_artist`, `entity_picture`, `state` |
| **Weather & AQI** | Open-Meteo API / HA Weather | 15–30 minutes | Temp, Rain %, UV Index, AQI (PM2.5, PM10), Sunrise/Sunset |
| **Calendar & Tasks** | HA Calendar / Google Tasks / Local To-Do | 5 minutes | `calendar.*`, `todo.*` |
| **Formula 1 Schedule** | Jolpica-F1 (Ergast successor) | Hourly / Daily | Schedule, session times (converted to IST), Driver standings |
| **Financial Strip** | Yahoo Finance API / AlphaVantage | 15 minutes | Nifty 50, Gold (MCX / Spot), USD/INR |
| **Photo Carousel** | Local directory server | Every 15 seconds | File listing, EXIF parser, thumbnail caching service |
| **System Health** | HA System Monitor Integration | 1 minute | CPU/RAM usage, host storage, local network latency |

---

## 4. Image Processing & Aspect Ratio Logic

To preserve original photo files without pre-cropping or distortion:

1. **Preload & Dimensions Inspection:**
   * An off-screen `Image()` instance loads the upcoming photo 10 seconds before transition.
   * Compute aspect ratio: $R = \frac{\text{width}}{\text{height}}$.
2. **Layout Adaptation:**
   * **Landscape ($R \ge 1.6$):** Render using CSS `object-cover` centered at `50% 35%` (prioritizing faces/horizons).
   * **Standard / Squarish ($1.2 \le R < 1.6$):** Render centered with mild background blur bars.
   * **Portrait ($R < 1.2$):**
     * **Center Stage:** Center the uncropped photo (`object-contain`).
     * **Wings:** Render a mirrored/stretched copy of the same photo in left/right backdrop containers using `filter: blur(40px) brightness(0.4)`.
     * **UI Widget Shift (Ambient Mode):** Relocate clock and weather overlays into the left and right blurred sidebands so the photo content remains completely unobscured.

---

## 5. Hardware & Display Management

* **Screen Sleep & Auto-Dim:**
  * Use a smart plug or HA-controlled USB power switch to toggle the portable monitor off between 00:00 and 06:00 (unless motion is detected).
  * Alternatively, control DPMS via SSH/local commands on the host:
    * Turn off screen: `xset -display :0 dpms force off`
    * Wake screen: `xset -display :0 dpms force on`
* **Chromium Kiosk Flags:**
  ```bash
  chromium-browser \
    --noerrdialogs \
    --disable-infobars \
    --kiosk \
    --check-for-update-interval=31536000 \
    --disable-pinch \
    --overscroll-history-navigation=0 \
    http://localhost:3000
  ```

---

## 6. Phased Implementation Roadmap

### Phase 1: Foundation & Data Pipelines (Week 1)
- [ ] Set up Vite + React + Tailwind CSS single-page application.
- [ ] Connect `home-assistant-js-websocket` to authenticate and listen to state changes.
- [ ] Implement local photo-serving endpoint (Lighttpd, Nginx, or an HA local folder share).
- [ ] Build the core State Machine managing the 4 modes (Ambient, Morning, Evening, Race Weekend).

### Phase 2: Core Components & Layouts (Week 2)
- [ ] Implement the **Clock, Weather, and AQI** modules with Open-Meteo fallback.
- [ ] Build the **Photo Carousel** with image preloading, 15-second timer bar, and the dual-blur portrait fallback.
- [ ] Construct the **Now-Playing** hero card with responsive album art background extraction.
- [ ] Build the **F1 module** consuming Jolpica-F1 with IST time zone formatting.

### Phase 3: Secondary Widgets & Ambient Refinement (Week 3)
- [ ] Build the **Market & News ticker** (Nifty, Gold, USD/INR, RSS feeds).
- [ ] Assemble the full **Ambient Mode** with responsive repositioning for portrait photos.
- [ ] Implement smooth CSS crossfade transitions when shifting between modes.

### Phase 4: Hardware Integration & Deployment (Week 4)
- [ ] Set up autostart script and Chromium kiosk mode on the host device.
- [ ] Configure HA automation for monitor standby/wake based on room presence or schedule.
- [ ] Perform stress testing on memory usage during long photo-carousel sessions.