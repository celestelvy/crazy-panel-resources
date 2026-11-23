// Only the GPS tab owns phone-speed sampling. Vehicle BLE telemetry stays intact.
(function (w) {
  'use strict';
  if (w !== w.top || w.__crazyTwinPolicy) return;
  w.__crazyTwinPolicy = true;
  var states = new WeakSet(), frame = 0, observer, timer;
  function install() {
    frame = 0;
    var app = w.APP, state = app && app.state;
    if (state && !states.has(state)) {
      var changed = state.gpsSpeed === true || state.gpsOver50 === true;
      ['gpsSpeed', 'gpsOver50'].forEach(function (key) {
        Object.defineProperty(state, key, { enumerable: true, configurable: true,
          get: function () { return false; }, set: function () {} });
      });
      states.add(state);
      if (changed && typeof app.savePrefs === 'function') app.savePrefs();
    }
    if (!document.getElementById('crazy-twin-policy-style')) {
      var style = document.createElement('style'); style.id = 'crazy-twin-policy-style';
      style.textContent = '[data-inductive-row="gpsSpeed"],[data-inductive-row="gpsOver50"],[data-inductive-gps-retry],[data-inductive="gps-hint"]{display:none!important}.crazy-gps-note{padding:14px 16px;border-radius:16px;background:var(--cs-inset);color:var(--cs-muted);font-size:14px;line-height:1.6}';
      (document.head || document.documentElement).appendChild(style);
    }
    document.querySelectorAll('.inductive-settings').forEach(function (root) {
      if (!root.querySelector('.crazy-gps-note')) {
        var note = document.createElement('p'); note.className = 'crazy-gps-note';
        note.textContent = '手机测速统一在下方「GPS 测速」页面使用。此仪表不再单独开启 GPS 测速。';
        root.prepend(note);
      }
    });
  }
  function schedule() { if (!frame) frame = w.requestAnimationFrame(install); }
  function start() {
    install(); observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    timer = w.setInterval(install, 2500);
  }
  w.addEventListener('pagehide', function () {
    if (observer) observer.disconnect(); w.clearInterval(timer); w.cancelAnimationFrame(frame);
  }, { once: true });
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})(window);
