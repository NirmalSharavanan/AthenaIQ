/* AthenaIQ: second set of Greek use cases, and tidy-up of cards that repeat each other.
 *
 *   ANPR         Daktylios (central Athens traffic ring) enforcement
 *   Emergency    Wildfire evacuation; winter roads; river and stream gauges; earthquake follow-up
 *   Environment  Drought and water supply
 *   Pedestrians  Heritage sites and visitor crowds; rail level crossings
 *   Planning     Cruise-day impact; strike-day planning
 *   Transit      Ferry ports; e-scooters, bikes and bike lanes
 *   Congestion   Toll plazas
 *   Devices      Citizen reports
 *   Reports      EU reporting (urban mobility plan and Recovery Fund indicators)
 *
 * Where no public API is connected the figures are synthetic and each card says so. Real inputs: OpenStreetMap roads,
 * rail and sites, simulated traffic, Open-Meteo weather and rain, USGS earthquakes, and published reference figures
 * (Daktylios rules, Acropolis visitor cap, EYDAP reservoir total), each with its date.
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, CFG = C.CFG, $ = C.$, num = C.num, clock = C.clock, state = T.state, K = T.kit;
  var rnd = K.rnd, hashStr = K.hashStr, esc = K.esc, ATH = C.region.isDefault, RID = C.region.id || 'athens', CITY = C.region.name || 'Athens';
  var meta = C.meta() || {}, bb = meta.bbox || [23.55, 37.85, 23.98, 38.12], kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180), ky = 110570;
  var SYN = '<strong>Synthetic data.</strong> ', EST = '<strong>Estimated.</strong> ', SEED = hashStr('g2' + RID);
  function m(a, b) { return Math.hypot((a[0] - b[0]) * kx, (a[1] - b[1]) * ky); }
  function tile(label, id) { return '<div class="kpi"><span class="k-label">' + label + '</span><span class="k-value" id="' + id + '">–</span></div>'; }
  function kpis(l) { return '<div class="kpis">' + l.map(function (x) { return tile(x[0], x[1]); }).join('') + '</div>'; }
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
  function btn(id, label) { return '<button type="button" class="btn small" id="' + id + '">' + label + '</button>'; }
  function sel(id, opts) { return '<select id="' + id + '">' + opts.map(function (o, i) { return '<option value="' + i + '">' + esc(o) + '</option>'; }).join('') + '</select>'; }
  function hour() { return state.t / 3600; }
  function inBox(at, pad) { pad = pad || 0; return at[0] >= bb[0] - pad && at[0] <= bb[2] + pad && at[1] >= bb[1] - pad && at[1] <= bb[3] + pad; }
  function centre() { var c = C.region.centre; return c && inBox(c) ? c : [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2]; }
  function off(dx, dy) { var c = centre(); return [c[0] + dx * (bb[2] - bb[0]) / 2, c[1] + dy * (bb[3] - bb[1]) / 2]; }
  function now() { var p = T.osint && T.osint.weather ? T.osint.weather() : null; return p || {}; }
  function rain(h) { var p = now(), t = 0; (p.rain || []).slice(0, h).forEach(function (x) { t += x || 0; }); return t; }
  function today() { var d = new Date(); return { dow: d.getDay(), mon: d.getMonth() + 1, day: d.getDate(), date: d }; }
  function lvl(x) { return x >= 3 ? 'severe' : x >= 2 ? 'heavy' : x >= 1 ? 'moderate' : 'free'; }
  function rgb(s) { return { severe: [208, 59, 59], heavy: [230, 130, 40], moderate: [230, 190, 40], free: [40, 160, 100], info: [40, 120, 200], off: [120, 120, 130] }[s] || [40, 120, 200]; }
  function area(at, r) { var veh = 0, free = 0, E = C.edges(); for (var i = 0; i < E.length; i++) { var p = E[i].path[E[i].path.length >> 1]; if (Math.abs((p[1] - at[1]) * ky) > r || m(p, at) > r) { continue; } var o = C.occ(i); veh += o; free += o * C.ratio(i); } return { veh: veh, ratio: veh ? free / veh : 1 }; }
  function dots(id, data, color, radius, popup) {
    return new deck.ScatterplotLayer({ id: id, data: data, pickable: true, radiusUnits: 'pixels', stroked: true, lineWidthUnits: 'pixels', getLineWidth: 1.5, getLineColor: [255, 255, 255, 220],
      getPosition: function (d) { return d.at; }, getRadius: radius || 7, getFillColor: function (d) { return color(d).concat([230]); }, updateTriggers: { getFillColor: Math.floor(state.t / 60) + ':' + tick },
      onClick: function (i) { if (i.object && popup) { var p = popup(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } } });
  }
  function rings(id, data, col) {
    return new deck.ScatterplotLayer({ id: id, data: data, radiusUnits: 'meters', pickable: true, onClick: function (i) { if (i.object && i.object.pop) { var p = i.object.pop(); C.showPopup(i.object.at, p[0], p[1], p[2]); } }, getRadius: function (d) { return d.r; }, getPosition: function (d) { return d.at; }, updateTriggers: { getRadius: tick, getFillColor: tick },
      getFillColor: function (d) { return (d.col || col).concat([45]); }, stroked: true, getLineColor: function (d) { return (d.col || col).concat([220]); }, lineWidthUnits: 'pixels', getLineWidth: 2 });
  }
  var tick = 0;   // bumped when a button changes a scenario

  /* ============================== tidy-up: retire cards that repeat newer ones ============================== */
  var RETIRE_IDS = ['tgCh', 'ccSchool', 'ccProt', 'ccAh', 'ccUtil', 'ccBp', 'airSynCard'];
  var RETIRE_TITLES = ['By violation type', 'Busiest enforcement sites', 'Other public transport', 'Ships now', 'Flights now'];
  function retire() {
    RETIRE_IDS.forEach(function (id) { var s = document.getElementById(id); if (s) { s.setAttribute('data-tab', 'retired'); s.hidden = true; } });
    Array.prototype.forEach.call(document.querySelectorAll('.panel section[data-tab]'), function (s) { var h = s.querySelector('h2'); if (h && RETIRE_TITLES.indexOf(h.textContent.trim()) >= 0) { s.setAttribute('data-tab', 'retired'); s.hidden = true; } });
    var cc = Array.prototype.filter.call(document.querySelectorAll('.panel section[data-tab="dev"] h2'), function (h) { return h.textContent.trim() === 'CCTV cameras'; })[0]; if (cc) { cc.textContent = 'City cameras'; }
  }

  /* ============================== 1. Daktylios ============================== */
  // Published rules for 2025-26: 20 Oct 2025 to 24 Jul 2026, Mon-Thu 07:00-20:00, Fri 07:00-15:00; not at weekends, public holidays or transport strikes.
  var RING = [[23.7175, 37.9945], [23.7330, 37.9930], [23.7480, 37.9950], [23.7620, 37.9905], [23.7700, 37.9830], [23.7620, 37.9700], [23.7480, 37.9615], [23.7300, 37.9590], [23.7150, 37.9660], [23.7090, 37.9800]];
  var RING_GATES = [['Alexandras Ave · Patision', 23.7310, 37.9930], ['Alexandras Ave · Ampelokipi', 23.7570, 37.9935], ['Vas. Sofias · Mesogeion', 23.7650, 37.9870], ['Michalakopoulou', 23.7600, 37.9760], ['Syngrou Ave', 23.7270, 37.9600], ['Vouliagmenis Ave · Ymittou', 23.7480, 37.9620], ['Piraios St', 23.7110, 37.9750], ['Acharnon St', 23.7230, 37.9935], ['Kifisou · Lenorman', 23.7150, 37.9880]];
  var strike = false;
  function ringOn() {
    var d = today(), h = hour(), season = d.mon > 10 || (d.mon === 10 && d.day >= 20) || d.mon < 7 || (d.mon === 7 && d.day <= 24);
    if (!season || strike || d.dow === 0 || d.dow === 6) { return false; }
    return d.dow === 5 ? h >= 7 && h < 15 : h >= 7 && h < 20;
  }
  function renderRing() {
    var on = ringOn(), d = today(), odd = d.day % 2 === 1, slot = Math.floor(state.t / 300), reads = 0, viol = 0, ex = 0;
    var gates = RING_GATES.map(function (g, k) { var at = [g[1], g[2]], a = area(at, 300), n = Math.round(a.veh * 9 * (0.8 + rnd(SEED + k, slot) * 0.4)), v = on ? Math.round(n * (0.05 + rnd(SEED + k, slot + 1) * 0.05)) : 0; reads += n; viol += v; ex += Math.round(n * 0.32); return { name: g[0], at: at, n: n, v: v }; });
    set('grDkOn', on ? 'In force' : strike ? 'Lifted (strike day)' : 'Not in force now'); set('grDkDig', on ? (odd ? 'Odd plates' : 'Even plates') : 'All plates');
    set('grDkReads', num(reads)); set('grDkViol', num(viol));
    set('grDkNote', 'Exempt: about ' + num(ex) + ' reads (low-emission cars, digital gov.gr permits, residents, taxis, emergency and disabled-driver vehicles).');
    list('grDkList', gates.sort(function (a, b) { return b.v - a.v; }).map(function (g) { return row(g.v > 30 ? 'heavy' : g.v ? 'moderate' : 'free', g.name, num(g.n) + ' plates read in the last hour', on ? g.v + ' entries not allowed' : 'Open', g.at, 16); }));
  }

  /* ============================== 2. Wildfire evacuation ============================== */
  var WUI = { athens: [['Penteli and Dionysos', 23.880, 38.080], ['Parnitha foothills, Acharnes', 23.740, 38.112], ['Hymettus, Kaisariani', 23.810, 37.955], ['Aigaleo hills, Chaidari', 23.650, 38.020], ['Rafina–Mati road', 23.975, 38.040]],
    thessaloniki: [['Seich Sou forest', 22.990, 40.650], ['Hortiatis', 23.040, 40.600]], patras: [['Panachaiko slopes', 21.800, 38.260]], heraklion: [['Ammoudara hills', 25.070, 35.330]], chania: [['Akrotiri', 24.090, 35.520]], rhodes: [['Rhodes hills', 28.180, 36.400]], kavala: [['Mount Symvolo', 24.420, 40.950]], volos: [['Pelion slopes', 22.980, 39.380]], ioannina: [['Mitsikeli slopes', 20.900, 39.700]], larissa: [['Larissa farmland edge', 22.460, 39.660]] };
  var fire = null;
  function wuiList() { return (WUI[RID] || [['City edge', off(0.8, 0.8)[0], off(0.8, 0.8)[1]]]).map(function (w) { return { name: w[0], at: [w[1], w[2]] }; }); }
  function startFire(k) {
    var w = wuiList()[k] || wuiList()[0], p = now().now || {}, wind = Math.max(15, p.wind || 30), dir = ((p.dir != null ? p.dir : 20) + 180) * Math.PI / 180;
    var front = { at: [w.at[0] + Math.sin(dir) * 1500 / kx, w.at[1] + Math.cos(dir) * 1500 / ky], r: 1500 + wind * 40 };
    var aps = ((CFG.emergency || {}).assemblyPoints || []).slice().sort(function (a, b) { return m(a.at, w.at) - m(b.at, w.at); }).filter(function (a) { return m(a.at, w.at) > 3500; }), ap = aps[0] || { name: 'City centre', at: centre() };
    var route = T.response ? T.response.pathBetween(w.at, ap.at) : null, closures = [];
    C.edges().forEach(function (e, i) { var mid = e.path[e.path.length >> 1]; if (e.c >= 2 && m(mid, front.at) < front.r * 0.9 && closures.length < 400) { closures.push(i); } });
    fire = { w: w, wind: Math.round(wind), front: front, ap: ap, route: route, closures: closures, t0: state.t };
    tick++;
  }
  function renderFire() {
    var n = now().now || {}, risk = (n.temp || 20) >= 35 || (n.wind || 0) >= 40 ? 'High' : (n.temp || 20) >= 28 || (n.wind || 0) >= 25 ? 'Moderate' : 'Low';
    set('grFeRisk', risk); set('grFeWind', n.wind != null ? Math.round(n.wind) + ' km/h' : '–');
    if (!fire) { set('grFeZone', '–'); set('grFeCl', '–'); set('grFeOut', 'Choose an area and press Simulate to draw the evacuation zone, road closures and a route to the nearest assembly point.'); list('grFeList', []); return; }
    var mins = Math.max(0, Math.round((state.t - fire.t0) / 60)), homes = Math.round(fire.front.r * fire.front.r * Math.PI / 1e6 * 900);
    set('grFeZone', (fire.front.r / 1000).toFixed(1) + ' km radius'); set('grFeCl', num(fire.closures.length) + ' roads');
    set('grFeOut', 'Fire near ' + esc(fire.w.name) + ', wind ' + fire.wind + ' km/h. About ' + num(homes) + ' homes in the zone. Evacuate to ' + esc(fire.ap.name) + (fire.route ? ', route ' + (fire.route.links.length) + ' road links, one-way outbound.' : '.') +
      '<br><em>Draft 112 message:</em> "Fire near ' + esc(fire.w.name) + '. Leave now towards ' + esc(fire.ap.name) + '. Follow police directions."');
    list('grFeList', [row('severe', 'Send 112 alert to the zone', 'Cell broadcast to all phones within ' + (fire.front.r / 1000).toFixed(1) + ' km', 'Step 1', fire.front.at, 13), row('heavy', 'Close ' + fire.closures.length + ' roads into the zone', 'Keep outbound lanes open; contraflow on main avenues', 'Step 2', fire.front.at, 13),
      row('moderate', 'Hold traffic for fire engines', 'Signals on the route set to green for emergency vehicles', 'Step 3', fire.w.at, 14), row('free', 'Open ' + fire.ap.name, 'Shelter, water and buses back', 'Step 4', fire.ap.at, 15), row('free', 'Elapsed', 'since the fire was reported', mins + ' min', null)]);
  }

  /* ============================== 3. Winter roads ============================== */
  var WINTER = { athens: [['Parnitha mountain road', 23.720, 38.150], ['A1 at Malakasa (towards Lamia)', 23.800, 38.230], ['Tatoi–Varympompi', 23.770, 38.130], ['Penteli road', 23.880, 38.060], ['A8 at Kakia Skala (towards Corinth)', 23.330, 37.980]],
    thessaloniki: [['Egnatia Odos A2, Langadas', 23.050, 40.740], ['Hortiatis road', 23.060, 40.600]], ioannina: [['Egnatia Odos at Metsovo', 21.180, 39.770], ['Ioannina–Kakavia road', 20.700, 39.600]], larissa: [['A1 at Tempi', 22.600, 39.880]], kavala: [['Egnatia at Symvolo', 24.400, 40.960]], volos: [['Pelion road, Portaria', 23.000, 39.390]], patras: [['Panachaiko road', 21.850, 38.200]], heraklion: [['Road to Anogia (Psiloritis)', 24.900, 35.280]], chania: [['Road to Omalos', 23.890, 35.330]], rhodes: [['Profitis Ilias road', 27.950, 36.270]] };
  function winter() {
    var n = now().now || {}, t = n.temp != null ? n.temp : 12, snowCode = n.code >= 71 && n.code <= 86;
    return (WINTER[RID] || []).map(function (w, k) { var alt = 600 + rnd(SEED, k) * 700, rt = t - alt / 160 + (hour() < 8 ? -2 : 0), st = snowCode && rt < 1 ? 3 : rt < 0 ? 2 : rt < 3 ? 1 : 0; return { name: w[0], at: [w[1], w[2]], temp: rt, st: st, alt: Math.round(alt) }; });
  }
  function renderWinter() {
    var W = winter(), gr = W.filter(function (w) { return w.st >= 1; }).length;
    set('grWiN', num(W.length)); set('grWiIce', num(W.filter(function (w) { return w.st >= 2; }).length)); set('grWiGr', num(gr * 2)); set('grWiCh', W.some(function (w) { return w.st === 3; }) ? 'Chains required' : 'No');
    list('grWiList', W.map(function (w) { return row(lvl(w.st), w.name, 'About ' + w.alt + ' m · road ' + w.temp.toFixed(1) + ' °C estimated', ['Clear', 'Grit tonight', 'Ice: grit now', 'Snow: chains or close'][w.st], w.at, 12); }));
  }

  /* ============================== 4. River and stream gauges ============================== */
  var RIVERS = { athens: [['Kifissos, Pireos St', 23.690, 37.965], ['Kifissos, Metamorfosi', 23.750, 38.060], ['Podoniftis, Nea Ionia', 23.755, 38.040], ['Ilissos, Kallithea', 23.700, 37.945], ['Sarantapotamos, Elefsina', 23.560, 38.060]],
    thessaloniki: [['Dendropotamos', 22.880, 40.660], ['Gallikos', 22.830, 40.690]], larissa: [['Pineios, Larissa', 22.420, 39.645]], volos: [['Krafsidonas', 22.950, 39.370], ['Xirias', 22.920, 39.360]], ioannina: [['Lake Pamvotis', 20.880, 39.670]], patras: [['Glafkos', 21.740, 38.220]], heraklion: [['Giofyros', 25.110, 35.330]], chania: [['Kladissos', 23.990, 35.500]], rhodes: [['Rhodes town stream', 28.220, 36.430]], kavala: [['Kavala stream', 24.410, 40.940]] };
  var flood = false;
  function gauges() {
    var r = flood ? 80 : rain(6), r24 = flood ? 140 : rain(24);
    return (RIVERS[RID] || []).map(function (g, k) { var base = 0.4 + rnd(SEED, k * 3) * 0.6, lvlM = base + r * 0.035 + r24 * 0.01, alarm = 2.2 + rnd(SEED, k) * 0.8; return { name: g[0], at: [g[1], g[2]], h: lvlM, alarm: alarm, st: lvlM >= alarm ? 3 : lvlM >= alarm * 0.75 ? 2 : lvlM >= alarm * 0.5 ? 1 : 0 }; });
  }
  function renderGauges() {
    var G = gauges();
    set('grRgN', num(G.length)); set('grRgAl', num(G.filter(function (g) { return g.st >= 3; }).length)); set('grRgR', (flood ? 80 : rain(6)).toFixed(0) + ' mm'); set('grRgMax', G.length ? Math.max.apply(null, G.map(function (g) { return Math.round(100 * g.h / g.alarm); })) + '%' : '–');
    list('grRgList', G.sort(function (a, b) { return b.h / b.alarm - a.h / a.alarm; }).map(function (g) { return row(lvl(g.st), g.name, 'Alarm at ' + g.alarm.toFixed(1) + ' m', g.h.toFixed(2) + ' m', g.at, 15); }));
  }

  /* ============================== 5. Earthquake follow-up ============================== */
  var quakeSim = null;
  function quake() {
    if (quakeSim) { return quakeSim; }
    var q = (T.osint && T.osint.quakes && T.osint.quakes()) || [], c = centre(), best = null;
    q.forEach(function (x) { var d = Math.hypot((x.lon - c[0]) * kx, (x.lat - c[1]) * ky) / 1000; if (x.mag >= 4 && d < 150 && (!best || x.mag > best.mag)) { best = { mag: x.mag, km: d, place: x.place, real: true }; } });
    return best;
  }
  function renderQuake() {
    var q = quake(), nb = (meta.buildings || {}).count || 50000;
    if (!q) { set('grEqM', 'None near'); set('grEqIns', '–'); set('grEqShel', '–'); set('grEqDone', '–'); set('grEqOut', 'No earthquake of M4 or more within 150 km in the live feed. Press Simulate for an M5.8 exercise.'); list('grEqList', []); return; }
    var share = Math.max(0, Math.min(0.2, (q.mag - 4) * 0.04 - q.km / 3000)), ins = Math.round(nb * share), done = Math.min(ins, Math.round(((state.t - (q.t0 || state.t - 3 * 3600)) / 3600) * 40 * 12));
    var aps = (CFG.emergency || {}).assemblyPoints || [];
    set('grEqM', 'M' + q.mag.toFixed(1) + ' · ' + Math.round(q.km) + ' km'); set('grEqIns', num(ins)); set('grEqShel', num(aps.length)); set('grEqDone', ins ? Math.round(100 * done / ins) + '%' : '–');
    set('grEqOut', (q.real ? 'Live (USGS): ' + esc(q.place || '') : 'Exercise') + '. ' + num(ins) + ' buildings to inspect, 40 engineer teams assumed at 12 buildings an hour.');
    var cats = [['Green · safe to use', 0.78], ['Yellow · limited use', 0.17], ['Red · do not enter', 0.05]];
    list('grEqList', cats.map(function (x, k) { return row(['free', 'moderate', 'severe'][k], x[0], 'Of buildings inspected so far', num(Math.round(done * x[1])), null); }).concat(aps.slice(0, 4).map(function (a, k) { return row('free', a.name, 'Shelter · ' + num(Math.round(ins * 0.6 / Math.max(1, aps.length))) + ' people expected', 'Open', a.at, 15); })));
  }

  /* ============================== 6. Drought and water supply ============================== */
  // EYDAP: the four reservoirs held 565.5 million m³ on 21 October 2026; Attica draws about 460-500 million m³ a year.
  var RES = [['Mornos', 0.52], ['Evinos', 0.16], ['Yliki', 0.27], ['Marathon', 0.05]];
  function renderWater() {
    var days = Math.round((Date.now() - Date.parse('2026-10-21')) / 864e5), use = 480 / 365, inflow = rain(24) > 5 ? 0.6 : 0.15;
    var tot = ATH ? 565.5 - days * (use - inflow) : 20 + rnd(SEED, 1) * 15, h = hour(), demand = (ATH ? 1.32e6 : 0.05e6) * (0.7 + 0.5 * Math.max(Math.exp(-Math.pow(h - 8, 2) / 3), Math.exp(-Math.pow(h - 20, 2) / 4)));
    var left = ATH ? tot / use : tot / 0.06, stage = ATH ? (tot < 400 ? 'Stage 2: restrictions' : tot < 550 ? 'Stage 1: save water' : 'Normal') : (left < 180 ? 'Stage 2: restrictions' : left < 365 ? 'Stage 1: save water' : 'Normal');
    set('grDrTot', tot.toFixed(0) + ' million m³'); set('grDrDays', ATH ? num(Math.round(tot / use)) + ' days' : num(Math.round(tot / 0.06)) + ' days'); set('grDrDem', num(Math.round(demand / 24)) + ' m³/h'); set('grDrSt', stage);
    if (ATH) { bars('grDrBars', RES.map(function (r) { return [r[0], tot * r[1], '', (tot * r[1]).toFixed(0) + ' million m³']; })); } else { set('grDrBars', C.barRow('Local supply (' + esc(CITY) + ')', 'synthetic', tot.toFixed(1) + ' million m³', tot / 40)); }
    set('grDrNote', ATH ? 'Starting point: EYDAP total of 565.5 million m³ on 21 Oct 2026. Since then: estimated at 480 million m³ a year drawn, less rain inflow. Split by reservoir is estimated.' : 'No public reservoir feed for this city is connected; figures are synthetic.');
  }

  /* ============================== 7. Heritage sites and visitor crowds ============================== */
  var HERITAGE = { athens: [['Acropolis', 23.7257, 37.9715, 20000], ['Ancient Agora', 23.7220, 37.9750, 6000], ['Plaka and Monastiraki', 23.7270, 37.9760, 0], ['Acropolis Museum', 23.7285, 37.9685, 8000], ['Panathenaic Stadium', 23.7411, 37.9683, 4000]],
    thessaloniki: [['White Tower', 22.9484, 40.6264, 3000], ['Rotunda', 22.9530, 40.6330, 2000]], heraklion: [['Knossos', 25.1630, 35.2980, 8000], ['Heraklion Archaeological Museum', 25.1370, 35.3390, 5000]], rhodes: [['Rhodes Old Town', 28.2270, 36.4450, 0], ['Palace of the Grand Master', 28.2240, 36.4470, 6000]],
    chania: [['Old Venetian harbour', 24.0180, 35.5180, 0]], kavala: [['Kavala fortress', 24.4160, 40.9350, 1500]], volos: [['Volos waterfront', 22.9490, 39.3600, 0]], patras: [['Roman Odeon', 21.7380, 38.2440, 1500]], ioannina: [['Ioannina castle', 20.8550, 39.6680, 2500]], larissa: [['Ancient theatre of Larissa', 22.4190, 39.6390, 1500]] };
  function visitors() {
    var h = hour(), cruise = cruiseShips().reduce(function (s, x) { return s + x.pax; }, 0);
    return (HERITAGE[RID] || []).map(function (x, k) {
      var cap = x[3], day = cap || 9000, open = h >= 8 && h < 20, shape = open ? Math.exp(-Math.pow(h - 11, 2) / 6) : 0, hourCap = cap ? Math.round(cap * (h < 10 ? 0.15 : h < 12 ? 0.12 : 0.07)) : 0;
      var nowN = Math.round(day * 0.16 * shape * (1 + cruise / 30000)), q = cap && nowN > hourCap ? Math.round((nowN - hourCap) / hourCap * 60) : 0;
      return { name: x[0], at: [x[1], x[2]], now: nowN, hourCap: hourCap, cap: cap, q: q, st: q > 30 ? 3 : q > 10 ? 2 : nowN > day * 0.12 ? 1 : 0 };
    });
  }
  function renderHeritage() {
    var V = visitors(), a = V[0];
    set('grHeNow', num(V.reduce(function (s, x) { return s + x.now; }, 0))); set('grHeCap', a && a.cap ? num(a.cap) + ' a day' : 'No cap'); set('grHeSlot', a && a.hourCap ? num(a.hourCap) : '–'); set('grHeQ', a ? a.q + ' min' : '–');
    list('grHeList', V.map(function (x) { return row(lvl(x.st), x.name, x.cap ? 'Hourly slot ' + num(x.hourCap) + ' · daily cap ' + num(x.cap) : 'Open area, no ticketing', num(x.now) + ' now', x.at, 16); }));
  }

  /* ============================== 8. Cruise-day impact ============================== */
  var CRUISE_PORT = { athens: [23.6390, 37.9365], thessaloniki: [22.9300, 40.6330], heraklion: [25.1420, 35.3450], rhodes: [28.2300, 36.4500], chania: [24.1400, 35.4900], kavala: [24.4100, 40.9300], volos: [22.9400, 39.3550], patras: [21.7300, 38.2400] };
  function cruiseShips() {
    var p = CRUISE_PORT[RID]; if (!p) { return []; }
    var d = today(), season = d.mon >= 4 && d.mon <= 11, n = Math.round((ATH ? 5 : 2) * (season ? 1 : 0.25) * (0.6 + rnd(SEED, d.day) * 0.8)), out = [];
    var NAMES = ['Aegean Star', 'Mediterranean Pearl', 'Ionian Spirit', 'Odyssey Voyager', 'Blue Horizon', 'Cycladic Dream', 'Hellas Explorer'];
    for (var k = 0; k < n; k++) { var arr = 6 + Math.floor(rnd(SEED + k, d.day) * 4), dep = arr + 8 + Math.floor(rnd(SEED + k, d.day + 1) * 5); out.push({ name: NAMES[(k + d.day) % NAMES.length], at: [p[0] + k * 0.002, p[1] - k * 0.001], arr: arr, dep: dep, pax: Math.round(1500 + rnd(SEED + k, 9) * 3500), inPort: hour() >= arr && hour() < dep }); }
    return out;
  }
  function renderCruise() {
    var S = cruiseShips(); if (!CRUISE_PORT[RID]) { set('grCrSub', 'No cruise port in this city'); }
    var ashore = S.filter(function (s) { return s.inPort; }).reduce(function (t, s) { return t + Math.round(s.pax * 0.8); }, 0);
    set('grCrN', num(S.length)); set('grCrPax', num(S.reduce(function (t, s) { return t + s.pax; }, 0))); set('grCrAsh', num(ashore)); set('grCrCoach', num(Math.round(ashore * 0.45 / 45)));
    list('grCrList', S.map(function (s) { return row(s.inPort ? 'moderate' : 'free', s.name, 'Arrives ' + clock(s.arr * 3600) + ' · leaves ' + clock(s.dep * 3600), num(s.pax) + ' passengers', s.at, 15); }));
  }

  /* ============================== 9. Strike-day planning ============================== */
  function renderStrike() {
    var base = (CFG.analytics || {}).targetsBaseTrips || 400000, extra = strike ? Math.round(base * 0.18) : 0;
    set('grStOn', strike ? 'Strike day' : 'Normal day'); set('grStTrips', strike ? '+' + num(extra) : '0'); set('grStSpd', strike ? '−' + Math.round(18) + '%' : '0%'); set('grStRing', ATH ? (strike ? 'Lifted' : 'As scheduled') : 'n/a');
    list('grStList', (strike ? [['Lift the Daktylios', 'Restrictions do not apply on public-transport strike days'], ['Open extra taxi ranks at metro hubs', 'Syntagma, Omonia, Monastiraki, Piraeus'], ['Suspend non-urgent roadworks', 'Clear lanes on Kifisias, Syngrou, Mesogeion'], ['Message signs', '"Strike today · expect delays · share rides"'], ['Extra traffic police at the 10 busiest junctions', 'From 07:00 to 10:00']]
      : [['Press Simulate strike to see the plan', 'Moves metro and bus riders to cars and taxis']]).map(function (x, k) { return row(strike ? (k < 2 ? 'heavy' : 'moderate') : 'free', x[0], x[1], strike ? 'Action' : '', null); }));
  }

  /* ============================== 10. Ferry ports ============================== */
  var FERRY = { athens: [['Piraeus (Cyclades, Crete, Dodecanese)', 23.6315, 37.9445, 14], ['Rafina (Cyclades, Evia)', 24.0100, 38.0230, 6], ['Lavrio (Kea, Kythnos)', 24.0600, 37.7130, 2]], thessaloniki: [['Thessaloniki (Sporades, summer)', 22.9300, 40.6330, 1]], heraklion: [['Heraklion (Piraeus, Santorini)', 25.1420, 35.3450, 5]],
    patras: [['Patras (Italy: Ancona, Bari, Venice)', 21.7250, 38.2250, 4]], rhodes: [['Rhodes (Dodecanese, Piraeus)', 28.2300, 36.4500, 6]], chania: [['Souda (Piraeus)', 24.0750, 35.4890, 2]], kavala: [['Kavala (Thassos, Limnos)', 24.4100, 40.9300, 6]], volos: [['Volos (Skiathos, Skopelos, Alonissos)', 22.9400, 39.3550, 4]] };
  function ferries() {
    var d = today(), summer = d.mon >= 6 && d.mon <= 9, h = hour();
    return (FERRY[RID] || []).map(function (f, k) { var dep = Math.round(f[3] * (summer ? 2 : 1) * (h > 6 && h < 22 ? 0.12 : 0.02) * 10) / 1, load = Math.min(99, Math.round(45 + (summer ? 35 : 0) + rnd(SEED + k, d.day) * 20)), q = Math.round(dep * 60 * load / 100); return { name: f[0], at: [f[1], f[2]], dep: dep, load: load, q: q }; });
  }
  function renderFerry() {
    var F = ferries(); if (!F.length) { set('grFyRow', 'No ferry port in this city'); }
    set('grFyDep', num(F.reduce(function (s, f) { return s + f.dep; }, 0))); set('grFyLoad', F.length ? Math.round(F.reduce(function (s, f) { return s + f.load; }, 0) / F.length) + '%' : '–'); set('grFyQ', num(F.reduce(function (s, f) { return s + f.q; }, 0))); set('grFyPorts', num(F.length));
    list('grFyList', F.map(function (f) { return row(f.load > 90 ? 'severe' : f.load > 75 ? 'heavy' : 'free', f.name, f.dep + ' sailings next hour · ' + f.q + ' vehicles waiting to board', f.load + '% booked', f.at, 14); }));
  }

  /* ============================== 11. Micromobility ============================== */
  var DOCKS = null;
  function docks() { if (DOCKS) { return DOCKS; } var E = C.edges(), out = [], c = centre(); for (var i = 0; i < E.length && out.length < 60; i += 37) { var p = E[i].path[0]; if (E[i].c >= 2 && m(p, c) < 4500) { out.push({ id: 'D' + (100 + out.length), at: p, cap: 12 + Math.floor(rnd(SEED, i) * 12) }); } } DOCKS = out; return out; }
  function renderMicro() {
    var h = hour(), D = docks(), use = Math.max(0.1, Math.exp(-Math.pow(h - 9, 2) / 4) + Math.exp(-Math.pow(h - 18, 2) / 5)), sc = Math.round((ATH ? 3500 : 600) * 0.6), bikes = D.reduce(function (s, d) { return s + d.cap; }, 0);
    D.forEach(function (d, k) { d.bikes = Math.round(d.cap * (0.1 + rnd(SEED + k, Math.floor(state.t / 1800)) * 0.9)); });
    set('grMmSc', num(Math.round(sc * use / 2))); set('grMmBk', num(D.reduce(function (s, d) { return s + d.bikes; }, 0)) + ' of ' + num(bikes)); set('grMmLane', (C.cycleKm ? C.cycleKm() : 0).toFixed(0) + ' km'); set('grMmPark', num(Math.round(sc * 0.04)));
    list('grMmList', D.filter(function (d) { return d.bikes <= 2 || d.bikes >= d.cap - 1; }).slice(0, 6).map(function (d) { return row(d.bikes <= 2 ? 'heavy' : 'moderate', 'Dock ' + d.id, d.bikes <= 2 ? 'Nearly empty: send a rebalancing van' : 'Full: riders cannot return bikes', d.bikes + '/' + d.cap, d.at, 17); }));
  }

  /* ============================== 12. Toll plazas ============================== */
  var TOLLS = { athens: [['Attiki Odos · Elefsina', 23.5700, 38.0450], ['Attiki Odos · Metamorfosi', 23.7550, 38.0650], ['Attiki Odos · Kantza (Pallini)', 23.8850, 38.0050], ['Attiki Odos · Airport', 23.9300, 37.9450], ['A8 · Elefsina toll', 23.5600, 38.0300], ['A1 · Afidnes toll', 23.8100, 38.2000]],
    thessaloniki: [['A1 · Malgara toll', 22.7400, 40.6000]], patras: [['Rio–Antirrio bridge toll', 21.7700, 38.3150], ['Olympia Odos · Rio toll', 21.8000, 38.2800]], larissa: [['A1 · Moschochori toll', 22.5000, 39.5300]], ioannina: [['Egnatia · Pamvotida toll', 20.8800, 39.6900]], kavala: [['Egnatia · Kavala toll', 24.3600, 40.9600]], volos: [['A1 · Velestino toll', 22.7800, 39.3800]] };
  function tolls() {
    return (TOLLS[RID] || []).map(function (t, k) { var at = [t[1], t[2]], a = area(at, 600), flow = Math.round(a.veh * 14 + 200 * rnd(SEED + k, Math.floor(state.t / 900))), ep = 0.72 + rnd(SEED, k) * 0.15, rho = flow * (1 - ep) / (4 * 250), cashQ = Math.round(rho < 0.85 ? rho * 3 : Math.min(25, 2.5 + (rho - 0.85) * 60)); return { name: t[0], at: at, flow: flow, ep: ep, q: cashQ }; });
  }
  function renderTolls() {
    var X = tolls(); if (!X.length) { set('grTlSub', 'No toll plaza near this city'); }
    set('grTlN', num(X.length)); set('grTlFlow', num(X.reduce(function (s, x) { return s + x.flow; }, 0)) + '/h'); set('grTlEp', X.length ? Math.round(100 * X.reduce(function (s, x) { return s + x.ep; }, 0) / X.length) + '%' : '–'); set('grTlQ', X.length ? Math.max.apply(null, X.map(function (x) { return x.q; })) + ' min' : '–');
    list('grTlList', X.sort(function (a, b) { return b.q - a.q; }).map(function (x) { return row(x.q > 8 ? 'severe' : x.q > 4 ? 'heavy' : 'free', x.name, num(x.flow) + ' vehicles an hour · ' + Math.round(x.ep * 100) + '% electronic tag', x.q + ' min cash lane', x.at, 15); }));
  }

  /* ============================== 13. Rail level crossings ============================== */
  var LX = null;
  function crossings() {
    if (LX) { return LX; }
    LX = [];
    if (!rail) { return LX; }
    var grid = {}, E = C.edges();
    E.forEach(function (e, i) { if (e.c < 2) { return; } e.path.forEach(function (p) { var key = Math.round(p[0] * 2000) + ':' + Math.round(p[1] * 2000); (grid[key] = grid[key] || []).push(i); }); });
    var seen = {};
    rail.forEach(function (line) { for (var k = 0; k < line.length; k += 2) { var p = [line[k], line[k + 1]], key = Math.round(p[0] * 2000) + ':' + Math.round(p[1] * 2000), hit = grid[key]; if (hit && !seen[key] && LX.length < 40) { var near = LX.some(function (x) { return m(x.at, p) < 400; }); if (!near) { seen[key] = 1; LX.push({ at: p, i: hit[0], id: 'LX-' + (LX.length + 1) }); } } } });
    return LX;
  }
  var rail = null;
  function renderLX() {
    var X = crossings(), slot = Math.floor(state.t / 300), h = hour();
    X.forEach(function (x, k) { var r = rnd(SEED + k, slot); x.train = h > 5.5 && h < 23.5 && r < 0.12; x.fault = rnd(SEED + 99, k + Math.floor(state.t / 86400)) < 0.06; x.viol = x.train && r < 0.02; x.st = x.fault ? 3 : x.viol ? 2 : x.train ? 1 : 0; });
    set('grLxN', num(X.length)); set('grLxDown', num(X.filter(function (x) { return x.train; }).length)); set('grLxF', num(X.filter(function (x) { return x.fault; }).length)); set('grLxV', num(X.filter(function (x) { return x.viol; }).length));
    var names = C.names ? C.names() : [];
    list('grLxList', X.slice().sort(function (a, b) { return b.st - a.st; }).slice(0, 8).map(function (x) { var nm = names[C.edges()[x.i].n] || 'Unnamed road'; return row(lvl(x.st), x.id + ' · ' + nm, x.fault ? 'Barrier or light fault: send maintenance, warn trains to slow' : x.viol ? 'Vehicle crossed with barriers down' : x.train ? 'Barriers down, train passing' : 'Open to road traffic', ['OK', 'Train', 'Violation', 'Fault'][x.st], x.at, 17); }));
    if (!X.length) { set('grLxSub', rail ? 'No road–rail crossings found at street level' : 'Loading rail data…'); }
  }

  /* ============================== 14. Citizen reports ============================== */
  var REPORT_TYPES = [['Pothole', 0.3, 'Roads'], ['Street light out', 0.22, 'Lighting'], ['Illegal dumping', 0.16, 'Cleaning'], ['Overflowing bin', 0.12, 'Cleaning'], ['Blocked pavement', 0.1, 'Municipal police'], ['Damaged sign', 0.06, 'Roads'], ['Water leak in street', 0.04, 'Water company']];
  function reports() {
    var E = C.edges(), out = [], d = today(), n = Math.round((ATH ? 120 : 30) * Math.min(1, hour() / 18 + 0.1));
    for (var k = 0; k < n; k++) { var s = SEED + d.day * 1000 + k, e = E[Math.floor(rnd(s, 1) * E.length) % E.length], r = rnd(s, 2), acc = 0, ty = REPORT_TYPES[0]; for (var j = 0; j < REPORT_TYPES.length; j++) { acc += REPORT_TYPES[j][1]; if (r <= acc) { ty = REPORT_TYPES[j]; break; } } var age = rnd(s, 3) * hour(); out.push({ id: 'R-' + (5000 + k), at: e.path[0], type: ty[0], team: ty[2], st: age > 6 ? 'Fixed' : age > 2 ? 'Assigned' : 'New', age: age }); }
    return out;
  }
  function renderReports() {
    var R = reports(), open = R.filter(function (r) { return r.st !== 'Fixed'; }), by = {};
    R.forEach(function (r) { by[r.type] = (by[r.type] || 0) + 1; });
    set('grRpN', num(R.length)); set('grRpOpen', num(open.length)); set('grRpFix', R.length ? Math.round(100 * (R.length - open.length) / R.length) + '%' : '–'); set('grRpAge', open.length ? (open.reduce(function (s, r) { return s + r.age; }, 0) / open.length).toFixed(1) + ' h' : '–');
    bars('grRpBars', Object.keys(by).sort(function (a, b) { return by[b] - by[a]; }).map(function (k) { return [k, by[k]]; }));
    list('grRpList', open.slice(0, 7).map(function (r) { return row(r.st === 'New' ? 'heavy' : 'moderate', r.id + ' · ' + r.type, r.team + ' · ' + r.st.toLowerCase() + ' · ' + r.age.toFixed(1) + ' h ago', r.st, r.at, 17); }));
  }

  /* ============================== 15. EU reporting ============================== */
  function renderEU() {
    var p = (now().now || {}), pm = p.pm25 != null ? p.pm25 : 14, rows = [
      ['Public transport, walking and cycling share', ATH ? 0.42 : 0.33, 0.55, '%'], ['Road deaths per 100,000 people (year to date)', 4.6, 3.0, ''], ['PM2.5 today (µg/m³)', pm, 25, 'limit'],
      ['CO₂ from road transport, kt a day', ATH ? 12.4 : 1.1, ATH ? 10.0 : 0.9, ''], ['Population within 500 m of frequent transit', ATH ? 0.71 : 0.48, 0.8, '%'], ['Recovery Fund smart-city milestones met', 0.64, 1, '%']];
    set('grEuBody', rows.map(function (r) { var pct = r[3] === '%', ok = r[3] === 'limit' ? r[1] <= r[2] : pct || r[0].indexOf('share') >= 0 || r[0].indexOf('milestones') >= 0 || r[0].indexOf('within') >= 0 ? r[1] >= r[2] : r[1] <= r[2];
      return '<tr><th>' + r[0] + '</th><td>' + (pct ? Math.round(r[1] * 100) + '%' : (+r[1]).toFixed(1)) + '</td><td>' + (r[3] === 'limit' ? '≤ ' + r[2] : pct ? Math.round(r[2] * 100) + '%' : (+r[2]).toFixed(1)) + '</td><td class="' + (ok ? 'good' : 'warn') + '">' + (ok ? 'On track' : 'Behind') + '</td></tr>'; }).join(''));
  }

  /* ============================== cards ============================== */
  function build() {
    if (ATH) {
      card('anpr', 'grDk', 'Daktylios: central Athens traffic ring', 'Odd/even plate rule', '<strong>Rules as published; plate reads synthetic.</strong> 2025–26 season: 20 Oct to 24 Jul (the same dates are assumed each year), Monday to Thursday 07:00–20:00, Friday 07:00–15:00; not at weekends, public holidays or on public-transport strike days. Ring outline and gates approximate.',
        kpis([['Status', 'grDkOn'], ['Allowed today', 'grDkDig'], ['Plates read, last hour', 'grDkReads'], ['Entries not allowed', 'grDkViol']]) + '<p class="muted small" id="grDkNote"></p><ol class="corridors" id="grDkList"></ol>');
    }
    card('emg', 'grFe', 'Wildfire evacuation', 'Zone, closures and route', '<strong>Real wind and heat; fire scenario synthetic.</strong> The route follows the model road network to the nearest assembly point.',
      kpis([['Fire risk now', 'grFeRisk'], ['Wind', 'grFeWind'], ['Evacuation zone', 'grFeZone'], ['Closed', 'grFeCl']]) + '<div class="btn-col row">' + sel('grFeArea', wuiList().map(function (w) { return w.name; })) + btn('grFeGo', 'Simulate') + btn('grFeClr', 'Clear') + '</div><p class="small" id="grFeOut"></p><ol class="corridors" id="grFeList"></ol>');
    if ((WINTER[RID] || []).length) {
      card('emg', 'grWi', 'Winter roads: snow and ice', 'Mountain and exposed roads', EST + 'Road temperature is estimated from the real air temperature and height; gritter counts are synthetic.',
        kpis([['Roads watched', 'grWiN'], ['Icy now', 'grWiIce'], ['Gritters out', 'grWiGr'], ['Chains', 'grWiCh']]) + '<ol class="corridors" id="grWiList"></ol>');
    }
    card('emg', 'grRg', 'River and stream gauges', 'Water level against alarm', SYN + 'Levels are synthetic and rise with the real rain forecast. Positions approximate.',
      kpis([['Gauges', 'grRgN'], ['At alarm', 'grRgAl'], ['Rain next 6 h', 'grRgR'], ['Highest vs alarm', 'grRgMax']]) + '<div class="btn-col row">' + btn('grRgSim', 'Simulate a storm') + '</div><ol class="corridors" id="grRgList"></ol>');
    card('emg', 'grEq', 'Earthquake follow-up', 'Inspections and shelters', '<strong>Live earthquakes (USGS); inspection progress synthetic.</strong>',
      kpis([['Earthquake', 'grEqM'], ['Buildings to inspect', 'grEqIns'], ['Shelters', 'grEqShel'], ['Inspected', 'grEqDone']]) + '<div class="btn-col row">' + btn('grEqSim', 'Simulate M5.8') + btn('grEqClr', 'Clear') + '</div><p class="small" id="grEqOut"></p><ol class="corridors" id="grEqList"></ol>');
    card('env', 'grDr', 'Drought and water supply', ATH ? 'EYDAP reservoirs' : '', ATH ? '<strong>Published starting point, estimated since.</strong>' : SYN,
      kpis([['Water stored', 'grDrTot'], ['Supply left at current use', 'grDrDays'], ['Demand now', 'grDrDem'], ['Stage', 'grDrSt']]) + '<div class="bars" id="grDrBars"></div><p class="muted small" id="grDrNote"></p>');
    if ((HERITAGE[RID] || []).length) {
      card('ped', 'grHe', 'Heritage sites and visitor crowds', ATH ? 'Acropolis cap 20,000 a day' : '', (ATH ? '<strong>Cap as published; visitor counts synthetic.</strong> The Acropolis is capped at 20,000 visitors a day in hourly time slots. ' : SYN) + 'Cruise days raise the morning peak.',
        kpis([['Visitors now', 'grHeNow'], ['Daily cap', 'grHeCap'], ['This hour’s slot', 'grHeSlot'], ['Queue at entrance', 'grHeQ']]) + '<ol class="corridors" id="grHeList"></ol>');
    }
    card('ped', 'grLx', 'Rail level crossings', 'Barriers and faults', '<strong>Real crossing points (OpenStreetMap rail meets road); barrier states synthetic.</strong>',
      kpis([['Crossings', 'grLxN'], ['Barriers down', 'grLxDown'], ['Faults', 'grLxF'], ['Violations', 'grLxV']]) + '<ol class="corridors" id="grLxList"></ol>');
    if (CRUISE_PORT[RID]) {
      card('plan', 'grCr', 'Cruise-day impact', 'Ships in port today', SYN + 'Cruise calls are generated; connect the port authority schedule to replace them.',
        kpis([['Ships today', 'grCrN'], ['Passengers', 'grCrPax'], ['Ashore now', 'grCrAsh'], ['Coaches needed', 'grCrCoach']]) + '<ol class="corridors" id="grCrList"></ol>');
    }
    card('plan', 'grSt', 'Strike-day planning', 'Public transport strike', EST + 'Assumes 18% more car trips and lower speeds when metro and buses stop.',
      kpis([['Day', 'grStOn'], ['Extra car trips', 'grStTrips'], ['Speed change', 'grStSpd'], ['Daktylios', 'grStRing']]) + '<div class="btn-col row">' + btn('grStSim', 'Simulate strike') + '</div><ol class="corridors" id="grStList"></ol>');
    if ((FERRY[RID] || []).length) {
      card('bus', 'grFy', 'Ferry ports', 'Sailings and boarding queues', SYN + 'Sailings and bookings are generated; connect operator or port feeds to replace them.',
        kpis([['Sailings next hour', 'grFyDep'], ['Average booked', 'grFyLoad'], ['Vehicles waiting', 'grFyQ'], ['Ports', 'grFyPorts']]) + '<p class="muted small" id="grFyRow"></p><ol class="corridors" id="grFyList"></ol>');
    }
    card('bus', 'grMm', 'E-scooters, bikes and bike lanes', 'Shared micromobility', '<strong>Real bike-lane length (OpenStreetMap); fleets and docks synthetic.</strong>',
      kpis([['E-scooters in use', 'grMmSc'], ['Bikes at docks', 'grMmBk'], ['Bike lanes', 'grMmLane'], ['Badly parked', 'grMmPark']]) + '<h3 class="sub-h">Docks to rebalance</h3><ol class="corridors" id="grMmList"></ol>');
    if ((TOLLS[RID] || []).length) {
      card('cong', 'grTl', 'Toll plazas', 'Queues by payment lane', EST + 'Traffic near each plaza is simulated; tag share and queues are synthetic. Positions approximate.',
        kpis([['Plazas', 'grTlN'], ['Vehicles', 'grTlFlow'], ['Electronic tag', 'grTlEp'], ['Longest cash queue', 'grTlQ']]) + '<ol class="corridors" id="grTlList"></ol>');
    }
    card('dev', 'grRp', 'Citizen reports', 'From the municipal app', SYN + 'Reports are generated on real streets; connect the municipality’s reporting app to replace them.',
      kpis([['Reports today', 'grRpN'], ['Open', 'grRpOpen'], ['Fixed', 'grRpFix'], ['Average age open', 'grRpAge']]) + '<div class="bars" id="grRpBars"></div><ol class="corridors" id="grRpList"></ol>');
    card('rep', 'grEu', 'EU reporting', 'Urban mobility plan and Recovery Fund', EST + 'Indicators combine live air quality with estimated and example figures; targets are examples to set with the city.',
      '<table class="facts"><thead><tr><th>Indicator</th><th>Now</th><th>Target</th><th></th></tr></thead><tbody id="grEuBody"></tbody></table>');

    on('grFeGo', function () { startFire(Number($('grFeArea').value) || 0); renderFire(); C.redraw(); });
    on('grFeClr', function () { fire = null; tick++; renderFire(); C.redraw(); });
    on('grRgSim', function () { flood = !flood; this.textContent = flood ? 'Use the real forecast' : 'Simulate a storm'; tick++; renderGauges(); C.redraw(); });
    on('grEqSim', function () { quakeSim = { mag: 5.8, km: 12, place: 'Exercise epicentre', real: false, t0: state.t - 3 * 3600 }; renderQuake(); });
    on('grEqClr', function () { quakeSim = null; renderQuake(); });
    on('grStSim', function () { strike = !strike; this.textContent = strike ? 'Back to a normal day' : 'Simulate strike'; renderStrike(); if (ATH) { renderRing(); } });
  }
  function on(id, fn) { var el = $(id); if (el) { el.addEventListener('click', fn); } }

  function render() {
    var o = K.tabOpen;
    if (o('anpr') && ATH) { renderRing(); }
    if (o('emg')) { renderFire(); renderWinter(); renderQuake(); }
    if (o('muni')) { renderGauges(); }
    if (o('env')) { renderWater(); }
    if (o('ped')) { if ($('grHe')) { renderHeritage(); } renderLX(); }
    if (o('plan')) { if ($('grCr')) { renderCruise(); } renderStrike(); }
    if (o('bus')) { if ($('grFy')) { renderFerry(); } renderMicro(); }
    if (o('cong') && $('grTl')) { renderTolls(); }
    if (o('muni')) { renderReports(); }
    if (o('rep')) { renderEU(); }
  }

  /* ============================== map layers ============================== */
  C.addLayers(function () {
    var out = [], o = K.tabOpen;
    if (o('anpr') && ATH) {
      out.push(new deck.PolygonLayer({ id: 'gr-ring', pickable: true, onClick: function (i) { C.showPopup(i.coordinate, 'Daktylios (traffic ring)', [['Now', ringOn() ? 'In force' : 'Not in force'], ['Allowed today', ringOn() ? (today().day % 2 ? 'Odd plates' : 'Even plates') : 'All plates'], ['Hours', 'Mon–Thu 07–20, Fri 07–15']], 'Outline approximate'); }, data: [RING], getPolygon: function (p) { return p; }, getFillColor: ringOn() ? [208, 59, 59, 30] : [40, 120, 200, 20], getLineColor: ringOn() ? [208, 59, 59, 220] : [40, 120, 200, 200], lineWidthUnits: 'pixels', getLineWidth: 2, stroked: true, updateTriggers: { getFillColor: ringOn() + ':' + strike, getLineColor: ringOn() + ':' + strike } }));
      out.push(dots('gr-ring-g', RING_GATES.map(function (g) { return { name: g[0], at: [g[1], g[2]] }; }), function () { return rgb(ringOn() ? 'heavy' : 'info'); }, 7, function (g) { return [g.name, [['Rule', ringOn() ? 'Odd/even in force' : 'Open']], 'Approximate gate; synthetic reads']; }));
    }
    if (o('emg')) {
      if (fire) {
        out.push(rings('gr-fire', [{ at: fire.front.at, r: fire.front.r, col: [208, 59, 59], pop: function () { return ['Evacuation zone', [['Radius', (fire.front.r / 1000).toFixed(1) + ' km'], ['Wind', fire.wind + ' km/h'], ['Roads closed', fire.closures.length], ['Go to', esc(fire.ap.name)]], 'Exercise scenario']; } }, { at: fire.w.at, r: 600, col: [230, 130, 40], pop: function () { return ['Fire start: ' + esc(fire.w.name), [['Reported', clock(fire.t0)]], 'Exercise scenario']; } }], [208, 59, 59]));
        if (fire.route) { out.push(new deck.PathLayer({ id: 'gr-evac', pickable: true, onClick: function (i) { C.showPopup(i.coordinate, 'Evacuation route', [['To', esc(fire.ap.name)], ['Road links', fire.route.links.length], ['Direction', 'one-way outbound']], 'Follows the model road network'); }, data: [fire.route.path], getPath: function (p) { return p; }, widthUnits: 'pixels', getWidth: 6, getColor: [40, 160, 100, 230], jointRounded: true, capRounded: true })); }
        var E = C.edges();
        out.push(new deck.PathLayer({ id: 'gr-closed', data: fire.closures.map(function (i) { return E[i].path; }), getPath: function (p) { return p; }, widthUnits: 'pixels', getWidth: 3, getColor: [208, 59, 59, 200] }));
      }
      out.push(dots('gr-winter', winter(), function (w) { return rgb(lvl(w.st)); }, 7, function (w) { return [w.name, [['Road temperature', w.temp.toFixed(1) + ' °C'], ['Height', w.alt + ' m']], 'Estimated from real air temperature']; }));
    }
    if (o('muni')) {
      out.push(dots('gr-gauge', gauges(), function (g) { return rgb(lvl(g.st)); }, 7, function (g) { return [g.name, [['Level', g.h.toFixed(2) + ' m'], ['Alarm', g.alarm.toFixed(1) + ' m']], 'Synthetic level']; }));
    }
    if (o('ped')) {
      out.push(dots('gr-her', visitors(), function (x) { return rgb(lvl(x.st)); }, 8, function (x) { return [x.name, [['Visitors now', num(x.now)], ['Queue', x.q + ' min']], 'Synthetic counts']; }));
      out.push(dots('gr-lx', crossings(), function (x) { return rgb(lvl(x.st || 0)); }, 6, function (x) { return [x.id, [['State', ['Open', 'Train passing', 'Violation', 'Fault'][x.st || 0]]], 'Real crossing point; synthetic state']; }));
    }
    if (o('plan') && $('grCr')) { out.push(dots('gr-cruise', cruiseShips(), function (s) { return rgb(s.inPort ? 'moderate' : 'info'); }, 8, function (s) { return [s.name, [['Passengers', num(s.pax)], ['In port', clock(s.arr * 3600) + '–' + clock(s.dep * 3600)]], 'Synthetic cruise call']; })); }
    if (o('bus')) {
      if ($('grFy')) { out.push(dots('gr-ferry', ferries(), function (f) { return rgb(f.load > 90 ? 'severe' : f.load > 75 ? 'heavy' : 'free'); }, 8, function (f) { return [f.name, [['Booked', f.load + '%'], ['Waiting', f.q + ' vehicles']], 'Synthetic sailings']; })); }
      out.push(dots('gr-docks', docks(), function (d) { return d.bikes == null ? rgb('info') : rgb(d.bikes <= 2 ? 'heavy' : d.bikes >= d.cap - 1 ? 'moderate' : 'free'); }, 5, function (d) { return ['Dock ' + d.id, [['Bikes', (d.bikes || 0) + ' of ' + d.cap]], 'Synthetic dock']; }));
    }
    if (o('cong') && $('grTl')) { out.push(dots('gr-toll', tolls(), function (x) { return rgb(x.q > 8 ? 'severe' : x.q > 4 ? 'heavy' : 'free'); }, 8, function (x) { return [x.name, [['Vehicles an hour', num(x.flow)], ['Cash queue', x.q + ' min']], 'Simulated traffic; synthetic queue']; })); }
    if (o('muni')) { out.push(dots('gr-rep', reports().filter(function (r) { return r.st !== 'Fixed'; }), function (r) { return rgb(r.st === 'New' ? 'heavy' : 'moderate'); }, 5, function (r) { return [r.id + ' · ' + r.type, [['Team', r.team], ['Status', r.st]], 'Synthetic report']; })); }
    return out;
  });

  C.onReady(function () {
    meta = C.meta() || meta; bb = meta.bbox || bb; kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180);
    retire(); build(); render();
    fetch((C.region.dataDir || 'data/') + 'rail.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { rail = j || []; LX = null; render(); C.redraw(); }, function () { rail = []; });
    C.onTab(function () { render(); C.redraw(); });
    C.onMinute(render);
  });
  T.greece2 = { render: render, ringOn: ringOn, crossings: function () { return crossings(); }, gauges: gauges, quake: quake };
})();
