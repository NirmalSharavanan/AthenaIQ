/* AthenaIQ: Greek use cases, added as cards to the existing menu sections (no new menu).
 *
 *   Dashboard    Greek cities: one tile per city (weather, rain, traffic, fires), opens that city
 *   Congestion   traffic mix: simulated car units split into cars, motorcycles, buses and vans
 *   Incidents    Attiki Odos by sector (Athens)
 *   Fines        offences by type with sample tickets
 *   Transit      Athens Metro (Thessaloniki Metro in Thessaloniki) and crowding by hour
 *   Planning     event and holiday plans (Athens Marathon, Easter and August exodus, parades, cruise days)
 *   Emergency    flash-flood watch; heatwave and wildfire risk; ambulance green corridor
 *   Environment  air quality in European AQI bands; streams and reservoir levels
 *
 * Real inputs: OpenStreetMap roads, signals and sites; Open-Meteo weather, rain, wind and particles; NASA FIRMS fires.
 * Everything else is estimated from the simulation or synthetic, and each card says which.
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, CFG = C.CFG, $ = C.$, num = C.num, clock = C.clock, state = T.state, K = T.kit;
  var TG = CFG.local || {}, rnd = K.rnd, hashStr = K.hashStr, esc = K.esc, HYD = C.region.isDefault;
  var bb = (C.meta() || {}).bbox, kx = 111320 * Math.cos((bb ? (bb[1] + bb[3]) / 2 : 17.9) * Math.PI / 180), ky = 110570;
  function metres(a, b) { return Math.hypot((a[0] - b[0]) * kx, (a[1] - b[1]) * ky); }
  var CUR = (CFG.currency || {}).symbol || '\u20ac', SYN = '<strong>Synthetic data.</strong> ', EST = '<strong>Estimated.</strong> ', EXA = '<strong>Example list, positions approximate.</strong> ';
  function tile(label, id) { return '<div class="kpi"><span class="k-label">' + label + '</span><span class="k-value" id="' + id + '">–</span></div>'; }
  function set(id, html) { var el = $(id); if (el) { el.innerHTML = html; } }
  function card(tab, id, title, sub, notice, body, first) {
    var sec = document.createElement('section'); sec.className = 'card'; sec.id = id; sec.setAttribute('data-tab', tab); sec.hidden = true;
    sec.innerHTML = (notice ? '<p class="notice">' + notice + '</p>' : '') + '<div class="card-head"><h2>' + title + '</h2><span class="muted" id="' + id + 'Sub">' + (sub || '') + '</span></div>' + body;
    var all = document.querySelectorAll('.panel section[data-tab="' + tab + '"]'), at = first ? all[0] : all[all.length - 1];
    if (at) { at.parentNode.insertBefore(sec, first ? at.nextSibling : at.nextSibling); } else { document.querySelector('.panel').appendChild(sec); }
    return sec;
  }
  function row(dot, title, sub, right, fn) { return C.listButton(dot, title, sub, right, fn); }
  function list(id, items) { var ol = $(id); if (!ol) { return; } ol.innerHTML = ''; items.forEach(function (li) { ol.appendChild(li); }); if (!items.length) { ol.innerHTML = '<li class="muted">Nothing to show.</li>'; } }
  var mids = null;
  function roadsNear(at, r) { if (!mids) { mids = C.edges().map(function (e) { return e.path[e.path.length >> 1]; }); } var out = []; for (var i = 0; i < mids.length; i++) { if (Math.abs((mids[i][1] - at[1]) * ky) <= r && metres(mids[i], at) <= r) { out.push(i); } } return out; }
  function areaLoad(at, r) { var veh = 0, free = 0; roadsNear(at, r).forEach(function (i) { var o = C.occ(i); veh += o; free += o * C.ratio(i); }); return { veh: veh, ratio: veh ? free / veh : 1 }; }
  function sites(kinds) { return C.sites().filter(function (s) { return !kinds || kinds.indexOf(s[4]) >= 0; }).map(function (s) { return { name: s[0], at: [s[1], s[2]] }; }); }
  function wx() { return T.osint && T.osint.weather ? T.osint.weather() : null; }
  function sum(a, n) { var t = 0; for (var i = 0; i < Math.min(n, (a || []).length); i++) { t += a[i] || 0; } return t; }
  var shown = {};   // map overlays of the cards that are open

  /* ============================== Dashboard: cities ============================== */
  var metas = {};
  function loadMetas() {
    (CFG.regions || []).forEach(function (r) {
      if (metas[r.id]) { return; }
      metas[r.id] = 'loading';
      fetch('data/' + (r.dir ? r.dir + '/' : '') + 'meta.json').then(function (x) { return x.ok ? x.json() : null; }).then(function (m) { metas[r.id] = m; renderCities(); }, function () { metas[r.id] = null; });
    });
  }
  function renderCities() {
    var places = T.osint && T.osint.places ? (T.osint.places() || []) : [], fires = (T.live && T.live.fires() || {}).list || [];
    var el = $('tgCities'); if (!el) { return; }
    el.innerHTML = (CFG.regions || []).map(function (r) {
      var m = metas[r.id], base = m && m.scenarios ? m.scenarios.filter(function (s) { return s.id === 'base'; })[0] : null, p = places.filter(function (x) { return x.id === r.id; })[0];
      var c = r.centre || [r.sites[0][1], r.sites[0][2]], nf = fires.filter(function (f) { return metres(f.at, c) <= 30000; }).length;
      var rain = p ? sum(p.rain, 24) : null, temp = p ? Math.round(p.now.temp) : null, kmh = base && base.stats ? base.stats.kmh : null;
      var lvl = kmh == null ? '' : kmh < 18 ? 'bad' : kmh < 25 ? 'warn' : 'good';
      return '<button type="button" class="tg-city' + (r.id === C.region.id ? ' on' : '') + '" data-r="' + r.id + '"><b>' + esc(r.name) + '</b>' +
        '<span>' + (temp != null ? temp + ' °C' : '–') + (rain ? ' · ' + rain.toFixed(0) + ' mm rain 24 h' : rain === 0 ? ' · dry' : '') + '</span>' +
        '<span class="' + lvl + '">' + (kmh ? 'Trips average ' + Math.round(kmh) + ' km/h' : m === 'loading' ? 'loading…' : 'no traffic data') + (m && m.traffic === 'synthetic' ? ' (pattern)' : '') + '</span>' +
        '<span>' + (nf ? nf + ' fire detection' + (nf > 1 ? 's' : '') + ' within 30 km' : 'No fires within 30 km') + '</span></button>';
    }).join('');
  }

  /* ============================== Congestion: traffic mix ============================== */
  function renderMix() {
    var k = C.kpiAt(state.scenario, state.t) || {}, pcu = k.vehicles || 0, mix = TG.mix || [], avg = mix.reduce(function (a, m) { return a + m[1] * m[2]; }, 0) || 1;
    var veh = pcu / avg;
    set('tgMixTot', num(Math.round(veh)));
    set('tgMixPcu', num(Math.round(pcu)));
    var max = 1; mix.forEach(function (m) { max = Math.max(max, veh * m[1]); });
    set('tgMixBars', mix.map(function (m) { var v = veh * m[1]; return C.barRow(esc(m[0]), Math.round(m[1] * 100) + '% of vehicles', num(Math.round(v)), v / max); }).join(''));
  }

  /* ============================== Incidents: ring motorway ============================== */
  var orr = null, SECT = ['North', 'North-east', 'East', 'South-east', 'South', 'South-west', 'West', 'North-west'];
  function orrEdges() {
    if (orr) { return orr; }
    var R = TG.ring || {}, names = C.names(), ctr = HYD && R.centre ? R.centre : null, re = new RegExp(R.match || '^$', 'i'); orr = [];
    if (!ctr) { return orr; }
    C.edges().forEach(function (e, i) {
      var n = names[e.n] || ''; if (!re.test(n)) { return; }
      var p = e.path[e.path.length >> 1], ang = (Math.atan2((p[1] - ctr[1]) * ky, (p[0] - ctr[0]) * kx) * 180 / Math.PI + 360) % 360;
      orr.push({ i: i, sec: Math.round(((90 - ang + 360) % 360) / 45) % 8, m: e.m, path: e.path });
    });
    return orr;
  }
  function orrStats() {
    var by = SECT.map(function () { return { km: 0, veh: 0, free: 0 }; });
    orrEdges().forEach(function (o) { var b = by[o.sec], v = C.occ(o.i); b.km += o.m / 1000; b.veh += v; b.free += v * C.ratio(o.i); });
    var seed = hashStr('orr' + state.date + Math.floor(state.t / 3600));
    return by.map(function (b, k) { return { name: SECT[k], km: b.km, veh: b.veh, ratio: b.veh ? b.free / b.veh : 1, breakdowns: b.km ? Math.floor(rnd(seed, k) * 2.4 * b.km / 20) : 0 }; }).filter(function (b) { return b.km > 0.5; });
  }
  function renderOrr() {
    var s = orrStats(); if (!s.length) { return; }
    var km = s.reduce(function (a, b) { return a + b.km; }, 0), veh = s.reduce(function (a, b) { return a + b.veh; }, 0), br = s.reduce(function (a, b) { return a + b.breakdowns; }, 0);
    set('tgOrrKm', num(Math.round(km)) + '<small>km</small>'); set('tgOrrVeh', num(Math.round(veh))); set('tgOrrBr', num(br));
    list('tgOrrList', s.map(function (b) {
      var dot = b.ratio < 0.35 ? 'severe' : b.ratio < 0.6 ? 'heavy' : b.ratio < 0.8 ? 'moderate' : 'free';
      return row(dot, b.name + ' sector', Math.round(b.km) + ' km · speed ' + Math.round(b.ratio * 100) + '% of the limit · ' + num(Math.round(b.veh)) + ' vehicles' + (b.breakdowns ? ' · ' + b.breakdowns + ' breakdown' + (b.breakdowns > 1 ? 's' : '') + ' (synthetic)' : ''), '', function () {
        var pts = orrEdges().filter(function (o) { return SECT[o.sec] === b.name; }).map(function (o) { return o.path[o.path.length >> 1]; });
        if (pts.length && T.getMap()) { var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; }); T.getMap().fitBounds([[Math.min.apply(null, xs), Math.min.apply(null, ys)], [Math.max.apply(null, xs), Math.max.apply(null, ys)]], { padding: 80, maxZoom: 14, duration: 800 }); }
      });
    }));
  }

  /* ============================== Fines: e-challan types ============================== */
  function plate(seed, n) { var L = (TG.plate || {}).letters || 'ABEZHIKMNOPTYX'; return L[Math.floor(rnd(seed, n) * L.length)] + L[Math.floor(rnd(seed, n + 1) * L.length)] + L[Math.floor(rnd(seed, n + 2) * L.length)] + '-' + String(1000 + Math.floor(rnd(seed, n + 3) * 9000)); }
  function renderChallan() {
    var et = C.eventTotals(state.scenario, state.t), total = et ? et.fines : 0, types = TG.challan || [];
    var twoW = types.filter(function (t) { return (TG.twoWheelerTypes || []).indexOf(t[0]) >= 0; }).reduce(function (a, t) { return a + t[1]; }, 0);
    set('tgChTot', num(total)); set('tgCh2w', Math.round(twoW * 100) + '<small>%</small>');
    set('tgChVal', CUR + num(Math.round(types.reduce(function (a, t) { return a + total * t[1] * t[2]; }, 0))));
    var max = 1; types.forEach(function (t) { max = Math.max(max, total * t[1]); });
    set('tgChBars', types.map(function (t) { var v = Math.round(total * t[1]); return C.barRow(esc(t[0]), CUR + num(t[2]) + ' each', num(v), v / max); }).join(''));
    var seed = hashStr('ch' + C.region.id + state.date + Math.floor(state.t / 600)), sp = sites();
    list('tgChList', [0, 1, 2, 3, 4, 5].map(function (n) {
      var t = types[Math.floor(rnd(seed, n * 7) * types.length)] || ['Violation', 1, 0], s = sp[Math.floor(rnd(seed, n * 7 + 5) * sp.length)] || { name: '–', at: null };
      var tm = Math.max(0, state.t - Math.floor(rnd(seed, n * 7 + 6) * 3000));
      return row('moderate', plate(seed, n * 7) + ' · ' + t[0], s.name + ' · ' + clock(tm) + ' · ' + CUR + num(t[2]) + ' · synthetic', '', function () { if (s.at) { C.flyTo(s.at[0], s.at[1], 15); } });
    }));
  }

  /* ============================== Transit: metro ============================== */
  function metro() { return HYD ? TG.metro : (TG.metroByRegion || {})[C.region.id]; }
  function metroLoad(h) { return 0.18 + 0.75 * Math.exp(-Math.pow((h - 9.2) / 1.3, 2)) + 0.7 * Math.exp(-Math.pow((h - 18.6) / 1.6, 2)) + (h < 6 || h > 23 ? -0.15 : 0); }
  function renderMetro() {
    var M = metro(); if (!M) { return; }
    var h = state.t / 3600, load = Math.max(0, Math.min(1.15, metroLoad(h)));
    set('tgMeKm', '~' + M.totalKm + '<small>km</small>'); set('tgMeSt', M.stations); set('tgMeLoad', Math.round(load * 100) + '<small>%</small>');
    var seed = hashStr('metro' + state.date);
    list('tgMeList', M.lines.map(function (l, n) {
      var lf = Math.max(0, Math.min(1.2, load * (0.85 + 0.3 * rnd(seed, n)))), dot = lf >= 1 ? 'severe' : lf >= 0.8 ? 'heavy' : lf >= 0.5 ? 'moderate' : 'free';
      return row(dot, l.name + ': ' + l.from + ' – ' + l.to, 'About ' + l.km + ' km · train load ' + Math.round(lf * 100) + '% now (synthetic) · headway ' + (lf >= 0.8 ? '3–4' : '5–8') + ' min', '', function () { C.showTab('bus'); });
    }));
  }

  /* ============================== Planning: festival plans ============================== */
  var fest = null;
  function festivals() {
    if (HYD) { return TG.festivals || []; }
    if ((TG.festivalsByRegion || {})[C.region.id]) { return TG.festivalsByRegion[C.region.id]; }
    var c = sites(['centre'])[0] || sites()[0]; if (!c) { return []; }
    return [{ id: 'proc', name: 'Festival procession, ' + c.name + ' (example)', season: 'any', crowd: 20000, at: c.at, radiusM: 1200, areas: [{ name: c.name, at: c.at }],
      actions: ['Close the procession route to vehicles during the slot', 'Signed diversions around the town centre', 'Parking at the edge of town with shuttle buses', 'Medical posts and lost-and-found on the route'] }];
  }
  function renderFest() {
    var F = festivals(), sel = $('tgFeSel'); if (!F.length) { return; }
    if (!sel.options.length) { F.forEach(function (f, i) { var o = document.createElement('option'); o.value = String(i); o.textContent = f.name + ' · ' + f.season; sel.appendChild(o); }); }
    var f = F[Number(sel.value) || 0], roads = roadsNear(f.at, f.radiusM), ld = areaLoad(f.at, f.radiusM);
    set('tgFeCrowd', f.crowd ? num(f.crowd) : 'Outbound +' + Math.round((f.outbound || 0) * 100) + '%');
    set('tgFeRoads', num(roads.length)); set('tgFeSpeed', Math.round(ld.ratio * 100) + '<small>%</small>');
    set('tgFeActs', '<ol class="steps">' + f.actions.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ol>');
    $('tgFeShow').textContent = fest === f ? 'Hide on the map' : 'Show on the map';
  }

  /* ============================== Emergency: waterlogging, heat, green corridor ============================== */
  var cloudburst = false;
  function waterPoints() {
    if (HYD) { return (TG.waterlogging || {}).points || []; }
    return sites(['centre', 'business', 'residential']).slice(0, 6).map(function (s) { return { name: s.name, at: s.at }; });
  }
  function waterStatus() {
    var W = TG.waterlogging || {}, p = wx(), rain6 = cloudburst ? 60 : p ? sum(p.rain, 6) : 0, prob = p ? Math.max.apply(null, (p.rainProb || [0]).slice(0, 6)) : 0;
    return { rain6: rain6, prob: cloudburst ? 100 : prob, pts: waterPoints().map(function (pt) {
      var r = rain6 * (pt.low || 1) * (pt.under ? 1.2 : 1), st = r >= (W.alertMm6h || 35) ? 'alert' : r >= (W.watchMm6h || 15) ? 'watch' : 'ok';
      return { name: pt.name, at: pt.at, under: pt.under, st: st, load: areaLoad(pt.at, 600) };
    }) };
  }
  function renderWater() {
    var w = waterStatus(), al = w.pts.filter(function (p) { return p.st === 'alert'; }).length, wa = w.pts.filter(function (p) { return p.st === 'watch'; }).length;
    set('tgWlRain', w.rain6.toFixed(0) + '<small>mm</small>'); set('tgWlAl', al); set('tgWlWa', wa);
    $('tgWlSub').textContent = cloudburst ? 'Exercise: 60 mm in 6 hours' : 'Forecast for the next 6 hours, Open-Meteo';
    list('tgWlList', w.pts.slice().sort(function (a, b) { return (a.st === 'alert' ? 0 : a.st === 'watch' ? 1 : 2) - (b.st === 'alert' ? 0 : b.st === 'watch' ? 1 : 2); }).map(function (p) {
      return row(p.st === 'alert' ? 'severe' : p.st === 'watch' ? 'heavy' : 'free', p.name + (p.under ? ' (underpass)' : ''), (p.st === 'alert' ? 'Likely waterlogging: close and divert' : p.st === 'watch' ? 'Watch: pumps on standby' : 'No action') + ' · ' + num(Math.round(p.load.veh)) + ' vehicles nearby', p.st === 'ok' ? 'OK' : p.st === 'alert' ? 'Alert' : 'Watch', function () { C.flyTo(p.at[0], p.at[1], 15.5); C.showPopup(p.at, p.name, [['Status', p.st === 'alert' ? 'Likely waterlogging' : p.st === 'watch' ? 'Watch' : 'Normal'], ['Rain, next 6 h', w.rain6.toFixed(0) + ' mm' + (cloudburst ? ' (exercise)' : '')], ['Vehicles within 600 m', num(Math.round(p.load.veh))]], 'Rain from Open-Meteo; the point list is an example'); });
    }));
  }
  // Heat and wildfire weather: hottest hour and strongest gust in the next 48 hours. Indicative only.
  function fireRisk(p) {
    var H = TG.heat || {}, mx = -99, gmax = 0, risk = 0;
    for (var i = 0; i < Math.min(48, (p.temp || []).length); i++) {
      var t = p.temp[i], g = (p.gust || [])[i] || 0; if (t == null) { continue; }
      mx = Math.max(mx, t); gmax = Math.max(gmax, g);
      var r = t >= 35 && g >= (H.fireWindKmh || 40) + 15 ? 3 : t >= 30 && g >= (H.fireWindKmh || 40) ? 2 : t >= 30 && g >= 25 ? 1 : 0;
      risk = Math.max(risk, r);
    }
    if (p.now && p.now.humidity != null && p.now.humidity < 25 && risk >= 1) { risk = Math.min(3, risk + 1); }
    return { mx: mx, gust: gmax, risk: risk };
  }
  function renderHeat() {
    var H = TG.heat || {}, places = T.osint && T.osint.places ? (T.osint.places() || []) : [], fires = (T.live && T.live.fires() || {}).list || [];
    var rows = places.map(function (p) { var f = fireRisk(p); var c = [p.lon, p.lat]; return { name: p.name, mx: f.mx, gust: f.gust, risk: f.risk, at: c, fires: fires.filter(function (x) { return metres(x.at, c) <= 30000; }).length }; })
      .sort(function (a, b) { return b.risk - a.risk || b.mx - a.mx; });
    var hot = rows.filter(function (r) { return r.mx >= (H.heatC || 40); }).length, fr = rows.filter(function (r) { return r.risk >= 2; }).length;
    set('tgHtMax', rows.length ? Math.round(Math.max.apply(null, rows.map(function (r) { return r.mx; }))) + '<small>°C</small>' : '–'); set('tgHtN', hot); set('tgHtF', fr);
    $('tgHtSub').textContent = rows.length ? 'Next 48 hours, ' + rows.length + ' cities' : '';
    var RL = ['Low', 'Moderate', 'High', 'Very high'];
    list('tgHtList', rows.map(function (r) { var lv = r.risk >= 3 || r.mx >= (H.severeC || 44) ? 'severe' : r.risk >= 2 || r.mx >= (H.heatC || 40) ? 'heavy' : r.risk >= 1 || r.mx >= 35 ? 'moderate' : 'free';
      return row(lv, r.name, 'Up to ' + Math.round(r.mx) + ' °C, gusts ' + Math.round(r.gust) + ' km/h · fire weather ' + RL[r.risk] + (r.fires ? ' · ' + r.fires + ' satellite heat detection' + (r.fires > 1 ? 's' : '') + ' within 30 km' : ''), RL[r.risk], function () { C.flyTo(r.at[0], r.at[1], 11); }); }));
    var sig = C.signals() || [], scored = sig.slice(0, 400).map(function (s) { return { at: s, l: areaLoad(s, 150) }; }).sort(function (a, b) { return b.l.veh - a.l.veh; }).slice(0, 5);
    var names = C.names();
    set('tgHtJ', scored.map(function (s) { var near = roadsNear(s.at, 120)[0], nm = near != null ? names[C.edges()[near].n] || 'Junction' : 'Junction'; return '<li>' + esc(nm) + ' · ' + num(Math.round(s.l.veh)) + ' vehicles nearby</li>'; }).join(''));
  }
  var corridor = null;
  function hospitals() { var z = T.zones ? T.zones.all().filter(function (s) { return s.type === 'hospital' && !/veterin|animal|pet /i.test(s.name || ''); }) : []; var c = (C.meta() || {}).bbox; var ctr = c ? [(c[0] + c[2]) / 2, (c[1] + c[3]) / 2] : [0, 0]; return z.sort(function (a, b) { return metres([a.lon, a.lat], ctr) - metres([b.lon, b.lat], ctr); }).slice(0, 25); }
  function runCorridor() {
    var hs = hospitals(), h = hs[Number($('tgGcHosp').value) || 0], from = sites()[Number($('tgGcFrom').value) || 0];
    if (!h || !from || !T.response) { return; }
    var r = T.response.pathBetween(from.at, [h.lon, h.lat]);
    if (!r) { $('tgGcOut').textContent = 'No connected route was found in the model network.'; return; }
    var sig = (C.signals() || []).filter(function (s) { for (var i = 0; i < r.path.length; i += 2) { if (metres(s, r.path[i]) <= 45) { return true; } } return false; });
    // Junctions without a mapped signal are where traffic police hold cross traffic (a smaller saving each, assumed 8 s).
    var junc = Math.max(0, r.links.length - 1 - sig.length);
    var mins = r.links.reduce(function (a, i) { var e = C.edges()[i]; return a + e.m / Math.max(8, e.s * C.ratio(i)) * 3.6 / 60; }, 0), saved = (sig.length * (TG.signalDelaySec || 25) + junc * 8) / 60;
    corridor = { path: r.path, sig: sig, h: h };
    $('tgGcOut').innerHTML = '<b>' + esc(from.name) + ' → ' + esc(h.name) + '</b>: ' + (r.metres / 1000).toFixed(1) + ' km, about ' + Math.max(1, Math.round(mins)) + ' min at current speeds. ' +
      'Holding ' + sig.length + ' mapped signal' + (sig.length === 1 ? '' : 's') + ' green and ' + junc + ' other junction' + (junc === 1 ? '' : 's') + ' by traffic police would save about ' + Math.max(1, Math.round(saved)) + ' min. <span class="muted">Estimate; nothing is sent to a signal controller. OpenStreetMap maps few signals here.</span>';
    var xs = r.path.map(function (p) { return p[0]; }), ys = r.path.map(function (p) { return p[1]; });
    if (T.getMap()) { T.getMap().fitBounds([[Math.min.apply(null, xs), Math.min.apply(null, ys)], [Math.max.apply(null, xs), Math.max.apply(null, ys)]], { padding: { top: 100, bottom: 140, left: 60, right: 60 }, maxZoom: 15, duration: 900 }); }
    if (T.audit) { T.audit('Green corridor: ' + from.name + ' → ' + h.name); }
    C.redraw();
  }

  /* ============================== Environment: European AQI, streams and reservoirs ============================== */
  // European Air Quality Index bands (EEA, as used by Open-Meteo): index 0–20 good … above 100 extremely poor.
  var BP = { pm25: [[0, 10, 0, 20], [10, 20, 20, 40], [20, 25, 40, 60], [25, 50, 60, 80], [50, 75, 80, 100], [75, 800, 100, 500]],
    pm10: [[0, 20, 0, 20], [20, 40, 20, 40], [40, 50, 40, 60], [50, 100, 60, 80], [100, 150, 80, 100], [150, 1200, 100, 500]] };
  var AQC = ['Good', 'Fair', 'Moderate', 'Poor', 'Very poor', 'Extremely poor'], AQD = ['free', 'free', 'moderate', 'heavy', 'severe', 'severe'];
  function sub(v, bps) { if (v == null) { return null; } for (var i = 0; i < bps.length; i++) { var b = bps[i]; if (v <= b[1] || i === bps.length - 1) { return Math.round(b[2] + (Math.min(v, b[1]) - b[0]) * (b[3] - b[2]) / (b[1] - b[0])); } } return null; }
  function aqi(n) { var a = sub(n.pm25, BP.pm25), b = sub(n.pm10, BP.pm10); if (a == null && b == null) { return null; } var v = Math.max(a || 0, b || 0); return { v: v, cat: v <= 20 ? 0 : v <= 40 ? 1 : v <= 60 ? 2 : v <= 80 ? 3 : v <= 100 ? 4 : 5, by: (a || 0) >= (b || 0) ? 'PM2.5' : 'PM10' }; }
  function renderAqi() {
    var places = T.osint && T.osint.places ? (T.osint.places() || []) : [], here = wx();
    var a = here ? aqi(here.now) : null;
    set('tgAqV', a ? a.v : '–'); set('tgAqC', a ? AQC[a.cat] : '–'); set('tgAqBy', a ? a.by : '–');
    list('tgAqList', places.map(function (p) { var q = aqi(p.now); return { p: p, q: q }; }).filter(function (x) { return x.q; }).sort(function (x, y) { return y.q.v - x.q.v; }).map(function (x) {
      return row(AQD[x.q.cat], x.p.name + ': ' + x.q.v + ' · ' + AQC[x.q.cat], 'PM2.5 ' + Math.round(x.p.now.pm25) + ', PM10 ' + Math.round(x.p.now.pm10) + ' µg/m³ · led by ' + x.q.by, '', null);
    }));
    if ($('tgAqSt')) { $('tgAqSt').hidden = !HYD; }
  }
  function lakes() {
    if (HYD) { return TG.lakes || []; }
    return C.sites().filter(function (s) { return /lake|reservoir|river|stream|λίμνη|ποταμ/i.test(s[0]); }).map(function (s) { return { name: s[0], at: [s[1], s[2]] }; });
  }
  function renderLakes() {
    var L = lakes(), p = wx(), rain24 = cloudburst ? 60 : p ? sum(p.rain, 24) : 0, seed = hashStr('lake' + C.region.id + state.date);
    $('tgLk').hidden = !L.length; if (!L.length) { return; }
    list('tgLkList', L.map(function (l, n) {
      var lvl = Math.min(104, 68 + 18 * rnd(seed, n) + rain24 * (l.river ? 0.55 : 0.3)), st = lvl >= 95 ? 'severe' : lvl >= 90 ? 'heavy' : 'free';
      return row(st, l.name, (l.river ? 'River level ' : 'Level ') + Math.round(lvl) + '% of ' + (l.river ? 'the danger mark' : 'full tank level') + (st === 'severe' ? ' · open gates / warn low-lying roads' : st === 'heavy' ? ' · watch' : '') + ' · synthetic sensor', '', function () { C.flyTo(l.at[0], l.at[1], 14); });
    }));
  }

  /* ============================== cards ============================== */
  function build() {
    card('dash', 'tgCity', TG.citiesTitle || 'Cities', 'Tap a city to open it', '<strong>Real weather and fires; simulated traffic.</strong> Trip speed is the simulated average over the morning, not a measurement.',
      '<div class="tg-cities" id="tgCities"></div>', true);
    card('cong', 'tgMix', 'Traffic mix', 'Vehicles moving now', EST + (TG.mixNote || ''),
      '<div class="kpis">' + tile('Vehicles, all types', 'tgMixTot') + tile('Car units simulated', 'tgMixPcu') + '</div><div class="bars" id="tgMixBars"></div>');
    if (HYD && orrEdges().length) {
      card('inc', 'tgOrr', (TG.ring || {}).title || 'Ring road', 'By sector', EST + 'Speeds from the simulation; breakdowns are synthetic.',
        '<div class="kpis">' + tile('Length modelled', 'tgOrrKm') + tile('Vehicles on it', 'tgOrrVeh') + tile('Breakdowns now', 'tgOrrBr') + '</div><ol class="corridors" id="tgOrrList"></ol>');
    }
    card('fines', 'tgCh', TG.challanTitle || 'Offences by type', TG.challanSub || '', SYN + 'Offence shares are assumed and fine values are placeholders; the tickets below are generated.',
      '<div class="kpis">' + tile('Tickets today', 'tgChTot') + tile('Two-wheeler offences', 'tgCh2w') + tile('Value', 'tgChVal') + '</div><div class="bars" id="tgChBars"></div><h3 class="sub-h">Latest tickets</h3><ol class="corridors" id="tgChList"></ol>');
    if (metro()) {
      card('bus', 'tgMe', HYD ? 'Athens Metro' : C.region.name + ' Metro', 'Lines and crowding', '<strong>Line facts as published; crowding is synthetic.</strong> Metro and rail tracks on the map come from OpenStreetMap (Railway layer). Source: ' + esc(metro().source) + '.',
        '<div class="kpis">' + tile('Network', 'tgMeKm') + tile('Stations', 'tgMeSt') + tile('Average train load now', 'tgMeLoad') + '</div><ol class="corridors" id="tgMeList"></ol>');
    }
    card('plan', 'tgFe', 'Event and holiday plans', '', EXA + 'Plans are templates for the exercise; crowds are examples. Use them with the Traffic Police’s own plans.',
      '<label class="field"><span>Plan</span><select id="tgFeSel"></select></label><div class="kpis">' + tile('Expected crowd', 'tgFeCrowd') + tile('Roads in the area', 'tgFeRoads') + tile('Speed there now', 'tgFeSpeed') + '</div>' +
      '<div id="tgFeActs"></div><div class="search-row"><button type="button" class="btn small" id="tgFeShow">Show on the map</button></div>');
    card('emg', 'tgWl', (TG.waterlogging || {}).title || 'Flash-flood watch', '', EXA + 'Rain is the real Open-Meteo forecast; ' + (HYD ? 'replace the points with ' + ((TG.waterlogging || {}).authority || 'the official list') + '.' : 'the points are this city’s site list; replace them with the municipality’s flood-prone points.'),
      '<div class="kpis">' + tile('Rain, next 6 h', 'tgWlRain') + tile('Points on alert', 'tgWlAl') + tile('Points to watch', 'tgWlWa') + '</div><ol class="corridors" id="tgWlList"></ol>' +
      '<div class="search-row"><button type="button" class="btn small" id="tgWlEx" aria-pressed="false">Exercise: 60 mm cloudburst</button></div>');
    card('emg', 'tgHt', 'Heatwave and wildfire risk', '', '<strong>Real forecast, indicative risk.</strong> Temperatures and gusts from Open-Meteo and heat detections from NASA FIRMS for the ten cities. The official fire-risk map comes from the General Secretariat for Civil Protection; heat warnings from ' + esc(TG.weatherService || 'the national weather service') + '.',
      '<div class="kpis">' + tile('Hottest, next 48 h', 'tgHtMax') + tile('Cities at 40 °C or more', 'tgHtN') + tile('High fire weather', 'tgHtF') + '</div><ol class="corridors" id="tgHtList"></ol>' +
      '<h3 class="sub-h">Busiest junctions now: shade and water for traffic police first</h3><ol class="plain" id="tgHtJ"></ol>' +
      '<ol class="steps"><li>Send ' + esc(TG.emergencyNumber || '112') + ' messages before evacuations, not during</li><li>Keep evacuation routes one-way outbound and hold traffic for fire engines</li><li>Roadworks only in the early morning; extra breakdown patrols on the motorways</li><li>Cooled spaces at metro stations and town halls</li></ol>');
    card('emg', 'tgGc', 'Ambulance green corridor', (TG.ambulance || 'Ambulance') + ' to hospital', EST + 'Route and time from the simulated speeds; hospitals from OpenStreetMap.',
      '<label class="field"><span>From</span><select id="tgGcFrom"></select></label><label class="field"><span>To hospital</span><select id="tgGcHosp"></select></label>' +
      '<div class="search-row"><button type="button" class="btn small primary" id="tgGcGo">Plan green corridor</button><button type="button" class="btn small" id="tgGcClr" hidden>Clear</button></div><p class="muted" id="tgGcOut"></p>');
    card('env', 'tgAq', 'Air quality, European AQI', 'Modelled now', '<strong>Modelled, not station readings.</strong> PM2.5 and PM10 from Open-Meteo (CAMS), shown in European Air Quality Index bands from current hourly values. Saharan dust episodes show up as high PM10.',
      '<div class="kpis">' + tile('AQI here', 'tgAqV') + tile('Category', 'tgAqC') + tile('Led by', 'tgAqBy') + '</div><ol class="corridors" id="tgAqList"></ol>' +
      '<p class="muted" id="tgAqSt">Stations of the ' + esc(TG.aqNetwork || 'official network') + ' are shown on the map when this card is open (approximate positions); connecting their readings needs ' + esc(TG.aqConnect || 'an open-data feed') + '.</p>');
    card('env', 'tgLk', 'Streams and reservoir levels', '', SYN + 'Levels are synthetic and rise with the rain forecast; connect real gauges through Integration Studio.',
      '<ol class="corridors" id="tgLkList"></ol>');

    // Controls.
    $('tgCities').addEventListener('click', function (e) { var b = e.target.closest('[data-r]'); if (!b) { return; } var s = $('regionSel'); if (b.getAttribute('data-r') !== C.region.id) { s.value = b.getAttribute('data-r'); s.dispatchEvent(new Event('change')); } });
    $('tgFeSel').addEventListener('change', function () { if (fest) { fest = festivals()[Number($('tgFeSel').value) || 0]; C.redraw(); } renderFest(); });
    $('tgFeShow').addEventListener('click', function () {
      var f = festivals()[Number($('tgFeSel').value) || 0]; fest = fest === f ? null : f;
      if (fest && T.getMap()) { T.getMap().easeTo({ center: f.at, zoom: 13.5, duration: 800 }); }
      if (fest && T.audit) { T.audit('Festival plan shown: ' + f.name); }
      renderFest(); C.redraw();
    });
    $('tgWlEx').addEventListener('click', function () { cloudburst = !cloudburst; this.setAttribute('aria-pressed', cloudburst ? 'true' : 'false'); this.textContent = cloudburst ? 'End the exercise' : 'Exercise: 60 mm cloudburst'; shown.water = true; renderWater(); renderLakes(); C.redraw(); });
    var from = $('tgGcFrom'); sites().forEach(function (s, i) { var o = document.createElement('option'); o.value = String(i); o.textContent = s.name; from.appendChild(o); });
    $('tgGcGo').addEventListener('click', function () { runCorridor(); $('tgGcClr').hidden = !corridor; });
    $('tgGcClr').addEventListener('click', function () { corridor = null; $('tgGcOut').textContent = ''; this.hidden = true; C.redraw(); });
  }
  function fillHospitals() { var sel = $('tgGcHosp'); if (!sel || sel.options.length) { return; } hospitals().forEach(function (h, i) { var o = document.createElement('option'); o.value = String(i); o.textContent = h.name; sel.appendChild(o); }); if (!sel.options.length) { sel.innerHTML = '<option>No hospitals in the map data</option>'; } }

  function render() {
    var open = function (t) { return K.tabOpen(t); };
    if (open('dash')) { loadMetas(); renderCities(); }
    if (open('cong')) { renderMix(); }
    if (open('inc') && $('tgOrr')) { renderOrr(); }
    if (open('fines')) { renderChallan(); }
    if (open('bus') && $('tgMe')) { renderMetro(); }
    if (open('plan')) { renderFest(); }
    if (open('emg')) { renderWater(); renderHeat(); fillHospitals(); }
    if (open('env')) { renderAqi(); renderLakes(); }
  }

  /* ============================== map layers ============================== */
  C.addLayers(function () {
    var out = [];
    if (K.tabOpen('emg')) {
      var w = waterStatus(), COL = { alert: [208, 59, 59], watch: [230, 150, 30], ok: [40, 120, 200] };
      out.push(new deck.ScatterplotLayer({ id: 'tg-water', data: w.pts, pickable: true, radiusUnits: 'pixels', stroked: true, lineWidthUnits: 'pixels', getPosition: function (p) { return p.at; },
        getRadius: function (p) { return p.st === 'alert' ? 10 : 7; }, getFillColor: function (p) { return COL[p.st].concat([230]); }, getLineColor: [255, 255, 255], getLineWidth: 2,
        updateTriggers: { getFillColor: w.rain6, getRadius: w.rain6 }, onClick: function (i) { if (i.object) { C.showPopup(i.object.at, i.object.name, [['Status', i.object.st === 'alert' ? 'Likely waterlogging' : i.object.st === 'watch' ? 'Watch' : 'Normal'], ['Rain, next 6 h', w.rain6.toFixed(0) + ' mm']], 'Example point; rain from Open-Meteo'); } } }));
      if (corridor) {
        out.push(new deck.PathLayer({ id: 'tg-corridor', data: [corridor.path], getPath: function (p) { return p; }, widthUnits: 'pixels', getWidth: 6, getColor: [20, 170, 90, 230], capRounded: true, jointRounded: true }));
        out.push(new deck.ScatterplotLayer({ id: 'tg-corridor-sig', data: corridor.sig, radiusUnits: 'pixels', getPosition: function (s) { return s; }, getRadius: 6, getFillColor: [40, 220, 120], stroked: true, getLineColor: [255, 255, 255], lineWidthUnits: 'pixels', getLineWidth: 2 }));
      }
    }
    if (fest && K.tabOpen('plan')) {
      out.push(new deck.ScatterplotLayer({ id: 'tg-fest', data: fest.areas, radiusUnits: 'meters', getRadius: Math.max(500, fest.radiusM / 2), getPosition: function (a) { return a.at; }, getFillColor: [230, 120, 30, 50], stroked: true, getLineColor: [230, 120, 30, 220], lineWidthUnits: 'pixels', getLineWidth: 2 }));
      if (deck.TextLayer) { out.push(new deck.TextLayer({ id: 'tg-fest-n', data: fest.areas, getPosition: function (a) { return a.at; }, getText: function (a) { return a.name; }, getSize: 12, getColor: C.theme() === 'light' ? [120, 60, 10] : [255, 200, 140], fontWeight: 700, fontFamily: 'system-ui, sans-serif' })); }
    }
    if (K.tabOpen('env') && HYD) {
      out.push(new deck.ScatterplotLayer({ id: 'tg-aq', data: TG.aqStations || [], pickable: true, radiusUnits: 'pixels', getPosition: function (s) { return s.at; }, getRadius: 6, getFillColor: [120, 90, 200, 230], stroked: true, getLineColor: [255, 255, 255], lineWidthUnits: 'pixels', getLineWidth: 2,
        onClick: function (i) { if (i.object) { C.showPopup(i.object.at, i.object.name + ' station', [['Network', TG.aqNetwork || 'Air-quality network'], ['Readings', 'not connected']], 'Approximate position; readings not connected yet'); } } }));
      if ($('tgLk') && $('tgLk').getAttribute('data-tab') !== 'retired') out.push(new deck.ScatterplotLayer({ id: 'tg-lakes', data: lakes(), pickable: true, onClick: function (i) { if (i.object) { C.showPopup(i.object.at, i.object.name, [['Type', 'Stream or reservoir'], ['Level', 'see the Streams and reservoir levels card']], 'Position approximate'); } }, radiusUnits: 'pixels', getPosition: function (l) { return l.at; }, getRadius: 7, getFillColor: [30, 140, 210, 230], stroked: true, getLineColor: [255, 255, 255], lineWidthUnits: 'pixels', getLineWidth: 2 }));
    }
    if (K.tabOpen('inc') && HYD) {
      var st = orrStats(), byName = {}; st.forEach(function (b) { byName[b.name] = b; });
      out.push(new deck.PathLayer({ id: 'tg-orr', data: orrEdges(), pickable: true, onClick: function (i) { if (i.object) { var b = byName[SECT[i.object.sec]]; C.showPopup(i.coordinate, ((TG.ring || {}).title || 'Ring road') + ' · ' + (SECT[i.object.sec] || ''), [['Speed vs free flow', b ? Math.round(b.ratio * 100) + '%' : '–'], ['Vehicles in sector', b ? num(Math.round(b.veh || 0)) : '–']], 'Simulated traffic'); } }, getPath: function (o) { return o.path; }, widthUnits: 'pixels', getWidth: 4,
        getColor: function (o) { var b = byName[SECT[o.sec]]; var r = b ? b.ratio : 1; return r < 0.35 ? [208, 59, 59, 200] : r < 0.6 ? [230, 130, 40, 200] : r < 0.8 ? [230, 190, 40, 200] : [40, 160, 100, 200]; },
        updateTriggers: { getColor: Math.floor(state.t / 300) } }));
    }
    return out;
  });

  C.onReady(function () {
    build(); render();
    C.onTab(function () { render(); C.redraw(); });
    C.onMinute(render);
  });
  T.local = { render: render, waterStatus: waterStatus, aqi: aqi };
})();
