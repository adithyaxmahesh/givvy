#!/usr/bin/env bash
# Tries to load nvm then run npm run dev. Use if you get "command not found: npm".

set -e
cd "$(dirname "$0")"

# Load nvm if it exists (common on Mac)
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  . "$NVM_DIR/nvm.sh"
fi

if ! command -v npm &>/dev/null; then
  echo "npm not found. Install Node.js first:"
  echo "  https://nodejs.org (download LTS)"
  echo "  Or see SETUP_NODE.md in this folder."
  exit 1
fi

npm run dev
