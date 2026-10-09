#!/bin/bash
# Dr. Gordian - Sistema Veterinario (copia local, no requiere internet)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "Abriendo Dr. Gordian (modo local, sin internet)..."
if command -v xdg-open &>/dev/null; then
  xdg-open "$DIR/app/index.html"
elif command -v open &>/dev/null; then
  open "$DIR/app/index.html"
else
  echo "Abre manualmente este archivo en tu navegador: $DIR/app/index.html"
fi
