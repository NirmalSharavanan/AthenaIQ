/* AthenaIQ configuration (Greece).
 *
 * Edit this file to connect real systems. Every value has a working default, so the app runs
 * without changes. Anything left as null uses the built-in synthetic data, and the app labels
 * that data as synthetic on screen. See docs/configuration.md.
 *
 * This file is served to every visitor. Never put passwords, server-side tokens or unrestricted keys in it.
 * The Google Maps and TomTom keys below are browser keys published by the owner's decision; keep them
 * restricted to this site's address in the providers' consoles.
 */
window.INTELLITWIN_CONFIG = {
  /* ---- Product ---------------------------------------------------------------------------------- */
  product: { name: 'AthenaIQ', state: 'Greece', country: 'Greece' },
  currency: { code: 'EUR', symbol: '\u20ac' },   // shown before money values
  /* ---- Base map ---------------------------------------------------------------------------- */
  map: {
    // Base map: a MapLibre vector map with 3D buildings, built the way the MapLibre example "Display buildings in 3D"
    // does it (https://maplibre.org/maplibre-gl-js/docs/examples/display-buildings-in-3d/). The tiles and styles come
    // from OpenFreeMap, which is made from OpenStreetMap data. Use a licensed or self-hosted style in production.
    styleUrl: 'https://tiles.openfreemap.org/styles/dark',           // dark theme
    styleUrlLight: 'https://tiles.openfreemap.org/styles/bright',    // light theme (the style the example uses)
    lightTint: '#cfe0d2',
    theme: 'light',             // 'dark' or 'light' at start; the Light map / Dark map button switches
    // Raster tiles shown if the vector map cannot be loaded. Empty: a plain background is shown instead.
    rasterTiles: [],
    rasterAttribution: '',
    // Google Maps is no longer used. To bring it back set enabled: true and a key (Map Tiles API), then choose the
    // type: 'roadmap', 'satellite' or 'hybrid'. tiles3d and heightOffsetM apply to Google's photorealistic 3D tiles.
    google: { enabled: false, key: null, type: 'osm', tiles3d: false, heightOffsetM: 27 },
    // 3D buildings on the vector base map, as in the MapLibre "Display buildings in 3D" example: the tiles' building layer
    // is extruded to its height and coloured by height (0 m, 200 m, 400 m), growing in from buildingsMinZoom.
    buildings3d: true,
    buildingsMinZoom: 14,
    buildingColors: { light: ['#d3d3d3', '#4169e1', '#add8e6'], dark: ['#33415c', '#3f6fd8', '#8fc3e6'] }
  },

  /* ---- Start-up view ------------------------------------------------------------------------- */
  // Interface style: 'government' (standard: navy and gold), 'military' (olive and khaki), 'police' (blue and silver)
  // or 'enterprise' (compact, rounded).
  // Visitors can switch with the Style button in the status bar.
  // menu: 'minimised' (icons only, with a button to expand) or 'expanded'.
  ui: { style: 'enterprise', menu: 'minimised' },

  /* ---- Regions ------------------------------------------------------------------------------- */
  // The region selector in the top bar: Athens and nine other Greek cities. Athens is the default and keeps
  // the settings in this file.
  // For the other regions the app derives its example data (bus routes, taxi ranks, parking, freight, emergency,
  // ships, flights) from the sites listed here; see js/regions.js. Site positions are APPROXIMATE: check them
  // on the map. Site: [name, longitude, latitude, zoom, kind]. Kinds: centre, business, residential, leisure,
  // mall, university, industrial, open, airport, port; a sixth value `true` marks a coastal site (storm-surge exercise).
  // port.seaBearing and airport.runwayBearing are compass bearings used to draw example sea lanes and flight paths.
  defaultRegion: 'athens',
  regions: [
    { id: 'athens', name: 'Athens', dir: '', centre: [23.7348, 37.9755], airport: { name: 'Athens International Airport', at: [23.9445, 37.9364], runwayBearing: 35 }, sites: [
      ['Syntagma Square', 23.7348, 37.9755, 15, 'centre'], ['Omonia', 23.7281, 37.9841, 15, 'business'], ['Acropolis', 23.7257, 37.9715, 15, 'leisure'],
      ['Monastiraki', 23.7255, 37.9761, 15.5, 'leisure'], ['Panathenaic Stadium', 23.7411, 37.9683, 15, 'leisure'], ['Larissis station', 23.7208, 37.9920, 15, 'business'],
      ['University of Athens', 23.7333, 37.9806, 15, 'university'], ['NTUA Zografou campus', 23.7820, 37.9780, 14.5, 'university'], ['Kolonaki', 23.7420, 37.9790, 15, 'residential'],
      ['Piraeus port', 23.6375, 37.9420, 14, 'port', true], ['Faliro seafront', 23.6800, 37.9330, 14.5, 'open', true], ['SNFCC, Kallithea', 23.6920, 37.9420, 14.5, 'leisure', true],
      ['Glyfada', 23.7536, 37.8650, 14, 'residential', true], ['Elliniko', 23.7300, 37.8890, 14, 'business', true], ['Peristeri', 23.6880, 38.0130, 14, 'residential'],
      ['Marousi, OAKA', 23.7866, 38.0363, 14.5, 'leisure'], ['The Mall Athens', 23.7896, 38.0444, 15, 'mall'], ['Kifisia', 23.8105, 38.0742, 14.5, 'residential'],
      ['Aspropyrgos industrial area', 23.5900, 38.0600, 13.5, 'industrial'], ['Athens International Airport', 23.9445, 37.9364, 13, 'airport']] },
    { id: 'thessaloniki', name: 'Thessaloniki', dir: 'thessaloniki', centre: [22.9410, 40.6328], airport: { name: 'Thessaloniki Macedonia Airport', at: [22.9709, 40.5197], runwayBearing: 100 }, sites: [
      ['Aristotelous Square', 22.9410, 40.6328, 15, 'centre', true], ['White Tower', 22.9484, 40.6264, 15, 'leisure', true], ['Port of Thessaloniki', 22.9230, 40.6340, 14, 'port', true],
      ['Aristotle University', 22.9590, 40.6300, 14.5, 'university'], ['Toumba', 22.9690, 40.6130, 14.5, 'leisure'], ['Kalamaria', 22.9500, 40.5820, 14.5, 'residential', true],
      ['Evosmos', 22.9080, 40.6650, 14, 'residential'], ['Sindos industrial area', 22.8100, 40.6700, 13.5, 'industrial'], ['Mediterranean Cosmos', 22.9940, 40.5470, 14.5, 'mall'],
      ['Thessaloniki Macedonia Airport', 22.9709, 40.5197, 13, 'airport']] },
    { id: 'patras', name: 'Patras', dir: 'patras', centre: [21.7346, 38.2466], sites: [
      ['Georgiou Square', 21.7346, 38.2466, 15, 'centre'], ['Port of Patras', 21.7230, 38.2330, 14, 'port', true], ['Patras Castle', 21.7430, 38.2440, 15, 'leisure'],
      ['University of Patras', 21.7880, 38.2900, 14, 'university'], ['Rio–Antirrio Bridge', 21.7750, 38.3210, 14, 'open', true], ['Industrial area', 21.7700, 38.2000, 14, 'industrial']] },
    { id: 'heraklion', name: 'Heraklion', dir: 'heraklion', centre: [25.1335, 35.3387], airport: { name: 'Heraklion Airport', at: [25.1803, 35.3397], runwayBearing: 90 }, sites: [
      ['Lions Square', 25.1335, 35.3387, 15, 'centre'], ['Port of Heraklion', 25.1400, 35.3440, 14, 'port', true], ['Knossos', 25.1631, 35.2980, 14.5, 'leisure'],
      ['University of Crete, Voutes', 25.0720, 35.3060, 14, 'university'], ['Industrial area', 25.1950, 35.3280, 14, 'industrial'], ['Heraklion Airport', 25.1803, 35.3397, 13.5, 'airport']] },
    { id: 'larissa', name: 'Larissa', dir: 'larissa', centre: [22.4191, 39.6390], sites: [
      ['Central Square', 22.4191, 39.6390, 15, 'centre'], ['Ancient Theatre', 22.4180, 39.6400, 15, 'leisure'], ['Pineios riverside', 22.4100, 39.6450, 14.5, 'open'],
      ['University of Thessaly', 22.4000, 39.6260, 14.5, 'university'], ['Industrial area', 22.4400, 39.6200, 14, 'industrial']] },
    { id: 'volos', name: 'Volos', dir: 'volos', centre: [22.9420, 39.3610], sites: [
      ['Town Centre', 22.9420, 39.3610, 15, 'centre', true], ['Port of Volos', 22.9440, 39.3580, 14, 'port', true], ['Nea Ionia', 22.9300, 39.3800, 14.5, 'residential'],
      ['University of Thessaly', 22.9520, 39.3600, 14.5, 'university', true], ['Industrial area', 22.8900, 39.3700, 14, 'industrial']] },
    { id: 'ioannina', name: 'Ioannina', dir: 'ioannina', centre: [20.8510, 39.6650], airport: { name: 'Ioannina Airport', at: [20.8225, 39.6964], runwayBearing: 140 }, sites: [
      ['Town Centre', 20.8510, 39.6650, 15, 'centre'], ['Lake Pamvotis', 20.8800, 39.6650, 14.5, 'open'], ['Ioannina Castle', 20.8590, 39.6680, 15, 'leisure'],
      ['University of Ioannina', 20.8420, 39.6180, 14, 'university'], ['Industrial area', 20.8300, 39.6300, 14, 'industrial'], ['Ioannina Airport', 20.8225, 39.6964, 13.5, 'airport']] },
    { id: 'chania', name: 'Chania', dir: 'chania', centre: [24.0170, 35.5170], sites: [
      ['Old Harbour', 24.0170, 35.5170, 15.5, 'centre', true], ['Municipal Market', 24.0190, 35.5140, 15.5, 'business'], ['Nea Chora beach', 24.0050, 35.5150, 15, 'open', true],
      ['Halepa', 24.0350, 35.5130, 14.5, 'residential', true], ['Industrial area', 23.9900, 35.4950, 14, 'industrial']] },
    { id: 'rhodes', name: 'Rhodes', dir: 'rhodes', centre: [28.2250, 36.4440], sites: [
      ['Old Town', 28.2250, 36.4440, 15.5, 'centre', true], ['Port of Rhodes', 28.2300, 36.4470, 14.5, 'port', true], ['Mandraki Harbour', 28.2270, 36.4510, 15, 'leisure', true],
      ['New Town', 28.2200, 36.4500, 15, 'business', true], ['Ialysos', 28.1600, 36.4100, 14, 'residential', true]] },
    { id: 'kavala', name: 'Kavala', dir: 'kavala', centre: [24.4120, 40.9370], sites: [
      ['Town Centre', 24.4120, 40.9370, 15, 'centre', true], ['Port of Kavala', 24.4050, 40.9350, 14.5, 'port', true], ['Kamares Aqueduct', 24.4130, 40.9390, 15, 'leisure'],
      ['Panagia old town', 24.4180, 40.9340, 15, 'leisure', true], ['Industrial area', 24.3700, 40.9200, 14, 'industrial']] }
  ],

  // Check options: which map layers are switched on when the app opens. Each can still be changed on screen.
  layers: {
    vehicles: true, people: true, accidents: true, enforcementSites: true, buildings3d: true,
    cameras: true, detectors: false, messageSigns: true, signals: true, responseBases: true,
    railway: true, cycleTracks: true, criticalZones: true, environmentSensors: true,
    buses: true, taxis: true, shuttles: true, ships: true, aircraft: true,
    // Live TomTom layers (need tomtom.key). tomtomTraffic replaces the twin's road colours with TomTom's live flow.
    tomtomTraffic: true, tomtomIncidents: true, tomtomEv: false, tomtomFuel: false
  },

  start: {
    mode: 'live',               // 'live' = start at the Athens clock and play at the rate below; 'replay' = today from now, as Historical
    rate: 1,                    // playback speed, Live included: 1 (Live stays locked to the clock), 30, 120 or 600
    fullView: true,             // open with the panel, legend and site shortcuts minimised
    focus: 'most-congested-site', // select the major site (map chip) with the slowest traffic; 'most-congested' = slowest road; 'all' = whole area
    orbit: true,                // circle the camera; it stays on until the Orbit button is unclicked
    selectionZoomBoost: 2,      // zoom levels added when a site, road or item is selected (0 = off)
    selectionMaxZoom: 17.5,     // closest zoom a selection goes to
    view: '3d',                 // map view at start: '2d' (flat), '3d' (tilted, 3D vehicles and buildings) or 'city' (Google photorealistic 3D, experimental)
    autoZoomForPanel: true      // zoom out a little when the panel narrows the map, so a selection stays whole while orbiting
  },

  /* ---- Time ---------------------------------------------------------------------------------- */
  time: {
    timeZone: 'Europe/Athens',  // Eastern European Time, UTC+02:00 (UTC+03:00 in summer)
    weekendDays: [6, 0],        // Saturday and Sunday (0 = Sunday)
    shortDay: 5                 // Friday: lighter afternoon traffic
  },

  /* ---- Feeds --------------------------------------------------------------------------------- */
  feeds: {
    // Live and historical traffic. 'synthetic' builds a 24-hour day from the simulated traffic states.
    // A real feed is an integration point, not implemented yet: see docs/configuration.md.
    traffic: 'synthetic',
    // URL returning accidents as JSON: [{ "time": "08:15", "lon": 23.73, "lat": 37.98, "road": "…",
    // "severity": "Damage only", "durationMin": 30 }]. null = illustrative accidents.
    accidentsUrl: null
  },

  /* ---- Field devices ------------------------------------------------------------------------- */
  devices: {
    // Leave a list empty to have the app place synthetic devices on the busiest roads.
    // CCTV camera: { id, name, lon, lat, stream }. "stream" may be an .mp4/.webm file, an HLS .m3u8
    // playlist, or "iframe:https://…" for an embeddable player. Without a stream the camera shows a
    // synthetic view drawn from the simulated traffic at that location.
    cameras: [],
    // Real traffic footage shown by cameras that have no stream of their own. These clips are filmed
    // in other cities, not Greece, are recorded (not live) and are not the camera's feed; the camera window says so.
    // The first source is an MP4 copy kept in this repository (made by the "Fetch sample media" workflow),
    // which plays on every browser including iPhones; the others are the Wikimedia originals.
    // Each entry: { kind, classes: road classes it suits (0 motorway … 4 tertiary), sources: [urls tried in order], credit }. Set to [] to use the synthetic view only.
sampleVideos: [
      { kind: 'Aerial interchange', classes: [0, 1], sources: ['assets/video/byrne-interchange.mp4', 'https://commons.wikimedia.org/wiki/Special:FilePath/Jane_M._Byrne_Interchange_Traffic.webm'],
        credit: '"Jane M. Byrne Interchange Traffic" (Chicago) by Sea Cow, CC BY-SA 4.0, Wikimedia Commons' },
      { kind: 'Urban expressway', classes: [0, 1, 2], sources: ['assets/video/lake-shore-drive.mp4', 'https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Shore_Drive_Traffic.webm'],
        credit: '"Lake Shore Drive Traffic" (Chicago) by Sea Cow, CC BY-SA 4.0, Wikimedia Commons' },
      { kind: 'Highway', classes: [0, 1], sources: ['assets/video/houston-highway.mp4', 'https://commons.wikimedia.org/wiki/Special:FilePath/Highway_610_near_Braeswood_Blvd_in_Houston_Texas.webm'],
        credit: '"Highway 610 near Braeswood Blvd in Houston Texas" by the Texas Army National Guard, public domain, Wikimedia Commons' },
      { kind: 'City street', classes: [2, 3, 4], sources: ['assets/video/city-street.mp4', 'https://commons.wikimedia.org/wiki/Special:FilePath/Causeway_Bay_Time-lapse_videos_(afternoon).ogv'],
        credit: '"Causeway Bay Time-lapse videos (afternoon)" (Hong Kong), CC0, Wikimedia Commons' }
    ],
    syntheticCameras: 120,
    syntheticDetectors: 80,
    syntheticSigns: 15,
    // Script that adds HLS playback to browsers without native support (for example a hosted hls.js).
    hlsScript: null,
    signalCycleSeconds: 90
  },

  /* ---- Alerts -------------------------------------------------------------------------------- */
  alerts: {
    // Thresholds set for Greek city traffic, where central roads normally run well below their limits.
    networkSpeedBelowKmh: 15,        // network average speed
    roadRatioBelow: 0.25,             // road speed as a share of its limit …
    roadMinVehicles: 120,           // … with at least this many vehicles on it
    seriousAccident: true,
    everyAccident: false,           // minor accidents stay on the map and in Accidents, without an alert
    // Synthetic operational events (stopped vehicle, wrong-way driver, device fault …) raised at the
    // cameras, so the alert feed is active at any hour. 0 turns them off.
    syntheticEventsPerHour: 6,             // also alert on each new accident, whatever its severity
    maxShown: 12,
    // Push each new alert as an on-screen notification, and as a browser notification when the
    // user has allowed them and the page is in the background.
    push: true,
    pushSeconds: 7,                         // auto-close after this many seconds; 0 = stay until closed with ×
    pushMinSeverity: 2,                     // only alerts of at least this severity pop up (1 low, 2 high, 3 critical)
    pushOnPhones: false,                    // on narrow screens new alerts only update the Alerts count
    pushPosition: 'top-right',              // 'top-right' or 'top-left' corner of the map
    pushMaxVisible: 1                       // one notification at a time; it counts the others ('+3 more')
  },

  /* ---- Forecast ------------------------------------------------------------------------------ */
  forecast: { horizonsMin: [15, 30, 60] },

  /* ---- Vehicle types ------------------------------------------------------------------------- */
  // The simulation has one vehicle type. The app draws and reports a mix of types using these
  // ASSUMED shares; replace them with fleet or classified-count data when available.
  vehicles: {
    mix: [
      { id: 'car', label: 'Cars', share: 0.72 },
      { id: 'taxi', label: 'Taxis', share: 0.08 },
      { id: 'van', label: 'Vans and pick-ups', share: 0.10 },
      { id: 'lorry', label: 'Lorries', share: 0.05 },
      { id: 'bus', label: 'Buses and staff buses', share: 0.03 },
      { id: 'moto', label: 'Motorcycles', share: 0.02 }
    ]
  },

  /* ---- Buses ---------------------------------------------------------------------------------- */
  // A SYNTHETIC bus network: no usable public timetable could be obtained. Each route runs between
  // two points along the quickest road path. Replace with real routes or a GTFS feed when available.
  buses: {
    scheduleKmh: 22,              // timetabled speed including stops
    stopSpacingM: 600,
    firstHour: 5.5, lastHour: 23.5,
    offPeakFactor: 1.5,           // headway outside 06:00–09:30 and 16:00–20:00, against the peak headway
    delayShare: 0.35,             // share of the route's extra traffic time that delays its buses
    onTimeWithinMin: 3,
    routes: [
      { id: '101', name: 'Syntagma – Piraeus', from: [23.7348, 37.9755], to: [23.6375, 37.9420], headwayMin: 10 },
      { id: '102', name: 'Omonia – Kifisia', from: [23.7281, 37.9841], to: [23.8105, 38.0742], headwayMin: 12 },
      { id: '103', name: 'Syntagma – Glyfada', from: [23.7348, 37.9755], to: [23.7536, 37.8650], headwayMin: 10 },
      { id: '110', name: 'Peristeri – Syntagma', from: [23.6880, 38.0130], to: [23.7348, 37.9755], headwayMin: 10 },
      { id: '120', name: 'Marousi – Omonia', from: [23.7866, 38.0363], to: [23.7281, 37.9841], headwayMin: 12 },
      { id: '160', name: 'Syntagma – Airport', from: [23.7348, 37.9755], to: [23.9445, 37.9364], headwayMin: 20 },
      { id: '170', name: 'Zografou – Monastiraki', from: [23.7820, 37.9780], to: [23.7255, 37.9761], headwayMin: 12 },
      { id: '200', name: 'Piraeus – SNFCC', from: [23.6375, 37.9420], to: [23.6920, 37.9420], headwayMin: 15 },
      { id: '210', name: 'Elliniko – Syntagma', from: [23.7300, 37.8890], to: [23.7348, 37.9755], headwayMin: 12 },
      { id: '300', name: 'Larissis station – Panathenaic Stadium', from: [23.7208, 37.9920], to: [23.7411, 37.9683], headwayMin: 15 }
    ]
  },

  /* ---- Taxis and on-demand shuttles (synthetic) ----------------------------------------------- */
  // Example fleets. Taxis move along corridors between the ranks; shuttles circulate inside their zones.
  taxis: {
    count: 260,                   // taxis drawn
    speedKmh: 32,
    hiredSharePeak: 0.7, hiredShareDay: 0.5, hiredShareNight: 0.25,   // share of taxis carrying a passenger
    bookingShare: 0.1,            // share driving to a booking
    ranks: [
      { name: 'Syntagma', at: [23.7348, 37.9755], bays: 14 }, { name: 'Omonia', at: [23.7281, 37.9841], bays: 12 }, { name: 'Monastiraki', at: [23.7255, 37.9761], bays: 8 },
      { name: 'Acropolis', at: [23.7257, 37.9690], bays: 8 }, { name: 'Larissis station', at: [23.7208, 37.9920], bays: 12 }, { name: 'Piraeus port', at: [23.6375, 37.9420], bays: 20 },
      { name: 'Kifisia', at: [23.8105, 38.0742], bays: 8 }, { name: 'Marousi', at: [23.7866, 38.0363], bays: 8 }, { name: 'Glyfada', at: [23.7536, 37.8650], bays: 8 },
      { name: 'Airport', at: [23.9445, 37.9364], bays: 30 }
    ]
  },
  shuttles: {
    seats: 12, speedKmh: 24,
    zones: [
      { name: 'Elliniko', at: [23.7300, 37.8890], radiusM: 2400, vehicles: 5, waitMin: 9 },
      { name: 'Marousi and OAKA', at: [23.7866, 38.0363], radiusM: 2400, vehicles: 5, waitMin: 9 },
      { name: 'Zografou campus', at: [23.7820, 37.9780], radiusM: 1800, vehicles: 4, waitMin: 8 },
      { name: 'Kifisia', at: [23.8105, 38.0742], radiusM: 1800, vehicles: 4, waitMin: 7 }
    ]
  },

  /* ---- TomTom live data --------------------------------------------------------------------- */
  // Live traffic tiles, live incidents, live speeds, EV and fuel stations and live route times.
  // The key is published here by the owner's decision: this file is public, so the key can be read by anyone.
  // Keep it restricted to this site's address in the TomTom developer dashboard, with a daily limit.
  // Set key to null to go back to a per-browser key (Reports, TomTom live data).
  // Real live data read from files the "Live data" GitHub Actions workflow publishes on the live-data branch
  // (NASA FIRMS fire detections, N2YO satellite orbits, aisstream.io vessels). The API keys stay in GitHub as
  // repository secrets FIRMS_API_KEY, N2YO_API_KEY, AIS_API_KEY and FLIGHT_RADAR; none is needed here.
  // Greek waters have good AIS coverage: real vessels replace the synthetic ships once enough are heard.
  live: {
    enabled: true,
    baseUrl: 'https://raw.githubusercontent.com/thirumald/AthenaIQ/live-data/',
    refreshMin: 10,              // how often the browser looks for newer files
    ais: true,
    fires: true, vessels: true, satellites: true, flights: true,   // layers on at start
    replaceSyntheticShips: true, // hide the synthetic ships once enough real AIS vessels are loaded
    minVesselsToReplace: 15,     // fewer real vessels than this: keep the synthetic ships as well
    fireAlertMw: 10              // raise an alert for a heat detection in the open region at or above this power
  },

  // OSINT menu: real public feeds (weather, rain and dust forecast, earthquakes, natural events, space weather, fire
  // detections, flights, vessels, satellites, global incidents). It opens as a page of its own with a 3D map.
  // 3D map options for every 3D map: lighting ('auto' follows the clock, or 'morning', 'noon', 'evening', 'night') and
  // the floor view (floors are estimated from building height, one every floorHeightM metres).
  map3d: { lighting: 'auto', floorHeightM: 3.3, maxFloor: 60, floorColor: '#f2a900' },

  // Live camera wall (the camera button beside Scenario and layers). earthStream is an embeddable player address for
  // the "Earth from space" tile: NASA's live stream on YouTube by default; null hides the tile.
  cameraWall: { tilesPerPage: 12, earthStream: 'https://www.youtube.com/embed/live_stream?channel=UCLA_DiR1FfKNvjuUpBHmylQ&autoplay=1&mute=1' },

  // OSINT on the 3D map: the Greece-wide view and how far heights are scaled so that aircraft and satellites can be seen.
  // defaultView: the view the OSINT page opens on: 'region' (city, 3D buildings), 'state' (all of Greece) or 'world'. orbit: circle the camera when the page opens.
  osintMap: { centre: [23.9, 38.3], zoom: 5.7, pitch: 52, bearing: -12, minZoom: 4, heightExaggeration: 6, satelliteHeightScale: 0.2, defaultView: 'region', orbit: true, orbitDegPerSec: 4 },
  // directWeather: when the published weather file is older than 75 minutes, ask Open-Meteo from the browser instead.
  osint: { rainAlertMm: 20, quakeAlertMag: 4.5, quakeAlertKm: 300, heatAlertC: 40, directWeather: true },

  // Critical smart-city use cases added to the existing sections (js/citycases.js). All figures are synthetic or screening estimates.
  cityCases: {
    venues: 10,                 // crowd safety: how many of the region's sites are watched as venues
    schoolZoneM: 200,           // radius of a school zone
    schoolLimitKmh: 40,         // speed limit in a school zone at school time
    conflictM: 2000,            // planned works closer than this with overlapping dates are flagged as a conflict
    development: { tripsPerHome: 7, tripsPerJob: 3, peakHourShare: 0.1, carShare: 0.8, radiusM: 2000, avgTripKmNearby: 3 }
  },

  // Connection check for Google Maps and TomTom (Reports, Connection check; also the two status-bar lights).
  diagnostics: { checkOnStart: true },

  tomtom: { key: 'Pvsf76Td6268Z6caVrXErIOkh6fq526I', flowStyle: 'relative0', flowThickness: 6, flowOnStart: true, incidentRefreshSec: 120, searchRadiusM: 15000, maxSites: 20 },

  /* ---- Ships and aircraft (synthetic) ----------------------------------------------------------- */
  // Example movements. The sea lanes and flight paths are approximate lines for demonstration, not
  // charted channels or published procedures. Paths are [longitude, latitude] points.
  sea: {
    portName: 'Piraeus', port: [23.6375, 37.9420], view: [23.6000, 37.9000], berths: 12, everyMin: 12, wakeSec: 900, namePrefix: 'MV Example',
    lanes: [   // drawn from the port out to sea
      { name: 'Saronic Gulf, south-west lane', path: [[23.6300, 37.9350], [23.6000, 37.9050], [23.5300, 37.8500], [23.4000, 37.7500]] },
      { name: 'Saronic Gulf, southern lane', path: [[23.6350, 37.9330], [23.6500, 37.8900], [23.6800, 37.8000], [23.7200, 37.7000]] },
      { name: 'Salamina strait, western lane', path: [[23.6250, 37.9400], [23.5900, 37.9450], [23.5500, 37.9600], [23.5000, 37.9700]] }
    ],
    types: [
      { kind: 'Ferry', knots: 18, colour: [25, 158, 112] }, { kind: 'Cruise ship', knots: 16, colour: [255, 255, 255] },
      { kind: 'Container ship', knots: 14, colour: [57, 135, 229] }, { kind: 'Tanker', knots: 12, colour: [217, 89, 38] }, { kind: 'Cargo vessel', knots: 9, colour: [201, 133, 0] }
    ]
  },
  air: {
    synthetic: false,           // real flights come from Flightradar24 (see live); true brings the synthetic flights back
    airport: [23.9445, 37.9364], airportName: 'Athens International Airport', movementsPerHour: 30, inViewSec: 420, topAltM: 2600, trailSec: 150, delayedShare: 0.2, flightPrefix: 'FLT',
    cities: ['London', 'Frankfurt', 'Paris', 'Rome', 'Munich', 'Amsterdam', 'Istanbul', 'Dubai', 'Larnaca', 'Thessaloniki', 'Heraklion', 'Rhodes'],
    routes: [   // arrivals end at the airport; departures start there. Runways run north-east – south-west.
      { name: 'Approach from the south-west', arrival: true, path: [[23.7800, 37.7200], [23.8700, 37.8400], [23.9445, 37.9364]] },
      { name: 'Approach from the north-east', arrival: true, path: [[24.1200, 38.1700], [24.0300, 38.0500], [23.9445, 37.9364]] },
      { name: 'Departure to the north-east', arrival: false, path: [[23.9445, 37.9364], [24.0300, 38.0500], [24.1200, 38.1700]] },
      { name: 'Departure to the south-west', arrival: false, path: [[23.9445, 37.9364], [23.8700, 37.8400], [23.7800, 37.7200]] }
    ]
  },

  /* ---- Operations modules (synthetic examples) ------------------------------------------------- */
  incidents: { responseTargetMin: 12 },              // target time from report to a unit on scene
  signalControl: { adaptiveJunctions: 25, progressionKmh: 60, prioritySavingSec: 12 },
  // Planned roadworks and events. Days count from the date on the map (0 = that day). roadIndex picks a
  // major road from the alphabetical list. These are examples, not real permits or events.
  planned: {
    peoplePerCar: 2.5, carShare: 0.6,
    items: [
      { type: 'roadworks', roadIndex: 3, fromDay: 0, toDay: 4, start: '22:00', end: '05:00', lanes: 1 },
      { type: 'roadworks', roadIndex: 9, fromDay: 0, toDay: 1, start: '09:30', end: '15:00', lanes: 1 },
      { type: 'roadworks', roadIndex: 15, fromDay: 2, toDay: 9, start: '21:00', end: '05:00', lanes: 2 },
      { type: 'roadworks', roadIndex: 21, fromDay: 6, toDay: 13, start: '10:00', end: '14:00', lanes: 1 },
      { type: 'event', title: 'Concert at OAKA, Marousi (example)', at: [23.7866, 38.0363], fromDay: 0, toDay: 0, start: '19:00', end: '23:30', attendance: 45000 },
      { type: 'event', title: 'Exhibition at Metropolitan Expo (example)', at: [23.9300, 37.9250], fromDay: 1, toDay: 3, start: '10:00', end: '19:00', attendance: 15000 },
      { type: 'event', title: 'Fun run, Panathenaic Stadium (example)', at: [23.7411, 37.9683], fromDay: 5, toDay: 5, start: '08:00', end: '12:00', attendance: 8000 },
      { type: 'event', title: 'Football at Karaiskakis Stadium, Piraeus (example)', at: [23.6645, 37.9460], fromDay: 3, toDay: 3, start: '19:30', end: '22:00', attendance: 32000 }
    ]
  },
  // Evacuation planning assumptions. Assembly points are example open areas, not designated sites.
  emergency: {
    occupancy: { school: 900, university: 4000, hospital: 600, embassy: 80, government: 400, defence: 500, airport: 12000, police: 120, fire: 40 },
    peoplePerCar: 2.5, peoplePerBus: 40, routeLanes: 2, laneCapacityPerHour: 1500, mobilisationMin: 10,
    // Natural disaster exercises. The areas are examples chosen for demonstration, not surveyed hazard zones.
    peoplePerKm2: 3500,
    disasters: [
      { id: 'flood', name: 'Flash flood after a storm', roadEffect: 'underpasses and low roads closed',
        areas: [{ name: 'Kifissos Avenue, Agios Ioannis Rentis', at: [23.6750, 37.9650], radiusM: 1800 }, { name: 'Poseidonos Avenue at Pikrodafni, Alimos', at: [23.7050, 37.9170], radiusM: 1400 }, { name: 'Piraeus Avenue, Tavros', at: [23.6980, 37.9640], radiusM: 1300 }],
        actions: ['Close flooded underpasses and Kifissos Avenue service roads', 'Send pumps and recovery vehicles to the closed sections', 'Send a 112 message to phones in the area', 'Give signals more green on the diversion routes', 'Check hospitals and schools inside the area for access'] },
      { id: 'fire', name: 'Wildfire near homes', roadEffect: 'roads closed for evacuation and fire engines',
        areas: [{ name: 'Penteli and Dionysos foothills', at: [23.8700, 38.0700], radiusM: 3500 }, { name: 'Parnitha foothills, Acharnes', at: [23.7300, 38.1100], radiusM: 3500 }, { name: 'Varibobi and Tatoi', at: [23.8100, 38.1150], radiusM: 3000 }],
        actions: ['Send a 112 evacuation message to phones in the area', 'Close forest roads and keep evacuation routes one-way outbound', 'Hold traffic at the edge for fire engines and water tankers', 'Open the assembly points away from the fire front', 'Warn drivers on message signs and the motorway operators'] },
      { id: 'surge', name: 'Storm surge on the coast road', roadEffect: 'coastal lanes closed',
        areas: [{ name: 'Poseidonos Avenue, Faliro', at: [23.6800, 37.9330], radiusM: 1500 }, { name: 'Glyfada seafront', at: [23.7450, 37.8700], radiusM: 1500 }, { name: 'Piraeus, Akti Miaouli', at: [23.6420, 37.9400], radiusM: 1200 }],
        actions: ['Close the coastal lanes of Poseidonos Avenue', 'Divert traffic inland via Syngrou and Vouliagmenis avenues', 'Pause ferry boarding at exposed gates', 'Move parked cars off the seafront'] },
      { id: 'sand', name: 'Saharan dust episode', roadEffect: 'reduced visibility, lower speed limits',
        areas: [{ name: 'Attiki Odos near the airport', at: [23.9000, 37.9600], radiusM: 5000 }, { name: 'Kifissos Avenue, north', at: [23.7000, 38.0300], radiusM: 4000 }],
        actions: ['Lower the limit on Attiki Odos and Kifissos Avenue', 'Show low-visibility warnings on message signs', 'Advise people with breathing problems to stay indoors', 'Place patrols at the usual pile-up locations'] },
      { id: 'quake', name: 'Earthquake', roadEffect: 'bridges and underpasses closed until inspected',
        areas: [{ name: 'Athens basin', at: [23.7300, 37.9800], radiusM: 9000 }],
        actions: ['Close bridges and underpasses until inspected', 'Set signals to flashing where power is lost', 'Keep main avenues clear for emergency vehicles', 'Open the assembly points and route people to them', 'Survey critical sites in priority order: hospitals first'] },
      { id: 'heat', name: 'Heatwave', roadEffect: 'no closures, more breakdowns and fires',
        areas: [{ name: 'Whole city', at: [23.7300, 37.9800], radiusM: 18000 }],
        actions: ['Add breakdown patrols on Attiki Odos and Kifissos Avenue', 'Limit roadworks to the early morning', 'Open cooled spaces at metro stations and town halls', 'Raise wildfire readiness on the city edge', 'Watch camera feeds for vehicle and grass fires'] }
    ],
    assemblyPoints: [
      { name: 'Pedion tou Areos park (example)', at: [23.7330, 37.9940] }, { name: 'National Garden, Syntagma (example)', at: [23.7370, 37.9730] },
      { name: 'Panathenaic Stadium (example)', at: [23.7411, 37.9683] }, { name: 'OAKA, Marousi (example)', at: [23.7866, 38.0363] },
      { name: 'SNFCC park, Kallithea (example)', at: [23.6920, 37.9420] }, { name: 'Peace and Friendship Stadium (example)', at: [23.6680, 37.9420] },
      { name: 'Goudi park (example)', at: [23.7700, 37.9840] }
    ]
  },
  parking: {
    violationsPerDay: 900,
    sites: [
      { name: 'Kotzia Square underground car park', at: [23.7275, 37.9810], spaces: 900, kind: 'business' },
      { name: 'Syntagma area car park', at: [23.7350, 37.9770], spaces: 600, kind: 'business' },
      { name: 'Acropolis visitors', at: [23.7230, 37.9700], spaces: 300, kind: 'leisure' },
      { name: 'Piraeus port car park', at: [23.6390, 37.9440], spaces: 1500, kind: 'mixed' },
      { name: 'Larissis station car park', at: [23.7210, 37.9925], spaces: 500, kind: 'mixed' },
      { name: 'The Mall Athens car park', at: [23.7896, 38.0444], spaces: 2500, kind: 'leisure' },
      { name: 'OAKA car park', at: [23.7870, 38.0350], spaces: 3000, kind: 'leisure' },
      { name: 'Kifisia car park', at: [23.8110, 38.0745], spaces: 600, kind: 'business' },
      { name: 'Airport long stay', at: [23.9400, 37.9330], spaces: 4000, kind: 'mixed' },
      { name: 'Kolonaki on-street zone', at: [23.7420, 37.9790], spaces: 420, kind: 'business', street: true },
      { name: 'Koukaki on-street zone', at: [23.7240, 37.9640], spaces: 380, kind: 'residential', street: true },
      { name: 'Glyfada on-street zone', at: [23.7540, 37.8660], spaces: 520, kind: 'leisure', street: true }
    ]
  },
  // Vehicle search uses generated plate reads at the synthetic cameras. Plates here are demo values.
  vehicleSearch: {
    watchList: [
      { plate: 'DEMO-48213', reason: 'Reported stolen (example)' },
      { plate: 'DEMO-10777', reason: 'Unpaid fines (example)' },
      { plate: 'DEMO-66502', reason: 'Vehicle of interest (example)' },
      { plate: 'DEMO-30914', reason: 'No valid registration (example)' }
    ]
  },
  freight: {
    weightLimitT: 2.5, banHours: [[6.5, 9], [15, 18]], nonComplianceShare: 0.06,
    zone: { at: [23.7300, 37.9800], radiusM: 3000 },
    hazmatVehicles: 6, hazmatFrom: [23.5900, 38.0450], hazmatTo: [23.6300, 37.9500],
    weighStations: [
      { name: 'Elefsina toll weigh station (example)', at: [23.5600, 38.0500], perHour: 180 },
      { name: 'Attiki Odos, Metamorfosi (example)', at: [23.7500, 38.0600], perHour: 150 },
      { name: 'Kifissos Avenue checkpoint (example)', at: [23.6900, 38.0200], perHour: 110 }
    ]
  },
  pedestrians: { schoolLimitKmh: 30, schoolWindows: [[6.75, 8, 'Arrival time'], [13, 15, 'Dismissal time']], crossings: 16, peakPerHour: 420 },
  weather: { demo: 'auto' },                         // 'auto', 'clear', 'fog', 'sand' or 'rain'
  assets: { openWorkOrders: 14, slaDays: { P1: 1, P2: 3, P3: 7 } },
  reports: {
    schedules: [
      { name: 'Daily operations summary', every: 'day', at: '06:00', audience: 'control room' },
      { name: 'Weekly traffic and safety report', every: 'week', weekday: 0, at: '07:00', audience: 'department heads' },
      { name: 'Monthly city KPI scorecard', every: 'month', day: 1, at: '08:00', audience: 'leadership' },
      { name: 'Daily city services report', every: 'day', at: '06:30', audience: 'city operations' },
      { name: 'Weekly safety and security report', every: 'week', weekday: 0, at: '07:30', audience: 'police and civil defence' },
      { name: 'Monthly regional comparison', every: 'month', day: 1, at: '09:00', audience: 'planning department' }
    ]
  },

  /* ---- Platform monitoring (synthetic example of a deployed platform) -------------------------- */
  platform: {
    pipelineMs: 900, queueBase: 1200, retentionDays: 30,
    storage: { totalTb: 480, usedTb: 301, perDayTb: 1.9 },
    feeds: [
      { name: 'Traffic detectors', source: 'roadside units', perSec: 520, lagMs: 350, followsTraffic: true },
      { name: 'Video analytics events', source: 'CCTV analytics servers', perSec: 180, lagMs: 800, followsTraffic: true },
      { name: 'Plate reads', source: 'enforcement cameras', perSec: 240, lagMs: 500, followsTraffic: true },
      { name: 'Signal controller status', source: 'traffic signal system', perSec: 80, lagMs: 300 },
      { name: 'Bus positions', source: 'vehicle location system', perSec: 35, lagMs: 1200 },
      { name: 'Taxi positions', source: 'dispatch system', perSec: 130, lagMs: 1500 },
      { name: 'Environmental sensors', source: 'air and noise stations', perSec: 6, lagMs: 2500 },
      { name: 'Weather service', source: 'external service', perSec: 0.4, lagMs: 4000, faultRate: 0.06 },
      { name: 'Incident reports', source: 'control room system', perSec: 0.6, lagMs: 700 },
      { name: 'Vessel positions', source: 'ship tracking receivers', perSec: 12, lagMs: 3000 },
      { name: 'Aircraft positions', source: 'flight tracking receivers', perSec: 45, lagMs: 1500 }
    ],
    nodes: [
      { name: 'ingest-01', role: 'Message broker', cpu: 46, mem: 58, disk: 41, followsLoad: true },
      { name: 'ingest-02', role: 'Message broker', cpu: 43, mem: 55, disk: 39, followsLoad: true },
      { name: 'stream-01', role: 'Stream processing', cpu: 61, mem: 67, disk: 33, followsLoad: true },
      { name: 'gpu-01', role: 'Video analytics', cpu: 52, mem: 71, disk: 48, gpu: 68, followsLoad: true },
      { name: 'gpu-02', role: 'Video analytics', cpu: 49, mem: 69, disk: 47, gpu: 64, followsLoad: true },
      { name: 'db-01', role: 'Database, primary', cpu: 38, mem: 74, disk: 63 },
      { name: 'store-01', role: 'Object storage', cpu: 22, mem: 40, disk: 63 },
      { name: 'app-01', role: 'Application and API', cpu: 34, mem: 52, disk: 28 }
    ],
    services: [
      { name: 'Map and traffic API', ms: 85 }, { name: 'Simulation service', ms: 420 }, { name: 'Alert engine', ms: 60 },
      { name: 'Video gateway', ms: 140 }, { name: 'Sign-in service', ms: 45 }, { name: 'Report service', ms: 310 }
    ]
  },

  /* ---- Integration Studio (data source onboarding and field mapping) --------------------------- */
  // The studio's screens are generated from this metadata: add a connector or an entity here and it
  // appears in the wizard without code changes. Mappings are kept in this browser; nothing is sent
  // to a server. See docs/integration-studio.md.
  integrations: {
    // Where a deployed studio would save, test and publish mappings (GraphQL). Empty: keep everything in the browser.
    apiUrl: '',
    // Connector types. `mode`: polling, streaming or file. `fields` build the connection form.
    connectors: [
      { id: 'rest', name: 'REST API', mode: 'polling', formats: ['json', 'xml', 'csv'], note: 'Calls an HTTP endpoint on a schedule.',
        fields: [{ key: 'url', label: 'Endpoint URL', type: 'url', required: true, placeholder: 'https://vendor.example/api/v1/events' },
          { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST'] }, { key: 'paging', label: 'Paging', type: 'select', options: ['None', 'Page number', 'Cursor', 'Since last timestamp'] }] },
      { id: 'graphql', name: 'GraphQL', mode: 'polling', formats: ['json'], note: 'Runs a query on a schedule.',
        fields: [{ key: 'url', label: 'Endpoint URL', type: 'url', required: true, placeholder: 'https://vendor.example/graphql' }, { key: 'query', label: 'Query', type: 'area', required: true, placeholder: 'query { events(since: $since) { id time } }' }] },
      { id: 'soap', name: 'SOAP', mode: 'polling', formats: ['xml'], note: 'Calls a web-service operation on a schedule.',
        fields: [{ key: 'wsdl', label: 'WSDL URL', type: 'url', required: true, placeholder: 'https://vendor.example/service?wsdl' }, { key: 'operation', label: 'Operation', type: 'text', required: true, placeholder: 'GetEvents' }] },
      { id: 'kafka', name: 'Kafka', mode: 'streaming', formats: ['json'], note: 'Reads messages from a topic as they arrive.',
        fields: [{ key: 'brokers', label: 'Bootstrap servers', type: 'text', required: true, placeholder: 'broker-1:9092, broker-2:9092' }, { key: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'vendor.events' },
          { key: 'group', label: 'Consumer group', type: 'text', placeholder: 'intellitwin-ingest' }, { key: 'offset', label: 'Start from', type: 'select', options: ['Latest', 'Earliest'] }] },
      { id: 'mqtt', name: 'MQTT', mode: 'streaming', formats: ['json', 'csv'], note: 'Subscribes to topics on a broker.',
        fields: [{ key: 'broker', label: 'Broker URL', type: 'text', required: true, placeholder: 'mqtts://broker.example:8883' }, { key: 'topic', label: 'Topic filter', type: 'text', required: true, placeholder: 'roadside/+/readings' }, { key: 'qos', label: 'Quality of service', type: 'select', options: ['0', '1', '2'] }] },
      { id: 'sql', name: 'Database (SQL)', mode: 'polling', formats: ['json'], note: 'Runs a query on a schedule and reads new rows.',
        fields: [{ key: 'engine', label: 'Database', type: 'select', options: ['PostgreSQL', 'SQL Server', 'Oracle', 'MySQL'] }, { key: 'host', label: 'Host and port', type: 'text', required: true, placeholder: 'db.example:5432' },
          { key: 'database', label: 'Database name', type: 'text', required: true }, { key: 'query', label: 'Query or table', type: 'area', required: true, placeholder: 'SELECT * FROM events WHERE updated_at > :last_run' }] },
      { id: 'sftp', name: 'SFTP / file drop', mode: 'file', formats: ['csv', 'json', 'xml'], note: 'Picks up files from a folder.',
        fields: [{ key: 'host', label: 'Host and port', type: 'text', required: true, placeholder: 'sftp.example:22' }, { key: 'path', label: 'Folder', type: 'text', required: true, placeholder: '/outbound/incidents' }, { key: 'pattern', label: 'File name pattern', type: 'text', placeholder: '*.csv' }] },
      { id: 'upload', name: 'File upload', mode: 'file', formats: ['csv', 'json', 'xml'], note: 'A file loaded by hand, for one-off imports.', noAuth: true, fields: [] },
      { id: 'onvif', name: 'ONVIF / RTSP metadata', mode: 'streaming', formats: ['xml', 'json'], note: 'Events and analytics metadata from cameras or a video management system.',
        fields: [{ key: 'host', label: 'Camera or VMS address', type: 'text', required: true, placeholder: '10.20.4.17:80' }, { key: 'profile', label: 'ONVIF profile', type: 'select', options: ['Profile M (metadata)', 'Profile S', 'Profile T'] }, { key: 'topics', label: 'Event topics', type: 'text', placeholder: 'tns1:RuleEngine//.' }] },
      { id: 'socket', name: 'TCP / UDP stream', mode: 'streaming', formats: ['json', 'csv'], note: 'Raw sensor streams, such as radar and LiDAR object lists.',
        fields: [{ key: 'address', label: 'Listen address and port', type: 'text', required: true, placeholder: '0.0.0.0:7100' }, { key: 'transport', label: 'Transport', type: 'select', options: ['UDP', 'TCP'] }, { key: 'framing', label: 'Message framing', type: 'select', options: ['One message per packet', 'Newline', 'Length prefix'] }] },
      { id: 'websocket', name: 'WebSocket', mode: 'streaming', formats: ['json'], note: 'A live stream pushed by the source.',
        fields: [{ key: 'wsUrl', label: 'Stream address', type: 'text', required: true, placeholder: 'wss://sensor-hub.example/stream' }] },
      { id: 'snmp', name: 'SNMP / NTCIP', mode: 'polling', formats: ['json'], note: 'Reads status objects from field equipment: signal controllers, signs, cabinets, network devices.',
        fields: [{ key: 'host', label: 'Device address', type: 'text', required: true, placeholder: '10.30.1.12:161' }, { key: 'version', label: 'Version', type: 'select', options: ['v3', 'v2c'] }, { key: 'objects', label: 'Objects to read (OIDs)', type: 'area', required: true, placeholder: '1.3.6.1.2.1.1.3.0' }] },
      { id: 'modbus', name: 'Modbus TCP', mode: 'polling', formats: ['json', 'csv'], note: 'Reads registers from controllers, power and cabinet equipment.',
        fields: [{ key: 'host', label: 'Device address', type: 'text', required: true, placeholder: '10.30.2.40:502' }, { key: 'unit', label: 'Unit ID', type: 'text', placeholder: '1' }, { key: 'registers', label: 'Register map', type: 'area', required: true, placeholder: '40001 battery_v float\n40003 temp_c float' }] },
      { id: 'opcua', name: 'OPC UA', mode: 'streaming', formats: ['json'], note: 'Subscribes to nodes on an industrial server (tunnels, pumping, building systems).',
        fields: [{ key: 'endpoint', label: 'Endpoint', type: 'text', required: true, placeholder: 'opc.tcp://plc.example:4840' }, { key: 'nodes', label: 'Nodes', type: 'area', required: true, placeholder: 'ns=2;s=Tunnel.Fan1.Speed' }] },
      { id: 'lorawan', name: 'LoRaWAN network server', mode: 'streaming', formats: ['json'], note: 'Uplinks from low-power sensors, delivered by the network server.',
        fields: [{ key: 'server', label: 'Network server', type: 'text', required: true, placeholder: 'lns.example' }, { key: 'application', label: 'Application', type: 'text', required: true, placeholder: 'city-sensors' }] }
    ],
    // How a connection signs in. Only a reference to the secret is kept, never the secret itself.
    authTypes: ['None', 'API key', 'Basic (user and password)', 'OAuth 2.0 client credentials', 'Client certificate (mTLS)'],
    pollEvery: ['10 seconds', '30 seconds', '1 minute', '5 minutes', '15 minutes', '1 hour', '1 day'],
    // The platform's own data model (canonical entities). `key` fields identify a record, for duplicate detection.
    // Field types: string, integer, number, boolean, datetime. `pii` marks personal data.
    entities: [
      { name: 'VehicleDetection', label: 'Vehicle detection', note: 'A vehicle read by a camera: the Search and Fines sections.', key: ['plateNumber', 'timestamp', 'cameraId'], fields: [
        { name: 'plateNumber', type: 'string', required: true, pattern: '[A-Z0-9 ]{2,12}', format: 'upper', pii: true, note: 'Capitals and digits' },
        { name: 'timestamp', type: 'datetime', required: true, note: 'ISO 8601, UTC' }, { name: 'cameraId', type: 'string', required: true },
        { name: 'confidence', type: 'number', min: 0, max: 100, note: 'Percent' }, { name: 'vehicleClass', type: 'string', 'enum': ['Car', 'Taxi', 'Bus', 'Light goods', 'Heavy vehicle', 'Motorcycle', 'Unknown'] },
        { name: 'latitude', type: 'number', min: -90, max: 90 }, { name: 'longitude', type: 'number', min: -180, max: 180 }, { name: 'speedKmh', type: 'number', min: 0, max: 300 },
        { name: 'lane', type: 'integer', min: 1, max: 12 }, { name: 'direction', type: 'string' }] },
      { name: 'TrafficReading', label: 'Traffic reading', note: 'A count from a roadside detector: the Congestion section.', key: ['detectorId', 'timestamp', 'lane'], fields: [
        { name: 'detectorId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'flowVehPerHour', type: 'integer', min: 0, max: 20000 },
        { name: 'speedKmh', type: 'number', min: 0, max: 300 }, { name: 'occupancyPct', type: 'number', min: 0, max: 100 }, { name: 'lane', type: 'integer', min: 1, max: 12 }] },
      { name: 'Incident', label: 'Incident', note: 'A reported incident: the Incidents and Accidents sections.', key: ['incidentId'], fields: [
        { name: 'incidentId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true },
        { name: 'type', type: 'string', required: true, 'enum': ['Accident', 'Breakdown', 'Roadworks', 'Obstruction', 'Flooding', 'Other'] }, { name: 'severity', type: 'string', 'enum': ['Low', 'Medium', 'High', 'Critical'] },
        { name: 'latitude', type: 'number', required: true, min: -90, max: 90 }, { name: 'longitude', type: 'number', required: true, min: -180, max: 180 },
        { name: 'description', type: 'string', maxLength: 500 }, { name: 'status', type: 'string', 'enum': ['Open', 'Acknowledged', 'Closed'] }, { name: 'reportedBy', type: 'string', pii: true }] },
      { name: 'SignalStatus', label: 'Signal status', note: 'The state of a signal junction: the Signals section.', key: ['junctionId', 'timestamp'], fields: [
        { name: 'junctionId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'state', type: 'string', required: true, 'enum': ['Normal', 'Flashing', 'Manual', 'Fault', 'Offline'] },
        { name: 'planId', type: 'string' }, { name: 'phase', type: 'integer', min: 1, max: 16 }, { name: 'cycleSec', type: 'integer', min: 20, max: 300 }] },
      { name: 'TransitPosition', label: 'Transit position', note: 'A bus, taxi or shuttle position: the Transit section.', key: ['vehicleId', 'timestamp'], fields: [
        { name: 'vehicleId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'latitude', type: 'number', required: true, min: -90, max: 90 },
        { name: 'longitude', type: 'number', required: true, min: -180, max: 180 }, { name: 'routeId', type: 'string' }, { name: 'speedKmh', type: 'number', min: 0, max: 200 },
        { name: 'delaySec', type: 'integer' }, { name: 'occupancyPct', type: 'number', min: 0, max: 100 }] },
      { name: 'EnvironmentReading', label: 'Environment reading', note: 'Air quality and noise from a station: the environment layer.', key: ['stationId', 'timestamp'], fields: [
        { name: 'stationId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'pm25', type: 'number', min: 0, max: 2000 }, { name: 'pm10', type: 'number', min: 0, max: 5000 },
        { name: 'no2', type: 'number', min: 0, max: 2000 }, { name: 'noiseDb', type: 'number', min: 0, max: 140 }, { name: 'temperatureC', type: 'number', min: -40, max: 70 }, { name: 'humidityPct', type: 'number', min: 0, max: 100 }] },
      { name: 'VideoEvent', label: 'Video analytics event', note: 'An event raised by camera analytics: stopped vehicle, wrong way, crowd, smoke.', key: ['eventId'], fields: [
        { name: 'eventId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'cameraId', type: 'string', required: true },
        { name: 'eventType', type: 'string', required: true, 'enum': ['Stopped vehicle', 'Wrong way', 'Pedestrian on road', 'Crowd', 'Intrusion', 'Smoke or fire', 'Debris', 'Queue', 'Other'] },
        { name: 'confidence', type: 'number', min: 0, max: 100, note: 'Percent' }, { name: 'objectClass', type: 'string' }, { name: 'latitude', type: 'number', min: -90, max: 90 }, { name: 'longitude', type: 'number', min: -180, max: 180 },
        { name: 'snapshotUrl', type: 'string', pii: true, note: 'Link to the image' }, { name: 'zone', type: 'string' }] },
      { name: 'SpeedMeasurement', label: 'Speed measurement', note: 'One vehicle measured by a radar or an enforcement camera.', key: ['deviceId', 'timestamp', 'lane'], fields: [
        { name: 'deviceId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'speedKmh', type: 'number', required: true, min: 0, max: 400 },
        { name: 'speedLimitKmh', type: 'integer', min: 20, max: 160 }, { name: 'lane', type: 'integer', min: 1, max: 12 }, { name: 'direction', type: 'string' },
        { name: 'vehicleClass', type: 'string', 'enum': ['Car', 'Taxi', 'Bus', 'Light goods', 'Heavy vehicle', 'Motorcycle', 'Unknown'] },
        { name: 'plateNumber', type: 'string', pattern: '[A-Z0-9 ]{2,12}', format: 'upper', pii: true }, { name: 'lengthM', type: 'number', min: 0, max: 40 }] },
      { name: 'ObjectTrack', label: 'Object track', note: 'A tracked road user from LiDAR, tracking radar or video: position, speed and size at one instant.', key: ['sensorId', 'trackId', 'timestamp'], fields: [
        { name: 'sensorId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'trackId', type: 'string', required: true, tag: false },
        { name: 'objectClass', type: 'string', required: true, 'enum': ['Car', 'Truck', 'Bus', 'Motorcycle', 'Bicycle', 'Pedestrian', 'Unknown'] },
        { name: 'x', type: 'number', note: 'Metres from the sensor' }, { name: 'y', type: 'number', note: 'Metres from the sensor' }, { name: 'latitude', type: 'number', min: -90, max: 90 }, { name: 'longitude', type: 'number', min: -180, max: 180 },
        { name: 'speedKmh', type: 'number', min: 0, max: 400 }, { name: 'headingDeg', type: 'number', min: 0, max: 360 }, { name: 'lengthM', type: 'number', min: 0, max: 40 }, { name: 'widthM', type: 'number', min: 0, max: 10 },
        { name: 'heightM', type: 'number', min: 0, max: 10 }, { name: 'zone', type: 'string' }] },
      { name: 'SensorReading', label: 'Sensor reading (generic IoT)', note: 'One measurement from any sensor: the catch-all for IoT devices without an entity of their own.', key: ['deviceId', 'metric', 'timestamp'], fields: [
        { name: 'deviceId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'metric', type: 'string', required: true, tag: true }, { name: 'value', type: 'number', required: true },
        { name: 'unit', type: 'string' }, { name: 'quality', type: 'string', 'enum': ['Good', 'Suspect', 'Bad'] }, { name: 'batteryPct', type: 'number', min: 0, max: 100 }] },
      { name: 'DeviceHealth', label: 'Device health', note: 'Status of a field device: the Devices section and maintenance.', key: ['deviceId', 'timestamp'], fields: [
        { name: 'deviceId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'status', type: 'string', required: true, 'enum': ['Online', 'Degraded', 'Offline', 'Maintenance'] },
        { name: 'deviceType', type: 'string' }, { name: 'uptimeSec', type: 'integer', min: 0 }, { name: 'temperatureC', type: 'number', min: -40, max: 120 }, { name: 'voltageV', type: 'number', min: 0, max: 500 },
        { name: 'signalDbm', type: 'number', min: -140, max: 0 }, { name: 'cpuPct', type: 'number', min: 0, max: 100 }, { name: 'storagePct', type: 'number', min: 0, max: 100 }, { name: 'firmware', type: 'string' },
        { name: 'lastError', type: 'string', maxLength: 200 }] },
      { name: 'ParkingOccupancy', label: 'Parking occupancy', note: 'A bay or a facility count: the Parking section.', key: ['facilityId', 'bayId', 'timestamp'], fields: [
        { name: 'facilityId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'bayId', type: 'string' }, { name: 'occupied', type: 'boolean' },
        { name: 'occupiedBays', type: 'integer', min: 0 }, { name: 'totalBays', type: 'integer', min: 0 }, { name: 'batteryPct', type: 'number', min: 0, max: 100 }] },
      { name: 'WeatherReading', label: 'Road weather reading', note: 'A road weather station observation.', key: ['stationId', 'timestamp'], fields: [
        { name: 'stationId', type: 'string', required: true }, { name: 'timestamp', type: 'datetime', required: true }, { name: 'airTempC', type: 'number', min: -40, max: 70 }, { name: 'roadTempC', type: 'number', min: -40, max: 90 },
        { name: 'humidityPct', type: 'number', min: 0, max: 100 }, { name: 'windSpeedKmh', type: 'number', min: 0, max: 300 }, { name: 'windDirDeg', type: 'number', min: 0, max: 360 }, { name: 'visibilityM', type: 'number', min: 0 },
        { name: 'rainMmPerHour', type: 'number', min: 0, max: 500 }, { name: 'roadCondition', type: 'string', 'enum': ['Dry', 'Wet', 'Flooded', 'Sand', 'Fog'] }] }
    ],
    // Device types the studio can onboard. Choosing one presets the connector, the target entity and an example
    // payload. `connectors` lists the usual ways that device delivers data, most common first. The payloads are invented.
    devices: [
      { id: 'anpr', name: 'ANPR / plate-reading camera', cat: 'Cameras', connectors: ['rest', 'kafka', 'onvif'], entity: 'VehicleDetection', format: 'json',
        sample: '[{"plate":"IKA1234","time":"2026-11-17T06:10:22+02:00","camera_id":"CAM-0012","confidence":96.4,"class":"Car","lat":37.9539,"lon":23.7773,"speed":62,"lane":2},{"plate":"YHN8802","time":"2026-11-17T06:10:24+02:00","camera_id":"CAM-0012","confidence":91.2,"class":"Taxi","lat":37.9539,"lon":23.7773,"speed":58,"lane":1}]' },
      { id: 'cctv', name: 'CCTV with video analytics', cat: 'Cameras', connectors: ['kafka', 'onvif', 'mqtt', 'rest'], entity: 'VideoEvent', format: 'json',
        sample: '[{"event_id":"EV-88120","ts":"2026-11-17T06:11:02+02:00","camera":"CCTV-0231","type":"stopped_vehicle","score":0.91,"object":"car","lat":37.9667,"lon":23.7667,"snapshot":"https://vms.example/snap/88120.jpg","zone":"Lane 2"},{"event_id":"EV-88121","ts":"2026-11-17T06:11:40+02:00","camera":"CCTV-0102","type":"wrong_way","score":0.84,"object":"car","lat":37.931,"lon":23.741,"snapshot":"https://vms.example/snap/88121.jpg","zone":"Slip road"}]' },
      { id: 'thermal', name: 'Thermal camera', cat: 'Cameras', connectors: ['onvif', 'mqtt', 'rest'], entity: 'VideoEvent', format: 'json',
        sample: '[{"event_id":"TH-2201","ts":"2026-11-17T06:14:10+02:00","camera":"THM-T2-04","type":"fire","score":0.88,"object":"vehicle","zone":"Tunnel bore 2"},{"event_id":"TH-2202","ts":"2026-11-17T06:15:31+02:00","camera":"THM-T2-07","type":"pedestrian","score":0.79,"object":"person","zone":"Tunnel bore 2"}]' },
      { id: 'enforcement', name: 'Speed and red-light enforcement camera', cat: 'Cameras', connectors: ['rest', 'sftp', 'kafka'], entity: 'SpeedMeasurement', format: 'json',
        sample: '[{"site":"ENF-ATT-04","captured":"17/11/2026 06:12:40","speed_kmh":147,"limit_kmh":120,"lane":3,"plate":"IPT5521","veh_class":"Car","direction":"Southbound"},{"site":"ENF-ATT-04","captured":"17/11/2026 06:13:05","speed_kmh":133,"limit_kmh":120,"lane":2,"plate":"SHJ 4410","veh_class":"Car","direction":"Southbound"}]' },
      { id: 'speed-radar', name: 'Speed radar', cat: 'Radar and LiDAR', connectors: ['rest', 'socket', 'mqtt'], entity: 'SpeedMeasurement', format: 'json',
        sample: '[{"radar":"RAD-07","t":"2026-11-17T06:12:03+02:00","kmh":138.4,"limit":120,"lane":2,"dir":"NB","cls":"car","len_m":4.6},{"radar":"RAD-07","t":"2026-11-17T06:12:04+02:00","kmh":96.0,"limit":120,"lane":1,"dir":"NB","cls":"truck","len_m":11.8}]' },
      { id: 'traffic-radar', name: 'Traffic counting radar', cat: 'Radar and LiDAR', connectors: ['mqtt', 'socket', 'rest'], entity: 'TrafficReading', format: 'json',
        sample: '[{"unit":"TR-112","ts":1794881400,"lane":1,"volume":1320,"avg_speed":84.2,"occupancy":14.6},{"unit":"TR-112","ts":1794881400,"lane":2,"volume":1188,"avg_speed":79.5,"occupancy":16.1}]' },
      { id: 'lidar', name: 'LiDAR sensor', cat: 'Radar and LiDAR', connectors: ['socket', 'websocket', 'kafka'], entity: 'ObjectTrack', format: 'json',
        sample: '{"sensor":"LID-J12","frame_ts":1794881400123,"objects":[{"id":4411,"cls":"pedestrian","x":12.4,"y":-3.1,"speed_ms":1.4,"heading":92,"l":0.6,"w":0.6,"h":1.7,"zone":"Crossing N"},{"id":4412,"cls":"car","x":-8.2,"y":15.9,"speed_ms":9.8,"heading":181,"l":4.5,"w":1.9,"h":1.5,"zone":"Approach E"},{"id":4413,"cls":"bicycle","x":3.3,"y":7.0,"speed_ms":4.9,"heading":178,"l":1.8,"w":0.6,"h":1.6,"zone":"Approach E"}]}' },
      { id: 'tracking-radar', name: 'Tracking radar (junction or perimeter)', cat: 'Radar and LiDAR', connectors: ['socket', 'websocket', 'kafka'], entity: 'ObjectTrack', format: 'json',
        sample: '{"radar":"RDR-P03","time":"2026-11-17T06:12:05.250+02:00","tracks":[{"track":88,"class":"Truck","lat":37.9281,"lon":23.7372,"speed_kmh":71,"heading_deg":14,"length_m":12.5},{"track":91,"class":"Car","lat":37.9283,"lon":23.7369,"speed_kmh":64,"heading_deg":193,"length_m":4.4}]}' },
      { id: 'loop', name: 'Loop or detector station', cat: 'Traffic field equipment', connectors: ['mqtt', 'snmp', 'rest'], entity: 'TrafficReading', format: 'json',
        sample: '[{"det":"DET-014","ts":1794881400,"q":1260,"v":71.5,"occ":18.2,"lane":1},{"det":"DET-014","ts":1794881400,"q":1104,"v":66.0,"occ":21.7,"lane":2}]' },
      { id: 'signal', name: 'Signal controller', cat: 'Traffic field equipment', connectors: ['snmp', 'rest', 'soap'], entity: 'SignalStatus', format: 'json',
        sample: '[{"junction":"J-12","time":"2026-11-17T06:00:00+02:00","mode":"Normal","plan":"P3","phase":2,"cycle":90},{"junction":"J-15","time":"2026-11-17T06:00:05+02:00","mode":"Flashing","plan":"P1","phase":1,"cycle":120}]' },
      { id: 'vms', name: 'Variable message sign', cat: 'Traffic field equipment', connectors: ['snmp', 'rest'], entity: 'DeviceHealth', format: 'json',
        sample: '[{"sign":"VMS-E11-03","polled":"2026-11-17T06:10:00+02:00","state":"Online","type":"Variable message sign","temp_c":41.5,"fw":"3.2.1","last_error":""},{"sign":"VMS-E11-07","polled":"2026-11-17T06:10:00+02:00","state":"Degraded","type":"Variable message sign","temp_c":58.9,"fw":"3.2.1","last_error":"Pixel faults: 14"}]' },
      { id: 'air', name: 'Air quality and noise station', cat: 'IoT sensors', connectors: ['mqtt', 'lorawan', 'rest'], entity: 'EnvironmentReading', format: 'json',
        sample: '[{"station":"AQ-03","time":"2026-11-17T06:00:00+02:00","pm2_5":38.2,"pm10":91.0,"no2":44.1,"noise_db":66.3,"temp_c":27.4,"rh":58},{"station":"AQ-07","time":"2026-11-17T06:00:00+02:00","pm2_5":52.9,"pm10":120.4,"no2":61.0,"noise_db":71.8,"temp_c":27.9,"rh":55}]' },
      { id: 'weather', name: 'Road weather station', cat: 'IoT sensors', connectors: ['rest', 'mqtt'], entity: 'WeatherReading', format: 'json',
        sample: '[{"station_id":"RWIS-07","obs_time":"2026-11-17T06:00:00+02:00","air_temp":27.1,"road_temp":29.8,"humidity":61,"wind_speed":14,"wind_dir":310,"visibility":8000,"rain_mm_h":0,"road_condition":"Dry"},{"station_id":"RWIS-09","obs_time":"2026-11-17T06:00:00+02:00","air_temp":26.4,"road_temp":28.9,"humidity":83,"wind_speed":6,"wind_dir":295,"visibility":350,"rain_mm_h":0,"road_condition":"Fog"}]' },
      { id: 'parking', name: 'Parking bay sensor', cat: 'IoT sensors', connectors: ['lorawan', 'mqtt', 'rest'], entity: 'ParkingOccupancy', format: 'json',
        sample: '[{"dev_eui":"70B3D57ED0051A2C","received_at":"2026-11-17T02:09:41Z","facility":"PK-SYNTAGMA-2","bay":"B-114","occupied":true,"battery":87},{"dev_eui":"70B3D57ED0051A2D","received_at":"2026-11-17T02:09:55Z","facility":"PK-SYNTAGMA-2","bay":"B-115","occupied":false,"battery":91}]' },
      { id: 'streetlight', name: 'Smart streetlight controller', cat: 'IoT sensors', connectors: ['lorawan', 'mqtt', 'rest'], entity: 'SensorReading', format: 'json',
        sample: '[{"device":"SL-4471","ts":"2026-11-17T06:10:00+02:00","metric":"power_w","value":86.5,"unit":"W","quality":"Good"},{"device":"SL-4472","ts":"2026-11-17T06:10:00+02:00","metric":"power_w","value":0,"unit":"W","quality":"Suspect"}]' },
      { id: 'flood', name: 'Water level and flood sensor', cat: 'IoT sensors', connectors: ['lorawan', 'mqtt'], entity: 'SensorReading', format: 'json',
        sample: '[{"device":"WL-09","ts":"2026-11-17T06:10:00+02:00","metric":"water_level_cm","value":3.2,"unit":"cm","battery":78},{"device":"WL-12","ts":"2026-11-17T06:10:00+02:00","metric":"water_level_cm","value":0.4,"unit":"cm","battery":64}]' },
      { id: 'iot', name: 'Other IoT sensor', cat: 'IoT sensors', connectors: ['mqtt', 'lorawan', 'opcua', 'modbus', 'rest'], entity: 'SensorReading', format: 'json',
        sample: '[{"device":"TUN-FAN-01","ts":"2026-11-17T06:10:00+02:00","metric":"fan_speed_rpm","value":1180,"unit":"rpm","quality":"Good"},{"device":"TUN-CO-03","ts":"2026-11-17T06:10:00+02:00","metric":"co_ppm","value":7.5,"unit":"ppm","quality":"Good"}]' },
      { id: 'avl', name: 'Bus and fleet tracker (GPS)', cat: 'Vehicles', connectors: ['kafka', 'websocket', 'rest'], entity: 'TransitPosition', format: 'json',
        sample: '[{"vehicle":"BUS-2231","route":"054","gps_time":"2026-11-17T06:12:00+02:00","lat":37.9702,"lon":23.7711,"speed":34,"delay_s":95,"occupancy":62},{"vehicle":"BUS-2260","route":"032","gps_time":"2026-11-17T06:12:02+02:00","lat":37.9488,"lon":23.7954,"speed":0,"delay_s":-20,"occupancy":41}]' },
      { id: 'health', name: 'Device health (cameras, radars, network)', cat: 'Infrastructure health', connectors: ['snmp', 'rest', 'mqtt'], entity: 'DeviceHealth', format: 'json',
        sample: '[{"device_id":"CAM-0012","type":"ANPR camera","polled_at":"2026-11-17T06:10:00+02:00","status":"Online","uptime_s":1843200,"temp_c":48.2,"cpu":37,"storage":61,"firmware":"7.4.2","signal":-67},{"device_id":"RAD-07","type":"Speed radar","polled_at":"2026-11-17T06:10:00+02:00","status":"Degraded","uptime_s":86400,"temp_c":63.5,"cpu":88,"storage":40,"firmware":"2.1.0","signal":-81,"last_error":"Heater fault"}]' },
      { id: 'cabinet', name: 'Cabinet, power and UPS', cat: 'Infrastructure health', connectors: ['modbus', 'snmp'], entity: 'DeviceHealth', format: 'json',
        sample: '[{"cabinet":"CAB-J12","ts":"2026-11-17T06:10:00+02:00","state":"Online","type":"Roadside cabinet","voltage":26.8,"temp_c":44.0},{"cabinet":"CAB-J15","ts":"2026-11-17T06:10:00+02:00","state":"Degraded","type":"Roadside cabinet","voltage":22.1,"temp_c":57.3,"last_error":"On battery"}]' },
      { id: 'cad', name: 'Control room or incident system', cat: 'Systems', connectors: ['sftp', 'rest', 'sql', 'soap'], entity: 'Incident', format: 'csv',
        sample: 'Incident Ref;Reported;Category;Priority;Lat;Lon;Details;State\nINC-2026-118204;17/11/2026 05:42;Accident;Critical;37.9667;23.7667;Two vehicles, lane 2 blocked;Open\nINC-2026-118205;17/11/2026 05:51;Breakdown;Medium;37.9310;23.7410;Stalled lorry on hard shoulder;Acknowledged' }
    ],
    // Where mapped records are kept. Every entity is time-stamped, so each lands in a time-series table.
    // No database runs in this demonstrator: the studio shows the design and generates the table definitions.
    storage: {
      engine: 'TimescaleDB on PostgreSQL',                 // the SQL shown is written for this engine
      alternatives: 'InfluxDB, ClickHouse or QuestDB would hold the same model',
      retention: '90 days', retentionChoices: ['7 days', '30 days', '90 days', '1 year', '3 years', '5 years'],
      rollups: ['5 minutes', '1 hour', '1 day'], rollupChoices: ['1 minute', '5 minutes', '15 minutes', '1 hour', '1 day'],
      compressAfter: '7 days',
      compression: 10,                                     // assumed compression ratio, for the size estimate only
      // Per entity: keep raw records for less or more time than the default.
      entity: { ObjectTrack: { retention: '7 days', rollups: ['1 minute', '15 minutes', '1 hour'] }, VehicleDetection: { retention: '30 days' }, Incident: { retention: '5 years', rollups: ['1 day'] }, DeviceHealth: { retention: '1 year', rollups: ['1 hour', '1 day'] } }
    },
    // Reports, analytics and machine-learning use cases the mapped data can feed. `needs` lists the entity
    // fields each one requires; the studio checks them against the published mappings. Nothing is trained or run here.
    analytics: [
      { name: 'Daily traffic report', kind: 'Report', grain: '1 hour', needs: [{ entity: 'TrafficReading', fields: ['detectorId', 'flowVehPerHour', 'speedKmh'] }], method: 'Hourly and daily rollups by detector and corridor.', output: 'Volumes, average speeds, peak hours', section: 'Reports' },
      { name: 'Device availability report', kind: 'Report', grain: '1 day', needs: [{ entity: 'DeviceHealth', fields: ['deviceId', 'status'] }], method: 'Share of time each device was online, by type and site.', output: 'Availability against the service level', section: 'Devices, Reports' },
      { name: 'Enforcement summary', kind: 'Report', grain: '1 day', needs: [{ entity: 'SpeedMeasurement', fields: ['deviceId', 'speedKmh', 'speedLimitKmh'] }], method: 'Counts of measurements over the limit by site, lane and hour.', output: 'Violations by site and time band', section: 'Fines' },
      { name: 'Short-term congestion forecast', kind: 'Predictive', grain: '5 minutes', needs: [{ entity: 'TrafficReading', fields: ['detectorId', 'flowVehPerHour', 'speedKmh', 'occupancyPct'] }, { entity: 'WeatherReading', fields: ['rainMmPerHour', 'visibilityM'], optional: true }], method: 'Gradient-boosted trees or a temporal neural network on lagged flow, speed and occupancy, with time of day and weather.', output: 'Speed and flow 15 to 60 minutes ahead, per corridor', section: 'Congestion, Prediction' },
      { name: 'Automatic incident detection', kind: 'Anomaly detection', grain: '1 minute', needs: [{ entity: 'TrafficReading', fields: ['detectorId', 'speedKmh', 'occupancyPct'] }, { entity: 'VideoEvent', fields: ['cameraId', 'eventType'], optional: true }], method: 'Sudden speed drop and occupancy rise between neighbouring detectors, confirmed by camera events.', output: 'Incident alerts with location and confidence', section: 'Incidents' },
      { name: 'Incident clearance time prediction', kind: 'Predictive', grain: 'per incident', needs: [{ entity: 'Incident', fields: ['incidentId', 'type', 'severity', 'latitude', 'longitude', 'status'] }], method: 'Survival or regression model on incident type, severity, place and time.', output: 'Expected time to clear, for diversion planning', section: 'Incidents' },
      { name: 'Accident risk hot spots', kind: 'Predictive', grain: '1 hour', needs: [{ entity: 'Incident', fields: ['type', 'latitude', 'longitude'] }, { entity: 'SpeedMeasurement', fields: ['deviceId', 'speedKmh'] }, { entity: 'WeatherReading', fields: ['roadCondition'], optional: true }], method: 'Space-time risk scoring from past incidents, speed distribution and road weather.', output: 'Risk score by road section and hour', section: 'Accidents' },
      { name: 'Journey time and origin-destination flows', kind: 'Analytics', grain: '15 minutes', needs: [{ entity: 'VehicleDetection', fields: ['plateNumber', 'cameraId'] }], method: 'Matching the same plate between cameras; plates are hashed before analysis.', output: 'Journey times and movements between camera sites', section: 'Search, Congestion' },
      { name: 'Near-miss and conflict analysis', kind: 'Analytics', grain: 'per track', needs: [{ entity: 'ObjectTrack', fields: ['sensorId', 'trackId', 'objectClass', 'x', 'y', 'speedKmh'] }], method: 'Surrogate safety measures (time to collision, post-encroachment time) from LiDAR and radar trajectories.', output: 'Conflict counts by junction arm and road-user type', section: 'Pedestrians, Accidents' },
      { name: 'Adaptive signal timing', kind: 'Optimisation', grain: '1 cycle', needs: [{ entity: 'SignalStatus', fields: ['junctionId', 'state', 'cycleSec'] }, { entity: 'TrafficReading', fields: ['detectorId', 'flowVehPerHour'] }, { entity: 'ObjectTrack', fields: ['sensorId', 'objectClass'], optional: true }], method: 'Demand-responsive optimisation or reinforcement learning on approach flows and queues.', output: 'Recommended splits and offsets per junction', section: 'Signals' },
      { name: 'Predictive maintenance of field devices', kind: 'Predictive', grain: '1 hour', needs: [{ entity: 'DeviceHealth', fields: ['deviceId', 'status', 'temperatureC', 'uptimeSec'] }], method: 'Failure-risk classifier or survival model on temperature, restarts, errors and age.', output: 'Devices likely to fail in the next 7 to 30 days', section: 'Devices' },
      { name: 'Sensor data quality monitoring', kind: 'Anomaly detection', grain: '5 minutes', needs: [{ entity: 'SensorReading', fields: ['deviceId', 'metric', 'value'] }], method: 'Stuck-value, drift and outlier detection per sensor and metric.', output: 'Suspect sensors and readings to exclude', section: 'Platform' },
      { name: 'Parking demand forecast', kind: 'Predictive', grain: '15 minutes', needs: [{ entity: 'ParkingOccupancy', fields: ['facilityId', 'occupied'] }], method: 'Seasonal time-series model per facility with events and time of day.', output: 'Free bays 30 to 120 minutes ahead', section: 'Parking' },
      { name: 'Air quality and noise forecast', kind: 'Predictive', grain: '1 hour', needs: [{ entity: 'EnvironmentReading', fields: ['stationId', 'pm25', 'no2'] }, { entity: 'TrafficReading', fields: ['flowVehPerHour'], optional: true }, { entity: 'WeatherReading', fields: ['windSpeedKmh'], optional: true }], method: 'Regression on traffic volume, wind and past readings.', output: 'Pollutant and noise levels for the next 24 hours', section: 'Environment' },
      { name: 'Bus arrival prediction', kind: 'Predictive', grain: '1 minute', needs: [{ entity: 'TransitPosition', fields: ['vehicleId', 'routeId', 'latitude', 'longitude', 'delaySec'] }], method: 'Travel-time model per route segment from recent vehicle positions.', output: 'Arrival times at stops, bunching alerts', section: 'Transit' }
    ],
    // Example integrations shown on first use. The vendors, endpoints and payloads are invented.
    seed: [
      { id: 'anpr-vendor', name: 'ANPR Vendor', device: 'anpr', connector: 'rest', entity: 'VehicleDetection', status: 'draft', format: 'json', ratePerSec: 240,
        config: { url: 'https://anpr-vendor.example/api/v2/reads', method: 'GET', paging: 'Since last timestamp' }, auth: { type: 'API key', ref: 'vault://athenaiq/anpr-vendor/api-key' }, every: '10 seconds',
        sample: '{\n  "vendor": "ANPR Vendor",\n  "count": 6,\n  "events": [\n    { "plate_no": "ika1234", "capture_time": "17/11/2026 06:10:22", "device_code": "CAM-0012", "confidence_score": 96.4, "vehicle_type": "car", "location": { "lat": 37.9539, "lon": 23.7773 }, "speed": 62, "lane": 2 },\n    { "plate_no": "yhn8802", "capture_time": "17/11/2026 06:10:24", "device_code": "CAM-0012", "confidence_score": 91.2, "vehicle_type": "taxi", "location": { "lat": 37.9539, "lon": 23.7773 }, "speed": 58, "lane": 1 },\n    { "plate_no": "ZKE7041", "capture_time": "17/11/2026 06:10:31", "device_code": "CAM-0047", "confidence_score": 88.75, "vehicle_type": "truck", "location": { "lat": 37.9281, "lon": 23.7372 }, "speed": 74, "lane": 3 },\n    { "plate_no": "ibm5120", "capture_time": "17/11/2026 06:10:40", "device_code": "CAM-0047", "confidence_score": 79.1, "vehicle_type": "bus", "location": { "lat": 37.9281, "lon": 23.7372 }, "speed": 51, "lane": 3 },\n    { "plate_no": "xkp3097", "capture_time": "17/11/2026 06:10:44", "device_code": "CAM-0103", "confidence_score": 93.0, "vehicle_type": "pickup", "location": { "lat": 37.9912, "lon": 23.7606 }, "speed": 66, "lane": 1 },\n    { "plate_no": "ika1234", "capture_time": "17/11/2026 06:10:22", "device_code": "CAM-0012", "confidence_score": 96.4, "vehicle_type": "car", "location": { "lat": 37.9539, "lon": 23.7773 }, "speed": 62, "lane": 2 }\n  ]\n}',
        rules: [
          { sourcePath: 'plate_no', targetPath: 'plateNumber', transform: 'uppercase', required: true },
          { sourcePath: 'capture_time', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'dd/MM/yyyy HH:mm:ss', tz: '+02:00' }, required: true },
          { sourcePath: 'device_code', targetPath: 'cameraId', transform: 'direct', required: true },
          { sourcePath: 'confidence_score', targetPath: 'confidence', transform: 'toDecimal', args: { decimals: 1 } },
          { sourcePath: 'vehicle_type', targetPath: 'vehicleClass', transform: 'lookup', args: { table: 'car=Car\ntaxi=Taxi\nbus=Bus\nvan=Light goods\ntruck=Heavy vehicle\nmotorbike=Motorcycle', fallback: '' } }
        ] },
      { id: 'roadside-detectors', name: 'Roadside detectors', device: 'loop', connector: 'mqtt', entity: 'TrafficReading', status: 'published', format: 'json', ratePerSec: 520, platformFeed: 'Traffic detectors',
        config: { broker: 'mqtts://roadside-broker.example:8883', topic: 'roadside/+/readings', qos: '1' }, auth: { type: 'Client certificate (mTLS)', ref: 'vault://athenaiq/roadside/client-cert' },
        sample: '[\n  { "det": "DET-014", "ts": 1794881400, "q": 1260, "v": 71.5, "occ": 18.2, "lane": 1 },\n  { "det": "DET-014", "ts": 1794881400, "q": 1104, "v": 66.0, "occ": 21.7, "lane": 2 },\n  { "det": "DET-022", "ts": 1794881400, "q": 1832, "v": 38.4, "occ": 44.9, "lane": 1 },\n  { "det": "DET-031", "ts": 1794881460, "q": 640, "v": 92.3, "occ": 7.5, "lane": 1 }\n]',
        rules: [
          { sourcePath: 'det', targetPath: 'detectorId', transform: 'direct', required: true },
          { sourcePath: 'ts', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'epoch-s', tz: '+00:00' }, required: true },
          { sourcePath: 'q', targetPath: 'flowVehPerHour', transform: 'toInteger' }, { sourcePath: 'v', targetPath: 'speedKmh', transform: 'toDecimal', args: { decimals: 1 } },
          { sourcePath: 'occ', targetPath: 'occupancyPct', transform: 'toDecimal', args: { decimals: 1 } }, { sourcePath: 'lane', targetPath: 'lane', transform: 'direct' }
        ] },
      { id: 'control-room-incidents', name: 'Control room incidents', device: 'cad', connector: 'sftp', entity: 'Incident', status: 'published', format: 'csv', ratePerSec: 0.6, platformFeed: 'Incident reports',
        config: { host: 'sftp.control-room.example:22', path: '/outbound/incidents', pattern: 'incidents_*.csv' }, auth: { type: 'Basic (user and password)', ref: 'vault://athenaiq/control-room/sftp' }, every: '1 minute',
        sample: 'Incident Ref;Reported;Category;Priority;Lat;Lon;Details;State\nINC-2026-118204;17/11/2026 05:42;RTA;P1;37.9667;23.7667;Two vehicles, lane 2 blocked;OPEN\nINC-2026-118205;17/11/2026 05:51;BRK;P3;37.9310;23.7410;Stalled lorry on hard shoulder;ACK\nINC-2026-118206;17/11/2026 06:03;OBS;P2;37.9895;23.7582;Debris in lane 1;OPEN\nINC-2026-118207;17/11/2026 06:15;RWK;P4;37.9532;23.7901;Night works overrun;CLOSED',
        rules: [
          { sourcePath: 'Incident Ref', targetPath: 'incidentId', transform: 'direct', required: true },
          { sourcePath: 'Reported', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'dd/MM/yyyy HH:mm', tz: '+02:00' }, required: true },
          { sourcePath: 'Category', targetPath: 'type', transform: 'lookup', args: { table: 'RTA=Accident\nBRK=Breakdown\nRWK=Roadworks\nOBS=Obstruction\nFLD=Flooding', fallback: 'Other' }, required: true },
          { sourcePath: 'Priority', targetPath: 'severity', transform: 'lookup', args: { table: 'P1=Critical\nP2=High\nP3=Medium\nP4=Low', fallback: '' } },
          { sourcePath: 'Lat', targetPath: 'latitude', transform: 'toDecimal', args: { decimals: 5 }, required: true }, { sourcePath: 'Lon', targetPath: 'longitude', transform: 'toDecimal', args: { decimals: 5 }, required: true },
          { sourcePath: 'Details', targetPath: 'description', transform: 'trim' },
          { sourcePath: 'State', targetPath: 'status', transform: 'lookup', args: { table: 'OPEN=Open\nACK=Acknowledged\nCLOSED=Closed', fallback: '' } }
        ] },
      { id: 'speed-radars', name: 'Speed radar network', device: 'speed-radar', connector: 'rest', entity: 'SpeedMeasurement', status: 'published', format: 'json', ratePerSec: 95,
        config: { url: 'https://radar-vendor.example/api/measurements', method: 'GET', paging: 'Cursor' }, auth: { type: 'OAuth 2.0 client credentials', ref: 'vault://athenaiq/radar-vendor/oauth' }, every: '10 seconds',
        sample: '[\n  { "radar": "RAD-07", "t": "2026-11-17T06:12:03+02:00", "kmh": 138.4, "limit": 120, "lane": 2, "dir": "NB", "cls": "car", "len_m": 4.6 },\n  { "radar": "RAD-07", "t": "2026-11-17T06:12:04+02:00", "kmh": 96.0, "limit": 120, "lane": 1, "dir": "NB", "cls": "truck", "len_m": 11.8 },\n  { "radar": "RAD-11", "t": "2026-11-17T06:12:04+02:00", "kmh": 151.9, "limit": 140, "lane": 3, "dir": "SB", "cls": "car", "len_m": 4.9 },\n  { "radar": "RAD-11", "t": "2026-11-17T06:12:07+02:00", "kmh": 88.3, "limit": 140, "lane": 1, "dir": "SB", "cls": "bus", "len_m": 12.0 }\n]',
        rules: [
          { sourcePath: 'radar', targetPath: 'deviceId', transform: 'direct', required: true }, { sourcePath: 't', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'auto', tz: '+02:00' }, required: true },
          { sourcePath: 'kmh', targetPath: 'speedKmh', transform: 'toDecimal', args: { decimals: 1 }, required: true }, { sourcePath: 'limit', targetPath: 'speedLimitKmh', transform: 'toInteger' }, { sourcePath: 'lane', targetPath: 'lane', transform: 'direct' },
          { sourcePath: 'dir', targetPath: 'direction', transform: 'lookup', args: { table: 'NB=Northbound\nSB=Southbound\nEB=Eastbound\nWB=Westbound', fallback: '' } },
          { sourcePath: 'cls', targetPath: 'vehicleClass', transform: 'lookup', args: { table: 'car=Car\ntaxi=Taxi\nbus=Bus\nvan=Light goods\ntruck=Heavy vehicle\nmotorbike=Motorcycle', fallback: 'Unknown' } },
          { sourcePath: 'len_m', targetPath: 'lengthM', transform: 'toDecimal', args: { decimals: 1 } }
        ] },
      { id: 'junction-lidar', name: 'Junction LiDAR', device: 'lidar', connector: 'socket', entity: 'ObjectTrack', status: 'draft', format: 'json', ratePerSec: 900,
        config: { address: '0.0.0.0:7100', transport: 'UDP', framing: 'One message per packet' }, auth: { type: 'None', ref: '' },
        sample: '{\n  "sensor": "LID-J12",\n  "frame_ts": 1794881400123,\n  "objects": [\n    { "id": 4411, "cls": "pedestrian", "x": 12.4, "y": -3.1, "speed_ms": 1.4, "heading": 92, "l": 0.6, "w": 0.6, "h": 1.7, "zone": "Crossing N" },\n    { "id": 4412, "cls": "car", "x": -8.2, "y": 15.9, "speed_ms": 9.8, "heading": 181, "l": 4.5, "w": 1.9, "h": 1.5, "zone": "Approach E" },\n    { "id": 4413, "cls": "bicycle", "x": 3.3, "y": 7.0, "speed_ms": 4.9, "heading": 178, "l": 1.8, "w": 0.6, "h": 1.6, "zone": "Approach E" },\n    { "id": 4414, "cls": "truck", "x": -21.0, "y": 16.2, "speed_ms": 7.1, "heading": 180, "l": 11.2, "w": 2.5, "h": 3.6, "zone": "Approach E" }\n  ]\n}',
        rules: [
          { sourcePath: '_parent.sensor', targetPath: 'sensorId', transform: 'direct', required: true }, { sourcePath: '_parent.frame_ts', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'epoch-ms', tz: '+00:00' }, required: true },
          { sourcePath: 'id', targetPath: 'trackId', transform: 'toString', required: true },
          { sourcePath: 'cls', targetPath: 'objectClass', transform: 'lookup', args: { table: 'car=Car\ntruck=Truck\nbus=Bus\nmotorcycle=Motorcycle\nbicycle=Bicycle\npedestrian=Pedestrian', fallback: 'Unknown' }, required: true },
          { sourcePath: 'speed_ms', targetPath: 'speedKmh', transform: 'scale', args: { factor: 3.6, offset: 0, decimals: 1 } }
        ] },
      { id: 'cctv-analytics', name: 'CCTV video analytics', device: 'cctv', connector: 'kafka', entity: 'VideoEvent', status: 'published', format: 'json', ratePerSec: 180, platformFeed: 'Video analytics events',
        config: { brokers: 'vms-broker-1:9092, vms-broker-2:9092', topic: 'vms.analytics.events', group: 'athenaiq-ingest', offset: 'Latest' }, auth: { type: 'Client certificate (mTLS)', ref: 'vault://athenaiq/vms/client-cert' },
        sample: '[\n  { "event_id": "EV-88120", "ts": "2026-11-17T06:11:02+02:00", "camera": "CCTV-0231", "type": "stopped_vehicle", "score": 0.91, "object": "car", "lat": 37.9667, "lon": 23.7667, "snapshot": "https://vms.example/snap/88120.jpg", "zone": "Lane 2" },\n  { "event_id": "EV-88121", "ts": "2026-11-17T06:11:40+02:00", "camera": "CCTV-0102", "type": "wrong_way", "score": 0.84, "object": "car", "lat": 37.9310, "lon": 23.7410, "snapshot": "https://vms.example/snap/88121.jpg", "zone": "Slip road" },\n  { "event_id": "EV-88122", "ts": "2026-11-17T06:12:15+02:00", "camera": "CCTV-0417", "type": "pedestrian", "score": 0.77, "object": "person", "lat": 37.9895, "lon": 23.7582, "snapshot": "https://vms.example/snap/88122.jpg", "zone": "Carriageway" }\n]',
        rules: [
          { sourcePath: 'event_id', targetPath: 'eventId', transform: 'direct', required: true }, { sourcePath: 'ts', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'auto', tz: '+02:00' }, required: true },
          { sourcePath: 'camera', targetPath: 'cameraId', transform: 'direct', required: true },
          { sourcePath: 'type', targetPath: 'eventType', transform: 'lookup', args: { table: 'stopped_vehicle=Stopped vehicle\nwrong_way=Wrong way\npedestrian=Pedestrian on road\ncrowd=Crowd\nintrusion=Intrusion\nfire=Smoke or fire\ndebris=Debris\nqueue=Queue', fallback: 'Other' }, required: true },
          { sourcePath: 'score', targetPath: 'confidence', transform: 'scale', args: { factor: 100, offset: 0, decimals: 1 } }, { sourcePath: 'object', targetPath: 'objectClass', transform: 'direct' },
          { sourcePath: 'lat', targetPath: 'latitude', transform: 'direct' }, { sourcePath: 'lon', targetPath: 'longitude', transform: 'direct' }, { sourcePath: 'snapshot', targetPath: 'snapshotUrl', transform: 'direct' }, { sourcePath: 'zone', targetPath: 'zone', transform: 'direct' }
        ] },
      { id: 'field-device-health', name: 'Field device health', device: 'health', connector: 'snmp', entity: 'DeviceHealth', status: 'published', format: 'json', ratePerSec: 12,
        config: { host: 'nms.field.example:161', version: 'v3', objects: '1.3.6.1.2.1.1.3.0\n1.3.6.1.4.1.99999.1.2' }, auth: { type: 'Basic (user and password)', ref: 'vault://athenaiq/nms/snmpv3' }, every: '1 minute',
        sample: '[\n  { "device_id": "CAM-0012", "type": "ANPR camera", "polled_at": "2026-11-17T06:10:00+02:00", "status": "up", "uptime_s": 1843200, "temp_c": 48.2, "cpu": 37, "disk": 61, "fw": "7.4.2", "rssi": -67 },\n  { "device_id": "RAD-07", "type": "Speed radar", "polled_at": "2026-11-17T06:10:00+02:00", "status": "degraded", "uptime_s": 86400, "temp_c": 63.5, "cpu": 88, "disk": 40, "fw": "2.1.0", "rssi": -81, "last_error": "Heater fault" },\n  { "device_id": "LID-J12", "type": "LiDAR", "polled_at": "2026-11-17T06:10:00+02:00", "status": "down", "uptime_s": 0, "fw": "1.9.3", "last_error": "No response" }\n]',
        rules: [
          { sourcePath: 'device_id', targetPath: 'deviceId', transform: 'direct', required: true }, { sourcePath: 'polled_at', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'auto', tz: '+02:00' }, required: true },
          { sourcePath: 'status', targetPath: 'status', transform: 'lookup', args: { table: 'up=Online\ndegraded=Degraded\ndown=Offline\nmaintenance=Maintenance', fallback: '' }, required: true },
          { sourcePath: 'type', targetPath: 'deviceType', transform: 'direct' }, { sourcePath: 'uptime_s', targetPath: 'uptimeSec', transform: 'toInteger' }, { sourcePath: 'temp_c', targetPath: 'temperatureC', transform: 'toDecimal', args: { decimals: 1 } },
          { sourcePath: 'cpu', targetPath: 'cpuPct', transform: 'direct' }, { sourcePath: 'disk', targetPath: 'storagePct', transform: 'direct' }, { sourcePath: 'fw', targetPath: 'firmware', transform: 'direct' },
          { sourcePath: 'rssi', targetPath: 'signalDbm', transform: 'direct' }, { sourcePath: 'last_error', targetPath: 'lastError', transform: 'trim' }
        ] },
      { id: 'air-quality-stations', name: 'Air quality stations', device: 'air', connector: 'mqtt', entity: 'EnvironmentReading', status: 'published', format: 'json', ratePerSec: 6, platformFeed: 'Environmental sensors',
        config: { broker: 'mqtts://iot-broker.example:8883', topic: 'city/air/+/reading', qos: '1' }, auth: { type: 'Client certificate (mTLS)', ref: 'vault://athenaiq/iot/client-cert' },
        sample: '[\n  { "station": "AQ-03", "time": "2026-11-17T06:00:00+02:00", "pm2_5": 38.2, "pm10": 91.0, "no2": 44.1, "noise_db": 66.3, "temp_c": 27.4, "rh": 58 },\n  { "station": "AQ-07", "time": "2026-11-17T06:00:00+02:00", "pm2_5": 52.9, "pm10": 120.4, "no2": 61.0, "noise_db": 71.8, "temp_c": 27.9, "rh": 55 },\n  { "station": "AQ-11", "time": "2026-11-17T06:00:00+02:00", "pm2_5": 21.7, "pm10": 64.3, "no2": 18.6, "noise_db": 58.2, "temp_c": 26.8, "rh": 63 }\n]',
        rules: [
          { sourcePath: 'station', targetPath: 'stationId', transform: 'direct', required: true }, { sourcePath: 'time', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'auto', tz: '+02:00' }, required: true },
          { sourcePath: 'pm2_5', targetPath: 'pm25', transform: 'direct' }, { sourcePath: 'pm10', targetPath: 'pm10', transform: 'direct' }, { sourcePath: 'no2', targetPath: 'no2', transform: 'direct' },
          { sourcePath: 'noise_db', targetPath: 'noiseDb', transform: 'direct' }, { sourcePath: 'temp_c', targetPath: 'temperatureC', transform: 'direct' }, { sourcePath: 'rh', targetPath: 'humidityPct', transform: 'direct' }
        ] }
    ],
    // Reusable mappings for vendors with similar payloads.
    templates: [
      { name: 'Plate read, generic ANPR', entity: 'VehicleDetection', rules: [
        { sourcePath: 'plate', targetPath: 'plateNumber', transform: 'uppercase', required: true }, { sourcePath: 'time', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'auto', tz: '+02:00' }, required: true },
        { sourcePath: 'camera_id', targetPath: 'cameraId', transform: 'direct', required: true }, { sourcePath: 'confidence', targetPath: 'confidence', transform: 'toDecimal', args: { decimals: 1 } }] }
    ]
  },

  /* ---- People on foot ------------------------------------------------------------------------- */
  // Synthetic walkers drawn at street zoom. People per km of street by road class
  // (motorway, trunk, primary, secondary, tertiary), before the time-of-day factor. Assumed, not counted.
  people: { perKmByClass: [0, 0, 6, 12, 16] },

  /* ---- Response routing ---------------------------------------------------------------------- */
  // Quickest route from the nearest response unit to a critical alert, over the road network at
  // current speeds. Unit positions are synthetic placeholders: replace with real bases.
  response: {
    auto: true,                 // route automatically when a critical alert is pushed
    speedFactor: 1.25,          // response vehicles travel this much faster than surrounding traffic
    bases: [
      { name: 'Patrol unit, Syntagma', lon: 23.7348, lat: 37.9755 },
      { name: 'Patrol unit, Omonia', lon: 23.7281, lat: 37.9841 },
      { name: 'Patrol unit, Piraeus', lon: 23.6375, lat: 37.9420 },
      { name: 'Patrol unit, Kifisia', lon: 23.8105, lat: 38.0742 },
      { name: 'Patrol unit, Marousi', lon: 23.7866, lat: 38.0363 },
      { name: 'Patrol unit, Glyfada', lon: 23.7536, lat: 37.8650 },
      { name: 'Patrol unit, Peristeri', lon: 23.6880, lat: 38.0130 }
    ]
  },

  /* ---- Critical zones ------------------------------------------------------------------------ */
  // Sites watched for traffic problems around them. Positions come from OpenStreetMap through the
  // data build; add your own in "custom". A site goes on WATCH when traffic within its radius is
  // slow, and into ALERT when it is very slow or an accident or event is active inside the radius.
  zones: {
    radiusM: 500,
    watchRatioBelow: 0.4,           // traffic speed as a share of the limit
    alertRatioBelow: 0.2,
    minVehicles: 40,                // ignore near-empty surroundings
    alert: true,                    // raise an alert when a high-priority site (defence, embassy …) goes into ALERT
    alertMinPriority: 3,
    types: {
      defence: { label: 'Defence site', priority: 3 },
      embassy: { label: 'Embassy', priority: 3 },
      government: { label: 'Government building', priority: 2 },
      police: { label: 'Police station', priority: 2 },
      hospital: { label: 'Hospital', priority: 3 },
      fire: { label: 'Fire station', priority: 2 },
      airport: { label: 'Airport', priority: 3 },
      school: { label: 'School', priority: 2 },
      university: { label: 'University or college', priority: 1 }
    },
    // Your own sites: { type, name, lon, lat }. "type" may be any key above or a new one.
    custom: []
  },

  /* ---- Environmental sensors ----------------------------------------------------------------- */
  // Roadside air-quality and noise sensors. Leave "sensors" empty for synthetic example sensors.
  // Readings are synthetic in both cases until a real feed is connected (see docs/environment.md).
  environment: {
    sensors: [],                    // real positions: { id, name, lon, lat }
    syntheticSensors: 18,
    radiusM: 400,                   // traffic within this distance drives a sensor's synthetic readings
    alertAqiAbove: 150,             // alert when a sensor's air-quality index passes this
    alertNoiseAboveDb: 80,
    alert: true
  },

  /* ---- Predictive analytics ------------------------------------------------------------------ */
  // Planning-level projections computed in the browser. Every number here is an assumption.
  analytics: {
    // The tree and the "Data layer" drop-down in Analytics: which sections belong to which kind of data.
    // Sections not listed here appear under "Other"; the charts under each section are read from the page.
    nav: [
      { name: 'City performance', sections: ['kpi', 'reg'] }, { name: 'Operations today', sections: ['ops'] }, { name: 'Traffic and roads', sections: ['over', 'road', 'other'] },
      { name: 'Signals', sections: ['sig'] }, { name: 'Safety and enforcement', sections: ['safe'] }, { name: 'Environment', sections: ['env'] }, { name: 'Population and fleet', sections: ['pop'] }
    ],
    growthPerYear: 0.05,              // traffic growth a year
    horizonYears: 10,
    bprAlpha: 0.6, bprBeta: 4,        // volume-delay curve: speed ratio = 1 / (1 + a·x^b)
    criticalRatio: 0.4,               // a road is "critical" when its peak speed is under this share of its limit
    roadsToWiden: 10,                 // size of the widening programme tested
    signalsToUpgrade: 25,             // junctions given adaptive control in the test
    adaptiveSignalDelayReduction: 0.12,
    valueOfTimePerHour: 12,          // value of time, euros per vehicle-hour (assumed)
    workingDaysPerYear: 250,
    co2: { baseGPerKm: 150, congestionGKmh: 2500,       // g/km = base + congestion ÷ speed (km/h)
      typeFactor: { car: 1, taxi: 1, van: 1.5, lorry: 4, bus: 4.5, moto: 0.5 } },   // emissions per km against a car
    // Example targets for the City scorecard. They are illustrations, not official targets; set your own.
    // Example targets for Athens, set against Greek conditions (about 20–25 km/h in the city at the peak).
    // Counts (accidents, fines, delay, CO2 …) are scaled for the other cities by their assumed trips against
    // targetsBaseTrips, so a town is not judged against a metro. They are illustrations, not official targets.
    targetsBaseTrips: 450000,
    targetsScaled: ['dailyDelayVehH', 'criticalRoads', 'accidentsPerDay', 'seriousAccidentsPerDay', 'accidentsWorstHour', 'finesPerDay', 'finesWorstHour',
      'sitesMonitored', 'co2TonnesPerDay', 'futureCriticalRoads', 'cycleKm', 'delayCostMillion'],
    targets: {
      venuesHighPct: 20, schoolZonesOkPct: 60, adaptiveCorridorsPct: 30, assetHealth: 85, planConflicts: 0, busLateMin: 8,
      peakSpeedKmh: 22, extraTravelPct: 90, dailyDelayVehH: 600000, criticalRoads: 90, junctionsEFPct: 45, busOnTimePct: 70,
      accidentsPerDay: 70, seriousAccidentsPerDay: 6, accidentsWorstHour: 9, criticalAlertsOpen: 2,
      finesPerDay: 12000, finesWorstHour: 1000, topViolationSharePct: 50, topSitesSharePct: 25,
      sitesMonitored: 1500, sitesOnAlertPct: 5, camerasOnlinePct: 97,
      co2TonnesPerDay: 12000, aqi: 100, noiseDb: 70,
      flightsOnTimePct: 80, flightDelayMin: 15, berthUsePct: 85, railKm: 250,
      futureSpeedKmh: 20, futureCriticalRoads: 120, cycleKm: 60, delayCostMillion: 2500
    },
    // Population: ELSTAT 2021 census (the latest). growthPerYear is the 2011–2021 average; projections assume it held,
    // so treat them as rough context only.
    population: { area: 'Greece', total: 10482487, year: 2021, source: 'ELSTAT 2021 census', growthPerYear: -0.0031, growthFrom: '2011–2021',
      partsLabel: 'Largest regions', parts: [['Attica', 3814064], ['Central Macedonia', 1795669], ['Crete', 624408]] }
  },

  /* ---- Greek use cases (js/localcases.js) ------------------------------------------------------ */
  // Example lists for Athens with approximate positions; replace them with official lists (municipal flood points,
  // the Attica air-quality network, the Traffic Police event plans) before client use. Other cities use their site list.
  local: {
    country: 'Greece', citiesTitle: 'Greek cities', emergencyNumber: '112', ambulance: 'EKAB 166 ambulance', weatherService: 'the Hellenic National Meteorological Service (EMY)',
    plate: { letters: 'ABEZHIKMNOPTYX', digits: 4, format: 'LLL-NNNN' },
    waterlogging: {
      title: 'Flash-flood watch', authority: 'the municipalities’ and the Region of Attica’s flood-prone points',
      watchMm6h: 15, alertMm6h: 35,          // rain forecast in the next 6 hours
      points: [
        { name: 'Kifissos Avenue, Agios Ioannis Rentis', at: [23.6750, 37.9650], under: true, low: 1.3 }, { name: 'Kifissos Avenue, Peristeri', at: [23.6950, 38.0050], under: true },
        { name: 'Poseidonos Avenue, Pikrodafni', at: [23.7050, 37.9170], low: 1.4 }, { name: 'Faliro, Ilissos outlet', at: [23.6850, 37.9360], low: 1.3 },
        { name: 'Piraeus Avenue, Tavros', at: [23.6980, 37.9640] }, { name: 'Syngrou Avenue, Neos Kosmos', at: [23.7230, 37.9570] },
        { name: 'Petrou Ralli underpass', at: [23.6900, 37.9720], under: true }, { name: 'Mesogeion Avenue, Cholargos', at: [23.7950, 38.0000] },
        { name: 'Kifisias Avenue, Marousi', at: [23.8000, 38.0420] }, { name: 'Vouliagmenis Avenue, Elliniko', at: [23.7400, 37.8950] },
        { name: 'Attiki Odos, Metamorfosi', at: [23.7500, 38.0600], under: true }, { name: 'Acharnon Street, Patisia', at: [23.7330, 38.0120] }
      ]
    },
    lakes: [
      { name: 'Kifissos river, Neo Faliro', at: [23.6750, 37.9480], river: true }, { name: 'Ilissos stream, Kallithea', at: [23.6950, 37.9450], river: true },
      { name: 'Pikrodafni stream, Alimos', at: [23.7050, 37.9170], river: true }, { name: 'Podoniftis stream, Nea Ionia', at: [23.7600, 38.0400], river: true },
      { name: 'Lake Marathon reservoir', at: [23.9000, 38.1700] }
    ],
    festivals: [
      { id: 'marathon', name: 'Athens Authentic Marathon', season: 'November', crowd: 60000, at: [23.7411, 37.9683], radiusM: 2500,
        areas: [{ name: 'Panathenaic Stadium finish', at: [23.7411, 37.9683] }, { name: 'Vasilissis Sofias Avenue', at: [23.7500, 37.9770] }, { name: 'Mesogeion Avenue', at: [23.7900, 37.9980] }],
        actions: ['Close Marathonos and Mesogeion avenues to traffic on race morning', 'Run extra metro trains from the early morning', 'Divert buses around Syntagma and Vasilissis Sofias', 'Medical posts every 2.5 km and at the finish'] },
      { id: 'easter', name: 'Easter holiday exodus', season: 'March–May (Orthodox Easter)', crowd: 0, outbound: 0.7, at: [23.7000, 38.0600], radiusM: 4000,
        areas: [{ name: 'Athens–Lamia motorway (A1), Metamorfosi', at: [23.7500, 38.0600] }, { name: 'Elefsina toll, Olympia Odos (A8)', at: [23.5600, 38.0500] }],
        actions: ['Open every toll lane and suspend roadworks on A1 and A8', 'Ban heavy vehicles on the motorways on the peak days', 'Advise departure windows on message signs and the radio', 'Extra ferry sailings from Piraeus, Rafina and Lavrio'] },
      { id: 'august', name: '15 August exodus', season: 'August', crowd: 0, outbound: 0.6, at: [23.6400, 37.9420], radiusM: 2500,
        areas: [{ name: 'Piraeus port gates', at: [23.6375, 37.9420] }, { name: 'Elefsina toll, Olympia Odos (A8)', at: [23.5600, 38.0500] }],
        actions: ['Stagger ferry boarding times by gate', 'Open overflow car parks at the port', 'Traffic police at the port gates and on Akti Miaouli', 'Message signs on Kifissos Avenue towards the port'] },
      { id: 'parade', name: 'Independence Day parade (25 March)', season: 'March', crowd: 40000, at: [23.7400, 37.9760], radiusM: 1500,
        areas: [{ name: 'Syntagma and Amalias Avenue', at: [23.7360, 37.9740] }, { name: 'Vasilissis Sofias Avenue', at: [23.7500, 37.9770] }],
        actions: ['Close the parade route from early morning', 'Close Syntagma metro exits to the square if crowded', 'Divert buses and trolleys around the centre', 'Security perimeter and medical posts'] },
      { id: 'cruise', name: 'Peak cruise day at Piraeus', season: 'April–October', crowd: 25000, at: [23.6300, 37.9370], radiusM: 1500,
        areas: [{ name: 'Cruise terminals, Akti Miaouli', at: [23.6300, 37.9370] }, { name: 'Acropolis coach drop-off', at: [23.7230, 37.9700] }],
        actions: ['Timed coach slots at the Acropolis drop-off', 'Coach lanes from the port to the centre', 'Extra line 1 trains Piraeus–Monastiraki', 'Taxi marshals at the terminals'] }
    ],
    festivalsByRegion: {
      thessaloniki: [
        { id: 'tif', name: 'Thessaloniki International Fair', season: 'September', crowd: 30000, at: [22.9550, 40.6260], radiusM: 1500,
          areas: [{ name: 'Helexpo', at: [22.9550, 40.6260] }, { name: 'Egnatia Street', at: [22.9450, 40.6350] }],
          actions: ['Close streets around Helexpo during the opening', 'Park-and-ride from the western suburbs', 'Extra metro and bus services in the evening'] },
        { id: 'okhi', name: '28 October parade', season: 'October', crowd: 50000, at: [22.9500, 40.6200], radiusM: 1500,
          areas: [{ name: 'Megalou Alexandrou Avenue', at: [22.9500, 40.6200] }],
          actions: ['Close the seafront avenue from early morning', 'Divert buses inland', 'Security perimeter and medical posts'] }
      ],
      patras: [
        { id: 'carnival', name: 'Patras Carnival', season: 'February–March', crowd: 150000, at: [21.7346, 38.2466], radiusM: 1500,
          areas: [{ name: 'Georgiou Square', at: [21.7346, 38.2466] }, { name: 'Port seafront', at: [21.7300, 38.2440] }],
          actions: ['Close the parade route in the centre', 'Park-and-ride and extra suburban trains', 'Medical posts and lost-and-found on the route'] }
      ]
    },
    metro: { source: 'STASY (Athens Metro) as published; check before client use', totalKm: 91.7, stations: 66, lines: [
      { name: 'Line 1 (green)', from: 'Piraeus', to: 'Kifisia', km: 25.7, colour: '#2e9e47' },
      { name: 'Line 2 (red)', from: 'Anthoupoli', to: 'Elliniko', km: 18.7, colour: '#d32f2f' },
      { name: 'Line 3 (blue)', from: 'Dimotiko Theatro', to: 'Airport', km: 47.3, colour: '#1e63c8' }] },
    metroByRegion: {
      thessaloniki: { source: 'Thessaloniki Metro as published; check before client use', totalKm: 14.4, stations: 18, lines: [
        { name: 'Line 1', from: 'New Railway Station', to: 'Nea Elvetia', km: 9.6, colour: '#d32f2f' },
        { name: 'Kalamaria extension', from: 'Nomarchia', to: 'Mikra', km: 4.8, colour: '#1e63c8' }] }
    },
    // Approximate positions of air-quality stations of the Attica network; not connected yet.
    aqStations: [
      { name: 'Athinas', at: [23.7270, 37.9780] }, { name: 'Patision', at: [23.7320, 37.9990] }, { name: 'Marousi', at: [23.7870, 38.0310] },
      { name: 'Lykovrysi', at: [23.7760, 38.0700] }, { name: 'Thrakomakedones', at: [23.7580, 38.1430] }, { name: 'Agia Paraskevi', at: [23.8190, 37.9950] },
      { name: 'Ano Liosia', at: [23.6960, 38.0770] }, { name: 'Peristeri', at: [23.6880, 38.0210] }, { name: 'Piraeus', at: [23.6500, 37.9470] }, { name: 'Elefsina', at: [23.5380, 38.0510] }
    ],
    aqNetwork: 'Attica air-quality network (Ministry of Environment)', aqConnect: 'the ministry’s open data or the European Environment Agency service',
    // Traffic mix: shares of moving vehicles (ASSUMED; Athens has many motorcycles and scooters) and passenger-car units.
    mix: [['Cars and taxis', 0.70, 1.0], ['Motorcycles and scooters', 0.17, 0.4], ['Buses', 0.03, 2.0], ['Vans and lorries', 0.10, 1.8]],
    mixNote: 'The simulation counts car units; they are split into vehicle types with assumed shares and passenger-car units.',
    // Traffic offences: shares (ASSUMED) applied to the synthetic tickets; fine values are placeholders.
    challan: [['Speeding', 0.30, 150], ['Red light', 0.10, 700], ['Phone while driving', 0.10, 350], ['No seat belt', 0.07, 350], ['No helmet', 0.08, 350],
      ['Illegal or double parking', 0.25, 80], ['Bus-lane misuse', 0.10, 200]],
    challanTitle: 'Traffic offences by type', challanSub: 'Speeding, red light, phone, parking and more', twoWheelerTypes: ['No helmet'],
    ring: { title: 'Attiki Odos', match: '^(Αττική Οδός|Attiki Odos)', centre: [23.73, 37.98] },
    heat: { heatC: 40, severeC: 44, fireWindKmh: 40 },
    signalDelaySec: 25                       // average wait a green corridor saves at each signal (assumed)
  },

  /* ---- What-if closure (estimated in the browser, not re-simulated) --------------------------- */
  closure: { radiusM: 1500, speedLoss: 0.4, extraVehicles: 0.3 },

  /* ---- Sign-in ------------------------------------------------------------------------------- */
  // Demo sign-in only: the role is chosen in the browser, so it is NOT a security control.
  // Put the app behind real authentication (SSO or a reverse proxy) for anything beyond a demo.
  auth: {
    enabled: true,
    roles: {
      admin: { label: 'Administrator', can: ['whatif', 'export', 'audit', 'settings', 'video', 'search', 'integrations'] },
      operator: { label: 'Operator', can: ['whatif', 'export', 'video', 'search'] },
      viewer: { label: 'Viewer', can: ['video'] }
    }
  },

  /* ---- Backend ------------------------------------------------------------------------------- */
  // Optional services of your own. The app works without them.
  api: {
    // POST { question, context } → { answer }. Lets a language model answer what the built-in
    // assistant rules do not cover. Keep the model API key on that service.
    assistantUrl: null,
    // Vision-language model for the camera window. POST { question, image (JPEG data URL of the current
    // frame, or null), camera, context } → { answer }. null = sample answers written from synthetic data.
    // Keep the model API key on that service. Sending frames to a service sends video images to it.
    vlmUrl: null,
    // POST of each audit entry as JSON. null = audit log kept in this browser only.
    auditUrl: null
  },

  /* ---- Language ------------------------------------------------------------------------------ */
  language: { default: 'en', available: ['en', 'el'] }   // English and Greek
};
