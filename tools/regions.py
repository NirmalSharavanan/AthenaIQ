"""AthenaIQ regions: Greek cities other than Athens.

Athens is the default region and is built by build-data.yml into data/. The regions below are built by
build-regions.yml into data/<id>/. `trips` is the ASSUMED number of vehicle trips on the major-road network between
06:30 and 10:00 on a working day, scaled from the Athens figure by rough city size (ELSTAT 2021); it is not a count.
`centre` is used by the synthetic traffic pattern (busier towards the centre).
"""

REGIONS = {
    "thessaloniki": {"name": "Thessaloniki", "bbox": (22.80, 40.50, 23.05, 40.72), "centre": (22.94, 40.63), "trips": 90_000},
    "patras":       {"name": "Patras",       "bbox": (21.68, 38.18, 21.82, 38.33), "centre": (21.73, 38.25), "trips": 26_000},
    "heraklion":    {"name": "Heraklion",    "bbox": (25.05, 35.28, 25.22, 35.36), "centre": (25.13, 35.34), "trips": 24_000},
    "larissa":      {"name": "Larissa",      "bbox": (22.36, 39.60, 22.47, 39.67), "centre": (22.42, 39.64), "trips": 18_000},
    "volos":        {"name": "Volos",        "bbox": (22.88, 39.33, 22.99, 39.40), "centre": (22.94, 39.36), "trips": 15_000},
    "ioannina":     {"name": "Ioannina",     "bbox": (20.79, 39.60, 20.92, 39.71), "centre": (20.85, 39.66), "trips": 13_000},
    "chania":       {"name": "Chania",       "bbox": (23.95, 35.47, 24.10, 35.53), "centre": (24.02, 35.51), "trips": 12_000},
    "rhodes":       {"name": "Rhodes",       "bbox": (28.15, 36.38, 28.25, 36.46), "centre": (28.22, 36.44), "trips": 8_000},
    "kavala":       {"name": "Kavala",       "bbox": (24.36, 40.91, 24.46, 40.96), "centre": (24.41, 40.94), "trips": 8_000},
}
