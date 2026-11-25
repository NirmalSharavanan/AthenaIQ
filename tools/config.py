"""AthenaIQ pipeline configuration (Greece). Every number here is documented in docs/methodology.md."""

# Study area: Athens — the Athens basin from Piraeus and Aspropyrgos to Kifisia, out to the airport at Spata (lon/lat).
BBOX = (23.55, 37.85, 23.98, 38.12)  # west, south, east, north

# OpenStreetMap sources, tried in order until one downloads; the file is cut once to Greece and cached.
OSM_URLS = [
    "https://download.openstreetmap.fr/extracts/europe/greece-latest.osm.pbf",   # Greece (OpenStreetMap France)
    "https://download.geofabrik.de/europe/greece-latest.osm.pbf",               # Greece (Geofabrik)
]
OSM_URL = OSM_URLS[0]
STATE_BBOX = (19.30, 34.70, 29.70, 41.80)  # Greece: west, south, east, north

# Greece drives on the right.
LEFTHAND = False

# OpenStreetMap road classes kept in the simulated network.
HIGHWAY_CLASSES = [
    "motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link",
    "secondary", "secondary_link", "tertiary", "tertiary_link",
]
CLASS_RANK = {"motorway": 0, "trunk": 1, "primary": 2, "secondary": 3, "tertiary": 4}

# Simulated window, seconds after midnight. The first 30 minutes warm the network up.
SIM_BEGIN = 6 * 3600 + 1800      # 06:30
SIM_END = 10 * 3600              # 10:00
DISPLAY_BEGIN = 7 * 3600         # 07:00
BIN_SECONDS = 300                # 5-minute road statistics

# Demand (ASSUMPTIONS — no traffic counts or commuting table are used for Athens).
TOTAL_VEHICLE_TRIPS = 400_000    # vehicle trips on the modelled (major-road) network, 06:30–10:00, typical weekday
# Relative departures per 15 minutes from 06:30 to 10:00 (14 slots).
DEPART_PROFILE = [0.55, 0.75, 0.95, 1.05, 1.10, 1.10, 1.05, 1.00, 0.92, 0.85, 0.78, 0.72, 0.66, 0.60]
EXTERNAL_SHARE = 0.12            # trips with one end at the study-area boundary
THROUGH_SHARE = 0.01             # boundary-to-boundary trips
GRAVITY_BETA_KM = 9.0            # deterrence: P(dest) ∝ weight × exp(-distance / beta)
MIN_TRIP_KM = 1.5
DEST_CANDIDATES = 12

# Scenarios: name → demand multiplier. All are nested subsets of one trip list.
SCENARIOS = [
    {"id": "base", "label": "Typical weekday", "demand": 1.0},
    {"id": "high", "label": "Demand +20%", "demand": 1.2},
    {"id": "low", "label": "Demand −20% (staggered hours)", "demand": 0.8},
]

# Only this share of trips is simulated; road capacity and storage are scaled down to match and
# results are scaled back up. This keeps routing time practical for a city-wide run.
SIM_SAMPLE = 0.25

# Share of vehicles whose full trajectory is exported for the moving dots.
TRIP_SAMPLE = 0.01               # of all trips (i.e. TRIP_SAMPLE / SIM_SAMPLE of the simulated ones)
SHAPE_TOLERANCE_M = 15.0

# Mesoscopic simulation settings (signals: timings are not public, so a generic penalty is applied).
MESO_TLS_PENALTY = 0.6
MESO_TLS_FLOW_PENALTY = 0.8
MESO_MINOR_PENALTY = 3
REROUTE_PROBABILITY = 0.3      # share of drivers who re-plan their route while driving
REROUTE_PERIOD = 600            # seconds between re-plans
SEED = 42

# Bus timetable. Switched off: the app shows a synthetic bus network instead (js/buses.js).
# OASA publishes a GTFS feed for Athens buses; it is not imported yet. Set GTFS_ENABLED and GTFS_URLS to import one.
GTFS_ENABLED = False
GTFS_FEED_ID = "mdb-1329"
GTFS_URLS = [
    "https://files.mobilitydatabase.org/mdb-1329/latest.zip",
]
GTFS_WEEKDAY = "tuesday"

# Buildings (optional). Microsoft Global ML Building Footprints.
BUILDING_WEIGHT = 0.8            # share of trip-end weight from floor space; the rest from road length × lanes
BUILDING_SNAP_M = 600            # a building feeds the nearest ordinary street within this distance
BUILDING_MIN_SHOW_M2 = 500       # footprints at least this large are exported for the 3D view …
BUILDING_MAX_SHOW = 15000        # … up to this many, largest first
FRINGE_MARGIN_DEG = 0.02         # dead ends this close to the study-area edge are boundary entry/exit points
