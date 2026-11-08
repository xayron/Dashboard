#!/usr/bin/env bash
# Production Kiosk Launcher Script for 15.6" 1080p Smart Display
set -euo pipefail

TARGET_URL="${1:-http://localhost:3000}"

echo "Starting 15.6\" Smart Display Dashboard in Chromium Kiosk mode on ${TARGET_URL}..."

# Disable screen saver, blanking and DPMS timeout on X11 display
if command -v xset >/dev/null 2>&1; then
  xset -display :0 s off || true
  xset -display :0 -dpms || true
  xset -display :0 s noblank || true
fi

# Hide mouse cursor when idle if unclutter is installed
if command -v unclutter >/dev/null 2>&1; then
  unclutter -idle 3 -root &
fi

# Launch Chromium with exact hardware kiosk parameters
CHROME_BIN=""
for bin in chromium-browser chromium google-chrome-stable google-chrome; do
  if command -v "$bin" >/dev/null 2>&1; then
    CHROME_BIN="$bin"
    break
  fi
done

if [ -z "$CHROME_BIN" ]; then
  echo "Error: Chromium or Google Chrome binary not found on PATH." >&2
  exit 1
fi

exec "$CHROME_BIN" \
  --noerrdialogs \
  --disable-infobars \
  --kiosk \
  --check-for-update-interval=31536000 \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --disable-translate \
  --disable-features=Translate \
  --disable-suggestions-ui \
  --disable-save-password-bubble \
  --disable-session-crashed-bubble \
  --incognito \
  --window-size=1920,1080 \
  --window-position=0,0 \
  "$TARGET_URL"
