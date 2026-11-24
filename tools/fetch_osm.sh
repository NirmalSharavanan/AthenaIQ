#!/usr/bin/env bash
# Download the Geofabrik India Southern Zone extract, cut it to Telangana once, then cut the study area to
# major roads. Requires: curl, osmium-tool, python3. Output: build/roads.osm and build/extra.osm (XML, read by netconvert).
set -euo pipefail

BUILD="${1:-build}"
cfg() { python3 -c 'import sys; sys.path.insert(0, "tools"); import config; print(eval(sys.argv[1], vars(config)))' "$1"; }
URL="$(cfg OSM_URL)"
STATE_BBOX="$(cfg '",".join(map(str, STATE_BBOX))')"
# ITW_REGION selects a region from tools/regions.py; without it the default study area (Hyderabad) is used.
REGION="${ITW_REGION:-}"
if [ -n "$REGION" ]; then
  BBOX="$(python3 -c 'import sys; sys.path.insert(0, "tools"); import regions; print(",".join(map(str, regions.REGIONS[sys.argv[1]]["bbox"])))' "$REGION")"
else
  BBOX="$(cfg '",".join(map(str, BBOX))')"
fi
CLASSES="$(cfg '",".join(HIGHWAY_CLASSES)')"

mkdir -p "$BUILD"
# build/telangana.osm.pbf is the cached state extract (the workflows keep it for a week).
if [ ! -s "$BUILD/telangana.osm.pbf" ]; then
  curl -fL --retry 6 --retry-all-errors --retry-delay 30 --connect-timeout 30 -o "$BUILD/source.osm.pbf" "$URL"
  osmium fileinfo -g header.option.osmosis_replication_timestamp "$BUILD/source.osm.pbf" > "$BUILD/osm_timestamp.txt" || echo "unknown" > "$BUILD/osm_timestamp.txt"
  osmium extract --bbox "$STATE_BBOX" --strategy complete_ways "$BUILD/source.osm.pbf" -o "$BUILD/telangana.osm.pbf" --overwrite
  rm -f "$BUILD/source.osm.pbf"
fi
[ -s "$BUILD/osm_timestamp.txt" ] || echo "unknown" > "$BUILD/osm_timestamp.txt"

osmium extract --bbox "$BBOX" --strategy complete_ways "$BUILD/telangana.osm.pbf" -o "$BUILD/area.osm.pbf" --overwrite
osmium tags-filter "$BUILD/area.osm.pbf" "w/highway=$CLASSES" -o "$BUILD/roads.osm.pbf" --overwrite
osmium cat "$BUILD/roads.osm.pbf" -o "$BUILD/roads.osm" --overwrite
# Railways (including the Hyderabad Metro), cycle tracks, critical sites (schools, hospitals, consulates, defence,
# government …), fuel and EV charging stations.
osmium tags-filter "$BUILD/area.osm.pbf" \
  w/railway=rail,light_rail,subway,tram,monorail w/highway=cycleway \
  nwr/amenity=school,kindergarten,university,college,hospital,embassy,police,fire_station,townhall,courthouse \
  nwr/office=diplomatic,government nwr/diplomatic nwr/landuse=military nwr/military nwr/aeroway=aerodrome \
  nwr/amenity=fuel,charging_station \
  -o "$BUILD/extra.osm.pbf" --overwrite
osmium cat "$BUILD/extra.osm.pbf" -o "$BUILD/extra.osm" --overwrite
ls -lh "$BUILD"/roads.osm "$BUILD"/extra.osm
echo "OSM data timestamp: $(cat "$BUILD/osm_timestamp.txt")"
