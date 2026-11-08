#!/usr/bin/env bash
# DPMS Display Power Management Script for Screen Sleep/Wake
set -euo pipefail

ACTION="${1:-status}"
DISPLAY_TARGET="${DISPLAY:-:0}"

case "$ACTION" in
  off|sleep)
    echo "Putting display to sleep (DPMS force off)..."
    xset -display "$DISPLAY_TARGET" dpms force off
    ;;
  on|wake)
    echo "Waking display (DPMS force on)..."
    xset -display "$DISPLAY_TARGET" dpms force on
    ;;
  status)
    echo "Querying DPMS status for display $DISPLAY_TARGET:"
    xset -display "$DISPLAY_TARGET" q | grep -i "dpms" -A 4 || true
    ;;
  *)
    echo "Usage: $0 [off|sleep|on|wake|status]"
    exit 1
    ;;
esac
