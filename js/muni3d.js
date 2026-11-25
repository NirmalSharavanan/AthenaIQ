/* AthenaIQ Municipality: 3D models, simulations and the collection-route planner.
 *
 *   3D models (street zoom)   smart bins with a fill gauge and sensor beacon · refuse trucks, sweepers and crew vans
 *                             that drive the road network · street-light poles with lamp heads and light pools ·
 *                             water metered areas raised by night flow · air-quality columns over each sensor
 *   Building energy           3D buildings coloured by estimated energy use for the hour of day
 *   Weather in 3D             rain, snow, Saharan dust, wildfire smoke or fog particles moving with the wind
 *   Route planner             depot, bin type, fill threshold, trucks, capacity, stop limit, optimisation goal;
 *                             routes follow the model road network; a collection run can be played on the map
 *
 * Everything here is synthetic or estimated, built on real roads, buildings and weather; the cards say which.
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, CFG = C.CFG, $ = C.$, num = C.num, clock = C.clock, state = T.state, K = T.kit;
  var G = function () { return T.greece || {}; }, ATH = C.region.isDefault;
  var meta = C.meta() || {}, bb = meta.bbox || [23.55, 37.85, 23.98, 38.12], kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180), ky = 110570;
  function m(a, b) { return Math.hypot((a[0] - b[0]) * kx, (a[1] - b[1]) * ky); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function set(id, html) { var el = $(id); if (el) { el.innerHTML = html; } }
  function box(id) { var b = $(id); return !b || b.checked; }
  function zoom() { var mp = T.getMap(); return mp ? mp.getZoom() : 12; }
  function muniOpen() { return K.tabOpen('muni') || box('showMuniAll') && $('showMuniAll') && $('showMuniAll').checked; }
  function on() { return box('showMuni3d') && muniOpen() && zoom() >= 15; }

  /* ============================== meshes (metres; front along +X) ============================== */
  function hexa(out, x0, x1, y0, y1, z0, z1) {
    var c = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
    [[0, 3, 2, 1], [4, 5, 6, 7], [1, 2, 6, 5], [0, 4, 7, 3], [0, 1, 5, 4], [3, 7, 6, 2]].forEach(function (f) {
      var a = c[f[0]], b = c[f[1]], d = c[f[2]], e = c[f[3]];
      var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      [a, b, d, a, d, e].forEach(function (p) { out.pos.push(p[0], p[1], p[2]); out.nor.push(nx / len, ny / len, nz / len); });
    });
  }
  function mesh(fn) { var g = { pos: [], nor: [] }; fn(g); return { positions: { value: new Float32Array(g.pos), size: 3 }, normals: { value: new Float32Array(g.nor), size: 3 }, texCoords: { value: new Float32Array(g.pos.length / 3 * 2), size: 2 } }; }
  var BIN = mesh(function (g) { hexa(g, -0.62, 0.62, -0.5, 0.5, 0.12, 1.25); hexa(g, -0.68, 0.68, -0.56, 0.56, 1.25, 1.36); });
  var BIN_DARK = mesh(function (g) { [[-0.45, -0.5], [0.45, -0.5], [-0.45, 0.44], [0.45, 0.44]].forEach(function (w) { hexa(g, w[0] - 0.08, w[0] + 0.08, w[1], w[1] + 0.06, 0, 0.16); }); hexa(g, -0.7, -0.62, -0.4, 0.4, 0.9, 1.1); });
  var TRUCK = mesh(function (g) { hexa(g, -4.2, 2.0, -1.2, 1.2, 0.7, 3.4); hexa(g, 2.1, 3.9, -1.2, 1.2, 0.7, 2.9); });
  var VAN = mesh(function (g) { hexa(g, -2.5, 1.6, -1.0, 1.0, 0.45, 2.3); hexa(g, 1.6, 2.6, -1.0, 1.0, 0.45, 1.5); });
  var SWEEP = mesh(function (g) { hexa(g, -1.8, 1.2, -0.85, 0.85, 0.5, 2.2); hexa(g, 1.2, 2.2, -0.9, 0.9, 0.2, 0.5); });
  var WHEELS_T = mesh(function (g) { [[-3, -1.3], [-1.4, -1.3], [3, -1.3], [-3, 1.1], [-1.4, 1.1], [3, 1.1]].forEach(function (w) { hexa(g, w[0] - 0.5, w[0] + 0.5, w[1], w[1] + 0.2, 0, 1.0); }); hexa(g, 3.4, 3.92, -1.1, 1.1, 1.6, 2.6); });
  var WHEELS_V = mesh(function (g) { [[-1.7, -1.1], [1.7, -1.1], [-1.7, 0.92], [1.7, 0.92]].forEach(function (w) { hexa(g, w[0] - 0.36, w[0] + 0.36, w[1], w[1] + 0.18, 0, 0.7); }); hexa(g, 1.9, 2.62, -0.95, 0.95, 1.5, 2.2); });
  function meshFor(type) { return /truck/i.test(type) ? [TRUCK, WHEELS_T] : /sweeper/i.test(type) ? [SWEEP, WHEELS_V] : [VAN, WHEELS_V]; }
  var BIN_COL = { 'Mixed': [46, 120, 70], 'Recycling (blue)': [40, 110, 200], 'Organic (brown)': [130, 84, 50] };
  function lvlCol(f) { return f >= 95 ? [208, 59, 59] : f >= 75 ? [236, 131, 40] : f >= 50 ? [240, 195, 40] : [40, 170, 100]; }
  function scale() { var z = zoom(); return z >= 17.5 ? 1.6 : z >= 16.5 ? 2.4 : z >= 15.5 ? 3.4 : 4.6; }
  function inView(at, pad) { var mp = T.getMap(); if (!mp) { return true; } var b = mp.getBounds(), p = pad || 0.003; return at[0] > b.getWest() - p && at[0] < b.getEast() + p && at[1] > b.getSouth() - p && at[1] < b.getNorth() + p; }
  var pulse = 0;

  /* ============================== route planner ============================== */
  var DEPOTS = ATH ? [['Elaionas municipal depot', 23.6930, 37.9860], ['Schisto transfer station', 23.6200, 38.0060], ['Fyli (Ano Liosia) landfill', 23.6600, 38.0700]] : [['Municipal depot', 0, 0]];
  var plan = null, sim = null, runs = 0;
  function depotAt(k) { var d = DEPOTS[k] || DEPOTS[0]; return d[1] ? [d[1], d[2]] : (G().centre ? G().centre() : [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2]); }
  function opts() {
    var v = function (id, def) { var el = $(id); return el ? el.value : def; };
    return { depot: +v('mpDepot', 0), kind: v('mpKind', ''), thr: +v('mpThr', 75), trucks: +v('mpTrucks', 2), cap: +v('mpCap', 12), stops: +v('mpStops', 25), goal: v('mpGoal', 'near') };
  }
  function legTime(leg) { var E = C.edges(), mins = 0; leg.links.forEach(function (i) { var e = E[i]; mins += (e.m || 0) / Math.max(6, (e.s || 40) * Math.max(0.15, C.ratio(i))) * 3.6 / 60; }); return mins; }
  function legKm(leg) { var E = C.edges(), km = 0; leg.links.forEach(function (i) { km += (E[i].m || 0) / 1000; }); return km; }
  function makePlan() {
    var o = opts(), g = G(); if (!g.bins || !T.response) { return null; }
    var depot = depotAt(o.depot), cand = g.bins().filter(function (b) { return g.fill(b) >= o.thr && (!o.kind || b.kind === o.kind); });
    cand.forEach(function (b) { b._ang = Math.atan2((b.at[1] - depot[1]) * ky, (b.at[0] - depot[0]) * kx); });
    cand.sort(function (a, b) { return a._ang - b._ang; });
    var per = Math.ceil(cand.length / Math.max(1, o.trucks)), COLS = [[40, 120, 200], [230, 120, 30], [150, 90, 210], [30, 170, 120]], trucks = [], left = 0;
    for (var t = 0; t < o.trucks; t++) {
      var grp = cand.slice(t * per, (t + 1) * per), stops = [], cur = depot, load = 0, path = [depot], km = 0, mins = 0, trips = 1, pool = grp.slice();
      while (pool.length && stops.length < o.stops) {
        var bi = 0, best = 1e18;
        pool.forEach(function (b, i) {
          var d = m(cur, b.at), f = g.fill(b), cost = o.goal === 'full' ? d / Math.pow(f / 50, 2) : o.goal === 'traffic' ? d * (1 + 2.5 * (1 - (b.i != null ? C.ratio(b.i) : 1))) : d;
          if (cost < best) { best = cost; bi = i; }
        });
        var b = pool.splice(bi, 1)[0], w = g.fill(b) / 100 * 0.11;
        if (load + w > o.cap) { var back = T.response.pathBetween(cur, depot); if (back) { path = path.concat(back.path); km += legKm(back); mins += legTime(back) + 20; } cur = depot; load = 0; trips++; }
        var leg = T.response.pathBetween(cur, b.at); if (!leg) { continue; }
        path = path.concat(leg.path); km += legKm(leg); mins += legTime(leg) + 1.2; load += w; stops.push({ b: b, at: b.at, d: path.length - 1, t: mins }); cur = b.at;
      }
      left += pool.length;
      var home = T.response.pathBetween(cur, depot); if (home) { path = path.concat(home.path); km += legKm(home); mins += legTime(home); }
      var cum = [0]; for (var i = 1; i < path.length; i++) { cum.push(cum[i - 1] + m(path[i - 1], path[i])); }
      stops.forEach(function (s) { s.dist = cum[s.d]; });
      var tons = stops.reduce(function (a, s) { return a + g.fill(s.b) / 100 * 0.11; }, 0);
      trucks.push({ n: t + 1, col: COLS[t % 4], path: path, cum: cum, len: cum[cum.length - 1] || 1, stops: stops, km: km, mins: mins, tons: tons, trips: trips });
    }
    var all = g.bins().filter(function (b) { return !o.kind || b.kind === o.kind; }).length, done = trucks.reduce(function (a, x) { return a + x.stops.length; }, 0);
    var kmT = trucks.reduce(function (a, x) { return a + x.km; }, 0), base = done ? kmT * Math.sqrt(all / done) * 1.15 : 0;
    return { o: o, depot: depot, trucks: trucks, left: left, all: all, done: done, km: kmT, base: base, made: clock(state.t) };
  }
  function renderPlan() {
    if (!plan) { set('mpOut', 'Set the options and press <strong>Plan routes</strong>.'); set('mpTable', ''); $('mpRun').disabled = true; $('mpCsv').disabled = true; return; }
    var save = plan.base ? Math.max(0, Math.round(100 - 100 * plan.km / plan.base)) : 0, co2 = plan.km * 1.1;
    set('mpOut', num(plan.done) + ' bins on ' + plan.trucks.length + ' route' + (plan.trucks.length > 1 ? 's' : '') + ', ' + plan.km.toFixed(1) + ' km in total' + (plan.left ? '; ' + plan.left + ' full bins left for the next round (stop limit)' : '') +
      '. About <strong>' + save + '% shorter</strong> than a fixed round of all ' + num(plan.all) + ' bins (estimated), saving about ' + Math.round((plan.base - plan.km) * 1.1) + ' kg CO₂. Fuel and CO₂ at 1.1 kg per km.');
    set('mpTable', '<thead><tr><th>Route</th><th>Bins</th><th>km</th><th>Time</th><th>Load</th><th>Trips</th></tr></thead><tbody>' + plan.trucks.map(function (t) {
      return '<tr><th><span class="mp-sw" style="background:rgb(' + t.col.join(',') + ')"></span>Truck ' + t.n + '</th><td>' + t.stops.length + '</td><td>' + t.km.toFixed(1) + '</td><td>' + Math.round(t.mins) + ' min</td><td>' + t.tons.toFixed(1) + ' t</td><td>' + t.trips + '</td></tr>';
    }).join('') + '</tbody>');
    $('mpRun').disabled = false; $('mpCsv').disabled = false; void co2;
  }
  function csv() {
    if (!plan) { return; }
    var rows = [['truck', 'stop', 'bin', 'type', 'street', 'fill_pct', 'lon', 'lat', 'eta_min']];
    plan.trucks.forEach(function (t) { t.stops.forEach(function (s, i) { rows.push([t.n, i + 1, s.b.id, s.b.kind, s.b.street, Math.round(G().fill(s.b)), s.at[0].toFixed(5), s.at[1].toFixed(5), Math.round(s.t)]); }); });
    var text = rows.map(function (r) { return r.map(function (c) { c = String(c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' })); a.download = 'collection-routes.csv'; document.body.appendChild(a); a.click(); a.remove();
  }
  /* A collection run played on the map: each truck drives its route; bins are emptied as it passes them. */
  function runSim() {
    if (!plan) { return; }
    var spd = +($('mpSpeed') || { value: 60 }).value;
    Object.keys(G().emptied).forEach(function (k) { delete G().emptied[k]; });
    sim = { t0: performance.now(), spd: spd, id: ++runs }; $('mpRun').textContent = 'Restart run'; $('mpStop').hidden = false;
    var me = runs;
    (function loop() { if (!sim || sim.id !== me) { return; } C.redraw(); simStatus(); if (simProgress() < 1) { requestAnimationFrame(loop); } else { simStatus(); } })();
  }
  function simMin() { return sim ? (performance.now() - sim.t0) / 1000 * sim.spd / 60 : 0; }
  function simProgress() { if (!sim || !plan) { return 0; } var mx = Math.max.apply(null, plan.trucks.map(function (t) { return t.mins; })); return Math.min(1, simMin() / Math.max(1, mx)); }
  function truckAt(t) {
    var mins = simMin(), f = Math.min(1, mins / Math.max(1, t.mins)), d = f * t.len, i = 1;
    while (i < t.cum.length - 1 && t.cum[i] < d) { i++; }
    var a = t.path[i - 1], z = t.path[i] || a, seg = Math.max(0.01, t.cum[i] - t.cum[i - 1]), q = (d - t.cum[i - 1]) / seg;
    t.stops.forEach(function (s) { if (s.dist <= d) { G().emptied[s.b.id] = true; } });
    return { at: [a[0] + (z[0] - a[0]) * q, a[1] + (z[1] - a[1]) * q], yaw: Math.atan2((z[1] - a[1]) * ky, (z[0] - a[0]) * kx) * 180 / Math.PI, f: f, d: d };
  }
  function simStatus() {
    if (!sim || !plan) { set('mpSim', ''); return; }
    var p = simProgress(), em = Object.keys(G().emptied).length;
    set('mpSim', '<div class="mp-bar"><i style="width:' + Math.round(p * 100) + '%"></i></div>' + (p < 1 ? 'Running: ' : 'Run complete: ') + em + ' of ' + plan.done + ' bins emptied · ' + Math.round(simMin()) + ' min of driving simulated at ' + sim.spd + '× speed.');
    if (G().renderWaste && K.tabOpen('muni')) { G().renderWaste(); }
  }
  function stopSim() { sim = null; Object.keys(G().emptied).forEach(function (k) { delete G().emptied[k]; }); $('mpRun').textContent = 'Play collection run'; $('mpStop').hidden = true; set('mpSim', ''); C.redraw(); if (G().renderWaste) { G().renderWaste(); } }

  /* ============================== weather particles ============================== */
  var parts = [], partKind = '', lastF = 0;
  function weatherKind() { var w = T.weather && T.weather.now ? T.weather.now() : null; return w ? { kind: w.kind, wind: w.wind || 10 } : { kind: 'clear', wind: 10 }; }
  function seedParticles(kind) {
    var mp = T.getMap(); if (!mp) { return; }
    var c = mp.getCenter(), n = kind === 'rain' ? 2200 : kind === 'snow' ? 1600 : 1300, r = 900, top = kind === 'fog' ? 40 : kind === 'rain' ? 260 : 220;
    parts = []; for (var i = 0; i < n; i++) { var a = Math.random() * 6.283, d = Math.sqrt(Math.random()) * r; parts.push({ p: [c.lng + Math.cos(a) * d / kx, c.lat + Math.sin(a) * d / ky, Math.random() * top], top: top, ph: Math.random() * 6.283 }); }
    partKind = kind;
  }
  function stepParticles(kind, wind) {
    var now = performance.now(), dt = lastF ? Math.min(0.1, (now - lastF) / 1000) : 0.016; lastF = now;
    var mp = T.getMap(), c = mp.getCenter(), fall = { rain: 90, snow: 2.2, sand: 0.4, smoke: 0.6, fog: 0.15 }[kind] || 1, drift = wind / 3.6 * dt, dir = 0.7;
    parts.forEach(function (q) {
      q.p[2] -= fall * dt * (kind === 'rain' ? 1 : 1 + 0.3 * Math.sin(now / 900 + q.ph));
      q.p[0] += Math.cos(dir) * drift * (kind === 'rain' ? 0.4 : 1) / kx; q.p[1] += Math.sin(dir) * drift * 0.3 / ky;
      if (kind === 'snow') { q.p[0] += Math.sin(now / 700 + q.ph) * 0.3 * dt / kx; }
      if (q.p[2] < 0) { q.p[2] = q.top; }
      if (Math.abs((q.p[0] - c.lng) * kx) > 950 || Math.abs((q.p[1] - c.lat) * ky) > 950) { var a = Math.random() * 6.283, d = Math.sqrt(Math.random()) * 900; q.p[0] = c.lng + Math.cos(a) * d / kx; q.p[1] = c.lat + Math.sin(a) * d / ky; }
    });
  }
  var skyKind = '';
  function sky(kind) {
    var mp = T.getMap(); if (!mp || !mp.setSky || skyKind === kind) { return; } skyKind = kind;
    var S = { sand: ['#d9a35f', '#e8c08a'], smoke: ['#8f8a85', '#b5aea6'], fog: ['#d8dde3', '#eef1f4'], snow: ['#c9d4df', '#e6ecf2'], rain: ['#7d8a99', '#a9b4c0'] }[kind];
    try { mp.setSky(S ? { 'sky-color': S[0], 'horizon-color': S[1], 'fog-color': S[1], 'fog-ground-blend': kind === 'fog' ? 0.2 : 0.6, 'horizon-fog-blend': 0.8, 'sky-horizon-blend': 0.7, 'atmosphere-blend': 0.6 } : { 'sky-color': '#88b6e8', 'horizon-color': '#d9e8f5', 'fog-color': '#d9e8f5', 'fog-ground-blend': 1, 'horizon-fog-blend': 0.5, 'sky-horizon-blend': 0.5, 'atmosphere-blend': 0.4 }); } catch (e) { /* older map style */ }
  }

  /* ============================== building energy colouring ============================== */
  var bldOrig = null, bldOn = false;
  function energyExpr() {
    var h = state.t / 3600, office = h >= 8 && h < 19 ? 1 : 0.35, home = (h >= 6 && h < 9) || (h >= 18 && h < 24) ? 1 : 0.5, hgt = ['coalesce', ['get', 'render_height'], 6];
    // Taller buildings are mostly offices and flats; intensity (kWh per m² per hour) rises with height and with the hour's use.
    var lo = 0.6 * home, hi = 1.4 * office + 0.3;
    return ['interpolate', ['linear'], ['*', hgt, hi / Math.max(0.2, lo)], 0, '#2e9e5b', 25, '#9ccc3d', 55, '#f2c335', 90, '#ee8a2c', 140, '#d6453d'];
  }
  function applyEnergy() {
    var want = box('grEnergy3d') && $('grEnergy3d') && $('grEnergy3d').checked && muniOpen(), mp = T.getMap();
    if (!mp || !mp.getLayer || !mp.getLayer('itw-buildings')) { bldOn = want; return; }
    if (want) { if (!bldOrig) { bldOrig = mp.getPaintProperty('itw-buildings', 'fill-extrusion-color'); } mp.setPaintProperty('itw-buildings', 'fill-extrusion-color', energyExpr()); bldOn = true; }
    else if (bldOn || bldOrig) { if (bldOrig) { mp.setPaintProperty('itw-buildings', 'fill-extrusion-color', bldOrig); } bldOn = false; }
  }
  function energyColour(h) { var v = h * (state.t / 3600 >= 8 && state.t / 3600 < 19 ? 2.6 : 1.2); return v < 25 ? [46, 158, 91] : v < 55 ? [156, 204, 61] : v < 90 ? [242, 195, 53] : v < 140 ? [238, 138, 44] : [214, 69, 61]; }

  /* ============================== layers ============================== */
  C.addLayers(function () {
    var out = [], g = G(); pulse = (performance.now() / 600) % 6.283;
    if (!g.bins) { return out; }
    var z3 = on(), mo = muniOpen();
    // the planned routes and the collection run show at any zoom
    if (plan && mo && box('showFleet')) {
      out.push(new deck.PathLayer({ id: 'mp-routes', data: plan.trucks, pickable: true, getPath: function (t) { return t.path; }, getColor: function (t) { return t.col.concat([sim ? 120 : 210]); }, widthUnits: 'pixels', getWidth: 4, jointRounded: true, capRounded: true,
        onClick: function (i) { var t = i.object; if (t) { C.showPopup(i.coordinate, 'Collection route · truck ' + t.n, [['Bins', t.stops.length], ['Distance', t.km.toFixed(1) + ' km'], ['Time', Math.round(t.mins) + ' min with simulated traffic'], ['Load', t.tons.toFixed(1) + ' t in ' + t.trips + ' trip' + (t.trips > 1 ? 's' : '')]], 'Follows the model road network'); } } }));
      out.push(new deck.ScatterplotLayer({ id: 'mp-depot', data: [{ at: plan.depot }], pickable: true, radiusUnits: 'pixels', getRadius: 9, getPosition: function (d) { return d.at; }, getFillColor: [20, 40, 70], stroked: true, getLineColor: [255, 255, 255], lineWidthUnits: 'pixels', getLineWidth: 2,
        onClick: function () { C.showPopup(plan.depot, DEPOTS[plan.o.depot] ? DEPOTS[plan.o.depot][0] : 'Depot', [['Trucks', plan.trucks.length], ['Capacity', plan.o.cap + ' t each']], 'Example depot position'); } }));
      if (sim) {
        var runT = plan.trucks.map(function (t) { var p = truckAt(t); return { t: t, at: p.at, yaw: p.yaw, f: p.f, trail: t.path.slice(Math.max(0, t.cum.findIndex(function (c) { return c >= p.d; }) - 25), Math.max(1, t.cum.findIndex(function (c) { return c >= p.d; }))) }; });
        out.push(new deck.PathLayer({ id: 'mp-trail', data: runT.filter(function (x) { return x.trail.length > 1; }), getPath: function (x) { return x.trail; }, getColor: function (x) { return x.t.col.concat([255]); }, widthUnits: 'pixels', getWidth: 7, capRounded: true, jointRounded: true, updateTriggers: { getPath: performance.now() } }));
        if (zoom() >= 15) {
          var sp = { data: runT, getPosition: function (x) { return x.at; }, getOrientation: function (x) { return [0, x.yaw, 0]; }, sizeScale: scale(), updateTriggers: { getPosition: performance.now(), getOrientation: performance.now() } };
          out.push(new deck.SimpleMeshLayer(Object.assign({ id: 'mp-run-truck', mesh: TRUCK, getColor: function (x) { return x.t.col; }, pickable: true, onClick: function (i) { var x = i.object; if (x) { C.showPopup(x.at, 'Truck ' + x.t.n + ' on its round', [['Done', Math.round(x.f * 100) + '%'], ['Bins on route', x.t.stops.length]], 'Simulated collection run'); } } }, sp)));
          out.push(new deck.SimpleMeshLayer(Object.assign({ id: 'mp-run-truck-d', mesh: WHEELS_T, getColor: [25, 28, 34] }, sp)));
        } else {
          out.push(new deck.ScatterplotLayer({ id: 'mp-run-dot', data: runT, radiusUnits: 'pixels', getRadius: 8, getPosition: function (x) { return x.at; }, getFillColor: function (x) { return x.t.col; }, stroked: true, getLineColor: [255, 255, 255], lineWidthUnits: 'pixels', getLineWidth: 2, updateTriggers: { getPosition: performance.now() } }));
        }
      }
    }
    if (z3) {
      var sc = scale(), t = Math.floor(state.t / 60);
      if (box('showBins')) {
        var B = g.bins().filter(function (b) { return inView(b.at); }), bp = { data: B, getPosition: function (b) { return b.at; }, getOrientation: function (b) { return [0, (b.i || 0) * 37 % 180, 0]; }, sizeScale: sc };
        out.push(new deck.SimpleMeshLayer(Object.assign({ id: 'm3-bins', mesh: BIN, pickable: true, getColor: function (b) { return BIN_COL[b.kind] || [80, 90, 100]; },
          onClick: function (i) { var b = i.object; if (b) { var f = g.fill(b); C.showPopup(b.at, b.id + ' · ' + b.kind + ' bin', [['Fill now', Math.round(f) + '%'], ['Sensor', g.sensorOk(b, +b.id.slice(1) - 1000) ? 'Online, reporting every 15 min' : 'Offline'], ['Street', esc(b.street)], ['Next collection', f >= 75 ? 'Today' : 'Scheduled round']], 'Synthetic IoT bin sensor'); } } }, bp)));
        var binClick = function (i) { var b = i.object; if (b) { var f = g.fill(b); C.showPopup(b.at, b.id + ' · ' + b.kind + ' bin', [['Fill now', Math.round(f) + '%'], ['Sensor', g.sensorOk(b, +b.id.slice(1) - 1000) ? 'Online, reporting every 15 min' : 'Offline'], ['Street', esc(b.street)], ['Next collection', f >= 75 ? 'Today' : 'Scheduled round']], 'Synthetic IoT bin sensor'); } };
        out.push(new deck.SimpleMeshLayer(Object.assign({ id: 'm3-bins-d', mesh: BIN_DARK, getColor: [30, 32, 36], pickable: true, onClick: binClick }, bp)));
        out.push(new deck.ColumnLayer({ id: 'm3-bin-gauge', data: B, pickable: true, onClick: binClick, diskResolution: 8, radius: 0.3 * sc, extruded: true, getPosition: function (b) { return [b.at[0] + 0.9 * sc / kx, b.at[1]]; },
          getElevation: function (b) { return Math.max(0.05, g.fill(b) / 100 * 1.35 * sc); }, getFillColor: function (b) { return lvlCol(g.fill(b)); }, updateTriggers: { getElevation: t + ':' + Object.keys(g.emptied).length, getFillColor: t + ':' + Object.keys(g.emptied).length } }));
        out.push(new deck.PointCloudLayer({ id: 'm3-bin-beacon', data: B, pickable: true, onClick: binClick, pointSize: 8, sizeUnits: 'pixels', getPosition: function (b) { return [b.at[0], b.at[1], 1.9 * sc]; },
          getColor: function (b, o) { var f = g.fill(b); return !g.sensorOk(b, o.index) ? [130, 130, 140, 200] : f >= 75 ? [255, 70, 50, 140 + 115 * Math.abs(Math.sin(pulse))] : [60, 220, 120, 220]; }, updateTriggers: { getColor: Math.round(pulse * 4) } }));
      }
      if (box('showFleet')) {
        var F = g.fleetNow().filter(function (x) { return inView(x.at, 0.01); });
        ['truck', 'sweeper', 'other'].forEach(function (kind) {
          var data = F.filter(function (x) { return kind === 'truck' ? /truck/i.test(x.v.type) : kind === 'sweeper' ? /sweeper/i.test(x.v.type) : !/truck|sweeper/i.test(x.v.type); }); if (!data.length) { return; }
          var ms = meshFor(data[0].v.type), fp = { data: data, getPosition: function (x) { return x.at; }, getOrientation: function (x) { return [0, x.yaw, 0]; }, sizeScale: sc, updateTriggers: { getPosition: state.t, getOrientation: state.t } };
          out.push(new deck.SimpleMeshLayer(Object.assign({ id: 'm3-fleet-' + kind, mesh: ms[0], pickable: true, getColor: function (x) { return x.v.col; }, onClick: function (i) { if (i.object) { var p = g.vehPopup(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } } }, fp)));
          out.push(new deck.SimpleMeshLayer(Object.assign({ id: 'm3-fleet-' + kind + '-d', mesh: ms[1], getColor: [25, 28, 34], pickable: true, onClick: function (i) { if (i.object) { var p = g.vehPopup(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } } }, fp)));
        });
        out.push(new deck.PointCloudLayer({ id: 'm3-fleet-light', data: F, pickable: true, onClick: function (i) { if (i.object) { var p = g.vehPopup(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } }, pointSize: 9, sizeUnits: 'pixels', getPosition: function (x) { return [x.at[0], x.at[1], 3.6 * sc]; }, getColor: [255, 170, 30, 160 + 95 * Math.abs(Math.sin(pulse * 2))], updateTriggers: { getColor: Math.round(pulse * 8), getPosition: state.t } }));
      }
      if (box('showLamps')) {
        var L = g.lamps().filter(function (l) { return inView(l.at); }), st = function (l) { return g.lampState(l); }, blink = Math.sin(pulse * 3) > 0;
        var lampClick = function (i) { var l = i.object; if (l) { var s = st(l); C.showPopup(l.at, l.id + ' · street light', [['State', { on: 'On, full power', dim: 'On, dimmed to 50% (quiet road)', off: 'Off (daylight)', fault: 'Fault: not responding' }[s]], ['Lamp', l.led ? 'LED, dimmable' : 'Sodium'], ['Power now', s === 'on' ? (l.led ? '90 W' : '150 W') : s === 'dim' ? '45 W' : '0 W'], ['Road', esc(l.road)]], 'Synthetic lighting controller'); } };
        out.push(new deck.ColumnLayer({ id: 'm3-poles', data: L, diskResolution: 6, radius: 0.35 * sc, extruded: true, getPosition: function (l) { return l.at; }, getElevation: 9 * sc, getFillColor: [96, 104, 116], pickable: true, onClick: lampClick }));
        out.push(new deck.PointCloudLayer({ id: 'm3-lamp-heads', data: L, pickable: true, onClick: lampClick, pointSize: 11, sizeUnits: 'pixels', getPosition: function (l) { return [l.at[0], l.at[1], 9 * sc]; },
          getColor: function (l) { var s = st(l); return s === 'on' ? [255, 226, 130, 255] : s === 'dim' ? [230, 190, 100, 200] : s === 'fault' ? (blink ? [255, 50, 40, 255] : [90, 20, 20, 160]) : [170, 175, 185, 200]; }, updateTriggers: { getColor: t + ':' + blink } }));
        out.push(new deck.ScatterplotLayer({ id: 'm3-lamp-pools', data: L.filter(function (l) { var s = st(l); return s === 'on' || s === 'dim'; }), radiusUnits: 'meters', getRadius: 7 * sc, getPosition: function (l) { return l.at; },
          getFillColor: function (l) { return st(l) === 'on' ? [255, 214, 110, 70] : [255, 214, 110, 35]; }, updateTriggers: { getFillColor: t } }));
      }
      if (box('showDma')) {
        out.push(new deck.PolygonLayer({ id: 'm3-dma', data: g.dmas(), extruded: true, pickable: false, getPolygon: function (d) { return d.poly; }, getElevation: function (d) { return Math.max(1, (d.leak - 0.5) * 12); },
          getFillColor: function (d) { return d.leak >= 2.5 ? [208, 59, 59, 60] : d.leak >= 1.5 ? [236, 131, 40, 50] : [40, 140, 210, 22]; }, getLineColor: [40, 120, 200, 160], wireframe: true,
          onClick: function (i) { var d = i.object; if (d) { C.showPopup(d.at, d.id + ' · metered area', [['Night flow', '×' + d.leak.toFixed(1) + ' of expected'], ['Properties', num(d.props)], ['Action', d.leak >= 1.5 ? 'Send a leak-detection crew' : 'None']], 'Height shows night flow; synthetic meters'); } } }));
      }
      if (box('showDma')) { out.push(new deck.ScatterplotLayer({ id: 'm3-dma-pt', data: g.dmas(), pickable: true, radiusUnits: 'pixels', getRadius: 7, getPosition: function (d) { return d.at; }, getFillColor: function (d) { return d.leak >= 2.5 ? [208, 59, 59] : d.leak >= 1.5 ? [236, 131, 40] : [40, 120, 200]; }, stroked: true, getLineColor: [255, 255, 255], lineWidthUnits: 'pixels', getLineWidth: 2,
        onClick: function (i) { var d = i.object; if (d) { C.showPopup(d.at, d.id + ' · metered area', [['Night flow', '×' + d.leak.toFixed(1) + ' of expected'], ['Properties', num(d.props)], ['Action', d.leak >= 1.5 ? 'Send a leak-detection crew' : 'None']], 'Synthetic meters'); } } })); }
      if (box('showEnv') && T.environment) {
        var S = T.environment.sensors().map(function (s) { var r = T.environment.readingAt(s, state.t); return { s: s, r: r, at: [s.lon, s.lat] }; });
        out.push(new deck.ColumnLayer({ id: 'm3-aq', data: S, diskResolution: 12, radius: 14, extruded: true, pickable: true, getPosition: function (x) { return x.at; }, getElevation: function (x) { return x.r.aqi * 1.6; },
          getFillColor: function (x) { return (x.r.band && x.r.band.color || [120, 120, 120]).concat([230]); }, updateTriggers: { getElevation: t, getFillColor: t },
          onClick: function (i) { var x = i.object; if (x) { C.showPopup(x.at, x.s.name, [['Air quality index', Math.round(x.r.aqi) + ' · ' + (x.r.band ? x.r.band.label : '')], ['PM2.5', x.r.pm25.toFixed(0) + ' µg/m³'], ['NO₂', x.r.no2.toFixed(0) + ' µg/m³'], ['Noise', x.r.noise.toFixed(0) + ' dB']], 'Column height shows the index; synthetic sensor'); } } }));
        out.push(new deck.ScatterplotLayer({ id: 'm3-aq-haze', data: S, radiusUnits: 'meters', getRadius: function (x) { return 120 + x.r.aqi * 3; }, getPosition: function (x) { return x.at; },
          getFillColor: function (x) { return (x.r.band && x.r.band.color || [120, 120, 120]).concat([Math.min(90, 20 + x.r.aqi / 2)]); }, updateTriggers: { getFillColor: t, getRadius: t } }));
      }
      if (bldOn && !(T.getMap() && T.getMap().getLayer('itw-buildings')) && C.buildingsData && C.buildingsData()) {
        out.push(new deck.PolygonLayer({ id: 'm3-energy', data: C.buildingsData().filter(function (b) { return inView(b.ring[0], 0.005); }), extruded: true, getPolygon: function (b) { return b.ring; }, getElevation: function (b) { return b.h + 0.4; },
          getFillColor: function (b) { return energyColour(b.h).concat([235]); }, updateTriggers: { getFillColor: Math.floor(state.t / 3600) } }));
      }
    }
    // Weather in 3D, around the map centre, whenever the box is ticked and the menu is open
    if (mo && box('showWx3d') && zoom() >= 13.5) {
      var w = weatherKind(), kind = w.kind;
      if (kind === 'clear') { sky('clear'); parts = []; partKind = ''; }
      else {
        sky(kind); if (partKind !== kind || !parts.length) { seedParticles(kind); }
        stepParticles(kind, w.wind);
        if (kind === 'rain') {
          out.push(new deck.LineLayer({ id: 'm3-rain', data: parts, getSourcePosition: function (q) { return q.p; }, getTargetPosition: function (q) { return [q.p[0] + 0.4 / kx, q.p[1], q.p[2] + 7]; }, getColor: [170, 200, 235, 150], getWidth: 1.2, updateTriggers: { getSourcePosition: performance.now(), getTargetPosition: performance.now() } }));
        } else {
          var PC = { snow: [250, 252, 255, 235], sand: [222, 160, 90, 120], smoke: [120, 112, 104, 120], fog: [235, 240, 245, 70] }[kind] || [200, 200, 200, 120], SZ = { snow: 3, sand: 5, smoke: 9, fog: 18 }[kind] || 4;
          out.push(new deck.PointCloudLayer({ id: 'm3-wx', data: parts, pointSize: SZ, sizeUnits: 'pixels', getPosition: function (q) { return q.p; }, getColor: PC, updateTriggers: { getPosition: performance.now() } }));
        }
      }
    } else if (skyKind) { sky('clear'); }
    return out;
  });

  /* ============================== card controls ============================== */
  function sel(id, label, opts, def) { return '<label class="inline-field mp-f"><span>' + label + '</span><select id="' + id + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(def) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>'; }
  function chk(id, label, on0) { return '<label class="check"><input id="' + id + '" type="checkbox"' + (on0 ? ' checked' : '') + '><span>' + label + '</span></label>'; }
  function viewBtn(id) { return '<button type="button" class="btn small mu-3d" id="' + id + '">View in 3D</button>'; }
  function fly(at, z, pitch) { z = Math.min(z || 16, window.innerWidth < 720 ? 15.4 : 16.2); var mp = T.getMap(); if (!mp || !at) { return; } var tick = $('showMuni3d'); if (tick && !tick.checked) { tick.checked = true; tick.dispatchEvent(new Event('change', { bubbles: true })); } mp.easeTo({ center: at, zoom: z || 17.2, pitch: pitch || 62, bearing: mp.getBearing() || -25, duration: 1600 }); }
  var ILL = {
    bin: '<svg viewBox="0 0 120 70"><path d="M30 58l28 10 28-10V26L58 16 30 26z" fill="#2e7846"/><path d="M58 36v32l28-10V26z" fill="#245e37"/><path d="M27 24l31-11 31 11-31 11z" fill="#3f9a5d"/><rect x="88" y="30" width="7" height="28" rx="2" fill="#1d2a22"/><rect x="88" y="40" width="7" height="18" rx="2" fill="#ee8a2c"/><circle cx="58" cy="10" r="4" fill="#ff4632"/></svg>',
    truck: '<svg viewBox="0 0 120 70"><path d="M14 46l44 16 30-11V24L44 8 14 19z" fill="#2878c8"/><path d="M58 30v32l30-11V24z" fill="#1f5f9f"/><path d="M14 19l30-11 44 16-30 11z" fill="#4a96e0"/><path d="M88 32l18 6v16l-18 6z" fill="#e8edf3"/><circle cx="34" cy="58" r="5" fill="#1c1f24"/><circle cx="72" cy="62" r="5" fill="#1c1f24"/><circle cx="98" cy="60" r="4" fill="#1c1f24"/><rect x="40" y="2" width="8" height="5" rx="2" fill="#ffaa1e"/></svg>',
    lamp: '<svg viewBox="0 0 120 70"><ellipse cx="60" cy="62" rx="40" ry="7" fill="#ffd66e" opacity=".45"/><rect x="57" y="10" width="5" height="52" fill="#606874"/><path d="M60 10h22" stroke="#606874" stroke-width="4"/><ellipse cx="84" cy="12" rx="8" ry="4" fill="#ffe282"/><path d="M76 14l-10 46h36L92 14z" fill="#ffe282" opacity=".25"/><rect x="10" y="28" width="22" height="34" fill="#9ccc3d"/><rect x="34" y="40" width="16" height="22" fill="#f2c335"/><rect x="92" y="20" width="20" height="42" fill="#ee8a2c"/></svg>',
    weather: '<svg viewBox="0 0 120 70"><circle cx="40" cy="26" r="13" fill="#f2c335"/><path d="M38 44a14 14 0 0 1 4-27 18 18 0 0 1 34 4 12 12 0 0 1 4 23z" fill="#dfe6ee"/><path d="M50 52l-4 10M62 52l-4 10M74 52l-4 10M86 52l-4 10" stroke="#7fb0e6" stroke-width="3" stroke-linecap="round"/></svg>',
    env: '<svg viewBox="0 0 120 70"><rect x="20" y="34" width="12" height="28" fill="#2e9e5b"/><rect x="40" y="22" width="12" height="40" fill="#f2c335"/><rect x="60" y="12" width="12" height="50" fill="#ee8a2c"/><rect x="80" y="28" width="12" height="34" fill="#9ccc3d"/><ellipse cx="66" cy="62" rx="52" ry="5" fill="#2e9e5b" opacity=".25"/></svg>',
    water: '<svg viewBox="0 0 120 70"><path d="M14 50l46 14 46-14-46-14z" fill="#2878c8" opacity=".3"/><path d="M40 40l20 6 20-6V20l-20 6-20-6z" fill="#ee8a2c" opacity=".7"/><path d="M60 6c6 10 10 15 10 20a10 10 0 0 1-20 0c0-5 4-10 10-20z" fill="#3fa0e6"/></svg>'
  };
  function illus(cardId, key) { var c = $(cardId); if (!c || c.querySelector('.mu-illus')) { return; } var d = document.createElement('div'); d.className = 'mu-illus'; d.innerHTML = ILL[key]; var h = c.querySelector('.card-head'); c.insertBefore(d, h); }

  function build() {
    // Fleet card: richer options and the planner
    var fl = $('grFl');
    if (fl) {
      ['grWsPlan', 'grWsClr'].forEach(function (id) { var b = $(id); if (b) { var row = b.closest('.btn-col'); if (row) { row.remove(); } } });
      var oldRoute = $('grWsRoute'); if (oldRoute) { oldRoute.remove(); }
      var types = (G().FTYPES || []).map(function (f) { return [f[0], f[0]]; });
      var head = document.createElement('div'); head.className = 'mp-filter';
      head.innerHTML = sel('mpVeh', 'Show', [['', 'All vehicles']].concat(types), '') + viewBtn('v3Fleet');
      fl.insertBefore(head, $('grFlList').previousElementSibling);
      var pl = document.createElement('div'); pl.className = 'mp-planner';
      pl.innerHTML = '<h3 class="sub-h">Collection route planner</h3><div class="mp-grid">' +
        sel('mpDepot', 'Depot', DEPOTS.map(function (d, i) { return [i, d[0]]; }), 0) +
        sel('mpKind', 'Bins', [['', 'All types'], ['Mixed', 'Mixed waste'], ['Recycling (blue)', 'Recycling (blue)'], ['Organic (brown)', 'Organic (brown)']], '') +
        sel('mpThr', 'Collect bins over', [[50, '50% full'], [60, '60% full'], [75, '75% full'], [90, '90% full']], 75) +
        sel('mpTrucks', 'Trucks', [[1, '1'], [2, '2'], [3, '3'], [4, '4']], 2) +
        sel('mpCap', 'Truck capacity', [[8, '8 t'], [12, '12 t'], [16, '16 t']], 12) +
        sel('mpStops', 'Stops per truck', [[15, 'Up to 15'], [25, 'Up to 25'], [40, 'Up to 40']], 25) +
        sel('mpGoal', 'Optimise for', [['near', 'Shortest distance'], ['full', 'Fullest bins first'], ['traffic', 'Avoid congestion']], 'near') +
        sel('mpSpeed', 'Run speed', [[30, '30×'], [60, '60×'], [120, '120×'], [300, '300×']], 60) +
        '</div><div class="btn-col row"><button type="button" class="btn small" id="mpGo">Plan routes</button><button type="button" class="btn small" id="mpRun" disabled>Play collection run</button><button type="button" class="btn small" id="mpStop" hidden>Stop</button><button type="button" class="btn small" id="mpCsv" disabled>Export CSV</button><button type="button" class="btn small" id="mpClr">Clear</button></div>' +
        '<p class="small" id="mpOut"></p><div id="mpSim" class="small"></div><table class="facts mp-table" id="mpTable"></table>';
      fl.insertBefore(pl, $('grFlList').previousElementSibling);
      $('mpGo').addEventListener('click', function () { var b = this; b.disabled = true; b.textContent = 'Planning…'; setTimeout(function () { stopSim(); plan = makePlan(); renderPlan(); b.disabled = false; b.textContent = 'Plan routes'; C.redraw(); if (plan && T.getMap()) { var p = plan.trucks.reduce(function (a, t) { return a.concat(t.path); }, []); if (p.length) { var xs = p.map(function (q) { return q[0]; }), ys = p.map(function (q) { return q[1]; }); T.getMap().fitBounds([[Math.min.apply(null, xs), Math.min.apply(null, ys)], [Math.max.apply(null, xs), Math.max.apply(null, ys)]], { padding: 60, pitch: 45, duration: 1200 }); } } }, 30); });
      $('mpRun').addEventListener('click', function () { runSim(); });
      $('mpStop').addEventListener('click', stopSim);
      $('mpCsv').addEventListener('click', csv);
      $('mpClr').addEventListener('click', function () { stopSim(); plan = null; renderPlan(); C.redraw(); });
      $('mpVeh').addEventListener('change', function () { if (G().renderFleet) { G().renderFleet(); } C.redraw(); });
      renderPlan();
    }
    // 3D options in each card
    var add = function (cardId, html) { var c = $(cardId); if (!c) { return; } var d = document.createElement('div'); d.className = 'btn-col row mu-3drow'; d.innerHTML = html; var k = c.querySelector('.kpis'); if (k) { k.parentNode.insertBefore(d, k.nextSibling); } else { c.appendChild(d); } };
    add('grWs', viewBtn('v3Bins'));
    add('grLt', viewBtn('v3Lamps') + chk('grEnergy3d', 'Colour 3D buildings by energy use', false));
    add('grLk', viewBtn('v3Dma'));
    add('wxCard', viewBtn('v3Wx') + chk('showWx3d', 'Show the weather in 3D (rain, snow, dust, smoke, fog)', true));
    var air = Array.prototype.filter.call(document.querySelectorAll('.panel section[data-tab="muni"] h2'), function (h) { return h.textContent.trim() === 'Air and noise now'; })[0];
    if (air) { var ac = air.closest('section'); ac.id = ac.id || 'envAirCard'; add(ac.id, viewBtn('v3Env')); illus(ac.id, 'env'); }
    var now = $('muNow');
    if (now) { var d3 = document.createElement('div'); d3.innerHTML = chk('showMuni3d', 'Show municipal assets as 3D models at street zoom', true); now.appendChild(d3.firstChild); }
    illus('grWs', 'bin'); illus('grFl', 'truck'); illus('grLt', 'lamp'); illus('wxCard', 'weather'); illus('grLk', 'water');
    var g = G();
    $('v3Bins').addEventListener('click', function () { var b = g.bins().slice().sort(function (a, c) { return g.fill(c) - g.fill(a); })[0]; fly(b && b.at); });
    $('v3Fleet').addEventListener('click', function () { var f = g.fleetNow()[0]; fly(f ? f.at : g.centre()); });
    $('v3Lamps').addEventListener('click', function () { var l = g.lamps().filter(function (x) { return g.lampState(x) === 'fault'; })[0] || g.lamps()[0]; fly(l && l.at, 17.4); });
    $('v3Dma').addEventListener('click', function () { var d = g.dmas().slice().sort(function (a, c) { return c.leak - a.leak; })[0]; fly(d && d.at, 15.2, 55); });
    $('v3Wx').addEventListener('click', function () { var tick = $('showWx3d'); if (tick && !tick.checked) { tick.checked = true; tick.dispatchEvent(new Event('change')); } fly(g.centre(), 15.6, 72); });
    var ve = $('v3Env'); if (ve) { ve.addEventListener('click', function () { var S = T.environment ? T.environment.sensors() : []; var w = S.map(function (s) { return { s: s, a: T.environment.readingAt(s, state.t).aqi }; }).sort(function (a, c) { return c.a - a.a; })[0]; fly(w ? [w.s.lon, w.s.lat] : g.centre(), 15.8, 60); }); }
    ['showMuni3d', 'showWx3d', 'grEnergy3d'].forEach(function (id) { var b = $(id); if (b) { b.addEventListener('change', function () { applyEnergy(); C.redraw(); }); } });
  }

  C.onReady(function () {
    meta = C.meta() || meta; bb = meta.bbox || bb; kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180);
    if (!ATH) { DEPOTS[0] = ['Municipal depot (example)', 0, 0]; }
    build();
    C.onTab(function () { applyEnergy(); C.redraw(); });
    C.onMinute(function () { if (bldOn) { applyEnergy(); } });
    var mp = T.getMap(); if (mp) { mp.on('zoomend', function () { C.redraw(); }); mp.on('moveend', function () { if (on()) { C.redraw(); } }); }
  });
  T.muni3d = { on: on, vehicleFilter: function () { var v = $('mpVeh'); return v ? v.value : ''; }, plan: function () { return plan; } };
})();
