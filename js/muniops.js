/* AthenaIQ Municipality: the cards that complete the ten smart-city modules.
 *
 *   Waste        Illegal dumping detection
 *   Planning     Urban planning and digital twin (3D city, GIS layers, land use, infrastructure, construction sites)
 *   Safety       Early warning (flood, fire, air, heat, structures) with alert rules
 *   Infrastructure  Potholes, structural health and predictive maintenance
 *   Permitting   Building permits, AI-assisted and digital field inspections, unauthorised construction
 *   Mobility     Traffic, parking, signals and parking violations in one view
 *   Environment  Water quality, temperature and carbon
 *   Utilities    Smart water and electricity metering, utility assets
 *   Citizens     Service requests, complaints and SLA
 *   Assets       Asset inventory, maintenance schedule and lifecycle
 *
 * Real inputs: OpenStreetMap roads, buildings and sites; simulated traffic; Open-Meteo weather; NASA FIRMS fires.
 * Detections, permits, meters, requests and asset records are synthetic until their systems are connected.
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, CFG = C.CFG, $ = C.$, num = C.num, clock = C.clock, state = T.state, K = T.kit;
  var rnd = K.rnd, hashStr = K.hashStr, esc = K.esc, ATH = C.region.isDefault, CITY = C.region.name || 'Athens', SEED = hashStr('mo' + (C.region.id || 'athens'));
  var meta = C.meta() || {}, bb = meta.bbox || [23.55, 37.85, 23.98, 38.12], kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180), ky = 110570;
  var SYN = '<strong>Synthetic data.</strong> ', EST = '<strong>Estimated.</strong> ';
  function m(a, b) { return Math.hypot((a[0] - b[0]) * kx, (a[1] - b[1]) * ky); }
  function tile(label, id) { return '<div class="kpi"><span class="k-label">' + label + '</span><span class="k-value" id="' + id + '">–</span></div>'; }
  function kpis(l) { return '<div class="kpis">' + l.map(function (x) { return tile(x[0], x[1]); }).join('') + '</div>'; }
  function set(id, html) { var el = $(id); if (el) { el.innerHTML = html; } }
  function card(id, title, sub, notice, body) {
    var sec = document.createElement('section'); sec.className = 'card'; sec.id = id; sec.setAttribute('data-tab', 'muni'); sec.hidden = true;
    sec.innerHTML = (notice ? '<p class="notice">' + notice + '</p>' : '') + '<div class="card-head"><h2>' + title + '</h2><span class="muted" id="' + id + 'Sub">' + (sub || '') + '</span></div>' + body;
    document.querySelector('.panel').appendChild(sec); return sec;
  }
  function list(id, items) { var ol = $(id); if (!ol) { return; } ol.innerHTML = ''; items.forEach(function (li) { ol.appendChild(li); }); if (!items.length) { ol.innerHTML = '<li class="muted">Nothing to show.</li>'; } }
  function row(dot, title, sub, right, at, pop) { return C.listButton(dot, title, sub, right, function () { if (at) { C.flyTo(at[0], at[1], 14.8); if (pop) { var p = pop(); setTimeout(function () { C.showPopup(at, p[0], p[1], p[2]); }, 1050); } } }); }
  function bars(id, rows) { var mx = Math.max.apply(null, rows.map(function (r) { return r[1]; }).concat([1])); set(id, rows.map(function (r) { return C.barRow(esc(r[0]), r[2] || '', r[3] != null ? r[3] : num(r[1]), r[1] / mx); }).join('')); }
  function hour() { return state.t / 3600; }
  function day() { return Math.floor(Date.now() / 864e5); }
  function lvl(x) { return x >= 3 ? 'severe' : x >= 2 ? 'heavy' : x >= 1 ? 'moderate' : 'free'; }
  function rgb(s) { return { severe: [208, 59, 59], heavy: [236, 131, 40], moderate: [240, 195, 40], free: [40, 170, 100], info: [40, 120, 200] }[s] || [40, 120, 200]; }
  function onRoads(n, seed, cls) { var E = C.edges(), out = []; for (var k = 0; out.length < n && k < n * 20; k++) { var e = E[Math.floor(rnd(seed, k) * E.length) % E.length]; if (!cls || cls.indexOf(e.c) >= 0) { out.push({ i: e.i, at: e.path[e.path.length >> 1], name: (C.names()[e.n] || 'Unnamed road') }); } } return out; }
  function open() { return K.tabOpen('muni') || ($('showMuniAll') && $('showMuniAll').checked); }
  function dots(id, data, color, radius, popup) {
    return new deck.ScatterplotLayer({ id: id, data: data, pickable: true, radiusUnits: 'pixels', stroked: true, lineWidthUnits: 'pixels', getLineWidth: 1.5, getLineColor: [255, 255, 255, 220],
      getPosition: function (d) { return d.at; }, getRadius: radius || 6, getFillColor: function (d) { return color(d).concat([230]); }, updateTriggers: { getFillColor: Math.floor(state.t / 300) },
      onClick: function (i) { if (i.object && popup) { var p = popup(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } } });
  }
  var shown = {};   // per-card "show on map" ticks
  function chk(id, label) { shown[id] = true; return '<label class="check"><input id="' + id + '" type="checkbox" checked><span>' + label + '</span></label>'; }
  function vis(id) { var b = $(id); return open() && (!b || b.checked); }

  /* ---------- Waste: illegal dumping ---------- */
  var DUMP = null;
  function dumping() {
    if (!DUMP) { DUMP = onRoads(26, SEED + 1, [2, 3, 4]).map(function (r, k) { return { id: 'ID-' + (300 + k), at: r.at, street: r.name, src: rnd(SEED, k) < 0.6 ? 'AI camera' : 'Citizen report', what: ['Furniture', 'Construction debris', 'Bags next to bins', 'Appliances', 'Garden waste'][k % 5], conf: 0.72 + rnd(SEED, k + 9) * 0.26, h: rnd(SEED, k + 4) * 24 }; }); }
    var h = hour(); return DUMP.filter(function (d) { return d.h <= h; }).map(function (d) { d.st = h - d.h > 6 ? 'Cleared' : h - d.h > 2 ? 'Crew sent' : 'New'; return d; });
  }
  function renderDump() {
    var D = dumping(), openD = D.filter(function (d) { return d.st !== 'Cleared'; });
    set('mwN', num(D.length)); set('mwOpen', num(openD.length)); set('mwAi', D.length ? Math.round(100 * D.filter(function (d) { return d.src === 'AI camera'; }).length / D.length) + '%' : '–'); set('mwClr', D.length ? (D.filter(function (d) { return d.st === 'Cleared'; }).length * 100 / D.length).toFixed(0) + '%' : '–');
    list('mwList', openD.slice(0, 6).map(function (d) { return row(d.st === 'New' ? 'heavy' : 'moderate', d.id + ' · ' + d.what, d.street + ' · ' + d.src + (d.src === 'AI camera' ? ' ' + Math.round(d.conf * 100) + '% sure' : '') + ' · ' + clock(Math.round(d.h * 3600)), d.st, d.at, function () { return dumpPop(d); }); }));
  }
  function dumpPop(d) { return [d.id + ' · illegal dumping', [['What', d.what], ['Seen by', d.src + (d.src === 'AI camera' ? ' (' + Math.round(d.conf * 100) + '% confidence)' : '')], ['Reported', clock(Math.round(d.h * 3600))], ['Status', d.st]], 'Synthetic detection on a real street']; }

  /* ---------- Planning: digital twin ---------- */
  var SITES = null;
  function sitesC() {
    if (!SITES) { var names = ATH ? ['Ellinikon redevelopment', 'Metro line 4 station works', 'Faliro waterfront', 'Kifissos Avenue upgrade', 'New courthouse annex', 'Student housing block', 'Hotel conversion', 'School extension'] : ['Ring road works', 'Hotel extension', 'School extension', 'Housing block', 'Waterfront upgrade'];
      SITES = onRoads(names.length, SEED + 2, [1, 2, 3]).map(function (r, k) { return { id: 'CS-' + (10 + k), name: names[k], at: r.at, storeys: 2 + Math.floor(rnd(SEED, k) * 9), prog: rnd(SEED, k + 3), noise: 62 + rnd(SEED, k + 5) * 20, dust: 20 + rnd(SEED, k + 6) * 70, permit: rnd(SEED, k + 7) < 0.85 }; }); }
    return SITES;
  }
  function renderTwin() {
    var bl = meta.buildings || {}, nw = meta.network || {}, S = sitesC(), groups = document.querySelectorAll('.ly-group').length, boxes = document.querySelectorAll('.ly-tree input[type=checkbox]').length;
    set('upBld', num(bl.count || 0)); set('upKm', num(Math.round(nw.km || 0)) + ' km'); set('upLayers', boxes ? num(boxes) + ' in ' + groups + ' groups' : '–'); set('upSites', num(S.length));
    bars('upLand', [['Residential', 0.46, '', '46%'], ['Commercial and offices', 0.18, '', '18%'], ['Public and education', 0.1, '', '10%'], ['Industry and logistics', 0.08, '', '8%'], ['Parks and open space', 0.12, '', '12%'], ['Transport', 0.06, '', '6%']]);
    list('upList', S.map(function (s) { var bad = !s.permit || s.noise > 75 || s.dust > 75; return row(!s.permit ? 'severe' : bad ? 'heavy' : 'free', s.name, Math.round(s.prog * 100) + '% built · ' + s.storeys + ' storeys · noise ' + Math.round(s.noise) + ' dB · dust ' + Math.round(s.dust) + ' µg/m³', !s.permit ? 'No permit' : bad ? 'Check' : 'OK', s.at, function () { return sitePop(s); }); }));
  }
  function sitePop(s) { return [s.name, [['Progress', Math.round(s.prog * 100) + '%'], ['Height', s.storeys + ' storeys'], ['Noise', Math.round(s.noise) + ' dB'], ['Dust PM10', Math.round(s.dust) + ' µg/m³'], ['Permit', s.permit ? 'Valid' : 'Not found: inspect']], 'Synthetic construction monitoring']; }

  /* ---------- Safety: early warning ---------- */
  function warnings() {
    var g2 = T.greece2 || {}, G = g2.gauges ? g2.gauges() : [], fires = ((T.live && T.live.fires()) || {}).list || [], c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2];
    var nearF = fires.filter(function (f) { return m(f.at, c) < 30000; }), p = (T.osint && T.osint.weather ? T.osint.weather() : null) || {}, n = p.now || {};
    var aq = T.environment ? T.environment.sensors().map(function (s) { return T.environment.readingAt(s, state.t).aqi; }) : [], aqMax = aq.length ? Math.max.apply(null, aq) : 0;
    var inc = T.incidents && T.incidents.list ? T.incidents.list().filter(function (x) { return x.stage !== 'closed' && x.stage !== 'Closed'; }) : [];
    var gMax = G.length ? Math.max.apply(null, G.map(function (x) { return x.h / x.alarm; })) : 0;
    return [
      { id: 'Flood', sensor: (G.length || 0) + ' river and stream gauges', rule: 'Level reaches the alarm mark', val: Math.round(gMax * 100) + '% of alarm', on: gMax >= 1, watch: gMax >= 0.75, act: '112 alert to the area; close underpasses; send pumps' },
      { id: 'Wildfire', sensor: 'NASA FIRMS satellite fire detections (real)', rule: 'Fire within 30 km and wind over 30 km/h', val: nearF.length + ' fires within 30 km · wind ' + Math.round(n.wind || 0) + ' km/h', on: nearF.length > 0 && (n.wind || 0) > 30, watch: nearF.length > 0, act: 'Raise readiness; prepare evacuation routes; 112 if it spreads' },
      { id: 'Heat', sensor: 'Open-Meteo temperature (real)', rule: 'Temperature 40 °C or more', val: n.temp != null ? Math.round(n.temp) + ' °C' : '–', on: (n.temp || 0) >= 40, watch: (n.temp || 0) >= 35, act: 'Open cooling centres; limit outdoor work' },
      { id: 'Air quality', sensor: (aq.length || 0) + ' air sensors', rule: 'Index over 150', val: 'highest ' + Math.round(aqMax), on: aqMax > 150, watch: aqMax > 100, act: 'Health warning; advise against outdoor sport' },
      { id: 'Structures', sensor: 'Bridge and wall sensors (synthetic)', rule: 'Tilt or vibration over limit', val: structures().filter(function (s) { return s.st >= 3; }).length + ' over limit', on: structures().some(function (s) { return s.st >= 3; }), watch: structures().some(function (s) { return s.st >= 2; }), act: 'Close the structure; send engineers' },
      { id: 'Incidents', sensor: 'Control room', rule: 'Serious incident open', val: inc.length + ' open', on: inc.some(function (x) { return x.sev >= 3; }), watch: inc.length > 0, act: 'Coordinate units; inform the public' }
    ];
  }
  function renderWarn() {
    var W = warnings();
    set('ewOn', num(W.filter(function (w) { return w.on; }).length)); set('ewWatch', num(W.filter(function (w) { return !w.on && w.watch; }).length)); set('ewRules', num(W.length)); set('ewLast', clock(state.t));
    set('ewTable', '<thead><tr><th>Hazard</th><th>Now</th><th>State</th></tr></thead><tbody>' + W.map(function (w) { return '<tr title="' + esc(w.rule + ' → ' + w.act) + '"><th>' + w.id + '<br><span class="muted small">' + esc(w.sensor) + '</span></th><td>' + esc(w.val) + '</td><td class="' + (w.on ? 'bad' : w.watch ? 'warn' : 'good') + '">' + (w.on ? 'Alert' : w.watch ? 'Watch' : 'Normal') + '</td></tr>'; }).join('') + '</tbody>');
  }

  /* ---------- Infrastructure: potholes, structures, predictive maintenance ---------- */
  var POT = null, STR = null;
  function potholes() { if (!POT) { POT = onRoads(40, SEED + 3, [1, 2, 3, 4]).map(function (r, k) { return { id: 'PH-' + (500 + k), at: r.at, road: r.name, depth: 2 + Math.round(rnd(SEED, k) * 10), conf: 0.7 + rnd(SEED, k + 2) * 0.29, d: Math.floor(rnd(SEED, k + 8) * 6) }; }); } return POT; }
  function structures() {
    if (!STR) { var E = C.edges(), out = []; for (var i = 0; i < E.length && out.length < 14; i += 97) { if (E[i].k && E[i].c <= 1) { out.push({ id: 'BR-' + (out.length + 1), at: E[i].path[0], road: C.names()[E[i].n] || 'Motorway ramp' }); } } STR = out; }
    var h = Math.floor(state.t / 3600);
    STR.forEach(function (s, k) { var v = rnd(SEED + 77, k * 13 + h), tilt = 0.2 + v * 1.1; s.tilt = tilt; s.vib = 1 + rnd(SEED + 78, k + h) * 4 + C.occ(0) * 0; s.st = tilt > 1.25 ? 3 : tilt > 1.0 ? 2 : tilt > 0.8 ? 1 : 0; });
    return STR;
  }
  function renderInfra() {
    var P = potholes(), S = structures(), risk = P.length + S.length;
    set('inPotN', num(P.length)); set('inDeep', num(P.filter(function (p) { return p.depth >= 8; }).length)); set('inStr', num(S.length)); set('inPm', num(Math.round(risk * 0.4)));
    var pm = P.filter(function (p) { return p.depth >= 8; }).map(function (p) { return { lvl: 2, t: p.id + ' · pothole ' + p.depth + ' cm deep', s: esc(p.road) + ' · found by AI camera on a refuse truck · ' + Math.round(p.conf * 100) + '% sure', r: 'Fix in 48 h', at: p.at, pop: function () { return potPop(p); } }; })
      .concat(S.filter(function (s) { return s.st >= 1; }).map(function (s) { return { lvl: s.st, t: s.id + ' · ' + esc(s.road), s: 'Tilt ' + s.tilt.toFixed(2) + ' mm/m · vibration ' + s.vib.toFixed(1) + ' mm/s', r: s.st >= 3 ? 'Close and inspect' : s.st === 2 ? 'Inspect this week' : 'Watch', at: s.at, pop: function () { return strPop(s); } }; }));
    list('inList', pm.sort(function (a, b) { return b.lvl - a.lvl; }).slice(0, 8).map(function (x) { return row(lvl(x.lvl), x.t, x.s, x.r, x.at, x.pop); }));
  }
  function potPop(p) { return [p.id + ' · pothole', [['Depth', p.depth + ' cm'], ['Road', esc(p.road)], ['Found', p.d ? p.d + ' days ago' : 'today'], ['Detected by', 'AI camera on a refuse truck (' + Math.round(p.conf * 100) + '%)']], 'Synthetic detection']; }
  function strPop(s) { return [s.id + ' · structure sensor', [['Structure', esc(s.road)], ['Tilt', s.tilt.toFixed(2) + ' mm/m'], ['Vibration', s.vib.toFixed(1) + ' mm/s'], ['State', ['Normal', 'Watch', 'Inspect', 'Over limit'][s.st]]], 'Synthetic structural health monitoring']; }

  /* ---------- Permitting and inspections ---------- */
  var PERM = null;
  function permits() {
    if (!PERM) { var T0 = ['New building', 'Extension', 'Change of use', 'Demolition', 'Shop sign', 'Pavement café', 'Scaffolding']; PERM = onRoads(30, SEED + 4, [2, 3, 4]).map(function (r, k) { var st = rnd(SEED, k); return { id: 'BP-' + (2026 * 100 + k), at: r.at, street: r.name, type: T0[k % T0.length], st: st < 0.35 ? 'Under review' : st < 0.55 ? 'Waiting for inspection' : st < 0.85 ? 'Approved' : 'Returned for changes', days: 3 + Math.floor(rnd(SEED, k + 1) * 60) }; }); }
    return PERM;
  }
  var UNAUTH = null;
  function unauth() { if (!UNAUTH) { UNAUTH = onRoads(7, SEED + 5, [3, 4]).map(function (r, k) { return { id: 'UC-' + (40 + k), at: r.at, street: r.name, what: ['Rooftop extension', 'Enclosed balcony', 'New storey', 'Warehouse in residential zone'][k % 4], src: k % 2 ? 'Drone survey' : 'Satellite change detection', conf: 0.7 + rnd(SEED, k) * 0.28 }; }); } return UNAUTH; }
  function renderPermit() {
    var P = permits(), U = unauth(), rev = P.filter(function (p) { return p.st === 'Under review' || p.st === 'Waiting for inspection'; }), ap = P.filter(function (p) { return p.st === 'Approved'; }).map(function (p) { return p.days; }).sort(function (a, b) { return a - b; });
    set('ipRev', num(rev.length)); set('ipDays', ap.length ? ap[ap.length >> 1] + ' days' : '–'); set('ipInsp', num(Math.round(6 + hour() / 24 * 18))); set('ipUn', num(U.length));
    bars('ipBars', [['Building and health inspections, AI-assisted', 0.62, '', '62% of checks'], ['Digital field inspections (tablet)', 0.31, '', '31%'], ['Paper', 0.07, '', '7%']]);
    list('ipList', U.map(function (u) { return row('severe', u.id + ' · ' + u.what, u.street + ' · ' + u.src + ' ' + Math.round(u.conf * 100) + '% sure', 'Inspect', u.at, function () { return [u.id + ' · possible unauthorised construction', [['What', u.what], ['Found by', u.src], ['Confidence', Math.round(u.conf * 100) + '%'], ['Permit on file', 'None']], 'Synthetic detection']; }); })
      .concat(rev.slice(0, 5).map(function (p) { return row('moderate', p.id + ' · ' + p.type, p.street + ' · ' + p.st.toLowerCase() + ' · ' + p.days + ' days', p.st === 'Waiting for inspection' ? 'Inspect' : 'Review', p.at, function () { return permPop(p); }); })));
  }
  function permPop(p) { return [p.id + ' · ' + p.type, [['Status', p.st], ['Days open', p.days], ['Street', esc(p.street)]], 'Synthetic permit record']; }

  /* ---------- Mobility and parking summary ---------- */
  function renderMob() {
    var E = C.edges(), veh = 0, free = 0, jam = 0;
    for (var i = 0; i < E.length; i++) { var o = C.occ(i); if (!o) { continue; } var r = C.ratio(i); veh += o; free += o * r; if (r < 0.35 && o > 3) { jam++; } }
    var pk = T.parking ? T.parking.now() : [], spaces = 0, fr = 0; pk.forEach(function (p) { fr += p.now.free; spaces += p.now.free + p.now.used; });
    set('mbSpd', veh ? Math.round(100 * free / veh) + '% of free flow' : '–'); set('mbJam', num(jam)); set('mbPark', spaces ? num(fr) + ' of ' + num(spaces) : '–'); set('mbSig', num((C.signals() || []).length));
    set('mbViol', num(Math.round(((CFG.parking || {}).violationsPerDay || 900) * Math.min(1, state.t / 86400))));
  }

  /* ---------- Environment: water quality, temperature, carbon ---------- */
  var WQ = ATH ? [['Mornos aqueduct inlet, Galatsi plant', 23.762, 38.027, 'drinking'], ['Acharnes treatment plant', 23.745, 38.095, 'drinking'], ['Faliro bay bathing water', 23.680, 37.930, 'sea'], ['Vouliagmeni bathing water', 23.770, 37.810, 'sea'], ['Kifissos river, Pireos St', 23.690, 37.965, 'river']]
    : [['City water treatment plant', (bb[0] + bb[2]) / 2 - 0.02, (bb[1] + bb[3]) / 2 + 0.02, 'drinking'], ['Main reservoir outlet', (bb[0] + bb[2]) / 2 + 0.03, (bb[1] + bb[3]) / 2 + 0.01, 'drinking'], ['City stream', (bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2 - 0.01, 'river']];
  function wq() { var h = Math.floor(state.t / 3600); return WQ.map(function (w, k) { var r = rnd(SEED + 9, k * 7 + h), turb = w[3] === 'drinking' ? 0.2 + r * 0.6 : 2 + r * 12, cl = w[3] === 'drinking' ? 0.25 + rnd(SEED, k + h) * 0.35 : null, ph = 7.1 + rnd(SEED, k + 2) * 0.9, ec = w[3] === 'sea' ? Math.round(20 + r * 180) : null; return { name: w[0], at: [w[1], w[2]], kind: w[3], turb: turb, cl: cl, ph: ph, ec: ec, ok: w[3] === 'drinking' ? turb < 1 && cl >= 0.2 : w[3] === 'sea' ? ec < 100 : turb < 10 }; }); }
  function renderWq() {
    var W = wq(), p = (T.osint && T.osint.weather ? T.osint.weather() : null) || {}, n = p.now || {}, co2 = (function () { var v = 0, E = C.edges(); for (var i = 0; i < E.length; i++) { v += C.occ(i) * (E[i].m || 0) / 1000; } return v * 0.17 * 12; })();
    set('evOk', W.filter(function (w) { return w.ok; }).length + ' of ' + W.length); set('evTemp', n.temp != null ? Math.round(n.temp) + ' °C' : '–'); set('evFeel', n.feels != null ? Math.round(n.feels) + ' °C' : '–'); set('evCo2', n.humidity != null ? Math.round(n.humidity) + '%' : '–'); void co2;
    list('evList', W.map(function (w) { return row(w.ok ? 'free' : 'heavy', w.name, w.kind === 'drinking' ? 'Turbidity ' + w.turb.toFixed(2) + ' NTU · chlorine ' + w.cl.toFixed(2) + ' mg/l · pH ' + w.ph.toFixed(1) : w.kind === 'sea' ? 'E. coli ' + w.ec + ' per 100 ml · pH ' + w.ph.toFixed(1) : 'Turbidity ' + w.turb.toFixed(1) + ' NTU · pH ' + w.ph.toFixed(1), w.ok ? 'OK' : 'Check', w.at, function () { return [w.name, [['Type', { drinking: 'Drinking water', sea: 'Bathing water', river: 'River' }[w.kind]], ['Turbidity', w.turb.toFixed(2) + ' NTU'], ['pH', w.ph.toFixed(1)]].concat(w.cl != null ? [['Free chlorine', w.cl.toFixed(2) + ' mg/l']] : []).concat(w.ec != null ? [['E. coli', w.ec + ' per 100 ml']] : []), 'Synthetic sensor; position approximate']; }); }));
  }

  /* ---------- Utilities: metering and assets ---------- */
  function renderUtil() {
    var bc = (meta.buildings || {}).count || 40000, h = hour(), elec = bc * 0.0011 * (0.55 + 0.45 * Math.max(Math.exp(-Math.pow(h - 13, 2) / 18), Math.exp(-Math.pow(h - 20, 2) / 6))), water = bc * 0.012 * (0.6 + 0.5 * Math.exp(-Math.pow(h - 8, 2) / 4));
    var meters = Math.round(bc * 1.6), comm = Math.round(meters * (0.965 + rnd(SEED, Math.floor(state.t / 3600)) * 0.02));
    set('utMet', num(meters)); set('utCom', (100 * comm / meters).toFixed(1) + '%'); set('utEl', elec.toFixed(1) + ' MW'); set('utWat', num(Math.round(water)) + ' m³/h');
    var A = [['Water pumping stations', 18, 1], ['Water reservoirs and tanks', 9, 0], ['Electricity substations (municipal)', 24, 2], ['Street-lighting cabinets', 140, 4], ['Stormwater pumps', 12, 1], ['EV chargers (municipal)', 60, 3]];
    if (!ATH) { A = A.map(function (a) { return [a[0], Math.max(2, Math.round(a[1] / 6)), Math.min(a[2], 1)]; }); }
    bars('utBars', A.map(function (a) { return [a[0], a[1], a[2] ? a[2] + ' need attention' : 'all healthy', num(a[1])]; }));
  }

  /* ---------- Citizens: requests and SLA ---------- */
  function requests() {
    var CAT = [['Waste and cleaning', 0.3, 24], ['Roads and pavements', 0.2, 72], ['Street lighting', 0.14, 48], ['Parks and trees', 0.1, 120], ['Noise and nuisance', 0.08, 48], ['Water and drainage', 0.1, 24], ['Parking and traffic', 0.08, 72]];
    var n = Math.round((ATH ? 420 : 90) * Math.min(1, hour() / 18 + 0.05)), out = [];
    for (var k = 0; k < n; k++) { var r = rnd(SEED + day(), k), acc = 0, c = CAT[0]; for (var j = 0; j < CAT.length; j++) { acc += CAT[j][1]; if (r <= acc) { c = CAT[j]; break; } } var age = rnd(SEED + 5, k) * 96, done = rnd(SEED + 6, k) < Math.min(0.9, age / c[2]); out.push({ cat: c[0], sla: c[2], age: age, done: done, ch: ['App', 'Phone', 'Web', 'Email', 'Counter'][k % 5] }); }
    return { list: out, cats: CAT };
  }
  function renderSla() {
    var R = requests(), L = R.list, openR = L.filter(function (x) { return !x.done; }), over = openR.filter(function (x) { return x.age > x.sla; }), met = L.filter(function (x) { return x.done && x.age <= x.sla * 1.1; }).length, closed = L.filter(function (x) { return x.done; }).length;
    set('csN', num(L.length)); set('csOpen', num(openR.length)); set('csSlaV', closed ? Math.round(100 * met / closed) + '%' : '–'); set('csCsat', (3.6 + 0.8 * (closed ? met / closed : 0.5)).toFixed(1) + ' / 5');
    bars('csBars', R.cats.map(function (c) { var f = L.filter(function (x) { return x.cat === c[0]; }), o = f.filter(function (x) { return !x.done && x.age > x.sla; }).length; return [c[0], f.length, 'SLA ' + c[2] + ' h' + (o ? ' · ' + o + ' overdue' : ''), num(f.length)]; }));
    set('csOver', over.length ? num(over.length) + ' requests are past their SLA; oldest ' + Math.round(Math.max.apply(null, over.map(function (x) { return x.age; }))) + ' h.' : 'No request is past its SLA.');
  }

  /* ---------- Assets ---------- */
  function renderAssets() {
    var g = T.greece || {}, lamps = g.lamps ? g.lamps().length : 0, bins = g.bins ? g.bins().length : 0, sig = (C.signals() || []).length, sens = T.environment ? T.environment.sensors().length : 0, poles = Math.round(((meta.network || {}).km || 0) * 28);
    var A = [['Street lights', poles, 18, 'estimated from road length'], ['Smart bins', bins, 7, 'synthetic'], ['Traffic signals', sig, 15, 'OpenStreetMap'], ['Environment sensors', sens, 6, 'synthetic'], ['Municipal vehicles', (g.FTYPES || []).reduce(function (a, f) { return a + f[2]; }, 0), 8, 'synthetic'], ['Water pumping stations', ATH ? 18 : 3, 30, 'example'], ['Bridges and walls monitored', structures().length, 60, 'synthetic']];
    var due = 0; A.forEach(function (a, k) { a.due = Math.round(a[1] * (0.01 + rnd(SEED, k) * 0.03)); a.eol = Math.round(a[1] * (0.02 + rnd(SEED, k + 4) * 0.06)); due += a.due; });
    set('amN', num(A.reduce(function (s, a) { return s + a[1]; }, 0))); set('amDue', num(due)); set('amEol', num(A.reduce(function (s, a) { return s + a.eol; }, 0))); set('amAv', (97 + rnd(SEED, 3) * 2.5).toFixed(1) + '%');
    set('amTable', '<thead><tr><th>Asset</th><th>Count</th><th>Service due this week</th><th>Near end of life</th></tr></thead><tbody>' + A.map(function (a) { return '<tr><th>' + a[0] + '<br><span class="muted small">' + a[3] + ' · life ' + a[2] + ' years</span></th><td>' + num(a[1]) + '</td><td>' + num(a.due) + '</td><td>' + num(a.eol) + '</td></tr>'; }).join('') + '</tbody>');
  }

  /* ---------- cards ---------- */
  function build() {
    card('mwDump', 'Illegal dumping detection', 'AI cameras and reports', SYN + 'Detections are generated on real streets; connect the camera analytics and the reporting app to replace them.',
      kpis([['Detections today', 'mwN'], ['Open', 'mwOpen'], ['Found by AI cameras', 'mwAi'], ['Cleared', 'mwClr']]) + chk('mwShow', 'Show detections on the map') + '<ol class="corridors" id="mwList"></ol>');
    card('upTwin', 'Urban planning and digital twin', '3D city, GIS and construction', '<strong>Real buildings and roads (OpenStreetMap); land-use shares and construction monitoring are examples.</strong>',
      kpis([['Buildings in the 3D twin', 'upBld'], ['Roads modelled', 'upKm'], ['GIS layers', 'upLayers'], ['Construction sites monitored', 'upSites']]) +
      '<div class="btn-col row"><button type="button" class="btn small" id="upCity">3D city view</button></div>' + chk('upShow', 'Show construction sites on the map') + '<h3 class="sub-h">Land use (example)</h3><div class="bars" id="upLand"></div><h3 class="sub-h">Construction monitoring</h3><ol class="corridors" id="upList"></ol>');
    card('ewWarn', 'Early warning', 'Sensors and alert rules', '<strong>Fires and weather are real; gauges, structures and air sensors are synthetic.</strong> Each rule fires an alert to the control room and, for public hazards, a 112 message.',
      kpis([['Alerts now', 'ewOn'], ['On watch', 'ewWatch'], ['Rules', 'ewRules'], ['Checked', 'ewLast']]) + '<table class="facts" id="ewTable"></table><div class="btn-col row"><button type="button" class="btn small" id="ewTest">Send a test alert</button></div>');
    card('inPot', 'Roads and structures: predictive maintenance', 'Potholes, bridges, walls', SYN + 'Potholes are found by AI cameras on refuse trucks; bridge and wall sensors measure tilt and vibration. All generated on real roads.',
      kpis([['Potholes found', 'inPotN'], ['Deeper than 8 cm', 'inDeep'], ['Structures monitored', 'inStr'], ['Jobs predicted this month', 'inPm']]) + chk('inShow', 'Show potholes and structures on the map') + '<ol class="corridors" id="inList"></ol>');
    card('ipPermit', 'Inspections and permitting', 'Permits, inspections, unauthorised building', SYN + 'Permits and detections are generated on real streets; connect the permit system and drone or satellite surveys to replace them.',
      kpis([['Permits in progress', 'ipRev'], ['Median time to approve', 'ipDays'], ['Inspections today', 'ipInsp'], ['Possible unauthorised building', 'ipUn']]) + chk('ipShow', 'Show permits and detections on the map') + '<div class="bars" id="ipBars"></div><ol class="corridors" id="ipList"></ol>');
    card('mbMob', 'Mobility and parking', 'From the traffic and parking menus', '<strong>Simulated traffic, OpenStreetMap signals, synthetic parking.</strong>',
      kpis([['Network speed', 'mbSpd'], ['Congested roads', 'mbJam'], ['Parking spaces free', 'mbPark'], ['Traffic signals', 'mbSig']]) + '<div class="kpis">' + tile('Parking violations today', 'mbViol') + '</div>' +
      '<div class="btn-col row"><button type="button" class="btn small" data-open="cong">Congestion</button><button type="button" class="btn small" data-open="park">Parking</button><button type="button" class="btn small" data-open="sig">Signals</button><button type="button" class="btn small" data-open="fines">Violations</button></div>');
    card('evWater', 'Water quality and temperature', 'Drinking, bathing and river water', '<strong>Real temperature (Open-Meteo); water-quality sensors synthetic.</strong> Carbon is in Emissions and exceedances.',
      kpis([['Water points within limits', 'evOk'], ['Temperature', 'evTemp'], ['Feels like', 'evFeel'], ['Humidity', 'evCo2']]) + chk('evShow', 'Show water-quality points on the map') + '<ol class="corridors" id="evList"></ol>');
    card('utMeter', 'Smart metering and utility assets', 'Water and electricity', EST + 'Meter numbers and consumption are estimated from the building count; asset states are synthetic.',
      kpis([['Smart meters', 'utMet'], ['Meters reporting', 'utCom'], ['Electricity now', 'utEl'], ['Water now', 'utWat']]) + '<h3 class="sub-h">Utility assets</h3><div class="bars" id="utBars"></div>');
    card('csSla', 'Service requests and SLA', 'All channels', SYN + 'Requests are generated; connect the municipal CRM or reporting app to replace them.',
      kpis([['Requests today', 'csN'], ['Open', 'csOpen'], ['Closed within SLA', 'csSlaV'], ['Satisfaction', 'csCsat']]) + '<p class="small" id="csOver"></p><div class="bars" id="csBars"></div>');
    card('amAsset', 'Municipal asset management', 'Inventory, maintenance, lifecycle', EST + 'Counts mix real (signals), estimated (street lights) and synthetic assets; due dates and life are examples.',
      kpis([['Assets on the map', 'amN'], ['Service due this week', 'amDue'], ['Near end of life', 'amEol'], ['Availability', 'amAv']]) + '<table class="facts" id="amTable"></table>');
    $('upCity').addEventListener('click', function () { var mp = T.getMap(); if (mp) { mp.easeTo({ center: C.region.centre || [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], zoom: window.innerWidth < 720 ? 14.2 : 15, pitch: 65, bearing: -30, duration: 1800 }); } });
    $('ewTest').addEventListener('click', function () { var c = C.region.centre || [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2]; C.showPopup(c, 'Test alert sent', [['To', 'Control room and duty officers'], ['Channel', 'Dashboard, SMS, e-mail'], ['Public 112', 'Not sent (test)'], ['Time', clock(state.t)]], 'Exercise only'); if (T.audit) { T.audit('Early-warning test alert'); } });
    Array.prototype.forEach.call(document.querySelectorAll('#mbMob [data-open]'), function (b) { b.addEventListener('click', function () { C.showTab(b.getAttribute('data-open')); }); });
    Object.keys(shown).forEach(function (id) { var b = $(id); if (b) { b.addEventListener('change', function () { C.redraw(); }); } });
  }
  function render() {
    if (!K.tabOpen('muni')) { return; }
    renderDump(); renderTwin(); renderWarn(); renderInfra(); renderPermit(); renderMob(); renderWq(); renderUtil(); renderSla(); renderAssets();
  }

  C.addLayers(function () {
    var out = [];
    if (vis('mwShow')) { out.push(dots('mo-dump', dumping().filter(function (d) { return d.st !== 'Cleared'; }), function (d) { return rgb(d.st === 'New' ? 'heavy' : 'moderate'); }, 6, dumpPop)); }
    if (vis('upShow')) {
      out.push(new deck.ColumnLayer({ id: 'mo-sites', data: sitesC(), diskResolution: 4, radius: 18, extruded: true, pickable: true, getPosition: function (s) { return s.at; }, getElevation: function (s) { return s.storeys * 3.2 * Math.max(0.15, s.prog); },
        getFillColor: function (s) { return !s.permit ? [208, 59, 59, 220] : [240, 170, 40, 220]; }, onClick: function (i) { if (i.object) { var p = sitePop(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } } }));
    }
    if (vis('inShow')) {
      out.push(dots('mo-pot', potholes(), function (p) { return rgb(p.depth >= 8 ? 'heavy' : 'moderate'); }, 5, potPop));
      out.push(new deck.ColumnLayer({ id: 'mo-str', data: structures(), diskResolution: 6, radius: 12, extruded: true, pickable: true, getPosition: function (s) { return s.at; }, getElevation: function (s) { return 10 + s.tilt * 30; }, getFillColor: function (s) { return rgb(lvl(s.st)).concat([220]); }, updateTriggers: { getFillColor: Math.floor(state.t / 3600), getElevation: Math.floor(state.t / 3600) },
        onClick: function (i) { if (i.object) { var p = strPop(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } } }));
    }
    if (vis('ipShow')) {
      out.push(dots('mo-perm', permits(), function (p) { return rgb(p.st === 'Approved' ? 'free' : p.st === 'Returned for changes' ? 'heavy' : 'info'); }, 5, permPop));
      out.push(dots('mo-unauth', unauth(), function () { return rgb('severe'); }, 8, function (u) { return [u.id + ' · possible unauthorised construction', [['What', u.what], ['Found by', u.src], ['Confidence', Math.round(u.conf * 100) + '%']], 'Synthetic detection']; }));
    }
    if (vis('evShow')) { out.push(dots('mo-wq', wq(), function (w) { return w.ok ? [30, 150, 220] : rgb('heavy'); }, 7, function (w) { return [w.name, [['Within limits', w.ok ? 'Yes' : 'No'], ['Turbidity', w.turb.toFixed(2) + ' NTU'], ['pH', w.ph.toFixed(1)]], 'Synthetic sensor']; })); }
    return out;
  });

  C.onReady(function () {
    meta = C.meta() || meta; bb = meta.bbox || bb; kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180);
    build(); render();
    C.onTab(function () { render(); C.redraw(); });
    C.onMinute(render);
  });
  T.muniops = { render: render, warnings: warnings, sites: sitesC, dumping: dumping };
})();
