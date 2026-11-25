/* AthenaIQ interface helpers.
 *
 * - One search box in the top bar for places, roads, cameras, critical sites, alerts and cities.
 * - On phones, the less used top-bar controls move into a "More" menu.
 * - A short guided tour after the first sign-in (and from the Tour button in the status bar).
 * - Full text of the status line on hover; the reason when TomTom is not working.
 * - Greek for section names and card headings when Greek is chosen.
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
    ['#qSearch', 'Search', 'Find a place, road, camera, critical site, alert or another Greek city.'],
    ['#lyBtn', 'Scenario and layers', 'Choose the demand case and which layers show. Alerts follow these tick boxes.'],
    ['#alertBtn', 'Alerts', 'Every active alert. Only important ones pop up, one at a time.'],
    ['#osintBtn', 'OSINT', 'Live weather, rain, heat, fires, flights, satellites and earthquakes on a 3D map.'],
    ['#analyticsBtn', 'Analytics', 'City scorecard, regional comparison and 10-year projections.'],
    ['#chatOpen', 'Twin Advisor', 'Ask a question about the traffic, alerts or KPIs.']
  ];
  var step = -1, tip = null;
  function endTour() { if (tip) { tip.remove(); tip = null; } document.querySelectorAll('.tour-on').forEach(function (e) { e.classList.remove('tour-on'); }); step = -1; try { localStorage.setItem('athenaiq.tour', '1'); } catch (e) { /* ignore */ } }
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

  /* ---------- Greek for section names and card headings ---------- */
  var TE = {
    "Dashboard": "Πίνακας ελέγχου",
    "Congestion": "Συμφόρηση",
    "Incident management": "Διαχείριση συμβάντων",
    "Accidents": "Ατυχήματα",
    "Fines": "Πρόστιμα",
    "Signal control": "Έλεγχος σηματοδοτών",
    "Public transport": "Δημόσιες συγκοινωνίες",
    "Transit": "Συγκοινωνίες",
    "Parking": "Στάθμευση",
    "Freight": "Εμπορευματικές μεταφορές",
    "Pedestrians": "Πεζοί",
    "Planning": "Σχεδιασμός",
    "Emergency": "Έκτακτη ανάγκη",
    "Number plates": "Πινακίδες κυκλοφορίας",
    "Critical zones": "Κρίσιμες ζώνες",
    "Environment": "Περιβάλλον",
    "Devices": "Συσκευές",
    "Reports": "Αναφορές",
    "Configuration": "Ρυθμίσεις",
    "Model": "Μοντέλο",
    "OSINT": "Πληροφορίες ανοιχτών πηγών",
    "Analytics and city KPIs": "Αναλύσεις και δείκτες πόλης",
    "Weather now": "Καιρός τώρα",
    "Rain forecast": "Πρόγνωση βροχής",
    "Dust storm and air quality forecast": "Πρόγνωση σκόνης και ποιότητας αέρα",
    "Earthquakes": "Σεισμοί",
    "Natural events": "Φυσικά φαινόμενα",
    "Global incidents": "Παγκόσμια συμβάντα",
    "Space weather": "Διαστημικός καιρός",
    "Fire and heat detections": "Ανιχνεύσεις πυρκαγιών και θερμότητας",
    "Live flights": "Πτήσεις σε πραγματικό χρόνο",
    "Satellites overhead": "Δορυφόροι από πάνω",
    "Sources": "Πηγές",
    "Symbols": "Σύμβολα",
    "Alerts": "Ειδοποιήσεις",
    "Greek cities": "Ελληνικές πόλεις",
    "Flash-flood watch": "Παρακολούθηση πλημμυρών",
    "Event and holiday plans": "Σχέδια εκδηλώσεων και εορτών",
    "Heatwave and wildfire risk": "Καύσωνας και κίνδυνος πυρκαγιάς",
    "Ambulance green corridor": "Πράσινος διάδρομος ασθενοφόρου",
    "Air quality, European AQI": "Ποιότητα αέρα, ευρωπαϊκός δείκτης",
    "Streams and reservoir levels": "Στάθμη ρεμάτων και ταμιευτήρων",
    "Traffic mix": "Σύνθεση κυκλοφορίας",
    "Attiki Odos": "Αττική Οδός",
    "Athens Metro": "Μετρό Αθήνας",
    "Traffic offences by type": "Παραβάσεις ανά τύπο",
    "Waste collection, fleet and routing": "Αποκομιδή απορριμμάτων, στόλος και δρομολόγηση",
    "Street lighting and building energy": "Οδοφωτισμός και ενέργεια κτιρίων",
    "Traffic and parking tickets: city streets": "Κλήσεις κυκλοφορίας και στάθμευσης: δρόμοι πόλης",
    "Traffic tickets: prefecture roads and national highways": "Κλήσεις: επαρχιακοί δρόμοι και εθνικές οδοί",
    "Water leakage": "Διαρροές νερού",
    "Port and city interface": "Λιμάνι και πόλη",
    "Airport landside": "Αεροδρόμιο: χερσαία πλευρά",
    "Smuggling: border and customs": "Λαθρεμπόριο: σύνορα και τελωνεία",
    "Civil protection and critical infrastructure": "Πολιτική προστασία και κρίσιμες υποδομές",
    "School and hospital crossings": "Διαβάσεις σχολείων και νοσοκομείων",
    "Prefecture and highway cameras": "Κάμερες επαρχιακών δρόμων και αυτοκινητοδρόμων",
    "Counter-UAV and threat detection": "Αντι-drone και ανίχνευση απειλών",
    "Municipality": "Δήμος",
    "Citizen reports and service requests": "Αναφορές και αιτήματα πολιτών",
    "Illegal dumping detection": "Εντοπισμός παράνομης απόρριψης",
    "Urban planning and digital twin": "Πολεοδομία και ψηφιακό δίδυμο",
    "Early warning": "Έγκαιρη προειδοποίηση",
    "Roads and structures: predictive maintenance": "Δρόμοι και κατασκευές: προγνωστική συντήρηση",
    "Inspections and permitting": "Επιθεωρήσεις και αδειοδοτήσεις",
    "Mobility and parking": "Κινητικότητα και στάθμευση",
    "Water quality and temperature": "Ποιότητα νερού και θερμοκρασία",
    "Smart metering and utility assets": "Έξυπνη μέτρηση και υποδομές κοινής ωφέλειας",
    "Municipal asset management": "Διαχείριση δημοτικών παγίων",
    "Intelligent waste management": "Έξυπνη διαχείριση απορριμμάτων",
    "Public safety and early warning": "Δημόσια ασφάλεια και έγκαιρη προειδοποίηση",
    "Smart infrastructure and lighting": "Έξυπνες υποδομές και φωτισμός",
    "Intelligent inspections and permitting": "Έξυπνες επιθεωρήσεις και αδειοδοτήσεις",
    "Intelligent mobility and parking": "Έξυπνη κινητικότητα και στάθμευση",
    "Environmental intelligence": "Περιβαλλοντική πληροφόρηση",
    "Smart utilities management": "Έξυπνη διαχείριση δικτύων",
    "Citizen engagement and services": "Συμμετοχή και εξυπηρέτηση πολιτών",
    "Municipality now": "Ο δήμος τώρα",
    "Waste management: smart bins (IoT)": "Διαχείριση απορριμμάτων: έξυπνοι κάδοι (IoT)",
    "Fleet and routing": "Στόλος και δρομολόγηση",
    "Daktylios: central Athens traffic ring": "Δακτύλιος: κέντρο Αθήνας",
    "Wildfire evacuation": "Εκκένωση λόγω πυρκαγιάς",
    "Winter roads: snow and ice": "Χειμερινοί δρόμοι: χιόνι και πάγος",
    "River and stream gauges": "Στάθμη ποταμών και ρεμάτων",
    "Earthquake follow-up": "Μετά τον σεισμό: έλεγχοι και καταφύγια",
    "Drought and water supply": "Λειψυδρία και υδροδότηση",
    "Heritage sites and visitor crowds": "Αρχαιολογικοί χώροι και επισκέπτες",
    "Rail level crossings": "Ισόπεδες σιδηροδρομικές διαβάσεις",
    "Cruise-day impact": "Ημέρες κρουαζιέρας",
    "Strike-day planning": "Σχέδιο για ημέρες απεργίας",
    "Ferry ports": "Λιμάνια πορθμείων",
    "E-scooters, bikes and bike lanes": "Πατίνια, ποδήλατα και ποδηλατόδρομοι",
    "Toll plazas": "Σταθμοί διοδίων",
    "Citizen reports": "Αναφορές πολιτών",
    "EU reporting": "Αναφορές προς την ΕΕ",
    "City cameras": "Κάμερες πόλης",
    "Prefecture and highway cameras: monitoring": "Κάμερες επαρχιακών δρόμων και αυτοκινητοδρόμων: παρακολούθηση",
    "Transport for Athens": "Συγκοινωνίες Αθήνας",
    "Search places, roads, cameras, alerts\u2026": "Αναζήτηση τοποθεσιών, δρόμων, καμερών, ειδοποιήσεων…",
    "More": "Περισσότερα",
    "Tour": "Ξενάγηση",
    "Replay speed": "Ταχύτητα αναπαραγωγής"
  };
  var orig = new WeakMap();
  function translate(lang) {
    var te = lang === 'el';
    document.querySelectorAll('.panel h2, .card-head h2, .mu-mod-n, .mu-t-name, #panelTitle, .op-head h1, .op-head h2, #osintPage h1, #analytics h1, .rate-label, .tour-btn, #moreBtn').forEach(function (el) {
      if (el.children.length) { return; }
      var cur = el.textContent;   // text set by the app since the last switch (a new tab title, a tracked vehicle) becomes the new original
      if (!orig.has(el) || (cur !== orig.get(el) && cur !== TE[orig.get(el)])) { orig.set(el, cur); }
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
    var seen = false; try { seen = localStorage.getItem('athenaiq.tour') === '1'; } catch (e) { seen = true; }
    if (!seen && $('login')) {
      var obs = new MutationObserver(function () { if ($('login').hidden) { obs.disconnect(); setTimeout(startTour, 1800); } });
      obs.observe($('login'), { attributes: true, attributeFilter: ['hidden'] });
    }
  });
  T.ux = { tour: startTour, translate: translate };
})();
