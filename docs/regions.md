# Regions

The region selector in the top bar switches the whole application to another Telangana city. **Hyderabad is the default.** Choosing a region reloads the app on that region's data; the address then carries `?region=warangal` (and so on), so a region can be bookmarked or shared.

| Region | Area covered | Traffic |
| --- | --- | --- |
| Hyderabad | The city inside and around the Outer Ring Road, out to the airport at Shamshabad | SUMO simulation |
| Warangal | Warangal, Hanamkonda and Kazipet | Synthetic pattern, then SUMO simulation when its build has run |
| Karimnagar | Karimnagar town and Lower Manair Dam | as Warangal |
| Nizamabad | Nizamabad town | as Warangal |
| Khammam | Khammam town | as Warangal |
| Ramagundam | Godavarikhani, Ramagundam and the NTPC plant | as Warangal |
| Mahbubnagar | Mahbubnagar town | as Warangal |
| Nalgonda | Nalgonda town | as Warangal |
| Siddipet | Siddipet town | as Warangal |
| Adilabad | Adilabad town | as Warangal |

The Model section and the status bar state whether a region's traffic is **simulated** or a **synthetic pattern**.

## What changes with the region

| Item | Source in every region |
| --- | --- |
| Roads, signals, railway (including Hyderabad Metro), cycle tracks | Real, from OpenStreetMap |
| Critical sites (Zones) | Real, from OpenStreetMap |
| Fuel and EV charging stations | Real locations, from OpenStreetMap |
| Site list (chips and the Sites drop-down) | `regions[].sites` in `config.js`; positions are approximate |
| Traffic | SUMO simulation, or a synthetic pattern until the simulation has been built |
| Buses, taxis, shuttles, parking, freight, events, emergency | Synthetic examples: written for Hyderabad in `config.js`, derived from the site list for the other cities (`js/regions.js`) |
| Accidents, fines, incidents, alerts, sensors, devices | Synthetic or illustrative, generated on the region's roads |
| Weather, rain, dust and heat forecast | Real, Open-Meteo, for each city's centre |
| Live traffic, incidents, speeds, EV and fuel | Real and live from TomTom (see [tomtom.md](tomtom.md)) |
| Fires, flights, satellites, earthquakes, events | Real, Telangana-wide (see [live-data.md](live-data.md)) |

Telangana has no coast, so no region has a port, sea lanes or ships, and the AIS vessel feed is off. Only Hyderabad has an airport with scheduled flights (Rajiv Gandhi International, HYD); the flights card follows it. Population figures in Analytics are state-wide (Census of India 2011) and appear for every region.

## Two kinds of traffic

**Synthetic pattern** (`--mode synthetic`). No simulation. Each road gets a flow from its class, lanes, distance from the region centre and the time of day, and a speed from a volume-delay curve. It is quick to build (about a minute per region) and looks plausible, but it is not a simulation result and not a measurement.

**SUMO simulation** (`--mode sumo`). The same method as Hyderabad: assumed demand, gravity trip distribution and a mesoscopic simulation on a left-hand-traffic network. The number of trips is an assumption scaled from Hyderabad by city size (`tools/regions.py`). Two-wheelers and auto-rickshaws, which carry much of the traffic in Telangana, are folded into car-equivalent trips.

Neither is calibrated; there are no public traffic counts.

## Building the data

`Build region data` in GitHub Actions builds all nine cities side by side into `data/<region>/`, then commits them once. `Build twin data` builds Hyderabad into `data/`. Both read Geofabrik's India Southern Zone extract, cut once to Telangana and cached for a week.

- A push that changes `tools/regions.py` runs the synthetic mode. It never replaces a region that already has a simulation.
- Run it by hand and choose **sumo** to simulate every region. This takes longer; a region whose simulation fails keeps its previous data.

## Adding a region

1. Add it to `tools/regions.py`: id, name, bounding box, centre and assumed trips.
2. Add the id to the `matrix.region` list in `.github/workflows/build-regions.yml` and `build-buildings.yml`.
3. Add it to `regions` in `config.js` with its site list (and an airport if it has scheduled flights), and to `PLACES` in `.github/scripts/live_data.py` for its weather.

## Limits

- Site positions are placed from approximate coordinates and should be checked on the map.
- The site list drives the example bus routes, taxi ranks, car parks and so on, so they are illustrations, not TGSRTC services or real facilities.
