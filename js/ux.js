/* UrbanIQ interface helpers.
 *
 * - One search box in the top bar for places, roads, cameras, critical sites, alerts and cities.
 * - On phones, the less used top-bar controls move into a "More" menu.
 * - A short guided tour after the first sign-in (and from the Tour button in the status bar).
 * - Full text of the status line on hover; the reason when TomTom is not working.
 * - Telugu for section names and card headings when Telugu is chosen.
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, CFG = C.CFG, $ = C.$;

  /* ---------- search ---------- */
  function norm(s) { return String(s || '').toLowerCase().normalize('NFKD').replace(/[^\w\s]/g, ' '); }
  function sources() {
    var out = [];
    (C.sites() || []).forEach(function (st, i) { out.push({ kind: 'Place', name: st[0], go: function () { var s = $('siteSel'); s.value = String(i); s.dispatchEvent(new Event('change')); } }); });
    Array.prototype.forEach.call(($('gotoRoads') || { children: [] }).children, function (o) { out.push({ kind: 'Road', name: o.textContent, go: function () { var g = $('goto'); g.value = o.value; g.dispatchEvent(new Event('change')); } }); });
    (CFG.regions || []).forEach(function (r) { if (r.id !== C.region.id) { out.push({ kind: 'City', name: r.name, go: function () { var s = $('regionSel'); s.value = r.id; s.dispatchEvent(new Event('change')); } }); } });
    if (T.devices) { T.devices.cameras().forEach(function (c) { out.push({ kind: 'Camera', name: c.id + ' · ' + c.name, go: function () { T.devices.openCamera(c.id); } }); }); }
    if (T.zones) { T.zones.all().forEach(function (s) { out.push({ kind: T.zones.label(s.type), name: s.name, go: function () { T.zones.open(s); } }); }); }
    if (T.ops) { T.ops.alerts().forEach(function (a) { out.push({ kind: 'Alert', name: a.title, go: function () { if (a.go) { a.go(); } } }); }); }
    return out;
  }
  function setupSearch() {
    var box = document.createElement('div'); box.className = 'qsearch';
    box.innerHTML = '<input id="qSearch" type="search" autocomplete="off" placeholder="Search places, roads, cameras, alerts…" aria-label="Search places, roads, cameras, sites, alerts and cities" aria-controls="qResults" aria-expanded="false">' +
      '<ul id="qResults" class="q-results" role="listbox" hidden></ul>';
    var anchor = document.querySelector('.topbar .goto'); anchor.parentNode.insertBefore(box, anchor);
    var input = $('qSearch'), list = $('qResults'), items = [], sel = -1;
    function close() { list.hidden = true; input.setAttribute('aria-expanded', 'false'); sel = -1; }
    function pick(i) { var it = items[i]; if (!it) { return; } close(); input.value = ''; input.blur(); it.go(); }
    function show() {
      var q = norm(input.value).trim();
      if (q.length < 2) { close(); return; }
      var words = q.split(/\s+/);
      items = sources().filter(function (it) { var n = norm(it.name + ' ' + it.kind); return words.every(function (w) { return n.indexOf(w) >= 0; }); })
        .sort(function (a, b) { return norm(a.name).indexOf(q) - norm(b.name).indexOf(q); }).slice(0, 12);
      list.innerHTML = items.length ? items.map(function (it, i) { return '<li role="option" id="q' + i + '" data-i="' + i + '"><span></span><em></em></li>'; }).join('') : '<li class="muted">No match</li>';
      items.forEach(function (it, i) { var li = list.children[i]; li.querySelector('span').textContent = it.name; li.querySelector('em').textContent = it.kind; });
      list.hidden = false; input.setAttribute('aria-expanded', 'true'); sel = -1;
    }
    input.addEventListener('input', show);
    input.addEventListener('keydown', function (e) {
      if (list.hidden) { return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % Math.max(1, items.length);
        Array.prototype.forEach.call(list.children, function (li, i) { li.classList.toggle('on', i === sel); }); input.setAttribute('aria-activedescendant', 'q' + sel); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(sel < 0 ? 0 : sel); }
      else if (e.key === 'Escape') { close(); }
    });
    list.addEventListener('mousedown', function (e) { var li = e.target.closest('[data-i]'); if (li) { e.preventDefault(); pick(Number(li.getAttribute('data-i'))); } });
    input.addEventListener('blur', function () { setTimeout(close, 150); });
  }

  /* ---------- phones: More menu ---------- */
  function setupMore() {
    var right = document.querySelector('.topbar-right'), b = document.createElement('button');
    b.type = 'button'; b.className = 'btn small more-btn'; b.id = 'moreBtn'; b.setAttribute('aria-expanded', 'false'); b.title = 'More controls'; b.textContent = 'More';
    right.insertBefore(b, $('alertBtn'));
    b.addEventListener('click', function (e) { e.stopPropagation(); var open = !document.body.classList.contains('more-open'); document.body.classList.toggle('more-open', open); b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    document.addEventListener('click', function (e) { if (document.body.classList.contains('more-open') && !e.target.closest('.topbar')) { document.body.classList.remove('more-open'); b.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---------- guided tour ---------- */
  var STEPS = [
    ['#map', 'The map', 'Traffic on every main road, coloured by speed. Numbered bubbles group cameras and sites: tap one to zoom in.'],
    ['#qSearch', 'Search', 'Find a place, road, camera, critical site, alert or another Telangana city.'],
    ['#lyBtn', 'Scenario and layers', 'Choose the demand case and which layers show. Alerts follow these tick boxes.'],
    ['#alertBtn', 'Alerts', 'Every active alert. Only important ones pop up, one at a time.'],
    ['#osintBtn', 'OSINT', 'Live weather, rain, heat, fires, flights, satellites and earthquakes on a 3D map.'],
    ['#analyticsBtn', 'Analytics', 'City scorecard, regional comparison and 10-year projections.'],
    ['#chatOpen', 'Twin Advisor', 'Ask a question about the traffic, alerts or KPIs.']
  ];
  var step = -1, tip = null;
  function endTour() { if (tip) { tip.remove(); tip = null; } document.querySelectorAll('.tour-on').forEach(function (e) { e.classList.remove('tour-on'); }); step = -1; try { localStorage.setItem('urbaniq.tour', '1'); } catch (e) { /* ignore */ } }
  function showStep(i) {
    document.querySelectorAll('.tour-on').forEach(function (e) { e.classList.remove('tour-on'); });
    var s = STEPS[i]; if (!s) { endTour(); return; }
    var el = document.querySelector(s[0]);
    if (!el || !el.offsetParent) { showStep(i + 1); return; }   // hidden on this screen: skip it
    step = i; el.classList.add('tour-on');
    if (!tip) { tip = document.createElement('div'); tip.className = 'tour-tip'; tip.setAttribute('role', 'dialog'); tip.setAttribute('aria-live', 'polite'); document.body.appendChild(tip); }
    tip.innerHTML = '<b></b><p></p><div class="tour-nav"><span class="muted">' + (i + 1) + ' of ' + STEPS.length + '</span><button type="button" class="btn small" data-t="skip">Skip</button><button type="button" class="btn small primary" data-t="next">' + (i === STEPS.length - 1 ? 'Done' : 'Next') + '</button></div>';
    tip.querySelector('b').textContent = s[1]; tip.querySelector('p').textContent = s[2];
    var r = el.getBoundingClientRect(), w = 280, big = r.width > window.innerWidth * 0.6;
    var x = big ? window.innerWidth / 2 - w / 2 : Math.min(window.innerWidth - w - 10, Math.max(10, r.left + r.width / 2 - w / 2));
    var y = big ? window.innerHeight / 2 - 60 : (r.bottom + 150 < window.innerHeight ? r.bottom + 10 : Math.max(10, r.top - 150));
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.style.width = w + 'px';
    tip.querySelector('[data-t=next]').focus();
    tip.onclick = function (e) { var t = e.target.getAttribute('data-t'); if (t === 'skip') { endTour(); } else if (t === 'next') { showStep(step + 1); } };
  }
  function startTour() { if (document.body.classList.contains('more-open')) { document.body.classList.remove('more-open'); } showStep(0); }
  document.addEventListener('keydown', function (e) { if (step >= 0 && e.key === 'Escape') { endTour(); } });

  /* ---------- status bar ---------- */
  function setupStatus() {
    var note = $('modeNote');
    new MutationObserver(function () { note.title = note.textContent; }).observe(note, { childList: true, characterData: true, subtree: true });
    note.title = note.textContent;
    var tb = document.createElement('button'); tb.type = 'button'; tb.className = 'style-btn tour-btn'; tb.textContent = 'Tour'; tb.title = 'A short tour of the screen';
    $('styleBtn').parentNode.insertBefore(tb, $('styleBtn'));
    tb.addEventListener('click', startTour);
    // A failing service says why on hover.
    var tt = $('svcTt');
    new MutationObserver(function () {
      if (!/not working|partly/.test(tt.textContent) || !T.diagnostics || !T.diagnostics.results) { return; }
      var bad = T.diagnostics.results().filter(function (r) { return r.group === 'TomTom' && !r.ok; })[0];
      if (bad) { var why = bad.name + ': ' + (bad.msg || ('HTTP ' + bad.status)); if (tt.title.indexOf(why) < 0) { tt.title = 'TomTom ' + (tt.textContent.split(': ')[1] || '') + '. ' + why + '. Click for the connection check.'; } }
    }).observe(tt, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    // The speed buttons are a replay speed: Live at 1× follows the clock.
    var rate = $('rate'); if (rate && !document.querySelector('.rate-label')) { var l = document.createElement('span'); l.className = 'rate-label'; l.textContent = 'Replay speed'; rate.parentNode.insertBefore(l, rate); }
  }

  /* ---------- Telugu for section names and card headings ---------- */
  var TE = {
    'Dashboard': 'డాష్‌బోర్డ్', 'Congestion': 'రద్దీ', 'Incident management': 'సంఘటనల నిర్వహణ', 'Accidents': 'ప్రమాదాలు', 'Fines': 'జరిమానాలు', 'Signal control': 'సిగ్నల్ నియంత్రణ',
    'Public transport': 'ప్రజా రవాణా', 'Transit': 'రవాణా', 'Parking': 'పార్కింగ్', 'Freight': 'సరుకు రవాణా', 'Pedestrians': 'పాదచారులు', 'Planning': 'ప్రణాళిక', 'Emergency': 'అత్యవసరం',
    'Number plates': 'నంబర్ ప్లేట్లు', 'Critical zones': 'కీలక ప్రాంతాలు', 'Environment': 'పర్యావరణం', 'Devices': 'పరికరాలు', 'Reports': 'నివేదికలు', 'Configuration': 'కాన్ఫిగరేషన్', 'Model': 'నమూనా',
    'OSINT': 'ఓపెన్-సోర్స్ సమాచారం', 'Analytics and city KPIs': 'విశ్లేషణ మరియు నగర సూచికలు', 'Weather now': 'ప్రస్తుత వాతావరణం', 'Rain forecast': 'వర్ష సూచన',
    'Dust storm and air quality forecast': 'దుమ్ము తుఫాను మరియు గాలి నాణ్యత సూచన', 'Earthquakes': 'భూకంపాలు', 'Natural events': 'ప్రకృతి సంఘటనలు', 'Global incidents': 'ప్రపంచ సంఘటనలు',
    'Space weather': 'అంతరిక్ష వాతావరణం', 'Fire and heat detections': 'అగ్ని మరియు వేడి గుర్తింపులు', 'Live flights': 'ప్రత్యక్ష విమానాలు', 'Satellites overhead': 'పైన ఉపగ్రహాలు', 'Sources': 'మూలాలు',
    'Symbols': 'చిహ్నాలు', 'Alerts': 'హెచ్చరికలు', 'Telangana cities': 'తెలంగాణ నగరాలు', 'Monsoon waterlogging watch': 'వర్షాకాల నీటి నిల్వ పర్యవేక్షణ', 'Festival and event plans': 'పండుగ మరియు కార్యక్రమ ప్రణాళికలు',
    'Search places, roads, cameras, alerts…': 'ప్రదేశాలు, రహదారులు, కెమెరాలు, హెచ్చరికలు వెతకండి…', 'More': 'మరిన్ని', 'Tour': 'పరిచయం', 'Replay speed': 'రీప్లే వేగం'
  };
  var orig = new WeakMap();
  function translate(lang) {
    var te = lang === 'te';
    document.querySelectorAll('.panel h2, .card-head h2, #panelTitle, .op-head h1, .op-head h2, #osintPage h1, #analytics h1, .rate-label, .tour-btn, #moreBtn').forEach(function (el) {
      if (el.children.length) { return; }
      if (!orig.has(el)) { orig.set(el, el.textContent); }
      var en = orig.get(el); el.textContent = te && TE[en] ? TE[en] : en;
    });
    document.querySelectorAll('#tabs [title], .rail-item[title]').forEach(function (el) {
      if (!el.hasAttribute('data-en-title')) { el.setAttribute('data-en-title', el.title); }
      var en = el.getAttribute('data-en-title'), key = en.split(':')[0]; el.title = te && TE[key] ? TE[key] : en;
    });
    var q = $('qSearch'); if (q) { q.placeholder = te ? TE['Search places, roads, cameras, alerts…'] : 'Search places, roads, cameras, alerts…'; }
  }

  C.onReady(function () {
    setupSearch(); setupMore(); setupStatus();
    if (window.IntelliTwinI18n) {
      var apply = window.IntelliTwinI18n.apply;
      window.IntelliTwinI18n.apply = function (l) { apply(l); translate(l); };
      translate(window.IntelliTwinI18n.lang());
      // The language button calls the language file directly, so translate after each click too.
      if ($('langBtn')) { $('langBtn').addEventListener('click', function () { setTimeout(function () { translate(window.IntelliTwinI18n.lang()); }, 0); }); }
      C.onTab(function () { translate(window.IntelliTwinI18n.lang()); });
    }
    // First sign-in on this browser: offer the tour once the role is chosen.
    var seen = false; try { seen = localStorage.getItem('urbaniq.tour') === '1'; } catch (e) { seen = true; }
    if (!seen && $('login')) {
      var obs = new MutationObserver(function () { if ($('login').hidden) { obs.disconnect(); setTimeout(startTour, 1800); } });
      obs.observe($('login'), { attributes: true, attributeFilter: ['hidden'] });
    }
  });
  T.ux = { tour: startTour, translate: translate };
})();
