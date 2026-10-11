#!/bin/sh
# Lokální server: public/ a funkce z api/ s podvrženou databází v paměti (viz scripts/server.mjs).
# Na mobilu ve stejné síti: HOST=0.0.0.0 ./scripts/serve.sh a otevři http://<IP Macu>:8737
# (IP zjistíš příkazem: ipconfig getifaddr en0)
exec node "$(dirname "$0")/server.mjs"
