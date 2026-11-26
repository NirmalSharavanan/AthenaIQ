/* AthenaIQ Municipality: clearer map interaction and more 3D models.
 *
 *   Focus mode        while Municipality is open, only municipal layers show (others come back when you leave)
 *   Pick list         when several objects sit under the pointer, the pop-up lists them so you choose the right one
 *   Pop-up actions    Create work order · Open card · Zoom here, on every municipal object
 *   Work orders       one list of jobs raised from the map, moving from New to Done, shown on the map as cones
 *   Legend            a key for the municipal symbols, changing with what is on the map
 *   Data badges       "Synthetic", "Estimated" or "Live + synthetic" chips replace the long notices (tap to read)
 *   One module open   opening a module folds the others
 *   3D models         police cars with light bars, tower cranes, market stalls, dumping piles, beach umbrellas,
 *                     work-order cones, lamp arms
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, $ = C.$, num = C.num, clock = C.clock, state = T.state, K = T.kit, esc = K.esc;
  var meta = C.meta() || {}, bb = meta.bbox || [23.55, 37.85, 23.98, 38.12], kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180), ky = 110570;

  function muniOpen() { return K.tabOpen('muni'); }
  function zoom() { var mp = T.getMap(); return mp ? mp.getZoom() : 12; }
  function on3d() { return T.muni3d && T.muni3d.on(); }
  function box(id) { var b = $(id); return !b || b.checked; }

  /* ============================== focus mode ============================== */
  var MUNI = /^(gr-(bins|fleet|lamps|dma|dma-pt|route|gauge|rep)|mo-|mx-|mp-|m3-|mu-|env-sensors|tg-aq|os-wx|roads|asphalt|buildings|cycle)/;
  var REPLACED_3D = /^(mx-units|mo-dump|mx-beach|mo-sites)$/;   // drawn as 3D models at street zoom instead
  C.layerFilter = function (l) {
    if (!muniOpen()) { return true; }
    if (on3d() && REPLACED_3D.test(l.id)) { return false; }
    if (!box('muFocus')) { return true; }
    return MUNI.test(l.id);
  };

  /* ============================== work orders ============================== */
  var WO = [], woSeq = 100;
  var CREW = { 'gr-bins': 'Waste crew', 'm3-bins': 'Waste crew', 'mo-dump': 'Cleaning crew', 'mu-dump3d': 'Cleaning crew', 'gr-lamps': 'Lighting crew', 'm3-poles': 'Lighting crew', 'm3-lamp-heads': 'Lighting crew', 'gr-dma-pt': 'Water crew', 'm3-dma-pt': 'Water crew', 'gr-gauge': 'Civil protection',
    'mo-pot': 'Road crew', 'mo-str': 'Structural engineers', 'mx-trees': 'Parks crew', 'mx-trees3d': 'Parks crew', 'mx-parks': 'Parks crew', 'mx-space': 'Municipal police', 'mx-tasks': 'Municipal police', 'mo-perm': 'Building inspectors', 'mo-unauth': 'Building inspectors', 'gr-rep': 'Duty office', 'mo-wq': 'Water quality lab', 'tg-aq': 'Environment team', 'env-sensors': 'Environment team', 'm3-aq': 'Environment team' };
  var CARD = { 'gr-bins': 'grWs', 'm3-bins': 'grWs', 'gr-fleet': 'grFl', 'mp-routes': 'grFl', 'mo-dump': 'mwDump', 'mu-dump3d': 'mwDump', 'gr-lamps': 'grLt', 'm3-poles': 'grLt', 'gr-dma-pt': 'grLk', 'm3-dma-pt': 'grLk', 'gr-gauge': 'grRg', 'mo-pot': 'inPot', 'mo-str': 'inPot', 'mo-sites': 'upTwin', 'mu-crane': 'upTwin',
    'mx-trees': 'gnTree', 'mx-trees3d': 'gnTree', 'mx-parks': 'gnTree', 'mx-units': 'mpPol', 'mu-police': 'mpPol', 'mx-tasks': 'mpPol', 'mx-space': 'psSpace', 'mx-market': 'psSpace', 'mu-stalls': 'psSpace', 'mx-beach': 'coBeach', 'mu-umbrella': 'coBeach', 'mo-perm': 'ipPermit', 'mo-unauth': 'ipPermit', 'gr-rep': 'grRp',
    'mo-wq': 'evWater', 'tg-aq': 'tgAq', 'env-sensors': 'envSens', 'm3-aq': 'envSens', 'mx-scen': 'spScen', 'mu-wo': 'woCard' };
  function baseId(id) { return id.replace(/-d$/, '').replace(/^m3-fleet-.*/, 'gr-fleet').replace(/^m3-bin-.*/, 'm3-bins'); }
  function addWO(layerId, title, at) {
    var o = { id: 'WO-' + (++woSeq), title: title, crew: CREW[baseId(layerId)] || 'Duty office', at: at, t0: state.t, wall: Date.now() };
    WO.unshift(o); renderWO(); C.redraw();
    if (T.audit) { T.audit('Work order ' + o.id + ': ' + title); }
    return o;
  }
  function woState(o) { var mins = (state.t - o.t0) / 60 + (Date.now() - o.wall) / 60000 * 0; return mins < 5 ? 'New' : mins < 20 ? 'Assigned' : mins < 60 ? 'In progress' : 'Done'; }
  function renderWO() {
    var ol = $('woList'); if (!ol) { return; }
    set('woN', num(WO.length)); set('woOpen', num(WO.filter(function (o) { return woState(o) !== 'Done'; }).length)); set('woDone', num(WO.filter(function (o) { return woState(o) === 'Done'; }).length));
    ol.innerHTML = '';
    if (!WO.length) { ol.innerHTML = '<li class="muted">No work orders yet. Click an object on the map and choose <strong>Create work order</strong>.</li>'; return; }
    WO.slice(0, 12).forEach(function (o) { var s = woState(o); ol.appendChild(C.listButton(s === 'New' ? 'heavy' : s === 'Done' ? 'free' : 'moderate', o.id + ' · ' + o.title, o.crew + ' · raised ' + clock(o.t0), s, function () { C.flyTo(o.at[0], o.at[1], 16); setTimeout(function () { woPopup(o); }, 1050); })); });
  }
  function set(id, html) { var el = $(id); if (el) { el.innerHTML = html; } }
  function woPopup(o) { C.showPopup(o.at, o.id + ' · work order', [['Job', esc(o.title)], ['Crew', o.crew], ['Status', woState(o)], ['Raised', clock(o.t0)]], 'Created from the map'); }

  /* ============================== pop-up actions and pick list ============================== */
  var lastPick = null;
  function actionsFor(info) {
    var pop = document.querySelector('.maplibregl-popup .pop'); if (!pop || !info || !info.layer || pop.querySelector('.mu-acts')) { return; }
    var lid = baseId(info.layer.id), obj = info.object, at = (obj && (obj.at || (obj.s && [obj.s.lon, obj.s.lat]))) || info.coordinate, title = (pop.querySelector('h3') || {}).textContent || 'Object';
    if (!MUNI.test(info.layer.id) && !/^mu-/.test(info.layer.id)) { return; }
    var bar = document.createElement('div'); bar.className = 'mu-acts';
    if (CREW[lid]) { bar.appendChild(btn('Create work order', function () { var o = addWO(lid, title, at); this.textContent = o.id + ' created'; this.disabled = true; })); }
    if (CARD[lid] && $(CARD[lid])) { bar.appendChild(btn('Open card', function () { openCard(CARD[lid]); })); }
    bar.appendChild(btn('Zoom here', function () { var mp = T.getMap(); if (mp) { mp.easeTo({ center: at, zoom: Math.max(mp.getZoom(), 16), duration: 700 }); } }));
    pop.appendChild(bar);
  }
  function btn(label, fn) { var b = document.createElement('button'); b.type = 'button'; b.className = 'btn small'; b.textContent = label; b.addEventListener('click', fn); return b; }
  function openCard(id) {
    var s = $(id); if (!s) { return; }
    var mod = s.getAttribute('data-mu'), h = mod && $('mu-' + mod), hb = h && h.querySelector('.mu-mod-h');
    if (hb && hb.getAttribute('aria-expanded') !== 'true') { hb.click(); }
    C.showTab('muni');
    setTimeout(function () { var box0 = s.parentElement; while (box0 && box0.scrollHeight <= box0.clientHeight + 2) { box0 = box0.parentElement; } if (box0) { box0.scrollTop += s.getBoundingClientRect().top - box0.getBoundingClientRect().top - 8; } s.classList.add('mu-flash'); setTimeout(function () { s.classList.remove('mu-flash'); }, 1600); }, 80);
  }
  function onDeckClick(info) {
    if (!muniOpen() || !info || info.x == null) { return; }
    var ov = T.getOverlay(), hits = [];
    try { hits = ov.pickMultipleObjects({ x: info.x, y: info.y, radius: 8, depth: 8 }) || []; } catch (e) { hits = []; }
    var seen = {}, list = [];
    hits.forEach(function (h) { if (!h.layer || !h.layer.props.onClick || !h.object || h.layer.id === 'roads') { return; } var k = baseId(h.layer.id) + ':' + (h.index); if (seen[k]) { return; } seen[k] = 1; list.push(h); });
    if (list.length > 1) { chooser(list, info); return; }
    setTimeout(function () { actionsFor(list[0] || info); }, 0);
  }
  function labelOf(h) {
    var o = h.object || {}, n = o.id || o.name || (o.v && o.v.id) || (o.s && o.s.name) || (o.u && o.u.id) || (o.t && 'Truck ' + o.t.n) || '';
    var KIND = { 'gr-bins': 'Bin', 'm3-bins': 'Bin', 'gr-fleet': 'Vehicle', 'gr-lamps': 'Street light', 'm3-poles': 'Street light', 'mx-trees': 'Tree', 'mx-trees3d': 'Tree', 'mx-units': 'Police unit', 'mu-police': 'Police unit', 'mx-tasks': 'Police task', 'mo-dump': 'Dumping', 'mu-dump3d': 'Dumping', 'mo-pot': 'Pothole', 'mo-str': 'Structure', 'mo-perm': 'Permit', 'mo-unauth': 'Unauthorised building', 'mx-space': 'Public-space permit', 'gr-rep': 'Citizen report', 'gr-dma-pt': 'Water area', 'm3-dma-pt': 'Water area', 'gr-gauge': 'River gauge', 'tg-aq': 'Air station', 'env-sensors': 'Environment sensor', 'm3-aq': 'Air sensor', 'mo-wq': 'Water quality', 'mx-parks': 'Park', 'mx-beach': 'Beach', 'mu-umbrella': 'Beach', 'mo-sites': 'Construction site', 'mu-crane': 'Construction site', 'mu-wo': 'Work order', 'mx-market': 'Street market', 'mu-stalls': 'Street market', 'mp-routes': 'Collection route' };
    return (KIND[baseId(h.layer.id)] || h.layer.id) + (n ? ' · ' + n : '');
  }
  function chooser(list, info) {
    var at = info.coordinate;
    setTimeout(function () {
      var rows = list.slice(0, 8).map(function (h) { return [labelOf(h), '']; });
      C.showPopup(at, list.length + ' objects here', rows, 'Choose one');
      var pop = document.querySelector('.maplibregl-popup .pop'); if (!pop) { return; }
      var tb = pop.querySelector('table'); if (tb) { tb.remove(); }
      var ul = document.createElement('div'); ul.className = 'mu-pick';
      list.slice(0, 8).forEach(function (h) { ul.appendChild(btn(labelOf(h), function () { h.layer.props.onClick({ object: h.object, index: h.index, coordinate: h.coordinate || at, layer: h.layer, x: info.x, y: info.y }); setTimeout(function () { actionsFor(h); }, 0); })); });
      pop.insertBefore(ul, pop.querySelector('.muted') || null);
    }, 0);
  }

  /* ============================== 3D models ============================== */
  function hexa(g, x0, x1, y0, y1, z0, z1) {
    var c = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
    [[0, 3, 2, 1], [4, 5, 6, 7], [1, 2, 6, 5], [0, 4, 7, 3], [0, 1, 5, 4], [3, 7, 6, 2]].forEach(function (f) { var a = c[f[0]], b = c[f[1]], d = c[f[2]], e = c[f[3]], ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2], nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1; [a, b, d, a, d, e].forEach(function (p) { g.pos.push(p[0], p[1], p[2]); g.nor.push(nx / l, ny / l, nz / l); }); });
  }
  function cone(g, r, h, n) { for (var i = 0; i < n; i++) { var a0 = i / n * 6.283, a1 = (i + 1) / n * 6.283, p0 = [Math.cos(a0) * r, Math.sin(a0) * r, 0], p1 = [Math.cos(a1) * r, Math.sin(a1) * r, 0], tip = [0, 0, h], am = (a0 + a1) / 2; [p0, p1, tip].forEach(function (p) { g.pos.push(p[0], p[1], p[2]); g.nor.push(Math.cos(am), Math.sin(am), r / h); }); } }
  function mesh(fn) { var g = { pos: [], nor: [] }; fn(g); return { positions: { value: new Float32Array(g.pos), size: 3 }, normals: { value: new Float32Array(g.nor), size: 3 }, texCoords: { value: new Float32Array(g.pos.length / 3 * 2), size: 2 } }; }
  var POLICE = mesh(function (g) { hexa(g, -2.3, 2.3, -0.9, 0.9, 0.35, 1.0); hexa(g, -1.2, 1.0, -0.82, 0.82, 1.0, 1.45); });
  var POLICE_BAR = mesh(function (g) { hexa(g, -0.25, 0.25, -0.6, 0.6, 1.45, 1.6); });
  var CRANE = mesh(function (g) { hexa(g, -0.9, 0.9, -0.9, 0.9, 0, 32); hexa(g, -9, 22, -0.6, 0.6, 32, 33.6); hexa(g, -9, -5, -1.5, 1.5, 30, 32); hexa(g, -1.2, 1.2, -1.2, 1.2, 33.6, 36); });
  var STALL = mesh(function (g) { hexa(g, -1.4, 1.4, -1.0, 1.0, 0, 0.9); hexa(g, -1.6, 1.6, -1.2, 1.2, 2.1, 2.3); hexa(g, -1.5, -1.4, -1.1, -1.0, 0, 2.1); hexa(g, 1.4, 1.5, 1.0, 1.1, 0, 2.1); });
  var PILE = mesh(function (g) { hexa(g, -1.2, 0.6, -0.8, 0.7, 0, 0.8); hexa(g, -0.2, 1.3, -0.6, 0.9, 0, 0.55); hexa(g, -0.7, 0.4, -0.3, 0.6, 0.8, 1.3); });
  var UMBRELLA = mesh(function (g) { hexa(g, -0.04, 0.04, -0.04, 0.04, 0, 2.2); cone(g, 1.6, 0.6, 8); });
  var WCONE = mesh(function (g) { hexa(g, -0.35, 0.35, -0.35, 0.35, 0, 0.06); cone(g, 0.25, 0.75, 10); });
  function sc() { var z = zoom(); return z >= 17.5 ? 1.6 : z >= 16.5 ? 2.4 : z >= 15.5 ? 3.4 : 4.6; }
  function inView(at) { var mp = T.getMap(); if (!mp) { return true; } var b = mp.getBounds(); return at[0] > b.getWest() - 0.004 && at[0] < b.getEast() + 0.004 && at[1] > b.getSouth() - 0.004 && at[1] < b.getNorth() + 0.004; }
  function meshLayer(id, data, m, color, s, pop, extra) {
    return new deck.SimpleMeshLayer(Object.assign({ id: id, data: data, mesh: m, pickable: !!pop, sizeScale: s, getPosition: function (d) { return d.at; }, getColor: color, getOrientation: function (d) { return [0, d.yaw || 0, 0]; },
      onClick: function (i) { if (i.object && pop) { var p = pop(i.object); C.showPopup(i.object.at, p[0], p[1], p[2]); } } }, extra || {}));
  }

  C.addLayers(function () {
    var out = [], open = muniOpen() || ($('showMuniAll') && $('showMuniAll').checked);
    if (!open) { return out; }
    // work-order cones (any zoom; flat markers when zoomed out)
    var W = WO.filter(function (o) { return woState(o) !== 'Done'; });
    if (W.length) {
      if (on3d()) { out.push(meshLayer('mu-wo', W, WCONE, [250, 120, 20], sc() * 1.3, function (o) { return [o.id + ' · work order', [['Job', esc(o.title)], ['Crew', o.crew], ['Status', woState(o)]], 'Created from the map']; })); }
      else { out.push(new deck.ScatterplotLayer({ id: 'mu-wo', data: W, pickable: true, radiusUnits: 'pixels', getRadius: 8, getPosition: function (o) { return o.at; }, getFillColor: [250, 120, 20], stroked: true, getLineColor: [255, 255, 255], lineWidthUnits: 'pixels', getLineWidth: 2, onClick: function (i) { if (i.object) { woPopup(i.object); } } })); }
    }
    if (!on3d()) { return out; }
    var s = sc(), blink = Math.floor(performance.now() / 350) % 2;
    var MP = T.muniplus, G = T.greece, MO = T.muniops;
    if (MP && box('poShow')) {
      var U = MP.units().map(function (u) { var d = ((state.t / 3600 * 14000) + u.off * u.len) % u.len, i = 1; while (i < u.cum.length - 1 && u.cum[i] < d) { i++; } var a = u.path[i - 1], z = u.path[i], f = (d - u.cum[i - 1]) / Math.max(1, u.cum[i] - u.cum[i - 1]); return { u: u, at: [a[0] + (z[0] - a[0]) * f, a[1] + (z[1] - a[1]) * f], yaw: Math.atan2((z[1] - a[1]) * ky, (z[0] - a[0]) * kx) * 180 / Math.PI, id: u.id }; }).filter(function (x) { return inView(x.at); });
      var pop = function (x) { return [x.u.id + ' · ' + x.u.kind, [['Status', 'On patrol'], ['Speed', 'about 14 km/h']], 'Synthetic unit on the real road network']; };
      out.push(meshLayer('mu-police', U, POLICE, [245, 247, 250], s, pop, { updateTriggers: { getPosition: state.t, getOrientation: state.t } }));
      out.push(meshLayer('mu-police-d', U, POLICE_BAR, blink ? [30, 90, 255] : [230, 40, 40], s, pop, { updateTriggers: { getPosition: state.t, getOrientation: state.t, getColor: blink } }));
    }
    if (MO && box('upShow') && MO.sites) {
      out.push(meshLayer('mu-crane', MO.sites().filter(function (x) { return inView(x.at); }).map(function (x, k) { return { at: x.at, yaw: k * 47, s: x }; }), CRANE, function (d) { return d.s.permit ? [240, 175, 30] : [220, 60, 50]; }, Math.min(1.3, s / 2.4), function (d) { var x = d.s; return [x.name, [['Progress', Math.round(x.prog * 100) + '%'], ['Height', x.storeys + ' storeys'], ['Permit', x.permit ? 'Valid' : 'Not found: inspect'], ['Noise', Math.round(x.noise) + ' dB']], 'Synthetic construction monitoring']; }));
    }
    if (MO && box('mwShow') && MO.dumping) {
      out.push(meshLayer('mu-dump3d', MO.dumping().filter(function (d) { return d.st !== 'Cleared' && inView(d.at); }), PILE, [125, 92, 60], s, function (d) { return [d.id + ' · illegal dumping', [['What', d.what], ['Seen by', d.src], ['Status', d.st]], 'Synthetic detection']; }));
    }
    if (MP && box('psShow') && MP.markets) {
      var E = C.edges(), stalls = [];
      MP.markets().forEach(function (mk) { mk.edges.forEach(function (i) { var p = E[i].path; for (var j = 0; j + 1 < p.length; j++) { var a = p[j], z = p[j + 1], len = Math.hypot((z[0] - a[0]) * kx, (z[1] - a[1]) * ky), yaw = Math.atan2((z[1] - a[1]) * ky, (z[0] - a[0]) * kx) * 180 / Math.PI; for (var d = 0; d < len && stalls.length < 400; d += 4) { var f = d / len; stalls.push({ at: [a[0] + (z[0] - a[0]) * f, a[1] + (z[1] - a[1]) * f], yaw: yaw, mk: mk, c: stalls.length % 3 }); } } }); });
      var ph = MP.phase ? MP.phase() : 'Open';
      if (ph === 'Open' || ph === 'Setting up') { out.push(meshLayer('mu-stalls', stalls.filter(function (x) { return inView(x.at); }), STALL, function (x) { return [[200, 60, 60], [40, 120, 200], [240, 240, 240]][x.c]; }, Math.min(1.4, s / 2.4), function (x) { return [x.mk.name, [['Stalls', x.mk.stalls], ['Now', ph]], 'Example market on a real street']; })); }
    }
    if (MP && box('coShow') && MP.beaches) {
      var um = []; MP.beaches().forEach(function (b) { var n = b.season ? 30 : 6; for (var k = 0; k < n; k++) { um.push({ at: [b.at[0] + ((k % 6) - 2.5) * 9 / kx, b.at[1] + (Math.floor(k / 6) - 2) * 9 / ky], b: b, c: k % 2 }); } });
      out.push(meshLayer('mu-umbrella', um.filter(function (x) { return inView(x.at); }), UMBRELLA, function (x) { return x.c ? [240, 120, 40] : [40, 140, 220]; }, Math.min(1.4, s / 2.4), function (x) { var b = x.b; return [b.name + ' beach', [['People now', num(b.crowd)], ['Lifeguards', b.guards || 'Off season'], ['Bathing water', b.water]], 'Synthetic counts']; }));
    }
    return out;
  });

  /* ============================== legend ============================== */
  var LEG = [
    ['showBins', 'Smart bins', [['#28aa64', 'under 50%'], ['#f0c328', '50–75%'], ['#ec8328', '75–95%'], ['#d03b3b', 'over 95%']]],
    ['showFleet', 'Municipal vehicles', [['#2878c8', 'refuse truck'], ['#28a064', 'recycling'], ['#966ec8', 'sweeper'], ['#e6be28', 'lighting crew'], ['#1ea0d2', 'water crew']]],
    ['showLamps', 'Street lights', [['#ffe282', 'on'], ['#c8aa64', 'dimmed'], ['#d03b3b', 'fault']]],
    ['gnShow', 'Trees and parks', [['#2e803c', 'good'], ['#5a9646', 'fair'], ['#a0a03c', 'poor'], ['#966e3c', 'remove']]],
    ['poShow', 'Municipal police', [['#1e3c96', 'unit'], ['#ec8328', 'new task'], ['#f0c328', 'task in hand']]],
    ['mwShow', 'Dumping and potholes', [['#7d5c3c', 'dumping'], ['#ec8328', 'deep pothole']]],
    ['ipShow', 'Permits', [['#2878c8', 'in progress'], ['#28aa64', 'approved'], ['#d03b3b', 'unauthorised']]],
    [null, 'Work orders', [['#fa7814', 'open job']]]
  ];
  function legend() {
    var el = $('muLegend'); if (!el) { return; }
    var show = muniOpen() && box('muLegendOn');
    el.hidden = !show; if (!show) { return; }
    var pn = document.querySelector('.panel'), host = el.parentElement, hr = host.getBoundingClientRect(), pr = pn && !pn.hidden ? pn.getBoundingClientRect() : null;   // sit beside the side panel, not under it
    el.style.left = (pr && pr.width && pr.right > hr.left && window.innerWidth > 720 ? Math.round(pr.right - hr.left + 12) : 12) + 'px';
    el.querySelector('.mu-leg-body').innerHTML = LEG.filter(function (g) { return !g[0] || ($(g[0]) && $(g[0]).checked); }).map(function (g) {
      return '<div class="mu-leg-g"><strong>' + g[1] + '</strong>' + g[2].map(function (x) { return '<span><i style="background:' + x[0] + '"></i>' + x[1] + '</span>'; }).join('') + '</div>';
    }).join('') + '<p class="muted small">' + (zoom() >= 15 ? (on3d() ? '3D models at this zoom.' : 'All objects shown.') : 'Zoomed out: only items that need action. Zoom in for all.') + '</p>';
  }

  /* ============================== card tidy-up ============================== */
  function badges() {
    Array.prototype.forEach.call(document.querySelectorAll('.panel section[data-tab="muni"] > p.notice'), function (n) {
      var sec = n.parentElement, head = sec.querySelector('.card-head'); if (!head || head.querySelector('.mu-badge')) { return; }
      var t = n.textContent.trim(), kind = /^Synthetic/i.test(t) ? 'Synthetic' : /^Estimate/i.test(t) ? 'Estimated' : /real|live|published/i.test(t) && /synthetic/i.test(t) ? 'Live + synthetic' : /real|live|published/i.test(t) ? 'Live data' : 'About the data';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'mu-badge mu-b-' + kind.toLowerCase().replace(/[^a-z]+/g, '-'); b.textContent = kind + ' ⓘ'; b.title = t;
      b.addEventListener('click', function () { n.hidden = !n.hidden; });
      n.hidden = true; n.classList.add('mu-note'); head.appendChild(b);
    });
  }
  function accordion() {
    var hs = Array.prototype.slice.call(document.querySelectorAll('.mu-mod-h'));
    hs.forEach(function (h, i) {
      if (i > 0 && h.getAttribute('aria-expanded') === 'true') { h.click(); }
      h.addEventListener('click', function () { if (h.getAttribute('aria-expanded') === 'true' && box('muOneOpen')) { hs.forEach(function (o) { if (o !== h && o.getAttribute('aria-expanded') === 'true') { o.click(); } }); } });
    });
  }

  C.onReady(function () {
    meta = C.meta() || meta; bb = meta.bbox || bb; kx = 111320 * Math.cos((bb[1] + bb[3]) / 2 * Math.PI / 180);
    // work orders card, under the summary
    var now = $('muNow');
    if (now) {
      var opts = document.createElement('div'); opts.className = 'mu-opts';
      opts.innerHTML = '<label class="check"><input id="muFocus" type="checkbox" checked><span>Focus: show only municipal layers while this menu is open</span></label>' +
        '<label class="check"><input id="muOneOpen" type="checkbox" checked><span>Open one module at a time</span></label>' +
        '<label class="check"><input id="muLegendOn" type="checkbox"' + (window.innerWidth > 720 ? ' checked' : '') + '><span>Show the map key</span></label>';
      now.appendChild(opts);
      var wo = document.createElement('section'); wo.className = 'card'; wo.id = 'woCard'; wo.setAttribute('data-tab', 'muni'); wo.hidden = true;
      wo.innerHTML = '<div class="card-head"><h2>Work orders</h2><span class="muted">Raised from the map</span></div><div class="kpis"><div class="kpi"><span class="k-label">Raised</span><span class="k-value" id="woN">0</span></div><div class="kpi"><span class="k-label">Open</span><span class="k-value" id="woOpen">0</span></div><div class="kpi"><span class="k-label">Done</span><span class="k-value" id="woDone">0</span></div></div><ol class="corridors" id="woList"></ol>';
      now.parentNode.insertBefore(wo, now.nextSibling);
      ['muFocus', 'muLegendOn'].forEach(function (id) { $(id).addEventListener('change', function () { legend(); C.redraw(); }); });
    }
    var lg = document.createElement('div'); lg.id = 'muLegend'; lg.className = 'mu-legend'; lg.hidden = true;
    lg.innerHTML = '<div class="mu-leg-h"><strong>Municipality key</strong><button type="button" class="mu-leg-x" aria-label="Hide the key">×</button></div><div class="mu-leg-body"></div>';
    var mapEl = $('map'); (mapEl && mapEl.parentElement || document.body).appendChild(lg);
    lg.querySelector('.mu-leg-x').addEventListener('click', function () { var c = $('muLegendOn'); if (c) { c.checked = false; } legend(); });
    badges(); accordion(); renderWO();
    var ov = T.getOverlay(); if (ov) { ov.setProps({ onClick: onDeckClick }); }
    var mp = T.getMap(); if (mp) { mp.on('zoomend', legend); } window.addEventListener('resize', legend);
    Array.prototype.forEach.call(document.querySelectorAll('.panel section[data-tab="muni"] input[type=checkbox]'), function (b) { b.addEventListener('change', legend); });
    C.onTab(function () { legend(); renderWO(); C.redraw(); });
    C.onMinute(function () { renderWO(); legend(); });
  });
  T.muniux = { workOrders: function () { return WO; }, addWO: addWO, openCard: openCard };
})();
