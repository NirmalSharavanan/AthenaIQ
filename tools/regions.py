"""UrbanIQ regions: Telangana cities other than Hyderabad.

Hyderabad is the default region and is built by build-data.yml into data/. The regions below are built
by build-regions.yml into data/<id>/. `trips` is the ASSUMED number of vehicle trips on the major-road
network between 06:30 and 10:00 on a working day; it is scaled from the Hyderabad figure by rough city
size (Census 2011 urban populations) and is not a count. The first figures gridlocked the
simulations (peak speeds near 15 km/h in towns), so they were cut by about 45%. `centre` is used by the synthetic traffic pattern
(busier towards the centre).
"""

REGIONS = {
    "warangal":    {"name": "Warangal",    "bbox": (79.45, 17.88, 79.68, 18.06), "centre": (79.57, 17.99), "trips": 45_000},
    "karimnagar":  {"name": "Karimnagar",  "bbox": (79.05, 18.37, 79.21, 18.50), "centre": (79.13, 18.44), "trips": 18_000},
    "nizamabad":   {"name": "Nizamabad",   "bbox": (78.03, 18.62, 78.16, 18.73), "centre": (78.09, 18.67), "trips": 20_000},
    "khammam":     {"name": "Khammam",     "bbox": (80.09, 17.20, 80.21, 17.30), "centre": (80.15, 17.25), "trips": 16_000},
    "ramagundam":  {"name": "Ramagundam",  "bbox": (79.38, 18.69, 79.55, 18.82), "centre": (79.48, 18.77), "trips": 16_000},
    "mahbubnagar": {"name": "Mahbubnagar", "bbox": (77.93, 16.68, 78.06, 16.79), "centre": (78.00, 16.74), "trips": 11_000},
    "nalgonda":    {"name": "Nalgonda",    "bbox": (79.20, 17.00, 79.33, 17.10), "centre": (79.27, 17.05), "trips": 10_000},
    "siddipet":    {"name": "Siddipet",    "bbox": (78.80, 18.06, 78.91, 18.15), "centre": (78.85, 18.10), "trips": 8_000},
    "adilabad":    {"name": "Adilabad",    "bbox": (78.48, 19.62, 78.58, 19.71), "centre": (78.53, 19.66), "trips": 8_000},
}
