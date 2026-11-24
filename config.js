/* UrbanIQ configuration (Telangana, India).
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
  product: { name: 'UrbanIQ', state: 'Telangana', country: 'India' },
  currency: { code: 'INR', symbol: '\u20b9' },   // shown before money values
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
  // The region selector in the top bar: Hyderabad and nine other Telangana cities. Hyderabad is the default and keeps
  // the settings in this file.
  // For the other regions the app derives its example data (bus routes, taxi ranks, parking, freight, emergency,
  // ships, flights) from the sites listed here; see js/regions.js. Site positions are APPROXIMATE: check them
  // on the map. Site: [name, longitude, latitude, zoom, kind]. Kinds: centre, business, residential, leisure,
  // mall, university, industrial, open, airport. Telangana has no coast, so there are no port or coastal sites.
  // port.seaBearing and airport.runwayBearing are compass bearings used to draw example sea lanes and flight paths.
  defaultRegion: 'hyderabad',
  regions: [
    { id: 'hyderabad', name: 'Hyderabad', dir: '', centre: [78.4747, 17.3916], airport: { name: 'Rajiv Gandhi International Airport', at: [78.4294, 17.2403], runwayBearing: 90 }, sites: [
      ['Abids', 78.4747, 17.3916, 14.5, 'centre'], ['Charminar', 78.4747, 17.3616, 15, 'leisure'], ['Hussain Sagar', 78.4740, 17.4239, 14.5, 'leisure'],
      ['Secunderabad', 78.5016, 17.4337, 14.5, 'business'], ['Begumpet', 78.4670, 17.4440, 14.5, 'business'], ['Ameerpet', 78.4480, 17.4375, 14.5, 'business'],
      ['Banjara Hills', 78.4400, 17.4150, 14.5, 'residential'], ['Jubilee Hills', 78.4075, 17.4300, 14.5, 'residential'], ['HITEC City', 78.3810, 17.4474, 14.5, 'business'],
      ['Financial District', 78.3420, 17.4160, 14.5, 'business'], ['Gachibowli Stadium', 78.3480, 17.4470, 14.5, 'leisure'], ['Inorbit Mall', 78.3860, 17.4340, 15, 'mall'],
      ['Kukatpally', 78.4070, 17.4840, 14, 'residential'], ['Golconda Fort', 78.4011, 17.3833, 15, 'leisure'], ['Mehdipatnam', 78.4390, 17.3950, 14.5, 'residential'],
      ['Osmania University', 78.5280, 17.4130, 14.5, 'university'], ['University of Hyderabad', 78.3350, 17.4590, 14, 'university'], ['Uppal', 78.5590, 17.4010, 14, 'residential'],
      ['LB Nagar', 78.5520, 17.3460, 14, 'residential'], ['Jeedimetla', 78.4500, 17.5100, 13.5, 'industrial'], ['Rajiv Gandhi International Airport', 78.4294, 17.2403, 13, 'airport']] },
    { id: 'warangal', name: 'Warangal', dir: 'warangal', centre: [79.5600, 18.0000], sites: [
      ['Hanamkonda', 79.5600, 18.0070, 14.5, 'centre'], ['Thousand Pillar Temple', 79.5745, 18.0037, 15, 'leisure'], ['Warangal Fort', 79.6100, 17.9580, 14.5, 'leisure'],
      ['Warangal Railway Station', 79.6000, 17.9700, 14.5, 'business'], ['Kazipet', 79.5000, 17.9770, 14, 'residential'], ['NIT Warangal', 79.5300, 17.9840, 14.5, 'university'],
      ['Bhadrakali Lake', 79.5850, 17.9950, 14.5, 'open'], ['Madikonda', 79.5200, 18.0300, 14, 'industrial'], ['Mamnoor', 79.6020, 17.9140, 14, 'residential']] },
    { id: 'karimnagar', name: 'Karimnagar', dir: 'karimnagar', centre: [79.1288, 18.4386], sites: [
      ['Town Centre', 79.1288, 18.4386, 14.5, 'centre'], ['Bus Station', 79.1300, 18.4370, 15, 'business'], ['Lower Manair Dam', 79.1500, 18.4100, 14, 'open'],
      ['Kothirampur', 79.1250, 18.4300, 14.5, 'residential'], ['Alugunur', 79.1700, 18.4200, 14, 'residential'], ['Satavahana University', 79.1100, 18.4600, 14, 'university'],
      ['Industrial Area', 79.1000, 18.4250, 14, 'industrial']] },
    { id: 'nizamabad', name: 'Nizamabad', dir: 'nizamabad', centre: [78.0940, 18.6725], sites: [
      ['Town Centre', 78.0940, 18.6725, 14.5, 'centre'], ['Railway Station', 78.1000, 18.6700, 15, 'business'], ['Nizamabad Fort', 78.0920, 18.6760, 15, 'leisure'],
      ['Pragathi Nagar', 78.1100, 18.6850, 14.5, 'residential'], ['Kanteshwar', 78.0950, 18.6850, 14.5, 'residential'], ['Government Medical College', 78.1050, 18.6650, 14.5, 'university'],
      ['Autonagar', 78.1150, 18.6600, 14, 'industrial']] },
    { id: 'khammam', name: 'Khammam', dir: 'khammam', centre: [80.1514, 17.2473], sites: [
      ['Town Centre', 80.1514, 17.2473, 14.5, 'centre'], ['Khammam Fort', 80.1570, 17.2440, 15, 'leisure'], ['Railway Station', 80.1500, 17.2390, 15, 'business'],
      ['Lakaram Lake', 80.1460, 17.2560, 14.5, 'open'], ['Wyra Road', 80.1650, 17.2600, 14.5, 'residential'], ['Industrial Area', 80.1350, 17.2300, 14, 'industrial']] },
    { id: 'ramagundam', name: 'Ramagundam', dir: 'ramagundam', centre: [79.5100, 18.7900], sites: [
      ['Godavarikhani', 79.5100, 18.7900, 14.5, 'centre'], ['Ramagundam Railway Station', 79.4720, 18.7550, 14.5, 'business'], ['NTPC Ramagundam', 79.4500, 18.7600, 13.5, 'industrial'],
      ['NTPC Township', 79.4400, 18.7700, 14, 'residential'], ['Fertiliser Plant', 79.4150, 18.7400, 14, 'industrial'], ['Basantnagar', 79.3950, 18.7000, 14, 'residential']] },
    { id: 'mahbubnagar', name: 'Mahbubnagar', dir: 'mahbubnagar', centre: [78.0030, 16.7370], sites: [
      ['Town Centre', 78.0030, 16.7370, 14.5, 'centre'], ['Railway Station', 78.0000, 16.7400, 15, 'business'], ['Pillalamarri', 78.0160, 16.7650, 14.5, 'leisure'],
      ['Palamuru University', 78.0350, 16.7300, 14, 'university'], ['New Town', 77.9900, 16.7500, 14.5, 'residential'], ['Industrial Area', 78.0200, 16.7150, 14, 'industrial']] },
    { id: 'nalgonda', name: 'Nalgonda', dir: 'nalgonda', centre: [79.2671, 17.0500], sites: [
      ['Clock Tower', 79.2671, 17.0500, 14.5, 'centre'], ['Railway Station', 79.2700, 17.0450, 15, 'business'], ['Latif Saheb Gutta', 79.2850, 17.0650, 14.5, 'leisure'],
      ['Mahatma Gandhi University', 79.2200, 17.0200, 14, 'university'], ['Ramagiri', 79.2550, 17.0600, 14.5, 'residential'], ['Industrial Area', 79.2500, 17.0350, 14, 'industrial']] },
    { id: 'siddipet', name: 'Siddipet', dir: 'siddipet', centre: [78.8520, 18.1018], sites: [
      ['Town Centre', 78.8520, 18.1018, 14.5, 'centre'], ['Komati Cheruvu', 78.8600, 18.0980, 15, 'leisure'], ['Bus Station', 78.8530, 18.1040, 15, 'business'],
      ['Ponnala', 78.8300, 18.0800, 14, 'residential'], ['Rangadhampally', 78.8700, 18.1200, 14, 'residential'], ['Industrial Area', 78.8400, 18.1200, 14, 'industrial']] },
    { id: 'adilabad', name: 'Adilabad', dir: 'adilabad', centre: [78.5320, 19.6640], sites: [
      ['Town Centre', 78.5320, 19.6640, 14.5, 'centre'], ['Railway Station', 78.5350, 19.6680, 15, 'business'], ['RIMS Adilabad', 78.5250, 19.6720, 14.5, 'university'],
      ['Mavala', 78.5500, 19.6550, 14, 'residential'], ['Kachkanti', 78.5200, 19.6500, 14, 'residential'], ['Industrial Area', 78.5450, 19.6800, 14, 'industrial']] }
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
    mode: 'live',               // 'live' = start at the Hyderabad clock and play at the rate below; 'replay' = today from now, as Historical
    rate: 30,                   // playback speed, Live included: 1 (Live then stays locked to the clock), 30, 120 or 600
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
    timeZone: 'Asia/Kolkata',   // India Standard Time, UTC+05:30
    weekendDays: [0],           // Sunday (0 = Sunday)
    shortDay: 6                 // Saturday: lighter traffic than a working day
  },

  /* ---- Feeds --------------------------------------------------------------------------------- */
  feeds: {
    // Live and historical traffic. 'synthetic' builds a 24-hour day from the simulated traffic states.
    // A real feed is an integration point, not implemented yet: see docs/configuration.md.
    traffic: 'synthetic',
    // URL returning accidents as JSON: [{ "time": "08:15", "lon": 78.47, "lat": 17.39, "road": "…",
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
    // in other cities, not Telangana, are recorded (not live) and are not the camera's feed; the camera window says so.
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
    networkSpeedBelowKmh: 40,        // network average speed
    roadRatioBelow: 0.45,             // road speed as a share of its limit …
    roadMinVehicles: 80,            // … with at least this many vehicles on it
    seriousAccident: true,
    everyAccident: true,
    // Synthetic operational events (stopped vehicle, wrong-way driver, device fault …) raised at the
    // cameras, so the alert feed is active at any hour. 0 turns them off.
    syntheticEventsPerHour: 14,             // also alert on each new accident, whatever its severity
    maxShown: 12,
    // Push each new alert as an on-screen notification, and as a browser notification when the
    // user has allowed them and the page is in the background.
    push: true,
    pushSeconds: 8,                         // auto-close after this many seconds; 0 = stay until closed with ×
    pushPosition: 'top-right',              // 'top-right' or 'top-left' corner of the map
    pushMaxVisible: 3                       // most notifications on screen at once
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
      { id: '101', name: 'Abids – HITEC City', from: [78.4747, 17.3916], to: [78.3810, 17.4474], headwayMin: 10 },
      { id: '102', name: 'Secunderabad – Mehdipatnam', from: [78.5016, 17.4337], to: [78.4390, 17.3950], headwayMin: 8 },
      { id: '103', name: 'Charminar – Kukatpally', from: [78.4747, 17.3616], to: [78.4070, 17.4840], headwayMin: 12 },
      { id: '110', name: 'LB Nagar – Ameerpet', from: [78.5520, 17.3460], to: [78.4480, 17.4375], headwayMin: 10 },
      { id: '120', name: 'Uppal – Gachibowli', from: [78.5590, 17.4010], to: [78.3480, 17.4470], headwayMin: 12 },
      { id: '160', name: 'Secunderabad – Airport', from: [78.5016, 17.4337], to: [78.4294, 17.2403], headwayMin: 30 },
      { id: '170', name: 'Osmania University – Banjara Hills', from: [78.5280, 17.4130], to: [78.4400, 17.4150], headwayMin: 15 },
      { id: '200', name: 'Jeedimetla – Abids', from: [78.4500, 17.5100], to: [78.4747, 17.3916], headwayMin: 15 },
      { id: '210', name: 'HITEC City – Financial District', from: [78.3810, 17.4474], to: [78.3420, 17.4160], headwayMin: 10 },
      { id: '300', name: 'Charminar – Golconda Fort', from: [78.4747, 17.3616], to: [78.4011, 17.3833], headwayMin: 15 }
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
      { name: 'Abids', at: [78.4747, 17.3916], bays: 10 },
      { name: 'Charminar', at: [78.4747, 17.3616], bays: 8 },
      { name: 'Secunderabad station', at: [78.5016, 17.4337], bays: 14 },
      { name: 'Begumpet', at: [78.4670, 17.4440], bays: 8 },
      { name: 'Ameerpet', at: [78.4480, 17.4375], bays: 10 },
      { name: 'Banjara Hills', at: [78.4400, 17.4150], bays: 8 },
      { name: 'HITEC City', at: [78.3810, 17.4474], bays: 12 },
      { name: 'Financial District', at: [78.3420, 17.4160], bays: 12 },
      { name: 'Kukatpally', at: [78.4070, 17.4840], bays: 8 },
      { name: 'LB Nagar', at: [78.5520, 17.3460], bays: 8 },
      { name: 'Airport', at: [78.4294, 17.2403], bays: 20 }
    ]
  },
  shuttles: {
    seats: 12, speedKmh: 24,
    zones: [
      { name: 'HITEC City', at: [78.3810, 17.4474], radiusM: 2600, vehicles: 6, waitMin: 8 },
      { name: 'Financial District', at: [78.3420, 17.4160], radiusM: 2600, vehicles: 5, waitMin: 10 },
      { name: 'University of Hyderabad', at: [78.3350, 17.4590], radiusM: 2800, vehicles: 4, waitMin: 9 },
      { name: 'Jubilee Hills', at: [78.4075, 17.4300], radiusM: 1800, vehicles: 4, waitMin: 6 }
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
  // Telangana has no coast: the AIS vessel feed is off (vessels: false) and the Sea layers stay empty.
  live: {
    enabled: true,
    baseUrl: 'https://raw.githubusercontent.com/thirumald/UrbanIQ/live-data/',
    refreshMin: 10,              // how often the browser looks for newer files
    ais: false,                  // no coast in Telangana: no AIS card, layer or source
    fires: true, vessels: false, satellites: true, flights: true,   // layers on at start
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

  // OSINT on the 3D map: the Telangana-wide view and how far heights are scaled so that aircraft and satellites can be seen.
  // defaultView: the view the OSINT page opens on: 'region' (city, 3D buildings), 'state' (all of Telangana) or 'world'. orbit: circle the camera when the page opens.
  osintMap: { centre: [79.0, 17.85], zoom: 6.3, pitch: 52, bearing: -12, minZoom: 4, heightExaggeration: 6, satelliteHeightScale: 0.2, defaultView: 'region', orbit: true, orbitDegPerSec: 4 },
  // directWeather: when the published weather file is older than 75 minutes, ask Open-Meteo from the browser instead.
  osint: { rainAlertMm: 20, quakeAlertMag: 4.5, quakeAlertKm: 600, heatAlertC: 42, directWeather: true },

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
    // Telangana is landlocked: no port and no sea lanes. The Sea layers stay empty.
    portName: '', port: null, view: null, berths: 0, everyMin: 22, wakeSec: 900, namePrefix: 'MV Example',
    lanes: [],
    types: [
      { kind: 'Container ship', knots: 14, colour: [57, 135, 229] }, { kind: 'Tanker', knots: 12, colour: [217, 89, 38] },
      { kind: 'Cruise ship', knots: 16, colour: [255, 255, 255] }, { kind: 'Ferry', knots: 20, colour: [25, 158, 112] }, { kind: 'Cargo vessel', knots: 9, colour: [201, 133, 0] }
    ]
  },
  air: {
    synthetic: false,           // real flights come from Flightradar24 (see live); true brings the synthetic flights back
    airport: [78.4294, 17.2403], airportName: 'Rajiv Gandhi International Airport', movementsPerHour: 18, inViewSec: 420, topAltM: 2600, trailSec: 150, delayedShare: 0.2, flightPrefix: 'FLT',
    cities: ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Dubai', 'Doha', 'Singapore', 'London', 'Jeddah', 'Kuala Lumpur', 'Pune'],
    routes: [   // arrivals end at the airport; departures start there. Runways run roughly east–west.
      { name: 'Approach from the west', arrival: true, path: [[78.1300, 17.2450], [78.2900, 17.2420], [78.4294, 17.2403]] },
      { name: 'Approach from the east', arrival: true, path: [[78.7300, 17.2350], [78.5700, 17.2380], [78.4294, 17.2403]] },
      { name: 'Departure to the east', arrival: false, path: [[78.4294, 17.2403], [78.5700, 17.2380], [78.7300, 17.2350]] },
      { name: 'Departure to the west', arrival: false, path: [[78.4294, 17.2403], [78.2900, 17.2420], [78.1300, 17.2450]] }
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
      { type: 'event', title: 'Exhibition at HITEX (example)', at: [78.3720, 17.4710], fromDay: 0, toDay: 2, start: '10:00', end: '19:00', attendance: 18000 },
      { type: 'event', title: 'Evening concert, Gachibowli Stadium (example)', at: [78.3480, 17.4470], fromDay: 1, toDay: 1, start: '18:00', end: '23:30', attendance: 25000 },
      { type: 'event', title: 'Hussain Sagar fun run (example)', at: [78.4740, 17.4239], fromDay: 5, toDay: 5, start: '06:00', end: '10:00', attendance: 6000 },
      { type: 'event', title: 'Cricket match, Uppal stadium (example)', at: [78.5500, 17.4065], fromDay: 3, toDay: 3, start: '19:00', end: '23:00', attendance: 39000 }
    ]
  },
  // Evacuation planning assumptions. Assembly points are example open areas, not designated sites.
  emergency: {
    occupancy: { school: 900, university: 4000, hospital: 600, embassy: 80, government: 400, defence: 500, airport: 12000, police: 120, fire: 40 },
    peoplePerCar: 2.5, peoplePerBus: 40, routeLanes: 2, laneCapacityPerHour: 1500, mobilisationMin: 10,
    // Natural disaster exercises. The areas are examples chosen for demonstration, not surveyed hazard zones.
    peoplePerKm2: 3500,
    disasters: [
      { id: 'flood', name: 'Urban flooding after heavy rain', roadEffect: 'underpasses and low roads closed',
        areas: [{ name: 'Musi river low roads, Chaderghat', at: [78.4880, 17.3770], radiusM: 1800 }, { name: 'Tolichowki and Nadeem Colony', at: [78.4150, 17.3950], radiusM: 1600 }, { name: 'Hussain Sagar nala, Ashok Nagar', at: [78.4930, 17.4060], radiusM: 1400 }],
        actions: ['Close flooded underpasses and sign diversions', 'Send pumps and recovery vehicles to the closed sections', 'Warn drivers on message signs and public channels', 'Give signals more green on the diversion routes', 'Check hospitals and schools inside the area for access'] },
      { id: 'sand', name: 'Squall and dust storm', roadEffect: 'reduced speed limit, fallen trees and hoardings',
        areas: [{ name: 'Airport and Shamshabad corridor', at: [78.4300, 17.2600], radiusM: 6000 }, { name: 'Outer Ring Road, west', at: [78.3200, 17.4300], radiusM: 5000 }],
        actions: ['Lower the limit on the Outer Ring Road and exposed flyovers', 'Show low-visibility warnings on message signs', 'Send crews to clear fallen trees and hoardings', 'Place patrols at the usual pile-up locations', 'Tell schools and employers to stagger departures'] },
      { id: 'quake', name: 'Earthquake', roadEffect: 'flyovers and underpasses closed until inspected',
        areas: [{ name: 'Old city and centre', at: [78.4750, 17.3900], radiusM: 7000 }],
        actions: ['Close flyovers and underpasses until inspected', 'Set signals to flashing where power is lost', 'Keep main corridors clear for emergency vehicles', 'Open the assembly points and route people to them', 'Survey critical sites in priority order: hospitals first'] },
      { id: 'heat', name: 'Heatwave', roadEffect: 'no closures, more breakdowns',
        areas: [{ name: 'Whole city', at: [78.4600, 17.4000], radiusM: 18000 }],
        actions: ['Add recovery patrols for breakdowns on the Outer Ring Road', 'Limit roadworks to night hours', 'Open shaded waiting areas at bus stations', 'Check on outdoor workers and traffic police at junctions', 'Watch for vehicle fires on camera feeds'] }
    ],
    assemblyPoints: [
      { name: 'Parade Ground, Secunderabad (example)', at: [78.4980, 17.4430] },
      { name: 'NTR Gardens and Necklace Road (example)', at: [78.4700, 17.4120] },
      { name: 'LB Stadium grounds (example)', at: [78.4740, 17.3990] },
      { name: 'KBR Park gates (example)', at: [78.4210, 17.4230] },
      { name: 'Gachibowli Stadium grounds (example)', at: [78.3480, 17.4470] },
      { name: 'Uppal stadium car parks (example)', at: [78.5500, 17.4065] },
      { name: 'Osmania University grounds (example)', at: [78.5280, 17.4130] }
    ]
  },
  parking: {
    violationsPerDay: 900,
    sites: [
      { name: 'Abids multi-level car park', at: [78.4760, 17.3925], spaces: 900, kind: 'business' },
      { name: 'Charminar visitors', at: [78.4735, 17.3630], spaces: 500, kind: 'leisure' },
      { name: 'Secunderabad station car park', at: [78.5025, 17.4345], spaces: 1200, kind: 'mixed' },
      { name: 'Begumpet car park', at: [78.4680, 17.4450], spaces: 700, kind: 'business' },
      { name: 'Ameerpet metro car park', at: [78.4490, 17.4385], spaces: 600, kind: 'business' },
      { name: 'HITEC City car park', at: [78.3820, 17.4484], spaces: 2400, kind: 'business' },
      { name: 'Inorbit Mall car park', at: [78.3870, 17.4350], spaces: 2000, kind: 'leisure' },
      { name: 'Financial District car park', at: [78.3430, 17.4170], spaces: 3000, kind: 'business' },
      { name: 'Airport long stay', at: [78.4300, 17.2380], spaces: 3500, kind: 'mixed' },
      { name: 'Banjara Hills Road No. 1 on-street zone', at: [78.4480, 17.4180], spaces: 420, kind: 'business', street: true },
      { name: 'Koti on-street zone', at: [78.4840, 17.3850], spaces: 380, kind: 'business', street: true },
      { name: 'Kukatpally on-street zone', at: [78.4080, 17.4850], spaces: 650, kind: 'residential', street: true }
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
    zone: { at: [78.4750, 17.3950], radiusM: 6000 },
    hazmatVehicles: 5, hazmatFrom: [78.4500, 17.5100], hazmatTo: [78.5650, 17.4300],
    weighStations: [
      { name: 'Patancheru weigh station (example)', at: [78.2700, 17.5200], perHour: 180 },
      { name: 'Shamshabad weigh station (example)', at: [78.4100, 17.2700], perHour: 140 },
      { name: 'Jeedimetla checkpoint (example)', at: [78.4500, 17.5150], perHour: 110 }
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
        sample: '[{"plate":"TS09EA1234","time":"2026-11-17T06:10:22+05:30","camera_id":"CAM-0012","confidence":96.4,"class":"Car","lat":17.4539,"lon":78.3773,"speed":62,"lane":2},{"plate":"TS07UB8802","time":"2026-11-17T06:10:24+05:30","camera_id":"CAM-0012","confidence":91.2,"class":"Taxi","lat":17.4539,"lon":78.3773,"speed":58,"lane":1}]' },
      { id: 'cctv', name: 'CCTV with video analytics', cat: 'Cameras', connectors: ['kafka', 'onvif', 'mqtt', 'rest'], entity: 'VideoEvent', format: 'json',
        sample: '[{"event_id":"EV-88120","ts":"2026-11-17T06:11:02+05:30","camera":"CCTV-0231","type":"stopped_vehicle","score":0.91,"object":"car","lat":17.4667,"lon":78.3667,"snapshot":"https://vms.example/snap/88120.jpg","zone":"Lane 2"},{"event_id":"EV-88121","ts":"2026-11-17T06:11:40+05:30","camera":"CCTV-0102","type":"wrong_way","score":0.84,"object":"car","lat":17.431,"lon":78.441,"snapshot":"https://vms.example/snap/88121.jpg","zone":"Slip road"}]' },
      { id: 'thermal', name: 'Thermal camera', cat: 'Cameras', connectors: ['onvif', 'mqtt', 'rest'], entity: 'VideoEvent', format: 'json',
        sample: '[{"event_id":"TH-2201","ts":"2026-11-17T06:14:10+05:30","camera":"THM-T2-04","type":"fire","score":0.88,"object":"vehicle","zone":"Tunnel bore 2"},{"event_id":"TH-2202","ts":"2026-11-17T06:15:31+05:30","camera":"THM-T2-07","type":"pedestrian","score":0.79,"object":"person","zone":"Tunnel bore 2"}]' },
      { id: 'enforcement', name: 'Speed and red-light enforcement camera', cat: 'Cameras', connectors: ['rest', 'sftp', 'kafka'], entity: 'SpeedMeasurement', format: 'json',
        sample: '[{"site":"ENF-ORR-04","captured":"17/11/2026 06:12:40","speed_kmh":147,"limit_kmh":120,"lane":3,"plate":"TS09FA5521","veh_class":"Car","direction":"Southbound"},{"site":"ENF-ORR-04","captured":"17/11/2026 06:13:05","speed_kmh":133,"limit_kmh":120,"lane":2,"plate":"SHJ 4410","veh_class":"Car","direction":"Southbound"}]' },
      { id: 'speed-radar', name: 'Speed radar', cat: 'Radar and LiDAR', connectors: ['rest', 'socket', 'mqtt'], entity: 'SpeedMeasurement', format: 'json',
        sample: '[{"radar":"RAD-07","t":"2026-11-17T06:12:03+05:30","kmh":138.4,"limit":120,"lane":2,"dir":"NB","cls":"car","len_m":4.6},{"radar":"RAD-07","t":"2026-11-17T06:12:04+05:30","kmh":96.0,"limit":120,"lane":1,"dir":"NB","cls":"truck","len_m":11.8}]' },
      { id: 'traffic-radar', name: 'Traffic counting radar', cat: 'Radar and LiDAR', connectors: ['mqtt', 'socket', 'rest'], entity: 'TrafficReading', format: 'json',
        sample: '[{"unit":"TR-112","ts":1794881400,"lane":1,"volume":1320,"avg_speed":84.2,"occupancy":14.6},{"unit":"TR-112","ts":1794881400,"lane":2,"volume":1188,"avg_speed":79.5,"occupancy":16.1}]' },
      { id: 'lidar', name: 'LiDAR sensor', cat: 'Radar and LiDAR', connectors: ['socket', 'websocket', 'kafka'], entity: 'ObjectTrack', format: 'json',
        sample: '{"sensor":"LID-J12","frame_ts":1794881400123,"objects":[{"id":4411,"cls":"pedestrian","x":12.4,"y":-3.1,"speed_ms":1.4,"heading":92,"l":0.6,"w":0.6,"h":1.7,"zone":"Crossing N"},{"id":4412,"cls":"car","x":-8.2,"y":15.9,"speed_ms":9.8,"heading":181,"l":4.5,"w":1.9,"h":1.5,"zone":"Approach E"},{"id":4413,"cls":"bicycle","x":3.3,"y":7.0,"speed_ms":4.9,"heading":178,"l":1.8,"w":0.6,"h":1.6,"zone":"Approach E"}]}' },
      { id: 'tracking-radar', name: 'Tracking radar (junction or perimeter)', cat: 'Radar and LiDAR', connectors: ['socket', 'websocket', 'kafka'], entity: 'ObjectTrack', format: 'json',
        sample: '{"radar":"RDR-P03","time":"2026-11-17T06:12:05.250+05:30","tracks":[{"track":88,"class":"Truck","lat":17.4281,"lon":78.4372,"speed_kmh":71,"heading_deg":14,"length_m":12.5},{"track":91,"class":"Car","lat":17.4283,"lon":78.4369,"speed_kmh":64,"heading_deg":193,"length_m":4.4}]}' },
      { id: 'loop', name: 'Loop or detector station', cat: 'Traffic field equipment', connectors: ['mqtt', 'snmp', 'rest'], entity: 'TrafficReading', format: 'json',
        sample: '[{"det":"DET-014","ts":1794881400,"q":1260,"v":71.5,"occ":18.2,"lane":1},{"det":"DET-014","ts":1794881400,"q":1104,"v":66.0,"occ":21.7,"lane":2}]' },
      { id: 'signal', name: 'Signal controller', cat: 'Traffic field equipment', connectors: ['snmp', 'rest', 'soap'], entity: 'SignalStatus', format: 'json',
        sample: '[{"junction":"J-12","time":"2026-11-17T06:00:00+05:30","mode":"Normal","plan":"P3","phase":2,"cycle":90},{"junction":"J-15","time":"2026-11-17T06:00:05+05:30","mode":"Flashing","plan":"P1","phase":1,"cycle":120}]' },
      { id: 'vms', name: 'Variable message sign', cat: 'Traffic field equipment', connectors: ['snmp', 'rest'], entity: 'DeviceHealth', format: 'json',
        sample: '[{"sign":"VMS-E11-03","polled":"2026-11-17T06:10:00+05:30","state":"Online","type":"Variable message sign","temp_c":41.5,"fw":"3.2.1","last_error":""},{"sign":"VMS-E11-07","polled":"2026-11-17T06:10:00+05:30","state":"Degraded","type":"Variable message sign","temp_c":58.9,"fw":"3.2.1","last_error":"Pixel faults: 14"}]' },
      { id: 'air', name: 'Air quality and noise station', cat: 'IoT sensors', connectors: ['mqtt', 'lorawan', 'rest'], entity: 'EnvironmentReading', format: 'json',
        sample: '[{"station":"AQ-03","time":"2026-11-17T06:00:00+05:30","pm2_5":38.2,"pm10":91.0,"no2":44.1,"noise_db":66.3,"temp_c":27.4,"rh":58},{"station":"AQ-07","time":"2026-11-17T06:00:00+05:30","pm2_5":52.9,"pm10":120.4,"no2":61.0,"noise_db":71.8,"temp_c":27.9,"rh":55}]' },
      { id: 'weather', name: 'Road weather station', cat: 'IoT sensors', connectors: ['rest', 'mqtt'], entity: 'WeatherReading', format: 'json',
        sample: '[{"station_id":"RWIS-07","obs_time":"2026-11-17T06:00:00+05:30","air_temp":27.1,"road_temp":29.8,"humidity":61,"wind_speed":14,"wind_dir":310,"visibility":8000,"rain_mm_h":0,"road_condition":"Dry"},{"station_id":"RWIS-09","obs_time":"2026-11-17T06:00:00+05:30","air_temp":26.4,"road_temp":28.9,"humidity":83,"wind_speed":6,"wind_dir":295,"visibility":350,"rain_mm_h":0,"road_condition":"Fog"}]' },
      { id: 'parking', name: 'Parking bay sensor', cat: 'IoT sensors', connectors: ['lorawan', 'mqtt', 'rest'], entity: 'ParkingOccupancy', format: 'json',
        sample: '[{"dev_eui":"70B3D57ED0051A2C","received_at":"2026-11-17T02:09:41Z","facility":"PK-ABIDS-2","bay":"B-114","occupied":true,"battery":87},{"dev_eui":"70B3D57ED0051A2D","received_at":"2026-11-17T02:09:55Z","facility":"PK-ABIDS-2","bay":"B-115","occupied":false,"battery":91}]' },
      { id: 'streetlight', name: 'Smart streetlight controller', cat: 'IoT sensors', connectors: ['lorawan', 'mqtt', 'rest'], entity: 'SensorReading', format: 'json',
        sample: '[{"device":"SL-4471","ts":"2026-11-17T06:10:00+05:30","metric":"power_w","value":86.5,"unit":"W","quality":"Good"},{"device":"SL-4472","ts":"2026-11-17T06:10:00+05:30","metric":"power_w","value":0,"unit":"W","quality":"Suspect"}]' },
      { id: 'flood', name: 'Water level and flood sensor', cat: 'IoT sensors', connectors: ['lorawan', 'mqtt'], entity: 'SensorReading', format: 'json',
        sample: '[{"device":"WL-09","ts":"2026-11-17T06:10:00+05:30","metric":"water_level_cm","value":3.2,"unit":"cm","battery":78},{"device":"WL-12","ts":"2026-11-17T06:10:00+05:30","metric":"water_level_cm","value":0.4,"unit":"cm","battery":64}]' },
      { id: 'iot', name: 'Other IoT sensor', cat: 'IoT sensors', connectors: ['mqtt', 'lorawan', 'opcua', 'modbus', 'rest'], entity: 'SensorReading', format: 'json',
        sample: '[{"device":"TUN-FAN-01","ts":"2026-11-17T06:10:00+05:30","metric":"fan_speed_rpm","value":1180,"unit":"rpm","quality":"Good"},{"device":"TUN-CO-03","ts":"2026-11-17T06:10:00+05:30","metric":"co_ppm","value":7.5,"unit":"ppm","quality":"Good"}]' },
      { id: 'avl', name: 'Bus and fleet tracker (GPS)', cat: 'Vehicles', connectors: ['kafka', 'websocket', 'rest'], entity: 'TransitPosition', format: 'json',
        sample: '[{"vehicle":"BUS-2231","route":"054","gps_time":"2026-11-17T06:12:00+05:30","lat":17.4702,"lon":78.3711,"speed":34,"delay_s":95,"occupancy":62},{"vehicle":"BUS-2260","route":"032","gps_time":"2026-11-17T06:12:02+05:30","lat":17.4488,"lon":78.3954,"speed":0,"delay_s":-20,"occupancy":41}]' },
      { id: 'health', name: 'Device health (cameras, radars, network)', cat: 'Infrastructure health', connectors: ['snmp', 'rest', 'mqtt'], entity: 'DeviceHealth', format: 'json',
        sample: '[{"device_id":"CAM-0012","type":"ANPR camera","polled_at":"2026-11-17T06:10:00+05:30","status":"Online","uptime_s":1843200,"temp_c":48.2,"cpu":37,"storage":61,"firmware":"7.4.2","signal":-67},{"device_id":"RAD-07","type":"Speed radar","polled_at":"2026-11-17T06:10:00+05:30","status":"Degraded","uptime_s":86400,"temp_c":63.5,"cpu":88,"storage":40,"firmware":"2.1.0","signal":-81,"last_error":"Heater fault"}]' },
      { id: 'cabinet', name: 'Cabinet, power and UPS', cat: 'Infrastructure health', connectors: ['modbus', 'snmp'], entity: 'DeviceHealth', format: 'json',
        sample: '[{"cabinet":"CAB-J12","ts":"2026-11-17T06:10:00+05:30","state":"Online","type":"Roadside cabinet","voltage":26.8,"temp_c":44.0},{"cabinet":"CAB-J15","ts":"2026-11-17T06:10:00+05:30","state":"Degraded","type":"Roadside cabinet","voltage":22.1,"temp_c":57.3,"last_error":"On battery"}]' },
      { id: 'cad', name: 'Control room or incident system', cat: 'Systems', connectors: ['sftp', 'rest', 'sql', 'soap'], entity: 'Incident', format: 'csv',
        sample: 'Incident Ref;Reported;Category;Priority;Lat;Lon;Details;State\nINC-2026-118204;17/11/2026 05:42;Accident;Critical;17.4667;78.3667;Two vehicles, lane 2 blocked;Open\nINC-2026-118205;17/11/2026 05:51;Breakdown;Medium;17.4310;78.4410;Stalled lorry on hard shoulder;Acknowledged' }
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
        config: { url: 'https://anpr-vendor.example/api/v2/reads', method: 'GET', paging: 'Since last timestamp' }, auth: { type: 'API key', ref: 'vault://urbaniq/anpr-vendor/api-key' }, every: '10 seconds',
        sample: '{\n  "vendor": "ANPR Vendor",\n  "count": 6,\n  "events": [\n    { "plate_no": "ts09ea1234", "capture_time": "17/11/2026 06:10:22", "device_code": "CAM-0012", "confidence_score": 96.4, "vehicle_type": "car", "location": { "lat": 17.4539, "lon": 78.3773 }, "speed": 62, "lane": 2 },\n    { "plate_no": "ts07ub8802", "capture_time": "17/11/2026 06:10:24", "device_code": "CAM-0012", "confidence_score": 91.2, "vehicle_type": "taxi", "location": { "lat": 17.4539, "lon": 78.3773 }, "speed": 58, "lane": 1 },\n    { "plate_no": "TS08UC7041", "capture_time": "17/11/2026 06:10:31", "device_code": "CAM-0047", "confidence_score": 88.75, "vehicle_type": "truck", "location": { "lat": 17.4281, "lon": 78.4372 }, "speed": 74, "lane": 3 },\n    { "plate_no": "ts11ub5120", "capture_time": "17/11/2026 06:10:40", "device_code": "CAM-0047", "confidence_score": 79.1, "vehicle_type": "bus", "location": { "lat": 17.4281, "lon": 78.4372 }, "speed": 51, "lane": 3 },\n    { "plate_no": "ts13eb3097", "capture_time": "17/11/2026 06:10:44", "device_code": "CAM-0103", "confidence_score": 93.0, "vehicle_type": "pickup", "location": { "lat": 17.4912, "lon": 78.3606 }, "speed": 66, "lane": 1 },\n    { "plate_no": "ts09ea1234", "capture_time": "17/11/2026 06:10:22", "device_code": "CAM-0012", "confidence_score": 96.4, "vehicle_type": "car", "location": { "lat": 17.4539, "lon": 78.3773 }, "speed": 62, "lane": 2 }\n  ]\n}',
        rules: [
          { sourcePath: 'plate_no', targetPath: 'plateNumber', transform: 'uppercase', required: true },
          { sourcePath: 'capture_time', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'dd/MM/yyyy HH:mm:ss', tz: '+05:30' }, required: true },
          { sourcePath: 'device_code', targetPath: 'cameraId', transform: 'direct', required: true },
          { sourcePath: 'confidence_score', targetPath: 'confidence', transform: 'toDecimal', args: { decimals: 1 } },
          { sourcePath: 'vehicle_type', targetPath: 'vehicleClass', transform: 'lookup', args: { table: 'car=Car\ntaxi=Taxi\nbus=Bus\nvan=Light goods\ntruck=Heavy vehicle\nmotorbike=Motorcycle', fallback: '' } }
        ] },
      { id: 'roadside-detectors', name: 'Roadside detectors', device: 'loop', connector: 'mqtt', entity: 'TrafficReading', status: 'published', format: 'json', ratePerSec: 520, platformFeed: 'Traffic detectors',
        config: { broker: 'mqtts://roadside-broker.example:8883', topic: 'roadside/+/readings', qos: '1' }, auth: { type: 'Client certificate (mTLS)', ref: 'vault://urbaniq/roadside/client-cert' },
        sample: '[\n  { "det": "DET-014", "ts": 1794881400, "q": 1260, "v": 71.5, "occ": 18.2, "lane": 1 },\n  { "det": "DET-014", "ts": 1794881400, "q": 1104, "v": 66.0, "occ": 21.7, "lane": 2 },\n  { "det": "DET-022", "ts": 1794881400, "q": 1832, "v": 38.4, "occ": 44.9, "lane": 1 },\n  { "det": "DET-031", "ts": 1794881460, "q": 640, "v": 92.3, "occ": 7.5, "lane": 1 }\n]',
        rules: [
          { sourcePath: 'det', targetPath: 'detectorId', transform: 'direct', required: true },
          { sourcePath: 'ts', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'epoch-s', tz: '+00:00' }, required: true },
          { sourcePath: 'q', targetPath: 'flowVehPerHour', transform: 'toInteger' }, { sourcePath: 'v', targetPath: 'speedKmh', transform: 'toDecimal', args: { decimals: 1 } },
          { sourcePath: 'occ', targetPath: 'occupancyPct', transform: 'toDecimal', args: { decimals: 1 } }, { sourcePath: 'lane', targetPath: 'lane', transform: 'direct' }
        ] },
      { id: 'control-room-incidents', name: 'Control room incidents', device: 'cad', connector: 'sftp', entity: 'Incident', status: 'published', format: 'csv', ratePerSec: 0.6, platformFeed: 'Incident reports',
        config: { host: 'sftp.control-room.example:22', path: '/outbound/incidents', pattern: 'incidents_*.csv' }, auth: { type: 'Basic (user and password)', ref: 'vault://urbaniq/control-room/sftp' }, every: '1 minute',
        sample: 'Incident Ref;Reported;Category;Priority;Lat;Lon;Details;State\nINC-2026-118204;17/11/2026 05:42;RTA;P1;17.4667;78.3667;Two vehicles, lane 2 blocked;OPEN\nINC-2026-118205;17/11/2026 05:51;BRK;P3;17.4310;78.4410;Stalled lorry on hard shoulder;ACK\nINC-2026-118206;17/11/2026 06:03;OBS;P2;17.4895;78.3582;Debris in lane 1;OPEN\nINC-2026-118207;17/11/2026 06:15;RWK;P4;17.4532;78.3901;Night works overrun;CLOSED',
        rules: [
          { sourcePath: 'Incident Ref', targetPath: 'incidentId', transform: 'direct', required: true },
          { sourcePath: 'Reported', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'dd/MM/yyyy HH:mm', tz: '+05:30' }, required: true },
          { sourcePath: 'Category', targetPath: 'type', transform: 'lookup', args: { table: 'RTA=Accident\nBRK=Breakdown\nRWK=Roadworks\nOBS=Obstruction\nFLD=Flooding', fallback: 'Other' }, required: true },
          { sourcePath: 'Priority', targetPath: 'severity', transform: 'lookup', args: { table: 'P1=Critical\nP2=High\nP3=Medium\nP4=Low', fallback: '' } },
          { sourcePath: 'Lat', targetPath: 'latitude', transform: 'toDecimal', args: { decimals: 5 }, required: true }, { sourcePath: 'Lon', targetPath: 'longitude', transform: 'toDecimal', args: { decimals: 5 }, required: true },
          { sourcePath: 'Details', targetPath: 'description', transform: 'trim' },
          { sourcePath: 'State', targetPath: 'status', transform: 'lookup', args: { table: 'OPEN=Open\nACK=Acknowledged\nCLOSED=Closed', fallback: '' } }
        ] },
      { id: 'speed-radars', name: 'Speed radar network', device: 'speed-radar', connector: 'rest', entity: 'SpeedMeasurement', status: 'published', format: 'json', ratePerSec: 95,
        config: { url: 'https://radar-vendor.example/api/measurements', method: 'GET', paging: 'Cursor' }, auth: { type: 'OAuth 2.0 client credentials', ref: 'vault://urbaniq/radar-vendor/oauth' }, every: '10 seconds',
        sample: '[\n  { "radar": "RAD-07", "t": "2026-11-17T06:12:03+05:30", "kmh": 138.4, "limit": 120, "lane": 2, "dir": "NB", "cls": "car", "len_m": 4.6 },\n  { "radar": "RAD-07", "t": "2026-11-17T06:12:04+05:30", "kmh": 96.0, "limit": 120, "lane": 1, "dir": "NB", "cls": "truck", "len_m": 11.8 },\n  { "radar": "RAD-11", "t": "2026-11-17T06:12:04+05:30", "kmh": 151.9, "limit": 140, "lane": 3, "dir": "SB", "cls": "car", "len_m": 4.9 },\n  { "radar": "RAD-11", "t": "2026-11-17T06:12:07+05:30", "kmh": 88.3, "limit": 140, "lane": 1, "dir": "SB", "cls": "bus", "len_m": 12.0 }\n]',
        rules: [
          { sourcePath: 'radar', targetPath: 'deviceId', transform: 'direct', required: true }, { sourcePath: 't', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'auto', tz: '+05:30' }, required: true },
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
        config: { brokers: 'vms-broker-1:9092, vms-broker-2:9092', topic: 'vms.analytics.events', group: 'urbaniq-ingest', offset: 'Latest' }, auth: { type: 'Client certificate (mTLS)', ref: 'vault://urbaniq/vms/client-cert' },
        sample: '[\n  { "event_id": "EV-88120", "ts": "2026-11-17T06:11:02+05:30", "camera": "CCTV-0231", "type": "stopped_vehicle", "score": 0.91, "object": "car", "lat": 17.4667, "lon": 78.3667, "snapshot": "https://vms.example/snap/88120.jpg", "zone": "Lane 2" },\n  { "event_id": "EV-88121", "ts": "2026-11-17T06:11:40+05:30", "camera": "CCTV-0102", "type": "wrong_way", "score": 0.84, "object": "car", "lat": 17.4310, "lon": 78.4410, "snapshot": "https://vms.example/snap/88121.jpg", "zone": "Slip road" },\n  { "event_id": "EV-88122", "ts": "2026-11-17T06:12:15+05:30", "camera": "CCTV-0417", "type": "pedestrian", "score": 0.77, "object": "person", "lat": 17.4895, "lon": 78.3582, "snapshot": "https://vms.example/snap/88122.jpg", "zone": "Carriageway" }\n]',
        rules: [
          { sourcePath: 'event_id', targetPath: 'eventId', transform: 'direct', required: true }, { sourcePath: 'ts', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'auto', tz: '+05:30' }, required: true },
          { sourcePath: 'camera', targetPath: 'cameraId', transform: 'direct', required: true },
          { sourcePath: 'type', targetPath: 'eventType', transform: 'lookup', args: { table: 'stopped_vehicle=Stopped vehicle\nwrong_way=Wrong way\npedestrian=Pedestrian on road\ncrowd=Crowd\nintrusion=Intrusion\nfire=Smoke or fire\ndebris=Debris\nqueue=Queue', fallback: 'Other' }, required: true },
          { sourcePath: 'score', targetPath: 'confidence', transform: 'scale', args: { factor: 100, offset: 0, decimals: 1 } }, { sourcePath: 'object', targetPath: 'objectClass', transform: 'direct' },
          { sourcePath: 'lat', targetPath: 'latitude', transform: 'direct' }, { sourcePath: 'lon', targetPath: 'longitude', transform: 'direct' }, { sourcePath: 'snapshot', targetPath: 'snapshotUrl', transform: 'direct' }, { sourcePath: 'zone', targetPath: 'zone', transform: 'direct' }
        ] },
      { id: 'field-device-health', name: 'Field device health', device: 'health', connector: 'snmp', entity: 'DeviceHealth', status: 'published', format: 'json', ratePerSec: 12,
        config: { host: 'nms.field.example:161', version: 'v3', objects: '1.3.6.1.2.1.1.3.0\n1.3.6.1.4.1.99999.1.2' }, auth: { type: 'Basic (user and password)', ref: 'vault://urbaniq/nms/snmpv3' }, every: '1 minute',
        sample: '[\n  { "device_id": "CAM-0012", "type": "ANPR camera", "polled_at": "2026-11-17T06:10:00+05:30", "status": "up", "uptime_s": 1843200, "temp_c": 48.2, "cpu": 37, "disk": 61, "fw": "7.4.2", "rssi": -67 },\n  { "device_id": "RAD-07", "type": "Speed radar", "polled_at": "2026-11-17T06:10:00+05:30", "status": "degraded", "uptime_s": 86400, "temp_c": 63.5, "cpu": 88, "disk": 40, "fw": "2.1.0", "rssi": -81, "last_error": "Heater fault" },\n  { "device_id": "LID-J12", "type": "LiDAR", "polled_at": "2026-11-17T06:10:00+05:30", "status": "down", "uptime_s": 0, "fw": "1.9.3", "last_error": "No response" }\n]',
        rules: [
          { sourcePath: 'device_id', targetPath: 'deviceId', transform: 'direct', required: true }, { sourcePath: 'polled_at', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'auto', tz: '+05:30' }, required: true },
          { sourcePath: 'status', targetPath: 'status', transform: 'lookup', args: { table: 'up=Online\ndegraded=Degraded\ndown=Offline\nmaintenance=Maintenance', fallback: '' }, required: true },
          { sourcePath: 'type', targetPath: 'deviceType', transform: 'direct' }, { sourcePath: 'uptime_s', targetPath: 'uptimeSec', transform: 'toInteger' }, { sourcePath: 'temp_c', targetPath: 'temperatureC', transform: 'toDecimal', args: { decimals: 1 } },
          { sourcePath: 'cpu', targetPath: 'cpuPct', transform: 'direct' }, { sourcePath: 'disk', targetPath: 'storagePct', transform: 'direct' }, { sourcePath: 'fw', targetPath: 'firmware', transform: 'direct' },
          { sourcePath: 'rssi', targetPath: 'signalDbm', transform: 'direct' }, { sourcePath: 'last_error', targetPath: 'lastError', transform: 'trim' }
        ] },
      { id: 'air-quality-stations', name: 'Air quality stations', device: 'air', connector: 'mqtt', entity: 'EnvironmentReading', status: 'published', format: 'json', ratePerSec: 6, platformFeed: 'Environmental sensors',
        config: { broker: 'mqtts://iot-broker.example:8883', topic: 'city/air/+/reading', qos: '1' }, auth: { type: 'Client certificate (mTLS)', ref: 'vault://urbaniq/iot/client-cert' },
        sample: '[\n  { "station": "AQ-03", "time": "2026-11-17T06:00:00+05:30", "pm2_5": 38.2, "pm10": 91.0, "no2": 44.1, "noise_db": 66.3, "temp_c": 27.4, "rh": 58 },\n  { "station": "AQ-07", "time": "2026-11-17T06:00:00+05:30", "pm2_5": 52.9, "pm10": 120.4, "no2": 61.0, "noise_db": 71.8, "temp_c": 27.9, "rh": 55 },\n  { "station": "AQ-11", "time": "2026-11-17T06:00:00+05:30", "pm2_5": 21.7, "pm10": 64.3, "no2": 18.6, "noise_db": 58.2, "temp_c": 26.8, "rh": 63 }\n]',
        rules: [
          { sourcePath: 'station', targetPath: 'stationId', transform: 'direct', required: true }, { sourcePath: 'time', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'auto', tz: '+05:30' }, required: true },
          { sourcePath: 'pm2_5', targetPath: 'pm25', transform: 'direct' }, { sourcePath: 'pm10', targetPath: 'pm10', transform: 'direct' }, { sourcePath: 'no2', targetPath: 'no2', transform: 'direct' },
          { sourcePath: 'noise_db', targetPath: 'noiseDb', transform: 'direct' }, { sourcePath: 'temp_c', targetPath: 'temperatureC', transform: 'direct' }, { sourcePath: 'rh', targetPath: 'humidityPct', transform: 'direct' }
        ] }
    ],
    // Reusable mappings for vendors with similar payloads.
    templates: [
      { name: 'Plate read, generic ANPR', entity: 'VehicleDetection', rules: [
        { sourcePath: 'plate', targetPath: 'plateNumber', transform: 'uppercase', required: true }, { sourcePath: 'time', targetPath: 'timestamp', transform: 'dateFormat', args: { format: 'auto', tz: '+05:30' }, required: true },
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
      { name: 'Patrol unit, Abids', lon: 78.4747, lat: 17.3916 },
      { name: 'Patrol unit, Charminar', lon: 78.4747, lat: 17.3616 },
      { name: 'Patrol unit, Secunderabad', lon: 78.5016, lat: 17.4337 },
      { name: 'Patrol unit, Banjara Hills', lon: 78.4400, lat: 17.4150 },
      { name: 'Patrol unit, HITEC City', lon: 78.3810, lat: 17.4474 },
      { name: 'Patrol unit, Kukatpally', lon: 78.4070, lat: 17.4840 },
      { name: 'Patrol unit, LB Nagar', lon: 78.5520, lat: 17.3460 }
    ]
  },

  /* ---- Critical zones ------------------------------------------------------------------------ */
  // Sites watched for traffic problems around them. Positions come from OpenStreetMap through the
  // data build; add your own in "custom". A site goes on WATCH when traffic within its radius is
  // slow, and into ALERT when it is very slow or an accident or event is active inside the radius.
  zones: {
    radiusM: 500,
    watchRatioBelow: 0.6,           // traffic speed as a share of the limit
    alertRatioBelow: 0.4,
    minVehicles: 25,                // ignore near-empty surroundings
    alert: true,                    // raise an alert when a site goes into ALERT
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
    valueOfTimePerHour: 150,         // value of time, rupees per vehicle-hour (assumed)
    workingDaysPerYear: 250,
    co2: { baseGPerKm: 150, congestionGKmh: 2500,       // g/km = base + congestion ÷ speed (km/h)
      typeFactor: { car: 1, taxi: 1, van: 1.5, lorry: 4, bus: 4.5, moto: 0.5 } },   // emissions per km against a car
    // Example targets for the City scorecard. They are illustrations, not official targets; set your own.
    targets: {
      venuesHighPct: 20, schoolZonesOkPct: 60, adaptiveCorridorsPct: 50, assetHealth: 85, planConflicts: 0, busLateMin: 3,
      peakSpeedKmh: 45, extraTravelPct: 25, dailyDelayVehH: 120000, criticalRoads: 20, junctionsEFPct: 20, busOnTimePct: 85,
      accidentsPerDay: 60, seriousAccidentsPerDay: 2, accidentsWorstHour: 6, criticalAlertsOpen: 0,
      finesPerDay: 12000, finesWorstHour: 1000, topViolationSharePct: 50, topSitesSharePct: 25,
      sitesMonitored: 500, sitesOnAlertPct: 2, camerasOnlinePct: 97,
      co2TonnesPerDay: 7000, aqi: 100, noiseDb: 70,
      flightsOnTimePct: 80, flightDelayMin: 15, berthUsePct: 85,
      futureSpeedKmh: 40, futureCriticalRoads: 40, cycleKm: 300, delayCostMillion: 9000
    },
    // Population: Census of India 2011 (the latest census), with districts as re-drawn in 2016. growthPerYear is the
    // 2001–2011 average for the state; projections assume it held, so treat them as rough context only.
    population: { area: 'Telangana', total: 35003674, year: 2011, source: 'Census of India 2011', growthPerYear: 0.0128, growthFrom: '2001–2011',
      partsLabel: 'Hyderabad metro districts', parts: [['Hyderabad', 3943323], ['Ranga Reddy', 2446265], ['Medchal–Malkajgiri', 2440073]] }
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
  language: { default: 'en', available: ['en', 'te'] }   // English and Telugu
};
