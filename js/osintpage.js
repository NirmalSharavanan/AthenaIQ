/* AthenaIQ: the OSINT page.
 *
 * OSINT opens as a page of its own, like Analytics: a 3D map of the open-source feeds on top (Greece, world or the
 * open region), a symbol legend beside it, and the feed cards in a grid below. The cards are the ones built by
 * js/osint.js and js/livefeeds.js; this file lays them out as a page and gives the page its own map.
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, CFG = C.CFG, $ = C.$, num = C.num, K = T.kit;
  if (!T.osint || !T.osintMap) { return; }
  var M = CFG.osintMap || {}, isOpen = false, map = null, overlay = null, view = M.defaultView || 'region', popup = null, timer = 0;
  var orbiting = M.orbit !== false, handsOn = false, wheelUntil = 0, lastT = 0;
  var tabOpen = K.tabOpen; K.tabOpen = function (id) { return id === 'osint' ? isOpen : tabOpen(id); };   // the feed cards draw while the page is open

  function pop(lngLat, title, rows, note) {
    if (!map) { return; } if (popup) { popup.remove(); }
    var box = document.createElement('div'); box.className = 'pop';
    box.innerHTML = '<h3></h3><table>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</table>' + (note ? '<div class="muted">' + note + '</div>' : '');
    box.querySelector('h3').textContent = title;
    popup = new maplibregl.Popup({ closeButton: true, maxWidth: '300px', offset: 16 }).setLngLat(lngLat).setDOMContent(box).addTo(map);
  }
  function draw() { if (overlay && map) { overlay.setProps({ layers: T.osintMap.layersFor(map, { view: view, pop: pop }) }); } legend(); }
  function legend() {
    $('opLegend').innerHTML = T.osintMap.legend(view).map(function (r) {
      return '<div class="os-leg" role="button" tabindex="0" data-kind="' + r.kind + '" title="Show these on the map"><svg viewBox="0 0 24 24" width="22" height="22" fill="rgb(' + r.color.join(',') + ')" aria-hidden="true">' + r.pic + '</svg><span><strong>' + r.name + '</strong>' + (r.note ? '<em>' + r.note + '</em>' : '') + '</span><b>' + num(r.count) + '</b></div>';
    }).join('');
  }
  // The camera for each view. "region" is street level over the open region, where the 3D buildings show.
  function camFor(v, at) {
    var bb = (C.meta() || {}).bbox || [23.55, 37.85, 23.98, 38.12];
    return v === 'world' ? { center: at || [24, 38.5], zoom: at ? 4.2 : 1.7, pitch: at ? 35 : 0, bearing: 0 } : v === 'region' ? { center: (C.sites()[0] ? [C.sites()[0][1], C.sites()[0][2]] : [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2]), zoom: 14.6, pitch: 60, bearing: -20 } :
      { center: M.centre || [23.9, 38.3], zoom: M.zoom || 5.7, pitch: M.pitch || 52, bearing: M.bearing || -12 };
  }
  // Fly the OSINT map to every point of one kind (legend click). Global incidents open the world view.
  function showKind(kind) {
    if (!map) { return; }
    if (kind === 'event') { setView('world'); return; }
    if (kind === 'sat' && view === 'region') { setView('state'); }
    var pts = T.osintMap.points(kind, view === 'world' ? 'world' : 'state');
    if (!pts.length) { K.toast ? K.toast('No ' + kind + ' data on the map yet') : 0; return; }
    if (view === 'region') { view = 'state'; Array.prototype.forEach.call($('opViews').children, function (b) { var on = b.getAttribute('data-v') === 'state'; b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); }); }
    setOrbit(false);
    if (pts.length === 1) { map.flyTo({ center: pts[0], zoom: 9, pitch: 45, duration: 1200 }); }
    else {
      var w = Math.min.apply(null, pts.map(function (p) { return p[0]; })), e = Math.max.apply(null, pts.map(function (p) { return p[0]; })),
        s = Math.min.apply(null, pts.map(function (p) { return p[1]; })), n = Math.max.apply(null, pts.map(function (p) { return p[1]; }));
      map.fitBounds([[w, s], [e, n]], { padding: 60, maxZoom: 10, pitch: 40, duration: 1200 });
    }
    draw();
  }
  // While the page is open, list items in the feed cards show their point on this map, not on the hidden main map.
  function focusPoint(lng, lat, z) {
    if (!map) { return; }
    setOrbit(false);
    if (view === 'region' && Math.hypot(lng - map.getCenter().lng, lat - map.getCenter().lat) > 0.3) { view = 'state'; Array.prototype.forEach.call($('opViews').children, function (b) { var on = b.getAttribute('data-v') === 'state'; b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); }); draw(); }
    map.flyTo({ center: [lng, lat], zoom: Math.min(z || 10, 11), pitch: 50, duration: 1200 });
    $('opMap').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function setView(v, at) {
    view = v; var cam = camFor(v, at);
    if (map) { map.flyTo(Object.assign({ duration: 1500 }, cam)); }
    Array.prototype.forEach.call($('opViews').children, function (b) { var on = b.getAttribute('data-v') === v; b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
    draw();
  }
  function makeMap() {
    if (map) { return; }
    var light = document.body.classList.contains('map-light');
    map = new maplibregl.Map({ container: 'opMap', style: { version: 8, sources: {}, layers: [{ id: 'bg', type: 'background', paint: { 'background-color': light ? '#dfeae2' : '#0a101c' } }] },
      center: camFor(view).center, zoom: camFor(view).zoom, pitch: camFor(view).pitch, bearing: camFor(view).bearing, minZoom: 1, maxZoom: 18, maxPitch: 70, attributionControl: false, antialias: true });
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    overlay = new deck.MapboxOverlay({ interleaved: false, layers: [], pickingRadius: 8,
      // Every symbol can be clicked for its details; hovering shows its name and a pointer.
      onHover: function (info) {
        var t = info && info.object && info.layer ? T.osintMap.tip(info.object, info.layer.id) : null;
        map.getCanvasContainer().style.cursor = info && info.object ? 'pointer' : '';
        var el = $('opTip'); if (!el) { el = document.createElement('div'); el.id = 'opTip'; el.className = 'os-tip'; el.setAttribute('role', 'tooltip'); $('opMap').appendChild(el); }
        if (t) { el.textContent = t + ' · click for details'; el.style.left = (info.x + 14) + 'px'; el.style.top = (info.y + 12) + 'px'; el.hidden = false; } else { el.hidden = true; }
      } });
    map.addControl(overlay);
    // The vector base map, if it can be reached; otherwise the symbols are drawn on the plain background.
    var url = light ? CFG.map.styleUrlLight : CFG.map.styleUrl;
    if (url) { fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(function (st) { if (st && map) { map.setStyle(st, { diff: false }); } }).catch(function () { /* plain background */ }); }
    map.on('zoomend', draw); map.on('load', draw);
    // 3D buildings, floors and lighting, shared with the main map.
    if (T.map3d) { T.map3d.attach(map, function () { return overlay; }); }
    // Orbit pauses while the map is dragged or zoomed by hand, as on the main map.
    var cc = map.getCanvasContainer();
    ['mousedown', 'touchstart'].forEach(function (n) { cc.addEventListener(n, function () { handsOn = true; }, { passive: true }); });
    ['mouseup', 'touchend', 'touchcancel', 'mouseleave'].forEach(function (n) { window.addEventListener(n, function () { handsOn = false; }, { passive: true }); });
    cc.addEventListener('wheel', function () { wheelUntil = performance.now() + 1200; }, { passive: true });
  }
  // Slowly circle the camera while the page is open and Orbit is on.
  function spin(now) {
    if (!isOpen) { lastT = 0; return; }
    var dt = lastT ? Math.min(0.1, (now - lastT) / 1000) : 0; lastT = now;
    if (orbiting && map && !map.isEasing() && !handsOn && now > wheelUntil && !(popup && popup.isOpen())) { map.setBearing(map.getBearing() + (M.orbitDegPerSec || 4) * dt); }
    requestAnimationFrame(spin);
  }
  function setOrbit(on) {
    orbiting = on; var b = $('opOrbit'); if (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.classList.toggle('active', on); }
    if (on && map && map.getPitch() < 30) { map.easeTo({ pitch: 55, duration: 600 }); }
  }
  function open() {
    if (isOpen) { return; }
    if (T.analytics && !$('analytics').hidden) { T.analytics.close(); }
    isOpen = true; $('osintPage').hidden = false; document.body.classList.add('os-open'); $('osintBtn').classList.add('active'); $('osintBtn').setAttribute('aria-pressed', 'true');
    makeMap(); setTimeout(function () { map.resize(); setView(view); }, 60);
    T.osint.render(); if (T.live && T.live.render) { T.live.render(); }
    timer = setInterval(function () { draw(); }, 2000);            // satellites move; data refreshes arrive
    setOrbit(orbiting); lastT = 0; requestAnimationFrame(spin);
    if (T.audit) { T.audit('Opened the OSINT page'); }
  }
  function close() {
    if (!isOpen) { return; }
    isOpen = false; $('osintPage').hidden = true; document.body.classList.remove('os-open'); $('osintBtn').classList.remove('active'); $('osintBtn').setAttribute('aria-pressed', 'false');
    clearInterval(timer); if (popup) { popup.remove(); }
  }
  C.onReady(function () {
    // The feed cards move from the side panel into the page grid.
    var grid = $('opGrid');
    Array.prototype.forEach.call(document.querySelectorAll('.panel section[data-tab="osint"]'), function (sec) { sec.removeAttribute('data-tab'); sec.hidden = false; grid.appendChild(sec); });
    var src = $('osSources'); if (src) { grid.appendChild(src); }
    if (T.map3d) { var m3 = $('opM3'); m3.innerHTML = T.map3d.controls(); T.map3d.wire(m3); T.map3d.sync(); }
    $('osintBtn').addEventListener('click', function () { if (isOpen) { close(); } else { open(); } });
    $('opClose').addEventListener('click', close);
    $('opOrbit').addEventListener('click', function () { setOrbit(!orbiting); });
    $('opViews').addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (b) { setView(b.getAttribute('data-v')); } });
    var legendGo = function (e) { var r = e.target.closest('[data-kind]'); if (r && (e.type === 'click' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); showKind(r.getAttribute('data-kind')); } };
    $('opLegend').addEventListener('click', legendGo); $('opLegend').addEventListener('keydown', legendGo);
    // Card list clicks call the core flyTo and showPopup; while this page is open they act on its map instead.
    var coreFly = C.flyTo, corePop = C.showPopup;
    C.flyTo = function (lng, lat, z) { if (isOpen) { focusPoint(lng, lat, z); } else { coreFly.apply(C, arguments); } };
    C.showPopup = function (lngLat, title, rows, note) { if (isOpen) { pop(lngLat, title, rows, note); } else { corePop.apply(C, arguments); } };
    $('analyticsBtn').addEventListener('click', close);
    document.getElementById('tabs').addEventListener('click', function (e) { if (e.target.closest('[data-tab]')) { close(); } });
    document.addEventListener('change', function (e) { if (isOpen && e.target && e.target.type === 'checkbox') { setTimeout(draw, 50); } });
  });
  T.osintPage = { showKind: function (k) { showKind(k); }, focus: focusPoint, map: function () { return map; }, open: open, close: close, isOpen: function () { return isOpen; }, world: function (at) { open(); setView('world', at); $('opMap').scrollIntoView({ block: 'start' }); } };
})();
