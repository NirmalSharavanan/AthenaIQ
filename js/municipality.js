/* AthenaIQ: the Municipality menu (next to Dashboard).
 *
 * Gathers the city-services cards in one place, in this order:
 *   Municipality now (summary) · Weather and visibility · Waste management: smart bins (IoT) · Fleet and routing ·
 *   Street lighting and building energy · Water leakage · Drought and water supply · the Environment cards
 *   (air and noise, sensors, air quality, emissions, streams) · Citizen reports.
 * The old Environment menu is folded in here; code that asks whether 'env' is open is answered for 'muni'.
 */
(function () {
  'use strict';
  var T = window.IntelliTwin, C = T.core, $ = C.$;
  var ORDER = ['muNow', 'wxCard', 'grWs', 'grFl', 'grLt', 'grLk', 'grDr'], LAST = ['grRp'];

  function txt(id) { var el = $(id); return el ? el.textContent.trim() || '–' : '–'; }
  function summary() {
    var sec = document.createElement('section'); sec.className = 'card'; sec.id = 'muNow'; sec.setAttribute('data-tab', 'muni'); sec.hidden = true;
    sec.innerHTML = '<div class="card-head"><h2>Municipality now</h2><span class="muted">Tap a figure to open its card</span></div><div class="kpis mu-kpis">' +
      [['Weather', 'wxNow', 'wxCard'], ['Bins over 75% full', 'grWsFull', 'grWs'], ['Vehicles out', 'grFlN', 'grFl'], ['Street-light faults', 'grLtFault', 'grLt'], ['Likely water leaks', 'grLkBad', 'grLk'], ['Water stage', 'grDrSt', 'grDr']]
        .map(function (k) { return '<button type="button" class="kpi mu-go" data-go="' + k[2] + '"><span class="k-label">' + k[0] + '</span><span class="k-value" data-src="' + k[1] + '">–</span></button>'; }).join('') +
      '</div><label class="check"><input id="showMuniAll" type="checkbox"><span>Keep municipal layers on the map in every menu</span></label>';
    return sec;
  }
  function refresh() {
    if (!K().tabOpen('muni')) { return; }
    Array.prototype.forEach.call(document.querySelectorAll('#muNow [data-src]'), function (el) { el.textContent = txt(el.getAttribute('data-src')); });
  }
  function K() { return T.kit; }

  C.onReady(function () {
    var secs = Array.prototype.slice.call(document.querySelectorAll('.panel section[data-tab="env"]'));
    LAST.forEach(function (id) { var s = $(id); if (s) { secs.push(s); } });
    secs.forEach(function (s) { s.setAttribute('data-tab', 'muni'); });
    var first = secs[0] || document.querySelector('.panel section[data-tab]'), host = first.parentNode, now = summary();
    host.insertBefore(now, first);
    var ordered = ORDER.map(function (id) { return $(id); }).filter(Boolean);
    secs.forEach(function (s) { if (ordered.indexOf(s) < 0 && LAST.indexOf(s.id) < 0) { ordered.push(s); } });
    LAST.forEach(function (id) { var s = $(id); if (s) { ordered.push(s); } });
    var at = now;
    ordered.forEach(function (s) { if (s === now) { return; } host.insertBefore(s, at.nextSibling); at = s; });
    Array.prototype.forEach.call(now.querySelectorAll('.mu-go'), function (b) {
      b.addEventListener('click', function () { var s = $(b.getAttribute('data-go')), box = s && s.parentElement; while (box && box.scrollHeight <= box.clientHeight + 2) { box = box.parentElement; } if (s && box) { box.scrollTop += s.getBoundingClientRect().top - box.getBoundingClientRect().top - 8; } });
    });
    $('showMuniAll').addEventListener('change', function () { C.redraw(); });
    C.onTab(function () { setTimeout(refresh, 50); });
    C.onMinute(refresh);
  });
})();
