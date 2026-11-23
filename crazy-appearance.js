// Shared full-window presentation. This changes appearance only, never vehicle data/actions.
(function () {
  'use strict';
  var d = document;
  function install() {
    if (d.getElementById('crazy-panel-appearance')) return;
    d.documentElement.classList.add('cs-panel');
    var style = d.createElement('style'); style.id = 'crazy-panel-appearance';
    style.textContent = `
html.cs-panel{--cs-page:#f4f3f8;--cs-card:#ffffff;--cs-inset:#eceaf3;--cs-ink:#211e29;--cs-muted:#686372;--cs-line:#dedbe7}
html.cs-panel[data-theme="dark"]{--cs-page:#131218;--cs-card:#211f29;--cs-inset:#2c2936;--cs-ink:#f1edf7;--cs-muted:#b6afc3;--cs-line:#3b3548}
html.cs-panel{--bg-page:var(--cs-page)!important;--bg-surface:var(--cs-card)!important;--bg-inset:var(--cs-inset)!important;--md-sys-color-on-surface:var(--cs-ink)!important;--md-sys-color-on-surface-variant:var(--cs-muted)!important;--md-sys-color-surface:var(--cs-page)!important;--md-sys-color-surface-container:var(--cs-inset)!important;--md-sys-color-surface-container-low:var(--cs-page)!important;--md-sys-color-surface-container-high:var(--cs-inset)!important;--md-sys-color-outline-variant:var(--cs-line)!important}
.cs-panel body{background:var(--cs-page)}
.cs-panel .stage{padding:0!important;place-items:stretch}
.cs-panel .phone{width:100%!important;max-width:none!important;height:100%!important;max-height:none!important;border-radius:0!important;box-shadow:none!important;margin:0;--gutter:16px}
.cs-panel #scroll{display:flex;flex-direction:column;padding-left:calc(var(--gutter) + var(--sal));padding-right:calc(var(--gutter) + var(--sar));scroll-padding-bottom:120px}
.cs-panel #scroll>.page{flex:1 0 auto;min-width:0}
.cs-panel .dashboard{flex:1 0 auto;--d-card-radius:26px;--d-card-padding:18px;--d-number-size:38px;--gap:14px}
.cs-panel .dashboard[data-dashboard-default]>.hero-card{display:flex;flex-direction:column;flex:1 0 auto;padding:18px}
.cs-panel .dashboard[data-dashboard-default] .hero-stage{flex:1 0 auto;height:auto;min-height:clamp(190px,27svh,340px);margin:12px 0 8px;padding:48px 0 32px;box-sizing:border-box}
.cs-panel .dashboard[data-dashboard-default] .hero-stage>.bignum{top:0;transform:none;min-height:44px;margin:0;padding:0}
.cs-panel .dashboard[data-dashboard-default] .hero-stage>img,.cs-panel .dashboard[data-dashboard-default] .hero-stage>svg.fallback{max-width:90%;max-height:190px;width:auto;height:auto;object-fit:contain}
.cs-panel .dashboard[data-dashboard-default] .hero-stage model-viewer.hero-3d{height:clamp(150px,22svh,300px);width:100%}
.cs-panel .dashboard[data-dashboard-default] .hero-stage .vs-model-fallback{inset:48px 0 32px}
.cs-panel .dashboard[data-dashboard-default] .hero-stage>.tirebub{bottom:0;min-height:30px;align-items:center;box-sizing:border-box}
.cs-panel .dashboard .hero-meta{line-height:1.6;gap:6px 10px;margin-top:12px}
.cs-panel .dashboard .actions{gap:12px}
.cs-panel .dashboard .action{min-height:76px;border-radius:22px;gap:8px}
.cs-panel .dashboard .duo>.card{padding:16px 12px;min-width:0}
.cs-panel .dashboard .duo .tile .k{font-size:11px;line-height:1.5}
.cs-panel .dashboard .duo .tile .v{font-size:17px;line-height:1.45}
.cs-panel .dashboard .duo .mapbox.sm{height:120px}
.cs-panel .dashboard .duo .card-head{flex-wrap:wrap;row-gap:6px}
.cs-panel .dashboard .duo .card-actions{margin-left:auto}
.cs-panel .dashboard .loc-meta{flex-wrap:wrap;gap:4px;font-size:11px;line-height:1.5}
.cs-panel .tabbar{background:color-mix(in srgb,var(--cs-card) 82%,transparent)!important;border:1px solid var(--cs-line)!important;box-shadow:0 8px 30px #00000012}
.cs-panel .tabbar.cs-speed-integrated{max-width:none!important;margin:0!important}
.cs-panel .topbar-controls>.iconbtn{min-height:44px}
@media(min-width:760px){
 .cs-panel .phone{--gutter:24px}
 .cs-panel .dashboard[data-dashboard-default]{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);align-content:stretch;align-items:stretch}
 .cs-panel .dashboard[data-dashboard-default]>.hero-card{grid-column:1;grid-row:1 / span 3}
 .cs-panel .dashboard[data-dashboard-default]>.actions,.cs-panel .dashboard[data-dashboard-default]>.duo,.cs-panel .dashboard[data-dashboard-default]>.recent-charge-card{grid-column:2}
 .cs-panel .dashboard[data-dashboard-default]>.center:last-child{grid-column:1 / -1}
 .cs-panel .dashboard[data-dashboard-default] .hero-stage>img,.cs-panel .dashboard[data-dashboard-default] .hero-stage>svg.fallback{max-height:320px;width:90%}
}
@media(max-width:359px){
 .cs-panel .phone{--gutter:12px}
 .cs-panel .dashboard{--gap:10px;--d-number-size:32px}
 .cs-panel .dashboard[data-dashboard-default]>.hero-card{padding:14px}
 .cs-panel .dashboard .duo{grid-template-columns:minmax(0,1fr)}
 .cs-panel .dashboard .duo>.card{padding:16px}
}
@media(prefers-reduced-transparency:reduce){.cs-panel .tabbar{background:var(--cs-card)!important}}
`;
    (d.head || d.documentElement).appendChild(style);
  }
  if (d.documentElement) install(); else d.addEventListener('DOMContentLoaded', install, {once:true});
})();
