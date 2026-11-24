/* UrbanIQ interface language. English is written in index.html; this file adds Telugu for the
 * fixed labels (marked with data-i18n). Telugu is written left to right, like English.
 * Sentences built from live values, the assistant and the docs remain in English.
 * The Telugu text should be reviewed by a native speaker before client use.
 */
(function () {
  'use strict';
  var TE = {
    tagline: "రియల్-టైమ్ రవాణా సమాచారం మరియు అంచనా అనుకరణ",
    gotoRoad: "ప్రధాన రహదారికి వెళ్లండి…",
    wholeArea: "మొత్తం అధ్యయన ప్రాంతం",
    alerts: "హెచ్చరికలు",
    badge: "స్మార్ట్ నగరాల కోసం ఇంటెలిజెంట్ డిజిటల్ ట్విన్",
    live: "ప్రత్యక్షం",
    historical: "చారిత్రక",
    sites: "ప్రదేశాలు",
    dashboard: "డాష్‌బోర్డ్",
    legend: "సూచిక",
    lgFree: "సాఫీగా ≥80% పరిమితి",
    lgModerate: "మధ్యస్థం 60–80%",
    lgHeavy: "రద్దీ 40–60%",
    lgSevere: "తీవ్ర రద్దీ <40%",
    lgVehicles: "వాహనాలు (3D కోసం జూమ్ చేయండి)",
    lgAccident: "ప్రమాదం (ఉదాహరణ)",
    lgSite: "ఎన్‌ఫోర్స్‌మెంట్ కెమెరా (కృత్రిమం)",
    lgCam: "సీసీటీవీ కెమెరా",
    lgDet: "డిటెక్టర్",
    lgVms: "సందేశ బోర్డు",
    lgSig: "ట్రాఫిక్ సిగ్నల్ (సాధారణ చక్రం)",
    ask: "ట్విన్ సలహాదారు",
    fullView: "పూర్తి వీక్షణ",
    orbit: "చుట్టూ తిరుగు",
    minimise: "కుదించు",
    congestion: "రద్దీ",
    accidents: "ప్రమాదాలు",
    fines: "జరిమానాలు",
    devices: "పరికరాలు",
    reports: "నివేదికలు",
    model: "నమూనా",
    networkNow: "ప్రస్తుత నెట్‌వర్క్",
    avgSpeed: "సగటు వేగం",
    extraTime: "అదనపు ప్రయాణ సమయం",
    vehMoving: "కదులుతున్న వాహనాలు",
    delayHour: "గంటకు ఆలస్యం",
    accToday: "ఈరోజు ప్రమాదాలు",
    finesToday: "ఈరోజు జరిమానాలు",
    illustrative: "ఉదాహరణ",
    forecast: "అంచనా",
    forecastNote: "కృత్రిమ రోజు ప్రొఫైల్ నుండి",
    dayProfile: "రోజు ప్రొఫైల్",
    speedKmh: "నెట్‌వర్క్ వేగం, కి.మీ/గం",
    typical: "సాధారణ డిమాండ్",
    selected: "ఎంచుకున్న సందర్భం",
    shownTime: "చూపిన సమయం",
    scenarioLayers: "సన్నివేశం మరియు పొరలు",
    demandCase: "డిమాండ్ సందర్భం",
    vehicles: "వాహనాలు",
    lyEnf: "ఎన్‌ఫోర్స్‌మెంట్ కెమెరాలు",
    lyCam: "సీసీటీవీ కెమెరాలు",
    lyDet: "డిటెక్టర్లు",
    lyVms: "సందేశ బోర్డులు",
    lySig: "ట్రాఫిక్ సిగ్నల్స్",
    whatIf: "ఒకవేళ: రహదారి మూసివేత",
    roadToClose: "మూసివేయాల్సిన రహదారి",
    congByClass: "రహదారి తరగతి వారీగా రద్దీ",
    slowest: "ఇప్పుడు అత్యంత నెమ్మదైన రహదారులు",
    tapLocate: "స్థానం కోసం నొక్కండి",
    today: "ఈరోజు",
    activeNow: "ఇప్పుడు క్రియాశీలం",
    withInjury: "గాయాలతో",
    accLog: "ప్రమాదాల జాబితా",
    value: "విలువ",
    byType: "ఉల్లంఘన రకం వారీగా",
    busiestSites: "అత్యంత రద్దీ ఎన్‌ఫోర్స్‌మెంట్ ప్రదేశాలు",
    cameras: "సీసీటీవీ కెమెరాలు",
    signs: "సందేశ బోర్డులు",
    exports: "ఎగుమతులు",
    audit: "ఆడిట్ లాగ్",
    settings: "కాన్ఫిగరేషన్"
  };
  var cfg = (window.IntelliTwin && window.IntelliTwin.core.CFG.language) || { default: 'en', available: ['en', 'te'] }, lang = 'en';
  var OTHER = 'te', DICT = TE, OTHER_NAME = 'తెలుగు';

  function apply(l) {
    lang = l;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      if (!el.hasAttribute('data-en')) { el.setAttribute('data-en', el.textContent); }
      var key = el.getAttribute('data-i18n');
      el.textContent = l === OTHER && DICT[key] ? DICT[key] : el.getAttribute('data-en');
    });
    document.documentElement.lang = l;
    document.documentElement.dir = 'ltr';
    var btn = document.getElementById('langBtn');
    if (btn) { btn.textContent = l === OTHER ? 'English' : OTHER_NAME; }
    try { localStorage.setItem('urbaniq.lang', l); } catch (e) { /* ignore */ }
  }

  function init() {
    var btn = document.getElementById('langBtn'), saved = null;
    try { saved = localStorage.getItem('urbaniq.lang'); } catch (e) { saved = null; }
    if (cfg.available.indexOf(OTHER) < 0) { if (btn) { btn.hidden = true; } return; }
    if (btn) { btn.addEventListener('click', function () { apply(lang === OTHER ? 'en' : OTHER); }); }
    apply(saved && cfg.available.indexOf(saved) >= 0 ? saved : cfg.default);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
  window.IntelliTwinI18n = { apply: apply, lang: function () { return lang; } };
})();
