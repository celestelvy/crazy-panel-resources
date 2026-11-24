// Only the GPS tab owns phone-speed sampling. Vehicle BLE telemetry stays intact.
(function (w) {
  'use strict';
  if (w !== w.top || w.__crazyTwinPolicy) return;
  w.__crazyTwinPolicy = true;
  var states = new WeakSet(), frame = 0, observer, timer;
  var modules = new WeakSet(), lastTap = null, pointer = null;
  function integrated() { return !!(w.__zeehoIOS && w.__zeehoIOS.capabilities.includes('speed.open')); }
  function hero(target) { return target && target.closest && target.closest('.hero-stage model-viewer.hero-3d,.hero-stage img.hero-pic,.hero-stage svg.fallback'); }
  function openGPS() { return typeof w.__crazyOpenGPS === 'function' && w.__crazyOpenGPS(); }
  // Also intercept handlers retained in an older cached document. Only a stationary
  // double tap is consumed; single taps, dragging and multi-touch keep model controls.
  document.addEventListener('pointerdown', function (e) {
    if (!integrated() || !e.isTrusted) return;
    var target = hero(e.target);
    if (!target || !e.isPrimary || e.button !== 0) { pointer = null; lastTap = null; return; }
    pointer = { id: e.pointerId, target: target, x: e.clientX, y: e.clientY, time: e.timeStamp };
  }, true);
  document.addEventListener('pointermove', function (e) {
    if (pointer && pointer.id === e.pointerId && Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>12) { pointer=null; lastTap=null; }
  }, true);
  document.addEventListener('pointercancel', function () { pointer=null; lastTap=null; }, true);
  document.addEventListener('pointerup', function (e) {
    var tap=pointer; pointer=null;
    if (!integrated() || !e.isTrusted || !tap || tap.id!==e.pointerId || e.timeStamp-tap.time>300 ||
        hero(e.target)!==tap.target || Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>12) { lastTap=null; return; }
    if (lastTap && lastTap.target===tap.target && e.timeStamp-lastTap.time<360 && Math.hypot(tap.x-lastTap.x,tap.y-lastTap.y)<24) {
      lastTap=null; e.stopImmediatePropagation(); e.preventDefault(); openGPS();
    } else lastTap={target:tap.target,x:tap.x,y:tap.y,time:e.timeStamp};
  }, true);
  document.addEventListener('keydown', function (e) {
    if (integrated() && e.isTrusted && hero(e.target) && !e.repeat && ['Enter',' '].includes(e.key)) {
      e.stopImmediatePropagation(); e.preventDefault(); openGPS();
    }
  }, true);
  function install() {
    frame = 0;
    var app = w.APP, state = app && app.state;
    var twin = app && app.inductiveUi;
    if (integrated() && twin && !modules.has(twin)) {
      twin.openTwin = openGPS;
      // Never auto-open the removed screen while rendering another tab.
      twin.restoreRecording = function () { return Promise.resolve(false); };
      modules.add(twin);
    }
    if (integrated()) document.querySelectorAll('.hero-stage .inductive-hero').forEach(function (node) {
      var label = node.matches('model-viewer') ? '双击进入 GPS 骑行，拖动旋转车模' : '双击进入 GPS 骑行';
      if (node.getAttribute('aria-label') !== label) node.setAttribute('aria-label', label);
    });
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
