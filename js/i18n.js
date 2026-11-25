/* AthenaIQ interface language. English is written in index.html; this file adds Greek for the
 * fixed labels (marked with data-i18n).
 * Sentences built from live values, the assistant and the docs remain in English.
 * The Greek text should be reviewed by a native speaker before client use.
 */
(function () {
  'use strict';
  var EL = {
    tagline: "Ευφυΐα μεταφορών σε πραγματικό χρόνο και προγνωστική προσομοίωση",
    gotoRoad: "Μετάβαση σε κεντρικό δρόμο…",
    wholeArea: "Όλη η περιοχή μελέτης",
    alerts: "Ειδοποιήσεις",
    badge: "Ευφυές ψηφιακό δίδυμο για έξυπνες πόλεις",
    live: "Ζωντανά",
    historical: "Ιστορικά",
    sites: "Τοποθεσίες",
    dashboard: "Πίνακας ελέγχου",
    legend: "Υπόμνημα",
    lgFree: "Ελεύθερη ροή ≥80% του ορίου",
    lgModerate: "Μέτρια 60–80%",
    lgHeavy: "Πυκνή 40–60%",
    lgSevere: "Πολύ πυκνή <40%",
    lgVehicles: "Οχήματα (μεγέθυνση για 3D)",
    lgAccident: "Ατύχημα (ενδεικτικό)",
    lgSite: "Κάμερα επιβολής (συνθετική)",
    lgCam: "Κάμερα CCTV",
    lgDet: "Ανιχνευτής",
    lgVms: "Πινακίδα μηνυμάτων",
    lgSig: "Φωτεινός σηματοδότης (τυπικός κύκλος)",
    ask: "Σύμβουλος ψηφιακού διδύμου",
    fullView: "Πλήρης προβολή",
    orbit: "Περιστροφή",
    minimise: "Ελαχιστοποίηση",
    congestion: "Συμφόρηση",
    accidents: "Ατυχήματα",
    fines: "Πρόστιμα",
    devices: "Συσκευές",
    reports: "Αναφορές",
    model: "Μοντέλο",
    networkNow: "Το δίκτυο τώρα",
    avgSpeed: "Μέση ταχύτητα",
    extraTime: "Επιπλέον χρόνος διαδρομής",
    vehMoving: "Οχήματα σε κίνηση",
    delayHour: "Καθυστέρηση ανά ώρα",
    accToday: "Ατυχήματα σήμερα",
    finesToday: "Πρόστιμα σήμερα",
    illustrative: "ενδεικτικό",
    forecast: "Πρόβλεψη",
    forecastNote: "από το συνθετικό προφίλ ημέρας",
    dayProfile: "Προφίλ ημέρας",
    speedKmh: "Ταχύτητα δικτύου, km/h",
    typical: "Τυπική ζήτηση",
    selected: "Επιλεγμένο σενάριο",
    shownTime: "Εμφανιζόμενη ώρα",
    scenarioLayers: "Σενάριο και επίπεδα",
    demandCase: "Σενάριο ζήτησης",
    vehicles: "Οχήματα",
    lyEnf: "Κάμερες επιβολής",
    lyCam: "Κάμερες CCTV",
    lyDet: "Ανιχνευτές",
    lyVms: "Πινακίδες μηνυμάτων",
    lySig: "Φωτεινοί σηματοδότες",
    whatIf: "Τι θα γινόταν αν: κλείσιμο δρόμου",
    roadToClose: "Δρόμος προς κλείσιμο",
    congByClass: "Συμφόρηση ανά κατηγορία δρόμου",
    slowest: "Οι πιο αργοί δρόμοι τώρα",
    tapLocate: "Πατήστε για εντοπισμό",
    today: "Σήμερα",
    activeNow: "Ενεργά τώρα",
    withInjury: "Με τραυματισμό",
    accLog: "Αρχείο ατυχημάτων",
    value: "Αξία",
    byType: "Ανά τύπο παράβασης",
    busiestSites: "Οι πιο φορτωμένες θέσεις επιβολής",
    cameras: "Κάμερες CCTV",
    signs: "Πινακίδες μηνυμάτων",
    exports: "Εξαγωγές",
    audit: "Αρχείο ενεργειών",
    settings: "Ρυθμίσεις"
  };
  var cfg = (window.IntelliTwin && window.IntelliTwin.core.CFG.language) || { default: 'en', available: ['en', 'el'] }, lang = 'en';
  var OTHER = 'el', DICT = EL, OTHER_NAME = 'Ελληνικά';

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
    try { localStorage.setItem('athenaiq.lang', l); } catch (e) { /* ignore */ }
  }

  function init() {
    var btn = document.getElementById('langBtn'), saved = null;
    try { saved = localStorage.getItem('athenaiq.lang'); } catch (e) { saved = null; }
    if (cfg.available.indexOf(OTHER) < 0) { if (btn) { btn.hidden = true; } return; }
    if (btn) { btn.addEventListener('click', function () { apply(lang === OTHER ? 'en' : OTHER); }); }
    apply(saved && cfg.available.indexOf(saved) >= 0 ? saved : cfg.default);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
  window.IntelliTwinI18n = { apply: apply, lang: function () { return lang; } };
})();
