#!/bin/sh
# Lokální server pro složku public/.
# Na mobilu ve stejné síti: HOST=0.0.0.0 ./scripts/serve.sh a otevři http://<IP Macu>:8737
# (IP zjistíš příkazem: ipconfig getifaddr en0)
cd "$(dirname "$0")/../public" || exit 1
exec python3 -m http.server "${PORT:-8737}" --bind "${HOST:-127.0.0.1}"
