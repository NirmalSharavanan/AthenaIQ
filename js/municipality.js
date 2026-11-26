/* AthenaIQ: the Municipality menu (next to Dashboard), organised as ten smart-city modules.
 *
 * Each module has a header (key use cases and expected benefit) that folds its cards away, and a tile in
 * "Municipality now" that jumps to it. The old Environment menu is folded in; code that asks whether 'env'
 * is open is answered for 'muni'.
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, $ = C.$;
  // [id, name, key use cases, expected benefit, card ids, [summary label, element id holding the figure]]
  var MODULES = [
    ['waste', 'Intelligent waste management', 'Smart bins, fill-level monitoring, collection route optimisation, fleet tracking, illegal dumping detection', 'Lower operating costs and better sanitation', ['grWs', 'grFl', 'rcRec', 'mwDump'], ['Bins over 75% full', 'grWsFull']],
    ['plan', 'Urban planning and digital twin', '3D city, GIS integration, land use, infrastructure mapping, construction monitoring', 'Data-driven urban planning', ['upTwin', 'spScen'], ['Construction sites', 'upSites']],
    ['safety', 'Public safety and early warning', 'Flood detection, environmental monitoring, emergency alerts, fire detection, incident management', 'Proactive emergency response', ['ewWarn', 'grRg'], ['Alerts now', 'ewOn']],
    ['infra', 'Smart infrastructure and lighting', 'Adaptive street lighting, energy monitoring, pothole detection, structural health, predictive maintenance', 'Energy savings and lower maintenance costs', ['grLt', 'inPot'], ['Street-light faults', 'grLtFault']],
    ['permit', 'Intelligent inspections and permitting', 'AI-assisted inspections, building permits, unauthorised construction detection, digital field inspections', 'Better regulatory compliance', ['ipPermit', 'psSpace'], ['Permits in progress', 'ipRev']],
    ['mob', 'Intelligent mobility and parking', 'Traffic optimisation, smart parking, congestion monitoring, adaptive signals, parking violations', 'Better mobility and less congestion', ['mbMob'], ['Congested roads', 'mbJam']],
    ['env', 'Environmental intelligence', 'Weather, air quality, noise, water quality, temperature and carbon emissions', 'Environmental sustainability', ['wxCard', 'gnTree', 'envAir', 'envSens', 'tgAq', 'ccEm', 'evWater'], ['Weather', 'wxNow']],
    ['util', 'Smart utilities management', 'Water leakage detection, smart metering, electricity use, utility asset monitoring, water supply', 'Resource optimisation', ['grLk', 'utMeter', 'grDr'], ['Likely water leaks', 'grLkBad']],
    ['cit', 'Citizen engagement and services', 'Citizen reporting, complaint management, service requests, SLA monitoring', 'Higher citizen satisfaction', ['grRp'], ['Requests open', 'csOpen']],
    ['police', 'Municipal police', 'Patrols, parking and pavement enforcement, noise, street trading, public-space checks', 'Faster response and fairer enforcement', ['mpPol'], ['Tasks open', 'poOpen']],
    ['coast', 'Beaches and coast', 'Crowding, lifeguards, bathing water, accessible ramps, lost children', 'Safer, cleaner beaches', ['coBeach'], ['People on the beach', 'coPeople']],
    ['asset', 'Municipal asset management', 'Asset inventory, GIS-based tracking, maintenance scheduling, lifecycle management', 'Better operational efficiency', ['amAsset'], ['Service due this week', 'amDue']]
  ];
  var TITLE_ID = { 'Air and noise now': 'envAir', 'Sensors, worst air first': 'envSens' };

  var muEntered = false;
  function txt(id) { var el = $(id); return el ? el.textContent.trim() || '–' : '–'; }
  function scrollTo(el) { var box = el && el.parentElement; while (box && box.scrollHeight <= box.clientHeight + 2) { box = box.parentElement; } if (el && box) { box.scrollTop += el.getBoundingClientRect().top - box.getBoundingClientRect().top - 8; } }
  function section(id, cls, html) { var s = document.createElement('section'); s.className = cls; s.id = id; s.setAttribute('data-tab', 'muni'); s.hidden = true; s.innerHTML = html; return s; }
  function summary() {
    return section('muNow', 'card', '<div class="card-head"><h2>Municipality now</h2><span class="muted">' + MODULES.length + ' modules · tap one to open it</span></div><div class="mu-tiles">' +
      MODULES.map(function (md) { return '<button type="button" class="mu-tile" data-go="mu-' + md[0] + '"><span class="mu-t-name">' + md[1] + '</span><span class="mu-t-k">' + md[5][0] + '</span><span class="mu-t-v" data-src="' + md[5][1] + '">–</span></button>'; }).join('') +
      '</div><label class="check"><input id="showMuniAll" type="checkbox"><span>Keep municipal layers on the map in every menu</span></label>');
  }
  function header(md) {
    return section('mu-' + md[0], 'mu-mod', '<button type="button" class="mu-mod-h" aria-expanded="true"><span class="mu-mod-n">' + md[1] + '</span><span class="mu-mod-c">' + (function (n) { return n + (n === 1 ? ' card' : ' cards'); })(md[4].filter(function (id) { return $(id); }).length) + '</span></button>' +
      '<p class="mu-mod-u">' + md[2] + '</p><p class="mu-mod-b"><strong>Benefit:</strong> ' + md[3] + '</p>');
  }
  function refresh() {
    if (!T.kit.tabOpen('muni')) { return; }
    Array.prototype.forEach.call(document.querySelectorAll('#muNow [data-src]'), function (el) { el.textContent = txt(el.getAttribute('data-src')); });
  }

  C.onReady(function () {
    MODULES = MODULES.filter(function (md) { return md[4].some(function (id) { return $(id); }); });   // e.g. no coast module inland
    // name the environment cards that came without an id
    Array.prototype.forEach.call(document.querySelectorAll('.panel section[data-tab="env"]'), function (s) { var h = s.querySelector('.card-head h2'), id = h && TITLE_ID[h.textContent.trim()]; if (id && !s.id) { s.id = id; } });
    // Duplicates folded away: the synthetic stream card repeats the river gauges; service requests join the citizen reports card;
    // the river gauges move here from Emergency.
    var tl = $('tgLk'); if (tl) { tl.setAttribute('data-tab', 'retired'); tl.hidden = true; }
    var rg = $('grRg'); if (rg) { rg.setAttribute('data-tab', 'muni'); }
    var cs = $('csSla'), rp = $('grRp');
    if (cs && rp) { var hd = rp.querySelector('.card-head h2'); if (hd) { hd.textContent = 'Citizen reports and service requests'; } var sub = document.createElement('h3'); sub.className = 'sub-h'; sub.textContent = 'Service requests and SLA, all channels'; rp.appendChild(sub); Array.prototype.slice.call(cs.childNodes).forEach(function (n) { if (!(n.classList && n.classList.contains('card-head'))) { rp.appendChild(n); } }); cs.remove(); }
    var secs = Array.prototype.slice.call(document.querySelectorAll('.panel section[data-tab="env"]')).concat(['grRp'].map(function (id) { return $(id); }).filter(Boolean));
    secs.forEach(function (s) { s.setAttribute('data-tab', 'muni'); });
    var first = document.querySelector('.panel section[data-tab="muni"]'), host = first.parentNode, now = summary(), at = now, placed = [];
    host.insertBefore(now, first);
    MODULES.forEach(function (md) {
      var h = header(md); host.insertBefore(h, at.nextSibling); at = h;
      md[4].forEach(function (id) { var s = $(id); if (s) { s.setAttribute('data-tab', 'muni'); s.setAttribute('data-mu', md[0]); host.insertBefore(s, at.nextSibling); at = s; placed.push(s); } });
      h.querySelector('.mu-mod-h').addEventListener('click', function () {
        var open = this.getAttribute('aria-expanded') !== 'true'; this.setAttribute('aria-expanded', open ? 'true' : 'false');
        Array.prototype.forEach.call(document.querySelectorAll('.panel section[data-mu="' + md[0] + '"]'), function (s) { s.classList.toggle('mu-folded', !open); });
      });
    });
    // any other municipal card goes under Environmental intelligence
    Array.prototype.forEach.call(document.querySelectorAll('.panel section[data-tab="muni"]'), function (s) { if (s !== now && !s.classList.contains('mu-mod') && placed.indexOf(s) < 0) { s.setAttribute('data-mu', 'env'); var envH = $('mu-env'), next = envH; while (next.nextElementSibling && next.nextElementSibling.getAttribute('data-mu') === 'env') { next = next.nextElementSibling; } host.insertBefore(s, next.nextSibling); } });
    Array.prototype.forEach.call(now.querySelectorAll('.mu-tile'), function (b) {
      b.addEventListener('click', function () { var h = $(b.getAttribute('data-go')), btn = h && h.querySelector('.mu-mod-h'); if (btn && btn.getAttribute('aria-expanded') !== 'true') { btn.click(); } setTimeout(function () { scrollTo(h); }, 30); });
    });
    $('showMuniAll').addEventListener('change', function () { C.redraw(); });
    // A way back to the overview from anywhere in the menu: a button in the panel header, and one on each module header
    var back = document.createElement('button'); back.type = 'button'; back.id = 'muBack'; back.className = 'mini mu-back'; back.hidden = true; back.textContent = 'Overview'; back.title = 'Back to the Municipality overview';
    back.addEventListener('click', home);
    var ph = document.querySelector('.panel-head'), pm = $('panelMin'); if (ph) { ph.insertBefore(back, pm || null); } else { host.appendChild(back); }
    function scroller() { var b0 = now.parentElement; while (b0 && b0.scrollHeight <= b0.clientHeight + 2) { b0 = b0.parentElement; } return b0; }
    MODULES.forEach(function (md) { var h = $('mu-' + md[0]); if (!h) { return; } var u = document.createElement('button'); u.type = 'button'; u.className = 'mu-up'; u.textContent = 'Overview'; u.title = 'Back to Municipality overview'; u.addEventListener('click', function (e) { e.stopPropagation(); home(); }); h.querySelector('.mu-mod-h').appendChild(u); });
    function home() {
      var s0 = scroller(); if (s0) { s0.scrollTop = 0; }
      var mp = T.getMap(); if (mp && mp.getZoom() > 14.4) { mp.easeTo({ zoom: window.innerWidth < 720 ? 13.6 : 14.2, pitch: Math.min(mp.getPitch(), 45), duration: 900 }); }
    }
    // Tapping the Municipality icon while the menu is open goes back to the overview
    var railBtn = document.querySelector('#tabs [data-tab="muni"]');
    if (railBtn) { railBtn.addEventListener('click', function () { if (T.kit.tabOpen('muni') && railBtn.getAttribute('data-was') === '1') { home(); } setTimeout(function () { railBtn.setAttribute('data-was', '1'); }, 0); }, true); }
    Array.prototype.forEach.call(document.querySelectorAll('#tabs [data-tab]'), function (b) { if (b !== railBtn) { b.addEventListener('click', function () { if (railBtn) { railBtn.setAttribute('data-was', '0'); } }); } });
    // Opening Municipality shows a wider part of the city
    C.onTab(function () { back.hidden = !T.kit.tabOpen('muni'); if (T.kit.tabOpen('muni')) { var mp = T.getMap(); if (!muEntered) { if (T.api && T.api.orbit) { T.api.orbit(false); } if (mp && mp.getZoom() > 14.4) { mp.easeTo({ zoom: window.innerWidth < 720 ? 13.6 : 14.2, pitch: Math.min(mp.getPitch(), 50), duration: 800 }); } } muEntered = true; } else { muEntered = false; } });
    C.onTab(function () { setTimeout(refresh, 60); });
    C.onMinute(refresh);
  });
})();
