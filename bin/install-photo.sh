#!/usr/bin/env bash
# install-photo.sh — copies ~/Desktop/nikita.png into the project + runs the
# image pipeline. macOS sandbox blocks Claude Code from reading Desktop directly,
# so this script is the one manual step required after clone.
set -euo pipefail

SRC="${1:-$HOME/Desktop/nikita.png}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/.research/nikita-original.png"

if [[ ! -f "$SRC" ]]; then
  echo "× Photo not found at: $SRC"
  echo "  Pass the path as the first argument: ./bin/install-photo.sh /path/to/photo.png"
  exit 1
fi

mkdir -p "$ROOT/.research"
cp "$SRC" "$DEST"

# Strip EXIF + verify
if command -v sips >/dev/null 2>&1; then
  sips -g pixelWidth -g pixelHeight "$DEST" | head -3
fi

echo "✓ Photo installed at $DEST"
echo "  Running build to generate AVIF/WebP responsive variants..."
cd "$ROOT"
if [[ -d node_modules ]]; then
  node tools/build.mjs
else
  echo "  (install deps first: npm install)"
fi
