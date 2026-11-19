#!/usr/bin/env bash
# Builds the offline Windows installer: /tmp/desk/Bulletins-Setup-$VERSION.exe
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EV=$(node -p "require('$ROOT/node_modules/electron/package.json').version")
VERSION=1.2.0
(cd "$ROOT" && bun run build:desktop)
rm -rf /tmp/desk && mkdir -p /tmp/desk/stage/electron
cp -r "$ROOT/desktop-dist" /tmp/desk/stage/
cp "$ROOT/electron/main.cjs" /tmp/desk/stage/electron/
cat > /tmp/desk/stage/package.json <<JSON
{ "name": "bulletins-college", "productName": "Bulletins", "version": "$VERSION", "main": "electron/main.cjs" }
JSON
cd /tmp/desk
"$ROOT/node_modules/.bin/electron-packager" stage Bulletins --platform=win32 --arch=x64 \
  --electron-version="$EV" --out=out --overwrite --asar
cp "$ROOT/electron/installer.nsi" /tmp/desk/installer.nsi
nix shell nixpkgs#nsis -c makensis -V2 -DVERSION="$VERSION" installer.nsi
