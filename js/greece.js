/* AthenaIQ: thirteen Greek city and national use cases, added as cards to the existing menu sections.
 *
 *   Freight      Waste collection, fleet and routing
 *   Environment  Street lighting and building energy; water leakage (district metered areas)
 *   Fines        Traffic and parking tickets on city streets; traffic tickets on prefecture roads and national highways
 *   Transit      Port and city interface; airport landside; Transport for Athens (public transport in other cities)
 *   ANPR         Smuggling: border crossings, customs and vessels
 *   Zones        Civil protection and critical infrastructure; counter-UAV and threat detection
 *   Pedestrians  School and hospital crossings
 *   Devices      Prefecture and highway cameras: monitoring
 *
 * Real inputs: OpenStreetMap roads and sites, simulated traffic from SUMO, Open-Meteo weather, NASA FIRMS fires and AIS vessels.
 * Device states, tickets, bins, meters, drones and alerts are synthetic until a feed is connected; each card says which.
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, CFG = C.CFG, $ = C.$, num = C.num, clock = C.clock, state = T.state, K = T.kit;
  var rnd = K.rnd, hashStr = K.hashStr, esc = K.esc, ATH = C.region.isDefault, CITY = C.region.name || 'Athens';
  var meta = C.meta() || {}, bb = meta.bbox || [23.55, 37.85, 23.98, 38.12];
  var kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180), ky = 110570;
  var CUR = (CFG.currency || {}).symbol || '€', SYN = '<strong>Synthetic data.</strong> ', EST = '<strong>Estimated.</strong> ', EXA = '<strong>Example list, positions approximate.</strong> ';
  var SEED = hashStr(C.region.id || 'athens');
  function m(a, b) { return Math.hypot((a[0] - b[0]) * kx, (a[1] - b[1]) * ky); }
  function tile(label, id) { return '<div class="kpi"><span class="k-label">' + label + '</span><span class="k-value" id="' + id + '">–</span></div>'; }
  function kpis(list) { return '<div class="kpis">' + list.map(function (x) { return tile(x[0], x[1]); }).join('') + '</div>'; }
  function set(id, html) { var el = $(id); if (el) { el.innerHTML = html; } }
  function card(tab, id, title, sub, notice, body) {
    var sec = document.createElement('section'); sec.className = 'card'; sec.id = id; sec.setAttribute('data-tab', tab); sec.hidden = true;
    sec.innerHTML = (notice ? '<p class="notice">' + notice + '</p>' : '') + '<div class="card-head"><h2>' + title + '</h2><span class="muted" id="' + id + 'Sub">' + (sub || '') + '</span></div>' + body;
    var all = document.querySelectorAll('.panel section[data-tab="' + tab + '"]'), at = all[all.length - 1];
    if (at) { at.parentNode.insertBefore(sec, at.nextSibling); } else { document.querySelector('.panel').appendChild(sec); }
    return sec;
  }
  function list(id, items) { var ol = $(id); if (!ol) { return; } ol.innerHTML = ''; items.forEach(function (li) { ol.appendChild(li); }); if (!items.length) { ol.innerHTML = '<li class="muted">Nothing to show.</li>'; } }
  function row(dot, title, sub, right, at, z) { return C.listButton(dot, title, sub, right, function () { if (at) { C.flyTo(at[0], at[1], z || 15); } }); }
  function bars(id, rows) { var mx = Math.max.apply(null, rows.map(function (r) { return r[1]; }).concat([1])); set(id, rows.map(function (r) { return C.barRow(esc(r[0]), r[2] || '', r[3] != null ? r[3] : num(r[1]), r[1] / mx); }).join('')); }
  function hideCard(id) { var s = document.getElementById(id); if (s) { s.setAttribute('data-tab', 'retired'); s.hidden = true; } }
  function hour() { return state.t / 3600; }
  function pick(seed, k, arr) { return arr[Math.floor(rnd(seed, k) * arr.length) % arr.length]; }
  function inBox(at, pad) { pad = pad || 0; return at[0] >= bb[0] - pad && at[0] <= bb[2] + pad && at[1] >= bb[1] - pad && at[1] <= bb[3] + pad; }
  function sites(kinds) {
    var out = C.sites().filter(function (s) { return !kinds || kinds.indexOf(s[4]) >= 0; }).map(function (s) { return { name: s[0], at: [s[1], s[2]], kind: s[4] }; });
    var z = T.zones && T.zones.all ? T.zones.all() : [];
    z.forEach(function (s) { if ((!kinds || kinds.indexOf(s.type) >= 0) && s.lon != null && !/veterin|animal|pet /i.test(s.name || '') && inBox([s.lon, s.lat], 0.02)) { out.push({ name: s.name || s.type, at: [s.lon, s.lat], kind: s.type }); } });
    return out;
  }
  function now() { var p = T.osint && T.osint.weather ? T.osint.weather() : null; return p && p.now ? p.now : {}; }
  function centre() { var r = C.region, c = r.centre; return c && inBox(c) ? c : [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2]; }
  function weekend() { var d = new Date().getDay(); return ((CFG.time || {}).weekendDays || [6, 0]).indexOf(d) >= 0; }

  /* Road samples: midpoints of the modelled roads, with class, name and current load. */
  var E = null;
  function roads() {
    if (E) { return E; }
    var names = C.names ? C.names() : null;
    E = C.edges().map(function (e, i) { return { i: i, c: e.c, k: e.k, at: e.path[e.path.length >> 1], len: e.m || e.len || e.length || 0, name: names && e.n != null ? names[e.n] : (e.name || '') }; });
    return E;
  }
  function load(i) { return { veh: C.occ(i), ratio: C.ratio(i) }; }
  function near(at, r) { var out = []; roads().forEach(function (e) { if (Math.abs((e.at[1] - at[1]) * ky) <= r && m(e.at, at) <= r) { out.push(e); } }); return out; }
  function area(at, r) { var veh = 0, free = 0; near(at, r).forEach(function (e) { var o = C.occ(e.i); veh += o; free += o * C.ratio(e.i); }); return { veh: veh, ratio: veh ? free / veh : 1, kmh: veh ? Math.round(free / veh * 50) : null }; }
  function every(cls, stepM, seed) {   // evenly spread samples on the given road classes
    var out = [], acc = 0;
    roads().forEach(function (e) { if (cls.indexOf(e.c) < 0 || e.k) { return; } acc += e.len || 150; if (acc >= stepM) { acc = 0; out.push(e); } });
    return out;
  }
  function lvl(r) { return r < 0.35 ? 'severe' : r < 0.6 ? 'heavy' : r < 0.8 ? 'moderate' : 'free'; }
  function rgb(s) { return { severe: [208, 59, 59], heavy: [230, 130, 40], moderate: [230, 190, 40], free: [40, 160, 100], off: [120, 120, 130], info: [40, 120, 200] }[s] || [40, 120, 200]; }
  function dots(id, data, color, radius, popup, pickable) {
    return new deck.ScatterplotLayer({ id: id, data: data, pickable: pickable !== false, radiusUnits: 'pixels', stroked: true, lineWidthUnits: 'pixels', getLineWidth: 1.5, getLineColor: [255, 255, 255, 220],
      getPosition: function (d) { return d.at; }, getRadius: radius || 6, getFillColor: function (d) { return color(d).concat([225]); },
      updateTriggers: { getFillColor: Math.floor(state.t / 60), getRadius: Math.floor(state.t / 60) },
      onClick: function (i) { if (i.object && popup) { var p = popup(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } } });
  }
  function rings(id, data, rM, col, popup) {
    return new deck.ScatterplotLayer({ id: id, data: data, radiusUnits: 'meters', pickable: !!popup, onClick: function (i) { if (i.object && popup) { var p = popup(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } }, getRadius: function (d) { return d.r || rM; }, getPosition: function (d) { return d.at; },
      getFillColor: function (d) { return (d.col || col).concat([40]); }, stroked: true, getLineColor: function (d) { return (d.col || col).concat([210]); }, lineWidthUnits: 'pixels', getLineWidth: 2 });
  }

  /* ============================== 1. Waste, fleet and routing ============================== */
  var BINS = null;
  function bins() {
    if (BINS) { return BINS; }
    BINS = every([2, 3, 4], 900, SEED).slice(0, 400).map(function (e, k) { return { id: 'B' + (1000 + k), at: e.at, street: e.name || 'Street', kind: rnd(SEED, k * 7) < 0.7 ? 'Mixed' : rnd(SEED, k * 7 + 1) < 0.6 ? 'Recycling (blue)' : 'Organic (brown)', rate: 2.5 + rnd(SEED, k * 3) * 5.5, start: rnd(SEED, k * 5) * 35 }; });
    return BINS;
  }
  function sensorOk(b, k) { return rnd(SEED + 41, (k || 0) + Math.floor(state.t / 21600)) > 0.03; }
  function muni(id) { var box = $(id), all = $('showMuniAll'); return (!box || box.checked) && (K.tabOpen('muni') || (all && all.checked)); }
  function chk(id, label) { return '<label class="check"><input id="' + id + '" type="checkbox" checked><span>' + label + '</span></label>'; }
  function fill(b) { var h = hour(), f = b.start + b.rate * ((h + 24 - 5) % 24); return Math.min(100, f % 125); }   // emptied on the 05:00 round
  var route = null;
  function planRoute() {
    var full = bins().filter(function (b) { return fill(b) >= 75; }), depot = ATH && inBox([23.6460, 38.0480]) ? [23.6460, 38.0480] : centre(), path = [depot], left = full.slice(), cur = depot, km = 0;
    while (left.length && path.length < 25) { var bi = 0, bd = 1e12; left.forEach(function (b, i) { var d = m(cur, b.at); if (d < bd) { bd = d; bi = i; } }); km += bd / 1000; cur = left[bi].at; path.push(cur); left.splice(bi, 1); }
    var road = [], rkm = 0, ok = !!T.response;
    for (var k = 1; ok && k < path.length; k++) { var leg = T.response.pathBetween(path[k - 1], path[k]); if (!leg) { ok = false; break; } road = road.concat(leg.path); leg.links.forEach(function (i) { rkm += (C.edges()[i].m || 0) / 1000; }); }
    route = ok && road.length ? { path: road, stops: path.length - 1, km: rkm, roads: true } : { path: path, stops: path.length - 1, km: km * 1.35, roads: false };
    return route;
  }
  /* Municipal fleet: refuse trucks, sweepers and crews, each driving a loop on the road network. */
  var FLEET = null;
  var FTYPES = [['Refuse truck', 'RT', 10, [40, 120, 200]], ['Recycling truck', 'RC', 4, [40, 160, 100]], ['Street sweeper', 'SW', 4, [150, 110, 200]], ['Street-lighting crew', 'LC', 2, [230, 190, 40]], ['Water-leak crew', 'WC', 2, [30, 160, 210]]];
  function fleet() {
    if (FLEET) { return FLEET; }
    FLEET = [];
    if (!T.response) { return FLEET; }
    var b = bins(), depot = ATH && inBox([23.6460, 38.0480]) ? [23.6460, 38.0480] : centre(), n = 0;
    FTYPES.forEach(function (ft) { for (var k = 0; k < ft[2]; k++, n++) {
      var a = b[Math.floor(rnd(SEED + 7, n * 3) * b.length) % b.length], c = b[Math.floor(rnd(SEED + 7, n * 3 + 1) * b.length) % b.length];
      var l1 = a && T.response.pathBetween(depot, a.at), l2 = l1 && c && T.response.pathBetween(a.at, c.at), l3 = l2 && T.response.pathBetween(c.at, depot);
      if (!l3) { continue; }
      var path = l1.path.concat(l2.path, l3.path), cum = [0];
      for (var i = 1; i < path.length; i++) { cum.push(cum[i - 1] + m(path[i - 1], path[i])); }
      FLEET.push({ id: ft[1] + '-' + (101 + k), type: ft[0], col: ft[3], path: path, cum: cum, len: cum[cum.length - 1], off: rnd(SEED + 9, n), shift: ft[1] === 'LC' ? [18, 2] : ft[1] === 'WC' ? (k ? [7, 15] : [0, 24]) : ft[1] === 'SW' ? (k % 2 ? [14, 22] : [5, 13]) : ft[1] === 'RT' ? (k % 2 ? [19, 3] : [6, 14]) : [6, 14] });
    } });
    return FLEET;
  }
  function onShift(v) { var h = hour(), a = v.shift[0], z = v.shift[1]; return z - a >= 24 || (a < z ? h >= a && h < z : h >= a || h < z); }
  function posOf(v) {
    var kmh = v.type.indexOf('sweeper') >= 0 ? 8 : 18, d = ((state.t / 3600 * kmh * 1000) + v.off * v.len) % v.len, i = 1;
    while (i < v.cum.length - 1 && v.cum[i] < d) { i++; }
    var f = (d - v.cum[i - 1]) / Math.max(1, v.cum[i] - v.cum[i - 1]), a = v.path[i - 1], z = v.path[i];
    return { at: [a[0] + (z[0] - a[0]) * f, a[1] + (z[1] - a[1]) * f], done: d / v.len };
  }
  function fleetNow() { return fleet().filter(onShift).map(function (v) { var p = posOf(v); return { v: v, at: p.at, done: p.done }; }); }
  function vehPopup(x) { return [x.v.id + ' · ' + x.v.type, [['Shift', x.v.shift[1] - x.v.shift[0] >= 24 ? '24 h standby' : clock(x.v.shift[0] * 3600) + '–' + clock((x.v.shift[1] % 24) * 3600)], ['Round done', Math.round(x.done * 100) + '%'], ['Round length', (x.v.len / 1000).toFixed(1) + ' km']], 'Synthetic vehicle on the real road network']; }
  function renderFleet() {
    var F = fleetNow(), by = {};
    F.forEach(function (x) { by[x.v.type] = (by[x.v.type] || 0) + 1; });
    set('grFlN', num(F.length)); set('grFlRt', num((by['Refuse truck'] || 0) + (by['Recycling truck'] || 0))); set('grFlSw', num(by['Street sweeper'] || 0)); set('grFlCr', num((by['Street-lighting crew'] || 0) + (by['Water-leak crew'] || 0)));
    list('grFlList', F.map(function (x) { return C.listButton('free', x.v.id + ' · ' + x.v.type, Math.round(x.done * 100) + '% of the round done', '', function () { var p = vehPopup(x); C.flyTo(x.at[0], x.at[1], 16); C.showPopup(x.at, p[0], p[1], p[2]); }); }));
    var full = bins().filter(function (b) { return fill(b) >= 75; }).length, fixed = bins().length * 2.1 * 1.35 / 4, smart = full * 2.1 * 1.35 / 4 + 6;
    set('grFlSave', Math.max(0, Math.round(100 - 100 * smart / Math.max(fixed, 1))) + '%');
    set('grWsRoute', route ? route.stops + ' full bins, about ' + route.km.toFixed(1) + ' km in nearest-first order' + (route.roads ? ', following the road network.' : ' (straight lines; no road route found).') : '');
  }
  function renderWaste() {
    var b = bins(), full = b.filter(function (x) { return fill(x) >= 75; }), offline = b.filter(function (x, k) { return !sensorOk(x, k); }).length, avg = b.reduce(function (t, x) { return t + fill(x); }, 0) / Math.max(1, b.length), kinds = {};
    b.forEach(function (x) { kinds[x.kind] = (kinds[x.kind] || 0) + 1; });
    set('grWsBins', num(b.length)); set('grWsFull', num(full.length)); set('grWsTr', Math.round(avg) + '%'); set('grWsSave', num(offline));
    bars('grWsBars', Object.keys(kinds).map(function (k) { var f = b.filter(function (x) { return x.kind === k; }), a = f.reduce(function (t, x) { return t + fill(x); }, 0) / f.length; return [k, a, num(f.length) + ' bins', Math.round(a) + '% full on average']; }));
    list('grWsList', full.sort(function (x, y) { return fill(y) - fill(x); }).slice(0, 8).map(function (x) { var f = fill(x); return row(f >= 95 ? 'severe' : 'heavy', x.id + ' · ' + x.kind, x.street + ' · emptied 05:00', Math.round(f) + '%', x.at, 17); }));
  }

  /* ============================== 2. Street lighting and building energy ============================== */
  function sun() {   // sunrise and sunset, hours local, NOAA approximation
    var d = new Date(), doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5), lat = (bb[1] + bb[3]) / 2 * Math.PI / 180, lon = (bb[0] + bb[2]) / 2;
    var decl = 0.4093 * Math.sin(2 * Math.PI * (284 + doy) / 365), ha = Math.acos(Math.max(-1, Math.min(1, -Math.tan(lat) * Math.tan(decl)))) * 12 / Math.PI;
    var off = -d.getTimezoneOffset() / 60, tzOff = (CFG.time || {}).utcOffsetHours != null ? CFG.time.utcOffsetHours : (doy > 88 && doy < 300 ? 3 : 2), noon = 12 - lon / 15 + tzOff; void off;
    return { rise: noon - ha, set: noon + ha };
  }
  var LAMPS = null;
  function lamps() { if (!LAMPS) { LAMPS = every([0, 1, 2, 3], 600, SEED + 1).slice(0, 500).map(function (e, k) { return { id: 'L-' + (2000 + k), at: e.at, i: e.i, road: e.name || 'Road', fault: rnd(SEED, k * 11) < 0.025, led: rnd(SEED, k * 13) < 0.62 }; }); } return LAMPS; }
  function lampState(l) { var s = sun(), h = hour(), dark = h >= s.set + 0.25 || h < s.rise - 0.25; if (!dark) { return 'off'; } if (l.fault) { return 'fault'; } return l.led && C.occ(l.i) < 2 ? 'dim' : 'on'; }
  function renderLight() {
    var s = sun(), L = lamps(), c = { on: 0, dim: 0, off: 0, fault: 0 };
    L.forEach(function (l) { c[lampState(l)]++; });
    var poles = Math.round((meta.network || {}).km * 28 || 20000), hrs = 24 - (s.set - s.rise) - 0.5, full = poles * 0.15 * hrs, led = full * (1 - 0.62 * 0.45);
    set('grLtOn', c.off === L.length ? 'Off (daylight)' : num(c.on + c.dim)); set('grLtDim', num(c.dim)); set('grLtFault', num(L.filter(function (l) { return l.fault; }).length));
    set('grLtKwh', num(Math.round((full - led) / 1000)) + ' MWh');
    var bcount = (meta.buildings || {}).count || 0, gwh = bcount * 9.5 / 365 / 1000, t = hour(), cool = Math.max(0, (now().temp || 24) - 24);
    set('grLtSun', 'Lights on at ' + clock(Math.round((s.set + 0.25) * 3600)) + ', off at ' + clock(Math.round((s.rise - 0.25) * 3600)) + '. ' + num(poles) + ' street lights estimated from road length.');
    bars('grLtBars', [['Homes', gwh * 0.62 * (1 + cool * 0.04), '', (gwh * 0.62 * (1 + cool * 0.04)).toFixed(1) + ' GWh'], ['Offices and shops', gwh * 0.28 * (t > 8 && t < 20 ? 1.2 : 0.8), '', (gwh * 0.28).toFixed(1) + ' GWh'], ['Public buildings', gwh * 0.1, '', (gwh * 0.1).toFixed(1) + ' GWh']]);
    list('grLtList', L.filter(function (l) { return l.fault; }).slice(0, 6).map(function (l) { return row('severe', l.id + ' · lamp not responding', l.road + (l.led ? ' · LED' : ' · sodium'), 'Fault', l.at, 17); }));
  }

  /* ============================== 3-4. Tickets ============================== */
  var CITY_OFF = [['Illegal parking', 0.38, 40], ['Double parking', 0.14, 80], ['Disabled bay misuse', 0.04, 150], ['Bus lane', 0.12, 150], ['Red light', 0.07, 700], ['Speeding (50 km/h zone)', 0.12, 100], ['No helmet (motorcycle)', 0.06, 350], ['Mobile phone at the wheel', 0.07, 350]];
  var HWY_OFF = [['Speeding over 20 km/h', 0.46, 100], ['Speeding over 40 km/h', 0.12, 350], ['Hard-shoulder driving', 0.1, 200], ['Unsafe lane change', 0.1, 100], ['No seat belt', 0.09, 350], ['Truck in left lane', 0.08, 200], ['Tailgating', 0.05, 100]];
  var LET = (CFG.local || {}).plateLetters || 'ABEZHIKMNOPTYX';
  function plate(seed, k) { return LET[Math.floor(rnd(seed, k) * LET.length)] + LET[Math.floor(rnd(seed, k + 1) * LET.length)] + LET[Math.floor(rnd(seed, k + 2) * LET.length)] + '-' + (1000 + Math.floor(rnd(seed, k + 3) * 8999)); }
  function tickets(cls, offs, perK, seed) {
    var rs = roads().filter(function (e) { return cls.indexOf(e.c) >= 0 && e.name; }), by = {}, tot = 0, val = 0, h = hour(), share = Math.max(0, Math.min(1, (h - 6) / 16));
    rs.forEach(function (e) { var v = C.occ(e.i), key = e.name; by[key] = by[key] || { name: key, n: 0, at: e.at, ratio: 0, w: 0 }; var n = v * perK * (0.6 + rnd(seed, e.i) * 0.8); by[key].n += n; by[key].ratio += C.ratio(e.i) * v; by[key].w += v; });
    var streets = Object.keys(by).map(function (k) { var s = by[k]; s.n = Math.round(s.n * (2 + share * 30)); s.ratio = s.w ? s.ratio / s.w : 1; tot += s.n; return s; }).sort(function (a, b) { return b.n - a.n; });
    offs.forEach(function (o) { val += tot * o[1] * o[2]; });
    return { streets: streets, tot: tot, val: val };
  }
  function renderCityTickets() {
    var t = tickets([2, 3, 4], CITY_OFF, 0.012, SEED + 3);
    set('grCtTot', num(t.tot)); set('grCtPark', num(Math.round(t.tot * 0.56))); set('grCtBus', num(Math.round(t.tot * 0.12))); set('grCtVal', CUR + num(Math.round(t.val / 1000)) + 'k');
    bars('grCtBars', CITY_OFF.map(function (o) { return [o[0], t.tot * o[1], CUR + o[2], num(Math.round(t.tot * o[1]))]; }));
    list('grCtList', t.streets.slice(0, 7).map(function (s, k) { return row(s.n > t.tot / 25 ? 'heavy' : 'moderate', s.name, 'Last: ' + plate(SEED + k, Math.floor(state.t / 300)) + ' · ' + pick(SEED + k, Math.floor(state.t / 300), CITY_OFF)[0], num(s.n), s.at, 16); }));
  }
  function renderHwyTickets() {
    var t = tickets([0, 1], HWY_OFF, 0.004, SEED + 4);
    set('grHtTot', num(t.tot)); set('grHtSpd', num(Math.round(t.tot * 0.58))); set('grHtRoads', num(t.streets.length)); set('grHtVal', CUR + num(Math.round(t.val / 1000)) + 'k');
    bars('grHtBars', HWY_OFF.map(function (o) { return [o[0], t.tot * o[1], CUR + o[2], num(Math.round(t.tot * o[1]))]; }));
    list('grHtList', t.streets.slice(0, 7).map(function (s) { return row(lvl(s.ratio), s.name, 'Average speed ' + Math.round(s.ratio * 100) + '% of free flow', num(s.n), s.at, 13); }));
  }

  /* ============================== 5. Water leakage ============================== */
  var DMA = null;
  function dmas() {
    if (DMA) { return DMA; }
    var nx = 6, ny = 5, w = (bb[2] - bb[0]) / nx, h = (bb[3] - bb[1]) / ny, out = [];
    for (var x = 0; x < nx; x++) { for (var y = 0; y < ny; y++) {
      var c = [bb[0] + (x + 0.5) * w, bb[1] + (y + 0.5) * h], k = x * ny + y, nr = near(c, 900).length; if (nr < 4) { continue; }
      out.push({ id: 'DMA-' + String.fromCharCode(65 + x) + (y + 1), at: c, poly: [[c[0] - w / 2, c[1] - h / 2], [c[0] + w / 2, c[1] - h / 2], [c[0] + w / 2, c[1] + h / 2], [c[0] - w / 2, c[1] + h / 2]], props: Math.round(nr * 55), leak: rnd(SEED, k * 17) < 0.18 ? 1.8 + rnd(SEED, k) * 2 : 0.6 + rnd(SEED, k + 3) * 0.6 });
    } }
    DMA = out; return out;
  }
  function renderLeak() {
    var d = dmas(), bad = d.filter(function (x) { return x.leak >= 1.5; }), mnf = d.reduce(function (s, x) { return s + x.props * 0.0028 * x.leak; }, 0), legit = d.reduce(function (s, x) { return s + x.props * 0.0028; }, 0);
    set('grLkDma', num(d.length)); set('grLkBad', num(bad.length)); set('grLkMnf', num(Math.round(mnf)) + ' m³/h'); set('grLkNrw', Math.round(100 * (mnf - legit) / Math.max(mnf, 1) * 0.6 + 18) + '%');
    list('grLkList', d.slice().sort(function (a, b) { return b.leak - a.leak; }).slice(0, 7).map(function (x) { return row(x.leak >= 2.5 ? 'severe' : x.leak >= 1.5 ? 'heavy' : 'free', x.id + ' · night flow ×' + x.leak.toFixed(1), num(x.props) + ' properties · ' + (x.leak >= 1.5 ? 'send a leak-detection crew' : 'normal'), (x.props * 0.0028 * x.leak).toFixed(1) + ' m³/h', x.at, 14); }));
  }

  /* ============================== 6. Port and city interface ============================== */
  var PORT_GATES = { athens: [['Gate E1 · Akti Kondyli (ferries to Crete, Dodecanese)', 23.6315, 37.9445], ['Gate E2 · Akti Kalimasioti', 23.6345, 37.9420], ['Gate E7 · Akti Miaouli (Saronic, Aegina)', 23.6420, 37.9400], ['Gate E9 · cruise terminal Miaouli', 23.6390, 37.9365], ['Gate E12 · Ikonio container approach', 23.6020, 37.9570]] };
  function portSite() { var p = sites(['port'])[0]; if (p) { return p; } return ATH ? { name: 'Port of Piraeus', at: (CFG.sea || {}).port || [23.6375, 37.9420] } : null; }
  function gates() {
    var p = portSite(); if (!p) { return []; }
    var g = PORT_GATES[C.region.id] || [['Passenger gate', p.at[0] - 0.002, p.at[1] + 0.001], ['Freight gate', p.at[0] + 0.003, p.at[1] + 0.002]];
    return g.map(function (x, k) { var at = [x[1], x[2]], a = area(at, 500), h = hour(), wave = Math.max(0, Math.sin((h - 6) / 18 * Math.PI)) + (h > 6.5 && h < 8 ? 0.8 : 0) + (h > 16 && h < 18 ? 0.6 : 0); return { name: x[0], at: at, queue: Math.round((wave * 60 + rnd(SEED, k + Math.floor(state.t / 600)) * 25) * (weekend() ? 1.3 : 1)), a: a }; });
  }
  function renderPort() {
    var p = portSite(); if (!p) { hideCard('grPt'); return; }
    var g = gates(), s = T.sea && T.sea.stats ? T.sea.stats() : null, h = hour(), dep = Math.round((h > 6 && h < 23 ? 9 : 1) * (weekend() ? 1.4 : 1)), a = area(p.at, 1500);
    set('grPtDep', String(dep)); set('grPtQ', num(g.reduce(function (s0, x) { return s0 + x.queue; }, 0))); set('grPtSpd', a.kmh != null ? a.kmh + ' km/h' : '–'); set('grPtShip', s ? num(s.moving) : '–');
    list('grPtList', g.map(function (x) { return row(x.queue > 70 ? 'severe' : x.queue > 40 ? 'heavy' : 'free', x.name, 'Approach roads ' + (x.a.kmh != null ? x.a.kmh + ' km/h' : 'not modelled'), x.queue + ' vehicles', x.at, 16); }));
  }

  /* ============================== 7. Airport landside ============================== */
  function airport() { var a = sites(['airport'])[0]; if (a) { return a; } return ATH ? { name: 'Athens International Airport', at: (CFG.air || {}).at || [23.9445, 37.9364] } : null; }
  function renderAir() {
    var a = airport(); if (!a) { hideCard('grAir'); return; }
    var h = hour(), wave = 0.35 + 0.65 * Math.max(Math.exp(-Math.pow(h - 7, 2) / 4), Math.exp(-Math.pow(h - 18, 2) / 6)), pax = Math.round((ATH ? 3800 : 900) * wave), st = T.air && T.air.stats ? T.air.stats() : null;
    var kerb = Math.min(100, Math.round(45 + wave * 55)), taxiQ = Math.max(0, Math.round(pax / 90 - 8)), park = Math.min(98, Math.round(58 + wave * 30 + (weekend() ? 8 : 0))), acc = area(a.at, 5000);
    set('grAirPax', num(pax)); set('grAirKerb', kerb + '%'); set('grAirTaxi', taxiQ > 0 ? taxiQ + ' min wait' : 'No wait'); set('grAirPark', park + '%');
    var modes = ATH ? [['Car (drop-off and parking)', 0.38], ['Taxi', 0.24], ['Metro line 3', 0.17], ['Suburban rail', 0.09], ['Express buses X93, X95, X96, X97', 0.12]] : [['Car', 0.55], ['Taxi', 0.3], ['Bus', 0.15]];
    bars('grAirBars', modes.map(function (x) { return [x[0], pax * x[1], '', num(Math.round(pax * x[1])) + '/h']; }));
    set('grAirNote', 'Access roads within 5 km: ' + (acc.kmh != null ? acc.kmh + ' km/h simulated' : 'outside the model') + (st && st.movementsHour != null ? ' · ' + st.movementsHour + ' flight movements this hour' : '') + '.');
  }

  /* ============================== 8. Smuggling: border and customs ============================== */
  var BORDER = [['Evzonoi (North Macedonia)', 22.5560, 41.1240, 'road'], ['Promachonas (Bulgaria)', 23.3700, 41.3700, 'road'], ['Kipoi (Türkiye)', 26.3070, 40.9420, 'road'], ['Kastanies (Türkiye)', 26.4750, 41.6580, 'road'], ['Kakavia (Albania)', 20.3770, 39.9220, 'road'],
    ['Krystallopigi (Albania)', 21.1000, 40.6200, 'road'], ['Niki (North Macedonia)', 21.4170, 40.9450, 'road'], ['Ormenio (Bulgaria)', 26.2150, 41.7130, 'road'], ['Port of Piraeus customs', 23.6100, 37.9500, 'port'], ['Port of Thessaloniki customs', 22.9200, 40.6350, 'port'],
    ['Port of Patras customs', 21.7230, 38.2280, 'port'], ['Port of Igoumenitsa customs', 20.2650, 39.5000, 'port'], ['Athens airport customs', 23.9445, 37.9364, 'air']];
  function crossings() {
    var h = hour(), w = 0.4 + 0.6 * Math.max(0, Math.sin((h - 5) / 17 * Math.PI));
    return BORDER.map(function (b, k) { var trucks = Math.round((b[3] === 'road' ? 900 : b[3] === 'port' ? 1400 : 0) * (0.5 + rnd(SEED, k) ) * w * (h / 24)), hits = Math.round(trucks * 0.004 + rnd(k, Math.floor(state.t / 1800)) * 2); return { name: b[0], at: [b[1], b[2]], kind: b[3], trucks: trucks, hits: hits }; });
  }
  function darkShips() {
    var sh = T.live && T.live.vessels ? T.live.vessels() : null, list0 = sh && sh.ships ? sh.ships : [], now = Date.now();
    return list0.filter(function (s) { var t = Date.parse(s.t || ''); return t && now - t > 2 * 3600e3 && (s.type >= 70 && s.type < 90); }).slice(0, 30);
  }
  function renderSmug() {
    var cs = crossings(), dk = darkShips(), hits = cs.reduce(function (s, c) { return s + c.hits; }, 0);
    set('grSmTr', num(cs.reduce(function (s, c) { return s + c.trucks; }, 0))); set('grSmHit', num(hits)); set('grSmDark', T.live && T.live.vessels() ? num(dk.length) : 'no AIS'); set('grSmScan', num(Math.round(hits * 3.2 + 40)));
    var REASONS = ['Plate on watchlist', 'Seal number mismatch', 'Route deviation before border', 'Declared cargo vs. X-ray density', 'Repeated short crossings', 'Tobacco risk profile', 'Fuel laundering risk profile'];
    var c0 = centre(), items = cs.filter(function (c) { return c.hits > 0; }).sort(function (a, b) { return Math.hypot(a.at[0] - c0[0], a.at[1] - c0[1]) - Math.hypot(b.at[0] - c0[0], b.at[1] - c0[1]); }).slice(0, 6).map(function (c, k) { return row(c.hits > 3 ? 'severe' : 'heavy', c.name, pick(SEED + k, Math.floor(state.t / 900), REASONS) + ' · ' + plate(SEED + 9 + k, Math.floor(state.t / 900)), c.hits + ' alerts', c.at, 13); });
    dk.slice(0, 4).forEach(function (s) { items.push(row('moderate', (s.name || 'MMSI ' + s.mmsi) + ' · AIS silent', 'Tanker or cargo, last heard ' + Math.round((Date.now() - Date.parse(s.t)) / 3600e3) + ' h ago', 'Vessel', [s.lon, s.lat], 10)); });
    list('grSmList', items);
  }

  /* ============================== 9. Civil protection and critical infrastructure ============================== */
  var CI_ATH = [['Substation KYT Pallini (IPTO)', 23.8950, 38.0050, 'Power'], ['Substation KYT Koumoundourou (IPTO)', 23.6170, 38.0480, 'Power'], ['Substation KYT Rouf (IPTO)', 23.6990, 37.9740, 'Power'], ['Water treatment plant Galatsi (EYDAP)', 23.7620, 38.0270, 'Water'],
    ['Water treatment plant Acharnes (EYDAP)', 23.7450, 38.0950, 'Water'], ['Water treatment plant Aspropyrgos (EYDAP)', 23.5850, 38.0600, 'Water'], ['Wastewater plant Psyttaleia (EYDAP)', 23.5880, 37.9450, 'Water'], ['Aspropyrgos refinery', 23.5800, 38.0350, 'Fuel'],
    ['Revithoussa LNG terminal', 23.4050, 37.9620, 'Fuel'], ['Hymettus telecom masts', 23.8000, 37.9600, 'Telecom'], ['Athens traffic management centre', 23.7300, 37.9900, 'Transport'], ['Kifissos river channel', 23.6900, 37.9700, 'Flood']];
  var CI_CITY = { athens: CI_ATH,
    thessaloniki: [['Port of Thessaloniki (ThPA)', 22.9250, 40.6320, 'Transport'], ['Thessaloniki airport Makedonia', 22.9709, 40.5197, 'Transport'], ['EYATH wastewater plant, Sindos', 22.8200, 40.6600, 'Water'], ['EYATH water treatment plant', 22.8700, 40.7000, 'Water'], ['Thessaloniki substation (IPTO)', 22.9500, 40.6600, 'Power'], ['Kalochori fuel depots', 22.8600, 40.6400, 'Fuel'], ['Dendropotamos stream', 22.8800, 40.6600, 'Flood']],
    heraklion: [['Linoperamata power station', 25.0600, 35.3300, 'Power'], ['Heraklion airport Nikos Kazantzakis', 25.1803, 35.3397, 'Transport'], ['Port of Heraklion', 25.1400, 35.3450, 'Transport'], ['DEYAH water treatment plant', 25.1200, 35.3200, 'Water'], ['Giofyros stream', 25.1100, 35.3300, 'Flood']],
    patras: [['Port of Patras', 21.7250, 38.2250, 'Transport'], ['Rio–Antirrio bridge', 21.7740, 38.3200, 'Transport'], ['DEYAP water treatment plant', 21.7600, 38.2500, 'Water'], ['Patras substation (IPTO)', 21.7500, 38.2200, 'Power'], ['Glafkos river', 21.7400, 38.2200, 'Flood']] };
  function assets() {
    var out = (CI_CITY[C.region.id] || []).map(function (a) { return { name: a[0], at: [a[1], a[2]], kind: a[3] }; });
    sites(['hospital']).slice(0, 40).forEach(function (s) { out.push({ name: s.name, at: s.at, kind: 'Health' }); });
    sites(['police', 'fire', 'government']).slice(0, 8).forEach(function (s) { out.push({ name: s.name, at: s.at, kind: 'Emergency services' }); });
    var w = now(), fires = ((T.live && T.live.fires()) || {}).list || [], wind = w.wind || 0, hot = (w.temp || 0) >= ((CFG.local || {}).heat || {}).heatC;
    out.forEach(function (a) {
      var f = fires.filter(function (x) { return m(x.at, a.at) < 15000; }).length;
      a.hz = []; if (f) { a.hz.push(f + ' fire' + (f > 1 ? 's' : '') + ' within 15 km'); } if (wind >= 40 && a.kind !== 'Flood') { a.hz.push('Wind ' + Math.round(wind) + ' km/h'); } if (hot && (a.kind === 'Power' || a.kind === 'Health')) { a.hz.push('Heatwave load'); }
      var wr = T.local && T.local.waterStatus ? T.local.waterStatus() : null; if (wr && wr.rain6 >= 20 && (a.kind === 'Flood' || a.kind === 'Water' || a.kind === 'Transport')) { a.hz.push('Heavy rain, ' + Math.round(wr.rain6) + ' mm in 6 h'); }
      a.lvl = a.hz.length >= 2 ? 'severe' : a.hz.length ? 'heavy' : 'free';
    });
    return out;
  }
  function renderCP() {
    var A = assets(), ex = A.filter(function (a) { return a.hz.length; }), kinds = {};
    A.forEach(function (a) { kinds[a.kind] = (kinds[a.kind] || 0) + 1; });
    set('grCpN', num(A.length)); set('grCpEx', num(ex.length)); set('grCp112', ex.filter(function (a) { return a.lvl === 'severe'; }).length ? 'Consider 112 alert' : 'None needed'); set('grCpKinds', num(Object.keys(kinds).length));
    list('grCpList', A.slice().sort(function (a, b) { return b.hz.length - a.hz.length; }).slice(0, 8).map(function (a) { return row(a.lvl, a.name, a.kind + ' · ' + (a.hz.join(', ') || 'no hazard now'), a.hz.length ? 'Exposed' : 'OK', a.at, 15); }));
  }

  /* ============================== 10. School and hospital crossings ============================== */
  function crossingsSH() {
    var h = hour(), school = !weekend() && ((h >= 7.75 && h < 8.75) || (h >= 13.25 && h < 14.5));
    var c0 = centre();
    return sites(['school', 'hospital']).sort(function (a, b) { return m(a.at, c0) - m(b.at, c0); }).slice(0, 150).map(function (s) {
      var a = area(s.at, 250), kmh = a.kmh || 0, v = a.veh, risk = (s.kind === 'school' ? (school ? 2 : 0.6) : 1.2) * (kmh > 30 ? 1.6 : 1) * Math.min(2, v / 40 + 0.3);
      return { name: s.name, at: s.at, kind: s.kind, kmh: kmh, veh: Math.round(v), risk: risk, active: s.kind === 'school' ? school : true };
    }).sort(function (a, b) { return b.risk - a.risk; });
  }
  function renderSH() {
    var X = crossingsSH(), hi = X.filter(function (x) { return x.risk >= 2; });
    set('grShN', num(X.length)); set('grShHi', num(hi.length)); set('grShSch', num(X.filter(function (x) { return x.kind === 'school' && x.active; }).length)); set('grShSpd', X.length ? Math.round(X.reduce(function (s, x) { return s + x.kmh; }, 0) / X.length) + ' km/h' : '–');
    list('grShList', X.slice(0, 8).map(function (x) { return row(x.risk >= 3 ? 'severe' : x.risk >= 2 ? 'heavy' : x.risk >= 1 ? 'moderate' : 'free', x.name, (x.kind === 'school' ? (x.active ? 'School run now' : 'Outside school hours') : 'Hospital access') + ' · ' + x.veh + ' vehicles within 250 m', x.kmh ? x.kmh + ' km/h' : '–', x.at, 17); }));
  }

  /* ============================== 11. Prefecture and highway cameras ============================== */
  var CAMS = null;
  function cams() { if (!CAMS) { CAMS = every([0, 1], 2500, SEED + 5).slice(0, 160).map(function (e, k) { return { id: 'HC-' + (300 + k), at: e.at, i: e.i, road: e.name || 'Highway', type: rnd(SEED, k * 19) < 0.3 ? 'Speed (section)' : rnd(SEED, k * 19 + 1) < 0.5 ? 'PTZ' : 'Fixed CCTV' }; }); } return CAMS; }
  function camState(c, k) { var r = rnd(SEED + 77, k * 31 + Math.floor(state.t / 3600)); return r < 0.04 ? 'offline' : r < 0.1 ? 'degraded' : 'online'; }
  function renderCam() {
    var Cs = cams(), st = { online: 0, degraded: 0, offline: 0 };
    Cs.forEach(function (c, k) { c.st = camState(c, k); st[c.st]++; });
    set('grCmN', num(Cs.length)); set('grCmUp', Cs.length ? (100 * st.online / Cs.length).toFixed(1) + '%' : '–'); set('grCmOff', num(st.offline)); set('grCmInc', num(Cs.filter(function (c) { return C.ratio(c.i) < 0.35 && C.occ(c.i) > 5; }).length));
    var items = Cs.filter(function (c) { return c.st !== 'online'; }).map(function (c) { return row(c.st === 'offline' ? 'severe' : 'moderate', c.id + ' · ' + c.type, c.road + (c.st === 'offline' ? ' · no video for over 10 minutes' : ' · low frame rate or blurred'), c.st, c.at, 15); });
    Cs.filter(function (c) { return C.ratio(c.i) < 0.35 && C.occ(c.i) > 5; }).slice(0, 4).forEach(function (c) { items.unshift(row('heavy', c.id + ' · queue detected', c.road + ' · ' + Math.round(C.ratio(c.i) * 100) + '% of free-flow speed', 'Check', c.at, 15)); });
    list('grCmList', items.slice(0, 9));
  }

  /* ============================== 12. Counter-UAV and threat detection ============================== */
  var NOFLY_ATH = [['Hellenic Parliament and Maximos Mansion', 23.7370, 37.9755, 1000], ['Athens International Airport', 23.9445, 37.9364, 5000], ['Port of Piraeus', 23.6375, 37.9420, 1500], ['Acropolis', 23.7257, 37.9715, 600], ['Elefsina air base', 23.5560, 38.0670, 3000], ['Tatoi air base', 23.7830, 38.1080, 2500], ['Korydallos prison', 23.6450, 37.9840, 500]];
  function zonesU() {
    var NF = { athens: NOFLY_ATH, thessaloniki: [['Thessaloniki airport', 22.9709, 40.5197, 5000], ['White Tower and waterfront', 22.9484, 40.6264, 500], ['Port of Thessaloniki', 22.9250, 40.6320, 1500], ['Diavata prison', 22.8600, 40.6900, 500]],
      heraklion: [['Heraklion airport', 25.1803, 35.3397, 5000], ['Port of Heraklion', 25.1400, 35.3450, 1500], ['Knossos', 25.1630, 35.2980, 600]], patras: [['Port of Patras', 21.7250, 38.2250, 1500], ['Rio–Antirrio bridge', 21.7740, 38.3200, 1000]] };
    var z = (NF[C.region.id] || []).map(function (x) { return { name: x[0], at: [x[1], x[2]], r: x[3] }; });
    sites(['airport']).forEach(function (s) { if (!z.some(function (q) { return m(q.at, s.at) < 3000; })) { z.push({ name: s.name, at: s.at, r: 5000 }); } });
    sites(['defence', 'government']).slice(0, 5).forEach(function (s) { z.push({ name: s.name, at: s.at, r: 800 }); });
    return z;
  }
  function drones() {
    var Z = zonesU(), slot = Math.floor(state.t / 300), out = [], h = hour(), n = h > 6 && h < 21 ? 9 : 3;
    for (var k = 0; k < n; k++) {
      var s = SEED + slot * 13 + k, z = Z.length && rnd(s, 1) < 0.35 ? Z[Math.floor(rnd(s, 2) * Z.length) % Z.length] : null, base = z ? z.at : [bb[0] + rnd(s, 3) * (bb[2] - bb[0]), bb[1] + rnd(s, 4) * (bb[3] - bb[1])];
      var ang = rnd(s, 5) * 6.283, dist = (z ? z.r * (0.4 + rnd(s, 6) * 1.2) : 300), at = [base[0] + Math.cos(ang) * dist / kx, base[1] + Math.sin(ang) * dist / ky];
      var inside = Z.filter(function (q) { return m(q.at, at) <= q.r; })[0], cls = rnd(s, 7) < 0.55 ? 'Registered (Remote ID)' : rnd(s, 8) < 0.7 ? 'Unknown, consumer type' : 'Unknown, no Remote ID';
      var trail = []; for (var j = 0; j < 6; j++) { trail.push([at[0] - Math.cos(ang + j * 0.2) * j * 60 / kx, at[1] - Math.sin(ang + j * 0.2) * j * 60 / ky]); }
      out.push({ id: 'UAS-' + (s % 9000 + 1000), at: at, trail: trail, alt: Math.round(30 + rnd(s, 9) * 140), cls: cls, zone: inside ? inside.name : '', threat: inside && cls.indexOf('Unknown') === 0 ? (cls.indexOf('no Remote') > 0 ? 'severe' : 'heavy') : inside ? 'moderate' : 'free' });
    }
    return out;
  }
  function renderUAV() {
    var D = drones(), Z = zonesU(), hot = D.filter(function (d) { return d.threat === 'severe' || d.threat === 'heavy'; });
    set('grUvN', num(D.length)); set('grUvZone', num(D.filter(function (d) { return d.zone; }).length)); set('grUvThr', num(hot.length)); set('grUvZ', num(Z.length));
    list('grUvList', D.slice().sort(function (a, b) { return ['severe', 'heavy', 'moderate', 'free'].indexOf(a.threat) - ['severe', 'heavy', 'moderate', 'free'].indexOf(b.threat); }).map(function (d) { return row(d.threat, d.id + ' · ' + d.cls, (d.zone ? 'Inside ' + d.zone : 'Outside restricted zones') + ' · ' + d.alt + ' m', d.threat === 'severe' ? 'Alert' : d.threat === 'heavy' ? 'Track' : 'Log', d.at, 15); }));
  }

  /* ============================== 13. Transport for Athens ============================== */
  function renderTfA() {
    var h = hour(), peak = Math.max(Math.exp(-Math.pow(h - 8, 2) / 2), Math.exp(-Math.pow(h - 18, 2) / 3)), base = (ATH ? 2.2e6 : 160e3) * (weekend() ? 0.6 : 1), perH = base * (0.025 + 0.06 * peak);
    var modes = ATH ? [['Metro lines 1, 2 and 3 (STASY)', 0.38, 'free'], ['Buses and trolleys (OSY)', 0.4, 'moderate'], ['Tram (STASY)', 0.04, 'free'], ['Suburban rail (Hellenic Train)', 0.05, 'free'], ['Taxis', 0.13, 'moderate']]
      : [['City buses', 0.72, 'moderate'], ['Taxis', 0.28, 'free']];
    if (!ATH && C.region.id === 'thessaloniki') { modes = [['Thessaloniki Metro', 0.25, 'free'], ['Buses (OASTH)', 0.6, 'moderate'], ['Taxis', 0.15, 'free']]; }
    var ontime = Math.round(93 - peak * 9 - ((area(centre(), 3000).kmh || 50) < 20 ? 6 : 0));
    set('grTfTrip', num(Math.round(perH))); set('grTfOn', ontime + '%'); set('grTfBus', num(((meta.buses || {}).count) || Math.round(perH / 70))); set('grTfCo2', num(Math.round(perH * 7.5 * 0.12 / 1000)) + ' t/h');
    bars('grTfBars', modes.map(function (x) { return [x[0], perH * x[1], '', num(Math.round(perH * x[1])) + '/h']; }));
    var DIS = ATH ? [['Line 1 · Faliro–Piraeus', 'Reduced frequency, works'], ['Line 3 · airport branch', 'Every 36 minutes'], ['Bus 040 Syntagma–Piraeus', 'Delays, traffic on Syngrou'], ['Tram T6 · Syntagma', 'Normal service'], ['Bus X95 airport express', 'Normal service']]
      : [['Line 1', 'Normal service'], ['Line 2', 'Delays in the centre'], ['Night buses', 'From 23:30']];
    list('grTfList', DIS.map(function (d, k) { var bad = d[1].indexOf('Normal') < 0 && (rnd(SEED + k, Math.floor(state.t / 1800)) < 0.7 || k < 2); return row(bad ? 'moderate' : 'free', d[0], bad ? d[1] : 'Normal service', bad ? 'Info' : 'OK'); }));
  }

  /* ============================== cards ============================== */
  function build() {
    card('muni', 'grWs', 'Waste management: smart bins (IoT)', 'Fill-level sensors', SYN + 'Bins sit on real streets; fill levels and sensor states are synthetic. Connect the bin-sensor platform (LoRaWAN or NB-IoT) to replace them.',
      kpis([['Bins with sensors', 'grWsBins'], ['Over 75% full', 'grWsFull'], ['Average fill', 'grWsTr'], ['Sensors offline', 'grWsSave']]) + chk('showBins', 'Show bins on the map') +
      '<div class="bars" id="grWsBars"></div><h3 class="sub-h">Fullest bins</h3><ol class="corridors" id="grWsList"></ol>');
    card('muni', 'grFl', 'Fleet and routing', 'Municipal vehicles', SYN + 'Vehicles are generated and drive real roads; connect vehicle GPS (AVL) to replace them. Routes use the model road network.',
      kpis([['Vehicles out', 'grFlN'], ['Refuse and recycling trucks', 'grFlRt'], ['Sweepers', 'grFlSw'], ['Repair crews', 'grFlCr']]) + chk('showFleet', 'Show vehicles and routes on the map') +
      '<div class="btn-col row"><button type="button" class="btn small" id="grWsPlan">Plan a route for full bins</button><button type="button" class="btn small" id="grWsClr" hidden>Clear</button></div><p class="muted small" id="grWsRoute"></p>' +
      '<div class="kpis">' + tile('Distance saved vs fixed rounds', 'grFlSave') + '</div><h3 class="sub-h">Vehicles out now</h3><ol class="corridors" id="grFlList"></ol>');
    card('muni', 'grLt', 'Street lighting and building energy', '', EST + 'Light times from the sun position; street-light count and building use estimated from road length and the building footprints. Lamp faults are synthetic.',
      kpis([['Lights on', 'grLtOn'], ['Dimmed (quiet roads)', 'grLtDim'], ['Faults', 'grLtFault'], ['Saved tonight (LED, dimming)', 'grLtKwh']]) + chk('showLamps', 'Show street lights on the map') + '<p class="muted small" id="grLtSun"></p><h3 class="sub-h">Building energy today</h3><div class="bars" id="grLtBars"></div><h3 class="sub-h">Lamps not responding</h3><ol class="corridors" id="grLtList"></ol>');
    card('muni', 'grLk', 'Water leakage', 'District metered areas', SYN + 'Areas are a grid over the city and flows are synthetic. Connect ' + (ATH ? 'EYDAP' : 'DEYA') + ' meter data to find real leaks from the minimum night flow.',
      kpis([['Areas', 'grLkDma'], ['Likely leaks', 'grLkBad'], ['Night flow', 'grLkMnf'], ['Water lost (est.)', 'grLkNrw']]) + chk('showDma', 'Show metered areas on the map') + '<ol class="corridors" id="grLkList"></ol>');
    card('fines', 'grCt', 'Traffic and parking tickets: city streets', 'Municipal police and cameras', SYN + 'Tickets are generated in proportion to simulated traffic on real streets; fine values are indicative.',
      kpis([['Tickets today', 'grCtTot'], ['Parking', 'grCtPark'], ['Bus lane', 'grCtBus'], ['Value', 'grCtVal']]) + '<div class="bars" id="grCtBars"></div><h3 class="sub-h">Streets with most tickets</h3><ol class="corridors" id="grCtList"></ol>');
    card('fines', 'grHt', 'Traffic tickets: prefecture roads and national highways', 'Traffic police and section cameras', SYN + 'Tickets are generated from simulated speeds on motorways and trunk roads; fine values are indicative.',
      kpis([['Tickets today', 'grHtTot'], ['Speeding', 'grHtSpd'], ['Roads covered', 'grHtRoads'], ['Value', 'grHtVal']]) + '<div class="bars" id="grHtBars"></div><h3 class="sub-h">Roads</h3><ol class="corridors" id="grHtList"></ol>');
    card('bus', 'grPt', 'Port and city interface', ATH ? 'Piraeus gates' : '', EST + 'Gate queues and departures are synthetic; approach-road speeds are simulated. Ferry schedules and gate counts can be connected.',
      kpis([['Departures next hour', 'grPtDep'], ['Vehicles queuing', 'grPtQ'], ['Roads near the port', 'grPtSpd'], ['Ships moving', 'grPtShip']]) + '<ol class="corridors" id="grPtList"></ol>');
    card('bus', 'grAir', 'Airport landside', ATH ? 'Athens International' : '', EST + 'Passenger flow follows a typical daily profile; kerb, taxi and parking figures are synthetic. Access-road speeds are simulated.',
      kpis([['Passengers arriving, per hour', 'grAirPax'], ['Kerb in use', 'grAirKerb'], ['Taxi rank', 'grAirTaxi'], ['Parking full', 'grAirPark']]) + '<h3 class="sub-h">How passengers reach the airport</h3><div class="bars" id="grAirBars"></div><p class="muted small" id="grAirNote"></p>');
    card('bus', 'grTf', ATH ? 'Transport for Athens' : 'Public transport for ' + esc(CITY), 'All modes', EST + 'Trips by mode are estimated from typical ridership; service messages are examples. Connect ' + (ATH ? 'OASA' : C.region.id === 'thessaloniki' ? 'OASTH' : 'the local operator') + ' GTFS and real-time feeds to replace them.',
      kpis([['Trips this hour', 'grTfTrip'], ['On time', 'grTfOn'], ['Buses in the model', 'grTfBus'], ['CO₂ avoided', 'grTfCo2']]) + '<div class="bars" id="grTfBars"></div><h3 class="sub-h">Service status</h3><ol class="corridors" id="grTfList"></ol>');
    card('anpr', 'grSm', 'Smuggling: border and customs', 'Greece-wide · nearest first', EXA + 'Crossing points are real; truck counts and alerts are synthetic. Vessels come from live AIS: tankers and cargo ships silent for over 2 hours are flagged.',
      kpis([['Trucks crossing today', 'grSmTr'], ['Risk alerts', 'grSmHit'], ['Vessels gone silent', 'grSmDark'], ['Sent to X-ray', 'grSmScan']]) + '<ol class="corridors" id="grSmList"></ol>');
    card('zones', 'grCp', 'Civil protection and critical infrastructure', 'Exposure to current hazards', EXA + 'Hazards are real (Open-Meteo wind and heat, NASA FIRMS fires, rain). Asset positions are approximate; hospitals and emergency services come from OpenStreetMap.',
      kpis([['Assets', 'grCpN'], ['Exposed now', 'grCpEx'], ['Public alert', 'grCp112'], ['Sectors', 'grCpKinds']]) + '<ol class="corridors" id="grCpList"></ol>');
    card('zones', 'grUv', 'Counter-UAV and threat detection', 'Drones and restricted zones', SYN + 'Drone tracks are synthetic. Zones are examples with approximate radii, not the official HCAA geographic zones. Connect an RF or radar sensor to see real drones.',
      kpis([['Drones tracked', 'grUvN'], ['Inside restricted zones', 'grUvZone'], ['Threats', 'grUvThr'], ['Zones', 'grUvZ']]) + '<ol class="corridors" id="grUvList"></ol>');
    card('ped', 'grSh', 'School and hospital crossings', 'Risk near the entrance', EST + 'Schools and hospitals are from OpenStreetMap; traffic and speed within 250 m are simulated. Risk is higher at school-run times and higher speeds.',
      kpis([['Sites', 'grShN'], ['Higher risk now', 'grShHi'], ['Schools in session', 'grShSch'], ['Average nearby speed', 'grShSpd']]) + '<ol class="corridors" id="grShList"></ol>');
    card('dev', 'grCm', 'Prefecture and highway cameras: monitoring', 'Health and detections', SYN + 'Cameras are placed every 2.5 km on motorways and trunk roads; their state is synthetic. Queue detections come from simulated speeds.',
      kpis([['Cameras', 'grCmN'], ['Online', 'grCmUp'], ['Offline', 'grCmOff'], ['Queues seen', 'grCmInc']]) + '<ol class="corridors" id="grCmList"></ol>');
    var pl = $('grWsPlan'); if (pl) { pl.addEventListener('click', function () { planRoute(); $('grWsClr').hidden = false; renderFleet(); C.redraw(); }); $('grWsClr').addEventListener('click', function () { route = null; this.hidden = true; renderFleet(); C.redraw(); }); }
    ['showBins', 'showFleet', 'showLamps', 'showDma'].forEach(function (id) { var b = $(id); if (b) { b.addEventListener('change', function () { C.redraw(); }); } });
  }

  function render() {
    var o = K.tabOpen;
    if (o('muni')) { renderWaste(); renderFleet(); renderLight(); renderLeak(); }
    if (o('fines')) { renderCityTickets(); renderHwyTickets(); }
    if (o('bus')) { renderPort(); renderAir(); renderTfA(); }
    if (o('anpr')) { renderSmug(); }
    if (o('zones')) { renderCP(); renderUAV(); }
    if (o('ped')) { renderSH(); }
    if (o('dev')) { renderCam(); }
  }

  /* ============================== map layers ============================== */
  C.addLayers(function () {
    var out = [], o = K.tabOpen;
    if (muni('showBins')) {
      out.push(dots('gr-bins', bins(), function (b) { var f = fill(b); return rgb(f >= 95 ? 'severe' : f >= 75 ? 'heavy' : f >= 50 ? 'moderate' : 'free'); }, 4, function (b) { return [b.id + ' · ' + b.kind, [['Fill', Math.round(fill(b)) + '%'], ['Street', b.street], ['Emptied', '05:00']], 'Synthetic bin level']; }));
    }
    if (muni('showFleet')) {
      out.push(dots('gr-fleet', fleetNow(), function (x) { return x.v.col; }, 7, vehPopup));
      if (route) { out.push(new deck.PathLayer({ id: 'gr-route', pickable: true, onClick: function (i) { C.showPopup(i.coordinate, 'Planned collection route', [['Full bins', route.stops], ['Length', route.km.toFixed(1) + ' km']], route.roads ? 'Follows the model road network' : 'Straight lines'); }, data: [route.path], getPath: function (p) { return p; }, widthUnits: 'pixels', getWidth: 3, getColor: [40, 120, 200, 220], jointRounded: true })); }
    }
    if (muni('showDma')) {
      out.push(new deck.PolygonLayer({ id: 'gr-dma', data: dmas(), pickable: true, getPolygon: function (d) { return d.poly; }, getFillColor: function (d) { return rgb(d.leak >= 2.5 ? 'severe' : d.leak >= 1.5 ? 'heavy' : 'free').concat([d.leak >= 1.5 ? 60 : 18]); }, getLineColor: [40, 120, 200, 120], lineWidthUnits: 'pixels', getLineWidth: 1, stroked: true,
        onClick: function (i) { if (i.object) { C.showPopup(i.object.at, i.object.id, [['Night flow', '×' + i.object.leak.toFixed(1) + ' of expected'], ['Properties', num(i.object.props)]], 'Synthetic meter data'); } } }));
    }
    if (muni('showLamps')) {
      out.push(dots('gr-lamps', lamps(), function (l) { var s = lampState(l); return s === 'fault' ? rgb('severe') : s === 'dim' ? [200, 170, 60] : s === 'on' ? [255, 220, 90] : rgb('off'); }, 3, function (l) { return [l.id, [['State', lampState(l)], ['Type', l.led ? 'LED, dimmable' : 'Sodium'], ['Road', l.road]], 'Synthetic lamp state']; }));
    }
    if (o('fines')) {
      var t = tickets([0, 1, 2, 3, 4], CITY_OFF, 0.01, SEED + 3).streets.slice(0, 40);
      out.push(dots('gr-tk', t, function (s) { return rgb(s.ratio < 0.6 ? 'heavy' : 'moderate'); }, 6, function (s) { return [s.name, [['Tickets today', num(s.n)]], 'Synthetic tickets']; }));
    }
    if (o('bus')) {
      var g = gates(); if (g.length) { out.push(dots('gr-gates', g, function (x) { return rgb(x.queue > 70 ? 'severe' : x.queue > 40 ? 'heavy' : 'free'); }, 8, function (x) { return [x.name, [['Queue', x.queue + ' vehicles'], ['Approach speed', x.a.kmh != null ? x.a.kmh + ' km/h' : '–']], 'Synthetic queue; simulated speed']; })); }
      var a = airport(); if (a) { out.push(rings('gr-air', [{ at: a.at, name: a.name }], 1200, [40, 120, 200], function (x) { var acc = area(x.at, 5000); return [x.name, [['Landside roads', acc.kmh != null ? acc.kmh + ' km/h simulated' : 'outside the model'], ['Kerb in use', ($('grAirKerb') || {}).textContent || '–'], ['Taxi rank', ($('grAirTaxi') || {}).textContent || '–']], 'Estimated; see the Airport landside card']; })); }
    }
    if (o('anpr')) {
      out.push(dots('gr-border', crossings(), function (c) { return rgb(c.hits > 3 ? 'severe' : c.hits ? 'heavy' : 'info'); }, 8, function (c) { return [c.name, [['Trucks today', num(c.trucks)], ['Alerts', c.hits]], 'Real crossing point; synthetic counts']; }));
      var dk = darkShips(); if (dk.length) { out.push(dots('gr-dark', dk.map(function (s) { return { at: [s.lon, s.lat], s: s }; }), function () { return [150, 80, 200]; }, 6, function (d) { return [d.s.name || 'MMSI ' + d.s.mmsi, [['Last heard', Math.round((Date.now() - Date.parse(d.s.t)) / 3600e3) + ' h ago'], ['MMSI', d.s.mmsi]], 'Live AIS (aisstream.io)']; })); }
    }
    if (o('zones')) {
      out.push(dots('gr-ci', assets(), function (x) { return rgb(x.lvl); }, 7, function (x) { return [x.name, [['Sector', x.kind], ['Hazards', x.hz.join(', ') || 'none now']], 'Approximate position; real hazards']; }));
      out.push(rings('gr-nofly', zonesU(), 800, [208, 59, 59], function (z) { return [z.name, [['Restricted radius', (z.r / 1000).toFixed(1) + ' km'], ['Drones inside now', drones().filter(function (d) { return d.zone === z.name; }).length]], 'Example zone, not the official HCAA zone']; }));
      var D = drones();
      out.push(new deck.PathLayer({ id: 'gr-uav-tr', data: D, getPath: function (d) { return d.trail; }, widthUnits: 'pixels', getWidth: 2, getColor: function (d) { return rgb(d.threat).concat([180]); }, updateTriggers: { getColor: Math.floor(state.t / 300) } }));
      out.push(dots('gr-uav', D, function (d) { return rgb(d.threat); }, 6, function (d) { return [d.id, [['Class', d.cls], ['Height', d.alt + ' m'], ['Zone', d.zone || 'none']], 'Synthetic track']; }));
    }
    if (o('ped')) { out.push(rings('gr-sh', crossingsSH().slice(0, 60).map(function (x) { return { at: x.at, r: 250, x: x, col: rgb(x.risk >= 3 ? 'severe' : x.risk >= 2 ? 'heavy' : x.risk >= 1 ? 'moderate' : 'free') }; }), 250, [40, 160, 100], function (d) { var x = d.x; return [x.name, [['Type', x.kind === 'school' ? 'School' : 'Hospital'], ['Vehicles within 250 m', x.veh], ['Speed nearby', x.kmh ? x.kmh + ' km/h' : '–'], ['Risk', x.risk >= 3 ? 'High' : x.risk >= 2 ? 'Raised' : x.risk >= 1 ? 'Moderate' : 'Low']], 'OpenStreetMap site; simulated traffic']; })); }
    if (o('dev')) { out.push(dots('gr-cams', cams(), function (c) { return rgb(c.st === 'offline' ? 'severe' : c.st === 'degraded' ? 'moderate' : 'free'); }, 5, function (c) { return [c.id + ' · ' + c.type, [['State', c.st || 'online'], ['Road', c.road]], 'Synthetic device state']; })); }
    return out;
  });

  C.onReady(function () {
    meta = C.meta() || meta; bb = meta.bbox || bb; kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180);
    build(); render();
    C.onTab(function () { render(); C.redraw(); });
    C.onMinute(render);
  });
  T.greece = { render: render, bins: bins, drones: drones, assets: assets };
})();
