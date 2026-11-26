/* AthenaIQ Municipality: six more use cases, all on synthetic data placed on the real city.
 *
 *   Environment  Trees, green spaces and smart irrigation (3D trees at street zoom)
 *   Police       Municipal police: patrols and enforcement tasks (new module)
 *   Permitting   Use of public space and street markets (λαϊκές)
 *   Coast        Beaches and coast (new module, coastal cities only)
 *   Planning     Scenario planning: what-if tests with estimated effects
 *   Waste        Recycling performance against EU targets
 *
 * Real inputs: OpenStreetMap roads and names, simulated traffic, Open-Meteo rain and temperature.
 * Fixed reference: EU municipal-waste recycling targets of 55% (2025), 60% (2030) and 65% (2035).
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, $ = C.$, num = C.num, clock = C.clock, state = T.state, K = T.kit;
  var rnd = K.rnd, hashStr = K.hashStr, esc = K.esc, RID = C.region.id || 'athens', ATH = C.region.isDefault, SEED = hashStr('mp' + RID);
  var meta = C.meta() || {}, bb = meta.bbox || [23.55, 37.85, 23.98, 38.12], kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180), ky = 110570;
  var SYN = '<strong>Synthetic data.</strong> ';
  function m(a, b) { return Math.hypot((a[0] - b[0]) * kx, (a[1] - b[1]) * ky); }
  function ctr() { var c = C.region.centre; return c && c[0] > bb[0] && c[0] < bb[2] && c[1] > bb[1] && c[1] < bb[3] ? c : [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2]; }
  function off(dx, dy) { var c = ctr(); return [c[0] + dx * (bb[2] - bb[0]) / 2, c[1] + dy * (bb[3] - bb[1]) / 2]; }
  function tile(label, id) { return '<div class="kpi"><span class="k-label">' + label + '</span><span class="k-value" id="' + id + '">–</span></div>'; }
  function kpis(l) { return '<div class="kpis">' + l.map(function (x) { return tile(x[0], x[1]); }).join('') + '</div>'; }
  function set(id, html) { var el = $(id); if (el) { el.innerHTML = html; } }
  function card(id, title, sub, notice, body) {
    var sec = document.createElement('section'); sec.className = 'card'; sec.id = id; sec.setAttribute('data-tab', 'muni'); sec.hidden = true;
    sec.innerHTML = (notice ? '<p class="notice">' + notice + '</p>' : '') + '<div class="card-head"><h2>' + title + '</h2><span class="muted" id="' + id + 'Sub">' + (sub || '') + '</span></div>' + body;
    document.querySelector('.panel').appendChild(sec); return sec;
  }
  function list(id, items) { var ol = $(id); if (!ol) { return; } ol.innerHTML = ''; items.forEach(function (li) { ol.appendChild(li); }); if (!items.length) { ol.innerHTML = '<li class="muted">Nothing to show.</li>'; } }
  function row(dot, title, sub, right, at, pop) { return C.listButton(dot, title, sub, right, function () { if (at) { C.flyTo(at[0], at[1], 15.5); if (pop) { setTimeout(function () { var p = pop(); C.showPopup(at, p[0], p[1], p[2]); }, 1050); } } }); }
  function bars(id, rows) { var mx = Math.max.apply(null, rows.map(function (r) { return r[1]; }).concat([1])); set(id, rows.map(function (r) { return C.barRow(esc(r[0]), r[2] || '', r[3] != null ? r[3] : num(r[1]), r[1] / mx); }).join('')); }
  function hour() { return state.t / 3600; }
  function wx() { var p = T.osint && T.osint.weather ? T.osint.weather() : null; return p || {}; }
  function rain(h) { var t = 0; (wx().rain || []).slice(0, h).forEach(function (x) { t += x || 0; }); return t; }
  function open() { return K.tabOpen('muni') || ($('showMuniAll') && $('showMuniAll').checked); }
  function vis(id) { var b = $(id); return open() && (!b || b.checked); }
  function chk(id, label) { return '<label class="check"><input id="' + id + '" type="checkbox" checked><span>' + label + '</span></label>'; }
  function zoom() { var mp = T.getMap(); return mp ? mp.getZoom() : 12; }
  function rgb(s) { return { severe: [208, 59, 59], heavy: [236, 131, 40], moderate: [240, 195, 40], free: [40, 170, 100], info: [40, 120, 200] }[s] || [40, 120, 200]; }
  function dots(id, data, color, radius, popup) {
    return new deck.ScatterplotLayer({ id: id, data: data, pickable: true, radiusUnits: 'pixels', stroked: true, lineWidthUnits: 'pixels', getLineWidth: 1.5, getLineColor: [255, 255, 255, 220],
      getPosition: function (d) { return d.at; }, getRadius: radius || 6, getFillColor: function (d) { return color(d).concat([230]); }, updateTriggers: { getFillColor: Math.floor(state.t / 60), getPosition: state.t },
      onClick: function (i) { if (i.object && popup) { var p = popup(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } } });
  }
  function names() { return C.names ? C.names() : []; }
  var MS = {};
  function majorStreets(n) {
    var key = n + ':' + Math.floor(state.t / 900); if (MS[key]) { return MS[key]; }
    MS = {}; return (MS[key] = majorStreetsRaw(n));
  }
  function majorStreetsRaw(n) {
    var E = C.edges(), by = {}, nm = names();
    E.forEach(function (e, i) { var s = nm[e.n]; if (!s || e.c < 2 || e.c > 3 || e.k || /odos|motorway|highway|αυτοκινητόδρομος|εθνική/i.test(s) || / - /.test(s)) { return; } var b = by[s] = by[s] || { name: s, edges: [], veh: 0, len: 0, at: e.path[e.path.length >> 1] }; b.edges.push(i); b.veh += C.occ(i); b.len += e.m || 0; });
    return Object.keys(by).map(function (k) { return by[k]; }).filter(function (b) { return b.len > 600; }).sort(function (a, b) { return b.veh - a.veh; }).slice(0, n);
  }

  /* ============================== 1. Trees, green spaces and irrigation ============================== */
  var PARKS = { athens: [['National Garden', 23.7375, 37.9730, 15.5], ['Pedion tou Areos', 23.7320, 37.9940, 27.7], ['Lycabettus Hill', 23.7430, 37.9820, 25], ['Filopappou Hill', 23.7180, 37.9680, 70], ['Goudi Park', 23.7700, 37.9850, 30], ['Antonis Tritsis Park', 23.6950, 38.0430, 120], ['Stavros Niarchos Park', 23.6930, 37.9400, 21]] };
  var PK = null, PKkey = -1;
  function parks() { var k = Math.floor(state.t / 300); if (PK && PKkey === k) { return PK; } PKkey = k; PK = parksRaw(); return PK; }
  function parksRaw() {
    var L = PARKS[RID] || [['Central park', off(0.05, 0.1)[0], off(0.05, 0.1)[1], 12], ['Waterfront green', off(-0.2, -0.3)[0], off(-0.2, -0.3)[1], 6], ['Hill park', off(0.4, 0.4)[0], off(0.4, 0.4)[1], 20]];
    var r6 = rain(6), r24 = rain(24), t = (wx().now || {}).temp || 20, h = Math.floor(state.t / 3600);
    return L.map(function (p, k) {
      var base = 18 + rnd(SEED, k) * 22 - Math.max(0, t - 22) * 0.8 + r24 * 0.9, moist = Math.max(6, Math.min(45, base - (h % 24) * 0.15));
      var need = moist < 22, skip = need && (r6 >= 3 || r24 >= 8), m3 = need && !skip ? Math.round(p[3] * 10000 * 0.004) : 0;
      return { name: p[0], at: [p[1], p[2]], ha: p[3], moist: moist, need: need, skip: skip, water: m3, trees: Math.round(p[3] * 140) };
    });
  }
  var TREES = null, SPECIES = ['Bitter orange', 'Plane tree', 'Mulberry', 'Pepper tree', 'Olive', 'Jacaranda', 'Aleppo pine', 'Cypress', 'Ash'];
  function trees() {
    if (TREES) { return TREES; }
    var E = C.edges(), out = [], acc = 0;
    for (var i = 0; i < E.length && out.length < 900; i++) { var e = E[i]; if (e.c < 2 || e.c > 4 || e.k) { continue; } acc += e.m || 0; if (acc < 140) { continue; } acc = 0;
      var a = e.path[0], z = e.path[e.path.length - 1], dx = (z[1] - a[1]) * ky, dy = -(z[0] - a[0]) * kx, L = Math.hypot(dx, dy) || 1, mid = e.path[e.path.length >> 1], k = out.length;
      out.push({ id: 'T-' + (10000 + k), at: [mid[0] + dx / L * 6 / kx, mid[1] + dy / L * 6 / ky], sp: SPECIES[k % SPECIES.length], h: 5 + rnd(SEED, k) * 11, age: 5 + Math.floor(rnd(SEED, k + 1) * 60), health: rnd(SEED, k + 2), street: names()[e.n] || 'Street' }); }
    TREES = out; return out;
  }
  function treeState(t) { return t.health < 0.05 ? 'severe' : t.health < 0.15 ? 'heavy' : t.health < 0.3 ? 'moderate' : 'free'; }
  function treePop(t) { return [t.id + ' · ' + t.sp, [['Height', t.h.toFixed(0) + ' m'], ['Age', t.age + ' years'], ['Condition', { severe: 'Risk of falling: remove', heavy: 'Poor: prune and inspect', moderate: 'Fair: prune this year', free: 'Good' }[treeState(t)]], ['CO₂ stored', Math.round(t.h * t.age * 2.2) + ' kg'], ['Street', esc(t.street)]], 'Synthetic tree inventory on a real street']; }
  function renderGreen() {
    var P = parks(), Tr = trees(), bad = Tr.filter(function (t) { return t.health < 0.15; }), w = P.reduce(function (s, p) { return s + p.water; }, 0), sk = P.filter(function (p) { return p.skip; }).length;
    set('gnTrees', num(Tr.length)); set('gnRisk', num(bad.length)); set('gnWater', num(w) + ' m³'); set('gnSkip', sk ? sk + ' parks (rain)' : 'None');
    bars('gnSp', SPECIES.map(function (s) { return [s, Tr.filter(function (t) { return t.sp === s; }).length]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 5));
    list('gnList', P.map(function (p) { return row(p.skip ? 'info' : p.need ? 'heavy' : 'free', p.name, p.ha + ' ha · soil moisture ' + Math.round(p.moist) + '% · about ' + num(p.trees) + ' trees', p.skip ? 'Skip: rain' : p.need ? num(p.water) + ' m³ tonight' : 'No watering', p.at, function () { return parkPop(p); }); })
      .concat(bad.slice(0, 4).map(function (t) { return row(treeState(t), t.id + ' · ' + t.sp, esc(t.street) + ' · ' + t.h.toFixed(0) + ' m', t.health < 0.05 ? 'Remove' : 'Prune', t.at, function () { return treePop(t); }); })));
  }
  function parkPop(p) { return [p.name, [['Area', p.ha + ' ha'], ['Soil moisture', Math.round(p.moist) + '%'], ['Rain next 6 h', rain(6).toFixed(0) + ' mm (Open-Meteo)'], ['Irrigation tonight', p.skip ? 'Skipped: rain forecast' : p.need ? num(p.water) + ' m³' : 'Not needed']], 'Synthetic soil sensors; real rain forecast']; }
  var TREE = (function () {
    var pos = [], nor = [];
    function hexa(x0, x1, y0, y1, z0, z1) { var c = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
      [[0, 3, 2, 1], [4, 5, 6, 7], [1, 2, 6, 5], [0, 4, 7, 3], [0, 1, 5, 4], [3, 7, 6, 2]].forEach(function (f) { var a = c[f[0]], b = c[f[1]], d = c[f[2]], e = c[f[3]], ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2], nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1; [a, b, d, a, d, e].forEach(function (p) { pos.push(p[0], p[1], p[2]); nor.push(nx / l, ny / l, nz / l); }); }); }
    hexa(-1.6, 1.6, -1.6, 1.6, 2.2, 4.4); hexa(-2.2, 2.2, -2.2, 2.2, 3.0, 4.0); hexa(-1.1, 1.1, -1.1, 1.1, 4.4, 5.6);
    return { positions: { value: new Float32Array(pos), size: 3 }, normals: { value: new Float32Array(nor), size: 3 }, texCoords: { value: new Float32Array(pos.length / 3 * 2), size: 2 } };
  })();

  /* ============================== 2. Municipal police ============================== */
  var UNITS = null, TASKTYPES = [['Illegal parking', 0.34, 'Parking'], ['Blocked pavement', 0.14, 'Pavement'], ['Noise from a bar or works', 0.14, 'Noise'], ['Unlicensed street trading', 0.1, 'Trading'], ['Café tables over the permit', 0.1, 'Public space'], ['Illegal dumping', 0.08, 'Cleaning'], ['Abandoned vehicle', 0.1, 'Vehicles']];
  function units() {
    if (UNITS) { return UNITS; }
    UNITS = []; if (!T.response) { return UNITS; }
    var c = ctr(), E = C.edges(), n = ATH ? 10 : 4;
    for (var k = 0; k < n; k++) {
      var pts = [0, 1, 2].map(function (j) { var e = E[Math.floor(rnd(SEED + 3, k * 7 + j) * E.length) % E.length]; return e.path[0]; }).filter(function (p) { return m(p, c) < 5000; });
      if (pts.length < 2) { pts = [off(0.1 * k / n, 0.05), off(-0.1, 0.1 * k / n)]; }
      var path = [], ok = true; for (var j = 0; j < pts.length; j++) { var leg = T.response.pathBetween(pts[j], pts[(j + 1) % pts.length]); if (!leg) { ok = false; break; } path = path.concat(leg.path); }
      if (!ok || path.length < 2) { continue; }
      var cum = [0]; for (var q = 1; q < path.length; q++) { cum.push(cum[q - 1] + m(path[q - 1], path[q])); }
      UNITS.push({ id: 'DA-' + (11 + k), kind: k % 3 === 2 ? 'Motorcycle unit' : 'Patrol car', path: path, cum: cum, len: cum[cum.length - 1], off: rnd(SEED, k) });
    }
    return UNITS;
  }
  function unitAt(u) { var d = ((state.t / 3600 * 14000) + u.off * u.len) % u.len, i = 1; while (i < u.cum.length - 1 && u.cum[i] < d) { i++; } var a = u.path[i - 1], z = u.path[i], f = (d - u.cum[i - 1]) / Math.max(1, u.cum[i] - u.cum[i - 1]); return [a[0] + (z[0] - a[0]) * f, a[1] + (z[1] - a[1]) * f]; }
  var TK = null, TKkey = -1;
  function tasks() { var k = Math.floor(state.t / 60); if (TK && TKkey === k) { return TK; } TKkey = k; TK = tasksRaw(); return TK; }
  function tasksRaw() {
    var E = C.edges(), d = Math.floor(Date.now() / 864e5), n = Math.round((ATH ? 90 : 25) * Math.min(1, hour() / 20 + 0.05)), out = [], U = units();
    for (var k = 0; k < n; k++) { var s = SEED + d * 31 + k, r = rnd(s, 1), acc = 0, ty = TASKTYPES[0]; for (var j = 0; j < TASKTYPES.length; j++) { acc += TASKTYPES[j][1]; if (r <= acc) { ty = TASKTYPES[j]; break; } }
      var e = E[Math.floor(rnd(s, 2) * E.length) % E.length], age = rnd(s, 3) * Math.min(hour(), 8), resp = 8 + rnd(s, 4) * 30, st = age * 60 > resp + 25 ? 'Done' : age * 60 > resp ? 'On site' : U.length && age * 60 > 4 ? 'Unit assigned' : 'New';
      out.push({ id: 'MP-' + (4000 + k), type: ty[0], cat: ty[2], at: e.path[0], street: names()[e.n] || 'Street', age: age, resp: resp, st: st, unit: U.length ? U[k % U.length].id : '', fine: ty[2] === 'Parking' || ty[2] === 'Public space' || ty[2] === 'Trading' }); }
    return out;
  }
  function renderPolice() {
    var U = units(), Tk = tasks(), openT = Tk.filter(function (t) { return t.st !== 'Done'; }), done = Tk.filter(function (t) { return t.st === 'Done'; });
    set('poU', num(U.length)); set('poOpen', num(openT.length)); set('poResp', done.length ? Math.round(done.reduce(function (s, t) { return s + t.resp; }, 0) / done.length) + ' min' : '–'); set('poFine', num(done.filter(function (t) { return t.fine; }).length));
    bars('poBars', TASKTYPES.map(function (t) { return [t[0], Tk.filter(function (x) { return x.type === t[0]; }).length]; }));
    list('poList', openT.slice(0, 8).map(function (t) { return row(t.st === 'New' ? 'heavy' : 'moderate', t.id + ' · ' + t.type, esc(t.street) + ' · ' + (t.unit && t.st !== 'New' ? t.unit + ' · ' : '') + Math.round(t.age * 60) + ' min ago', t.st, t.at, function () { return taskPop(t); }); }));
  }
  function taskPop(t) { return [t.id + ' · ' + t.type, [['Status', t.st], ['Unit', t.st === 'New' ? 'Not yet assigned' : t.unit], ['Reported', Math.round(t.age * 60) + ' min ago'], ['Street', esc(t.street)]], 'Synthetic municipal police task']; }

  /* ============================== 3. Use of public space and street markets ============================== */
  var SPACE = null;
  function spacePermits() {
    if (!SPACE) { var E = C.edges(), T0 = [['Café tables', 'm²'], ['Scaffolding', 'm'], ['Kiosk', 'm²'], ['Event stage', 'm²'], ['Filming', 'm'], ['Skip for building waste', 'units']], out = [];
      for (var k = 0; k < 40; k++) { var e = E[Math.floor(rnd(SEED + 5, k) * E.length) % E.length]; if (e.c < 3) { continue; } var ty = T0[k % T0.length], perm = Math.round(8 + rnd(SEED, k) * 40), used = Math.round(perm * (0.7 + rnd(SEED, k + 1) * 0.7)); out.push({ id: 'PS-' + (700 + k), type: ty[0], unit: ty[1], at: e.path[0], street: names()[e.n] || 'Street', perm: perm, used: used, over: used > perm * 1.1, fee: Math.round(perm * (ty[0] === 'Café tables' ? 45 : 20)) }); }
      SPACE = out; }
    return SPACE;
  }
  var MK = null, MKkey = '';
  function markets() { var k = new Date().getDay() + ':' + Math.floor(state.t / 3600); if (MK && MKkey === k) { return MK; } MKkey = k; MK = marketsRaw(); return MK; }
  function marketsRaw() {
    var dow = new Date().getDay(), S = majorStreets(60).filter(function (s) { return s.len < 2500; }), out = [];
    for (var k = 0; k < (ATH ? 3 : 1); k++) { var s = S[(dow * 5 + k * 7) % Math.max(1, S.length)]; if (!s) { break; } out.push({ name: 'Street market on ' + s.name, street: s.name, edges: s.edges.slice(0, 8), at: s.at, stalls: 60 + Math.floor(rnd(SEED + dow, k) * 140) }); }
    return out;
  }
  function marketPhase() { var h = hour(); return h < 5.5 ? 'Not yet' : h < 7 ? 'Setting up' : h < 14.5 ? 'Open' : h < 16.5 ? 'Cleaning' : 'Finished'; }
  function renderSpace() {
    var P = spacePermits(), over = P.filter(function (p) { return p.over; }), M = markets(), ph = marketPhase(), dow = new Date().getDay();
    set('psN', num(P.length)); set('psOver', num(over.length)); set('psFee', '€' + num(P.reduce(function (s, p) { return s + p.fee; }, 0))); set('psMk', dow === 0 ? 'None (Sunday)' : M.length + ' · ' + ph.toLowerCase());
    list('psList', (dow === 0 ? [] : M.map(function (mk) { return row(ph === 'Open' || ph === 'Setting up' ? 'moderate' : ph === 'Cleaning' ? 'info' : 'free', mk.name, mk.stalls + ' stalls · street closed 05:30–16:30 · cleaning crew after 14:30', ph, mk.at, function () { return mkPop(mk); }); }))
      .concat(over.slice(0, 6).map(function (p) { return row('heavy', p.id + ' · ' + p.type, esc(p.street) + ' · uses ' + p.used + ' ' + p.unit + ', permit ' + p.perm + ' ' + p.unit, 'Over permit', p.at, function () { return spPop(p); }); })));
  }
  function mkPop(mk) { return [mk.name, [['Stalls', mk.stalls], ['Now', marketPhase()], ['Street closed', '05:30–16:30'], ['Cleaning', 'after 14:30']], 'Example market on a real street']; }
  function spPop(p) { return [p.id + ' · ' + p.type, [['Permit', p.perm + ' ' + p.unit], ['In use (camera check)', p.used + ' ' + p.unit], ['Annual fee', '€' + num(p.fee)], ['Result', p.over ? 'Over the permit: send municipal police' : 'Within the permit']], 'Synthetic permit and camera check']; }

  /* ============================== 4. Beaches and coast ============================== */
  var BEACH = { athens: [['Edem, Palaio Faliro', 23.6930, 37.9270, 1], ['Alimos (Kalamaki)', 23.7000, 37.9100, 1], ['Agios Kosmas', 23.7150, 37.8950, 0], ['Glyfada', 23.7400, 37.8650, 1], ['Voula A', 23.7620, 37.8420, 1]],
    thessaloniki: [['Perea', 22.9300, 40.5030, 1], ['Nea Michaniona', 22.8600, 40.4700, 0]], heraklion: [['Ammoudara', 25.0700, 35.3350, 1]], chania: [['Nea Chora', 24.0050, 35.5170, 1]], rhodes: [['Elli', 28.2220, 36.4520, 1]],
    kavala: [['Rapsani, Kavala', 24.3950, 40.9280, 0]], volos: [['Anavros', 22.9550, 39.3570, 1]], patras: [['Rio beach', 21.7900, 38.3000, 0]] };
  var BC = null, BCkey = -1;
  function beaches() { var k = Math.floor(state.t / 300); if (BC && BCkey === k) { return BC; } BCkey = k; BC = beachesRaw(); return BC; }
  function beachesRaw() {
    var mo = new Date().getMonth() + 1, season = mo >= 6 && mo <= 9, shoulder = mo === 5 || mo === 10, h = hour(), t = (wx().now || {}).temp || 20, sea = 14 + Math.max(0, Math.sin((mo - 3) / 12 * 6.283)) * 12;
    return (BEACH[RID] || []).map(function (b, k) {
      var day = h > 9 && h < 19 ? Math.exp(-Math.pow(h - 14, 2) / 10) : 0, cap = 1500 + Math.floor(rnd(SEED, k) * 3500), crowd = Math.round(cap * day * (season ? 0.9 : shoulder ? 0.25 : 0.03) * Math.max(0.2, (t - 15) / 15));
      var ec = Math.round(15 + rnd(SEED + k, Math.floor(Date.now() / 864e5)) * 140);
      return { name: b[0], at: [b[1], b[2]], ramp: !!b[3], cap: cap, crowd: crowd, guards: season ? (k % 3 === 2 ? 1 : 2) : 0, ec: ec, water: ec < 100 ? 'Excellent' : ec < 200 ? 'Good' : 'Poor', sea: sea, lost: season && rnd(SEED + k, Math.floor(state.t / 3600)) < 0.05 ? 1 : 0, season: season };
    });
  }
  function renderCoast() {
    var B = beaches(), mo = new Date().getMonth() + 1, season = mo >= 6 && mo <= 9;
    set('coN', num(B.length)); set('coPeople', num(B.reduce(function (s, b) { return s + b.crowd; }, 0))); set('coGuard', season ? num(B.reduce(function (s, b) { return s + b.guards; }, 0)) : 'Off season'); set('coSea', B.length ? Math.round(B[0].sea) + ' °C' : '–');
    set('coNote', season ? 'Bathing season: lifeguards on duty 11:00–19:00. Accessible ramps (for wheelchairs) at ' + B.filter(function (b) { return b.ramp; }).length + ' beaches.' : 'Outside the bathing season (June to September): no lifeguards; water sampling monthly. Accessible ramps at ' + B.filter(function (b) { return b.ramp; }).length + ' beaches.');
    list('coList', B.map(function (b) { var full = b.crowd / b.cap; return row(b.lost ? 'severe' : full > 0.85 ? 'heavy' : full > 0.6 ? 'moderate' : 'free', b.name, num(b.crowd) + ' people · water ' + b.water.toLowerCase() + (b.ramp ? ' · accessible ramp' : '') + (b.lost ? ' · lost child reported' : ''), Math.round(full * 100) + '% full', b.at, function () { return beachPop(b); }); }));
  }
  function beachPop(b) { return [b.name + ' beach', [['People now', num(b.crowd) + ' of about ' + num(b.cap)], ['Lifeguards', b.guards || 'None (off season)'], ['Bathing water', b.water + ' (E. coli ' + b.ec + ' per 100 ml)'], ['Sea temperature', Math.round(b.sea) + ' °C'], ['Accessible ramp', b.ramp ? 'Yes' : 'No']], 'Synthetic counts; position approximate']; }

  /* ============================== 5. Scenario planning ============================== */
  var scen = null, ROADS = null;
  var MEASURES = [['close', 'Close the street to traffic'], ['buslane', 'Add a bus lane'], ['z30', 'Make it a 30 km/h zone'], ['trees', 'Plant trees along it'], ['recycle', 'Add a recycling collection route']];
  function runScenario() {
    var r = ROADS[+$('scRoad').value] || ROADS[0], ms = $('scMeasure').value, n = +$('scTrees').value || 200, E = C.edges();
    var veh = 0, free = 0; r.edges.forEach(function (i) { veh += C.occ(i); free += C.occ(i) * C.ratio(i); });
    var kmh = veh ? free / veh * 50 : 40, km = r.len / 1000, flowH = Math.round(veh * 12), rowsOut = [];
    var near = 0; E.forEach(function (e, i) { var p = e.path[e.path.length >> 1]; if (m(p, r.at) < 1200 && r.edges.indexOf(i) < 0) { near += C.occ(i); } });
    if (ms === 'close') {
      var div = flowH, nearDrop = Math.min(45, div / Math.max(50, near * 12) * 35);
      rowsOut = [['Cars on the street per hour', num(flowH), '0', '−100%'], ['Cars diverted to nearby streets', '0', num(div), '+' + num(div)], ['Speed on nearby streets', Math.round(kmh) + ' km/h', Math.round(kmh * (1 - nearDrop / 100)) + ' km/h', '−' + Math.round(nearDrop) + '%'], ['Pedestrian space', '0 m²', num(Math.round(r.len * 9)) + ' m²', 'new'], ['CO₂ from detours', '–', '+' + Math.round(div * 0.4 * 0.17) + ' kg/h', 'more'], ['One-off cost', '–', '€' + num(Math.round(r.len * 180)), '']];
    } else if (ms === 'buslane') {
      rowsOut = [['Car speed on the street', Math.round(kmh) + ' km/h', Math.round(kmh * 0.9) + ' km/h', '−10%'], ['Bus speed on the street', Math.round(kmh * 0.8) + ' km/h', Math.round(kmh * 0.8 * 1.25) + ' km/h', '+25%'], ['Bus riders a day', num(Math.round(flowH * 3)), num(Math.round(flowH * 3 * 1.08)), '+8%'], ['Cars an hour', num(flowH), num(Math.round(flowH * 0.94)), '−6%'], ['One-off cost', '–', '€' + num(Math.round(r.len * 60)), '']];
    } else if (ms === 'z30') {
      rowsOut = [['Average speed', Math.round(kmh) + ' km/h', Math.round(Math.min(kmh, 30)) + ' km/h', Math.round(100 * (Math.min(kmh, 30) - kmh) / Math.max(1, kmh)) + '%'], ['Serious injuries a year (estimate)', (km * 1.6).toFixed(1), (km * 1.6 * 0.72).toFixed(1), '−28%'], ['Noise', '68 dB', '65.5 dB', '−2.5 dB'], ['Journey time along it', Math.round(km / Math.max(5, kmh) * 60) + ' min', Math.round(km / Math.max(5, Math.min(kmh, 30)) * 60) + ' min', ''], ['One-off cost (signs, markings)', '–', '€' + num(Math.round(r.len * 25)), '']];
    } else if (ms === 'trees') {
      var fit = Math.min(n, Math.round(r.len / 8));
      rowsOut = [['Trees planted', '0', num(fit), fit < n ? 'room for ' + num(fit) + ' only' : ''], ['CO₂ absorbed a year', '0', num(Math.round(fit * 22)) + ' kg', ''], ['Shade on the pavement in summer', '–', Math.round(Math.min(70, fit * 8 / r.len * 100)) + '%', ''], ['Pavement surface temperature on hot afternoons', '–', '−' + Math.min(12, (fit * 8 / r.len * 15)).toFixed(0) + ' °C', 'estimate'], ['Water for 3 summers', '–', num(Math.round(fit * 3 * 2.5)) + ' m³', ''], ['Cost', '–', '€' + num(fit * 420), 'planting and 3 years care']];
    } else {
      rowsOut = [['Recycling rate', recycle().rate.toFixed(1) + '%', (recycle().rate + 3.2).toFixed(1) + '%', '+3.2 points'], ['Recycling collected a year', '–', '+' + num(Math.round(((meta.buildings || {}).count || 30000) * 0.06)) + ' t', ''], ['Trucks', '–', '+1', ''], ['Running cost a year', '–', '€' + num(185000), 'crew, fuel, maintenance'], ['Landfill fee avoided a year', '–', '€' + num(Math.round(((meta.buildings || {}).count || 30000) * 0.06 * 35)), 'at €35 per tonne']];
    }
    scen = { r: r, ms: ms, rows: rowsOut };
    set('scOut', '<thead><tr><th>' + esc(MEASURES.filter(function (x) { return x[0] === ms; })[0][1]) + ' · ' + esc(r.name) + '</th><th>Now</th><th>After</th><th></th></tr></thead><tbody>' + rowsOut.map(function (x) { return '<tr><th>' + x[0] + '</th><td>' + x[1] + '</td><td>' + x[2] + '</td><td>' + x[3] + '</td></tr>'; }).join('') + '</tbody>');
    C.flyTo(r.at[0], r.at[1], 14.5); C.redraw();
  }

  /* ============================== 6. Recycling against EU targets ============================== */
  function districts() {
    var n = ATH ? 7 : 4, out = [];
    for (var k = 0; k < n; k++) { var a = k / n * 6.283, at = off(Math.cos(a) * 0.45, Math.sin(a) * 0.45); out.push({ name: ATH ? 'Municipal community ' + (k + 1) : 'District ' + (k + 1), at: at, rate: 14 + rnd(SEED, k) * 22, cont: 12 + rnd(SEED, k + 9) * 22, t: 0 }); }
    return out;
  }
  function recycle() {
    var D = districts(), sim = T.greece && T.greece.emptied ? Object.keys(T.greece.emptied).length : 0, rate = D.reduce(function (s, d) { return s + d.rate; }, 0) / D.length + sim * 0.01;
    return { D: D, rate: rate, cont: D.reduce(function (s, d) { return s + d.cont; }, 0) / D.length };
  }
  function renderRecycle() {
    var R = recycle(), yr = new Date().getFullYear(), tgt = yr <= 2025 ? 55 : yr <= 2030 ? 60 : 65, gap = tgt - R.rate;
    set('rcRate', R.rate.toFixed(1) + '%'); set('rcTgt', tgt + '% by ' + (yr <= 2025 ? 2025 : yr <= 2030 ? 2030 : 2035)); set('rcGap', gap > 0 ? gap.toFixed(1) + ' points' : 'Met'); set('rcCont', R.cont.toFixed(0) + '%');
    bars('rcBars', R.D.sort(function (a, b) { return b.rate - a.rate; }).map(function (d) { return [d.name, d.rate, 'contamination ' + Math.round(d.cont) + '%', d.rate.toFixed(1) + '%']; }));
    set('rcNote', 'EU targets for municipal waste: 55% by 2025, 60% by 2030, 65% by 2035 (preparing for re-use and recycling). Biggest gains: separate organic waste, door-to-door collection in dense blocks, and fewer wrong items in blue bins.');
  }

  /* ============================== cards, render, layers ============================== */
  function build() {
    card('gnTree', 'Trees, green spaces and irrigation', 'Urban forest and parks', SYN + 'Trees are placed along real streets; soil sensors and irrigation are synthetic. Watering is skipped when the real forecast brings rain.',
      kpis([['Street trees', 'gnTrees'], ['Need pruning or removal', 'gnRisk'], ['Irrigation tonight', 'gnWater'], ['Watering skipped', 'gnSkip']]) + chk('gnShow', 'Show trees and parks on the map (3D trees at street zoom)') + '<h3 class="sub-h">Most common species</h3><div class="bars" id="gnSp"></div><h3 class="sub-h">Parks and trees needing work</h3><ol class="corridors" id="gnList"></ol>');
    card('mpPol', 'Municipal police', 'Patrols and enforcement', SYN + 'Patrol units drive real roads; tasks are generated from typical municipal-police work. Connect the dispatch system and unit GPS to replace them.',
      kpis([['Units on patrol', 'poU'], ['Tasks open', 'poOpen'], ['Average response', 'poResp'], ['Fines issued today', 'poFine']]) + chk('poShow', 'Show units and tasks on the map') + '<div class="bars" id="poBars"></div><h3 class="sub-h">Open tasks</h3><ol class="corridors" id="poList"></ol>');
    card('psSpace', 'Use of public space and street markets', 'Permits, camera checks, markets', SYN + 'Permits and camera checks are generated on real streets; street markets are examples on real streets, changing by weekday.',
      kpis([['Public-space permits', 'psN'], ['Using more than allowed', 'psOver'], ['Fees a year', 'psFee'], ['Street markets today', 'psMk']]) + chk('psShow', 'Show permits and markets on the map') + '<ol class="corridors" id="psList"></ol>');
    if ((BEACH[RID] || []).length) {
      card('coBeach', 'Beaches and coast', 'Crowds, lifeguards, water, access', SYN + 'Crowds, lifeguard cover and water results are generated; season and temperature follow the real date and weather. Positions approximate.',
        kpis([['Beaches', 'coN'], ['People on the beach', 'coPeople'], ['Lifeguards', 'coGuard'], ['Sea temperature', 'coSea']]) + chk('coShow', 'Show beaches on the map') + '<p class="small" id="coNote"></p><ol class="corridors" id="coList"></ol>');
    }
    ROADS = majorStreets(15);
    card('spScen', 'Scenario planning', 'What if…', '<strong>Estimates.</strong> Effects are worked out from the simulated traffic on the chosen street with simple rules of thumb; use them to compare options, not as a forecast.',
      '<div class="mp-grid"><label class="inline-field mp-f"><span>Street</span><select id="scRoad">' + ROADS.map(function (r, i) { return '<option value="' + i + '">' + esc(r.name) + '</option>'; }).join('') + '</select></label>' +
      '<label class="inline-field mp-f"><span>Change</span><select id="scMeasure">' + MEASURES.map(function (x) { return '<option value="' + x[0] + '">' + x[1] + '</option>'; }).join('') + '</select></label>' +
      '<label class="inline-field mp-f" id="scTreesF" hidden><span>Trees</span><select id="scTrees"><option>100</option><option selected>200</option><option>500</option><option>1000</option></select></label></div>' +
      '<div class="btn-col row"><button type="button" class="btn small" id="scGo">Test the change</button><button type="button" class="btn small" id="scClr">Clear</button></div><table class="facts" id="scOut"></table>');
    card('rcRec', 'Recycling against EU targets', 'By district', SYN + 'District rates are generated; targets are the EU ones. A played collection run raises the rate slightly.',
      kpis([['Recycling rate', 'rcRate'], ['EU target', 'rcTgt'], ['Gap to target', 'rcGap'], ['Wrong items in recycling', 'rcCont']]) + '<div class="bars" id="rcBars"></div><p class="small muted" id="rcNote"></p>');
    $('scMeasure').addEventListener('change', function () { $('scTreesF').hidden = this.value !== 'trees'; });
    $('scGo').addEventListener('click', runScenario);
    $('scClr').addEventListener('click', function () { scen = null; set('scOut', ''); C.redraw(); });
    ['gnShow', 'poShow', 'psShow', 'coShow'].forEach(function (id) { var b = $(id); if (b) { b.addEventListener('change', function () { C.redraw(); }); } });
  }
  function render() {
    if (!K.tabOpen('muni')) { return; }
    renderGreen(); renderPolice(); renderSpace(); if ($('coBeach')) { renderCoast(); } renderRecycle();
  }

  C.addLayers(function () {
    var out = [], z = zoom();
    if (vis('gnShow')) {
      out.push(dots('mx-parks', parks(), function (p) { return p.skip ? rgb('info') : p.need ? rgb('heavy') : [40, 150, 80]; }, 9, parkPop));
      if (z >= 15 && !(T.muni3d && $('showMuni3d') && !$('showMuni3d').checked)) {
        var mp = T.getMap(), b = mp.getBounds(), Tv = trees().filter(function (t) { return t.at[0] > b.getWest() && t.at[0] < b.getEast() && t.at[1] > b.getSouth() && t.at[1] < b.getNorth(); });
        out.push(new deck.SimpleMeshLayer({ id: 'mx-trees3d', data: Tv, mesh: TREE, pickable: true, getPosition: function (t) { return t.at; }, getScale: function (t) { var s = t.h / 6; return [s, s, s]; }, sizeScale: z >= 17 ? 1 : z >= 16 ? 1.3 : 1.7,
          getColor: function (t) { var s = treeState(t); return s === 'severe' ? [150, 110, 60] : s === 'heavy' ? [160, 160, 60] : s === 'moderate' ? [90, 150, 70] : [46, 128, 60]; }, getOrientation: function (t) { return [0, (t.h * 37) % 90, 0]; },
          onClick: function (i) { if (i.object) { var p = treePop(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } } }));
        out.push(new deck.ColumnLayer({ id: 'mx-trunks', data: Tv, diskResolution: 6, radius: 0.35, extruded: true, getPosition: function (t) { return t.at; }, getElevation: function (t) { return t.h * 0.42 * (z >= 17 ? 1 : z >= 16 ? 1.3 : 1.7); }, getFillColor: [110, 80, 55] }));
      } else if (z >= 14) {
        out.push(dots('mx-trees', trees().filter(function (t) { return t.health < 0.15; }), function (t) { return rgb(treeState(t)); }, 4, treePop));
      }
    }
    if (vis('poShow')) {
      out.push(dots('mx-units', units().map(function (u) { return { u: u, at: unitAt(u) }; }), function () { return [30, 60, 150]; }, 8, function (x) { return [x.u.id + ' · ' + x.u.kind, [['Status', 'On patrol'], ['Open tasks nearby', tasks().filter(function (t) { return t.st !== 'Done' && m(t.at, x.at) < 1500; }).length]], 'Synthetic unit on the real road network']; }));
      out.push(dots('mx-tasks', tasks().filter(function (t) { return t.st !== 'Done'; }), function (t) { return rgb(t.st === 'New' ? 'heavy' : 'moderate'); }, 5, taskPop));
    }
    if (vis('psShow')) {
      out.push(dots('mx-space', spacePermits(), function (p) { return p.over ? rgb('heavy') : rgb('info'); }, 5, spPop));
      var ph = marketPhase(), E = C.edges();
      if (new Date().getDay() !== 0 && (ph === 'Setting up' || ph === 'Open' || ph === 'Cleaning')) {
        var M = markets();
        out.push(new deck.PathLayer({ id: 'mx-market', data: M.reduce(function (a, mk) { return a.concat(mk.edges.map(function (i) { return { p: E[i].path, mk: mk }; })); }, []), pickable: true, getPath: function (d) { return d.p; }, widthUnits: 'pixels', getWidth: 8, getColor: ph === 'Cleaning' ? [40, 120, 200, 200] : [150, 90, 210, 210], capRounded: true,
          onClick: function (i) { if (i.object) { var p = mkPop(i.object.mk); C.showPopup(i.coordinate, p[0], p[1], p[2]); } } }));
      }
    }
    if (vis('coShow') && $('coBeach')) { out.push(dots('mx-beach', beaches(), function (b) { var f = b.crowd / b.cap; return b.lost ? rgb('severe') : f > 0.85 ? rgb('heavy') : [30, 160, 210]; }, 9, beachPop)); }
    if (scen && open()) {
      var E2 = C.edges(), col = scen.ms === 'close' ? [208, 59, 59, 220] : scen.ms === 'buslane' ? [200, 40, 40, 200] : scen.ms === 'z30' ? [240, 170, 30, 220] : scen.ms === 'trees' ? [40, 150, 80, 220] : [40, 120, 200, 220];
      out.push(new deck.PathLayer({ id: 'mx-scen', data: scen.r.edges.map(function (i) { return E2[i].path; }), pickable: true, getPath: function (p) { return p; }, widthUnits: 'pixels', getWidth: 9, getColor: col, capRounded: true,
        onClick: function (i) { C.showPopup(i.coordinate, 'Scenario · ' + esc(scen.r.name), scen.rows.slice(0, 4).map(function (r) { return [r[0], r[1] + ' → ' + r[2]]; }), 'Estimates; see the Scenario planning card'); } }));
    }
    return out;
  });

  C.onReady(function () {
    meta = C.meta() || meta; bb = meta.bbox || bb; kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180);
    build(); render();
    C.onTab(function () { render(); C.redraw(); });
    C.onMinute(render);
  });
  T.muniplus = { render: render, trees: trees, units: units, markets: markets, phase: marketPhase, beaches: beaches };
})();
