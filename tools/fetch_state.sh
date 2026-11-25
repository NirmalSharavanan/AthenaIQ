#!/usr/bin/env bash
# Make build/state.osm.pbf (and build/osm_timestamp.txt) unless it is already there (restored from the cache).
# Tries each source in tools/config.py OSM_URLS until one downloads. Requires: curl, osmium-tool, python3.
set -euo pipefail
BUILD="${1:-build}"
mkdir -p "$BUILD"
if [ -s "$BUILD/state.osm.pbf" ]; then
  [ -s "$BUILD/osm_timestamp.txt" ] || echo "unknown" > "$BUILD/osm_timestamp.txt"
  echo "using cached $BUILD/state.osm.pbf"; exit 0
fi
STATE_BBOX="$(python3 -c 'import sys; sys.path.insert(0, "tools"); import config; print(",".join(map(str, config.STATE_BBOX)))')"
ok=""
for URL in $(python3 -c 'import sys; sys.path.insert(0, "tools"); import config; print(" ".join(config.OSM_URLS))'); do
  echo "trying $URL"
  if curl -fL --retry 3 --retry-all-errors --retry-delay 20 --connect-timeout 30 -o "$BUILD/source.osm.pbf" "$URL"; then ok="$URL"; break; fi
  echo "failed: $URL"
done
[ -n "$ok" ] || { echo "no OpenStreetMap source could be downloaded"; exit 1; }
osmium fileinfo -g header.option.osmosis_replication_timestamp "$BUILD/source.osm.pbf" > "$BUILD/osm_timestamp.txt" 2>/dev/null || true
[ -s "$BUILD/osm_timestamp.txt" ] || date -u +%Y-%m-%dT%H:%M:%SZ > "$BUILD/osm_timestamp.txt"
osmium extract --bbox "$STATE_BBOX" --strategy complete_ways "$BUILD/source.osm.pbf" -o "$BUILD/state.osm.pbf" --overwrite
rm -f "$BUILD/source.osm.pbf"
echo "source: $ok"; ls -lh "$BUILD/state.osm.pbf"
