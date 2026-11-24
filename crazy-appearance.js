// Crazy Panel presentation components. Existing service/action nodes keep their handlers.
(function(w){
  'use strict';
  const d=w.document;
  if(w.__crazyPresentationV4)return;w.__crazyPresentationV4=true;
  let observer,frame=0;
  function element(tag,cls,text){const e=d.createElement(tag);e.className=cls;if(text)e.textContent=text;return e;}
  function heading(kicker,title,detail){
    const h=element('header','cp-page-heading');
    h.append(element('span','cp-eyebrow',kicker),element('h1','cp-title',title),element('p','cp-description',detail));return h;
  }
  function compose(){
    frame=0;const page=d.querySelector('#scroll>.page');if(!page)return;
    const tab=w.APP?.state?.tab||'home';page.dataset.cpPage=tab;
    if(!page.querySelector(':scope>.cp-page-heading')){
      const titles={home:['YOUR GARAGE','爱车','车辆状态与常用操作'],settings:['VEHICLE SETTINGS','车辆设置','按车辆能力管理每一项功能'],me:['PERSONAL SPACE','我的','账号、记录与应用管理']};
      const t=titles[tab];if(t&&!page.querySelector('.boot-skeleton'))page.prepend(heading(...t));
    }
    const dashboard=page.querySelector('.dashboard[data-dashboard-default]');
    if(dashboard&&!dashboard.dataset.cpComposed){
      dashboard.dataset.cpComposed='true';
      const hero=dashboard.querySelector(':scope>.hero-card'),actions=dashboard.querySelector(':scope>.actions'),duo=dashboard.querySelector(':scope>.duo');
      if(hero){
        const garage=element('section','cp-vehicle-zone');garage.setAttribute('aria-label','车辆状态');
        dashboard.insertBefore(garage,hero);garage.append(hero);
        const name=element('div','cp-vehicle-name',w.APP?.state?.data?.home?.name||'我的爱车');hero.prepend(name);
        if(actions){const controls=element('section','cp-quick-controls');controls.append(element('h2','cp-section-title','常用操作'),actions);garage.append(controls);}
      }
      const insights=element('section','cp-insights');insights.setAttribute('aria-label','车辆概览');
      if(duo){dashboard.insertBefore(insights,duo);insights.append(duo);}
      const charge=dashboard.querySelector(':scope>.recent-charge-card');if(charge)insights.append(charge);
      const gps=element('button','cp-ride-entry');gps.type='button';
      gps.append(element('span','cp-eyebrow','CRAZY SPEED'),element('strong','','进入骑行'),element('span','','GPS 测速 · 轨迹与行程数据 →'));
      gps.addEventListener('click',()=>{if(typeof w.__crazyOpenGPS==='function')w.__crazyOpenGPS();else w.UI?.toast?.(w.APP?.phone?.(),'在 crazy面板 App 内使用 GPS 骑行');});
      insights.prepend(gps);
    }
    // Page composition is separate from vehicle/account logic; do not clone controls.
    if((tab==='me'||tab==='settings')&&!page.querySelector(':scope>.cp-collection-body')&&!page.querySelector('.boot-skeleton')){
      page.classList.add('cp-collection');
      const modules=element('div','cp-collection-body');
      for(const child of [...page.children])if(!child.classList.contains('cp-page-heading')){
        child.classList.add('cp-module');modules.append(child);
      }
      page.append(modules);
    }
  }
  function schedule(){if(!frame)frame=w.requestAnimationFrame(compose);}
  function start(){
    d.documentElement.classList.add('cs-panel');
    let style=d.getElementById('crazy-panel-appearance');
    if(!style){style=element('style','');style.id='crazy-panel-appearance';(d.head||d.documentElement).append(style);}
    style.textContent=CSS;
    compose();observer=new MutationObserver(schedule);observer.observe(d.body,{childList:true,subtree:true});
  }
  const CSS=String.raw`
html.cs-panel{--cs-page:#eff3f2;--cs-card:#ffffff;--cs-inset:#e3ebe8;--cs-ink:#14231f;--cs-muted:#5a6b65;--cs-line:#d8e3de;--cs-accent:#08765b;--cs-on-accent:#fff;--cs-soft:#d9f3e6}
html.cs-panel[data-theme="dark"]{--cs-page:#0c1418;--cs-card:#162127;--cs-inset:#223138;--cs-ink:#f0f7f3;--cs-muted:#a7bab1;--cs-line:#2b3f36;--cs-accent:#9ce8c2;--cs-on-accent:#12372b;--cs-soft:#203e32}
html.cs-panel{--bg-page:var(--cs-page)!important;--bg-surface:var(--cs-card)!important;--bg-inset:var(--cs-inset)!important;--md-sys-color-primary:var(--cs-accent)!important;--md-sys-color-on-primary:var(--cs-on-accent)!important;--md-sys-color-primary-container:var(--cs-soft)!important;--md-sys-color-on-primary-container:var(--cs-ink)!important;--md-sys-color-on-surface:var(--cs-ink)!important;--md-sys-color-on-surface-variant:var(--cs-muted)!important;--md-sys-color-surface:var(--cs-page)!important;--md-sys-color-surface-container:var(--cs-inset)!important;--md-sys-color-surface-container-low:var(--cs-page)!important;--md-sys-color-surface-container-high:var(--cs-inset)!important;--md-sys-color-outline-variant:var(--cs-line)!important}
.cs-panel body{background:var(--cs-page);color:var(--cs-ink)}
.cs-panel .stage{padding:0!important;place-items:stretch}
.cs-panel .phone{width:100%!important;max-width:none!important;height:100%!important;max-height:none!important;border-radius:0!important;box-shadow:none!important;margin:0;--gutter:20px}
.cs-panel #scroll{padding-left:calc(var(--gutter) + var(--sal));padding-right:calc(var(--gutter) + var(--sar));scroll-padding-bottom:120px}
.cs-panel #scroll>.page{width:100%;max-width:1280px;margin:auto;min-width:0}
.cs-panel .cp-page-heading{display:grid;gap:7px;padding:22px 2px 24px;margin:0}
.cs-panel .cp-eyebrow{font:700 10px/1.5 ui-monospace,monospace;letter-spacing:2.2px;color:var(--cs-accent)}
.cs-panel .cp-title{font-size:clamp(30px,6vw,42px);line-height:1.15;font-weight:800;letter-spacing:-1.2px;margin:0;color:var(--cs-ink)}
.cs-panel .cp-description{font-size:13px;line-height:1.6;color:var(--cs-muted);margin:0}
.cs-panel .dashboard[data-cp-composed]{display:grid;grid-template-columns:minmax(0,1fr);gap:20px;--d-card-radius:26px;--d-card-padding:20px;--d-number-size:36px;--gap:16px}
.cs-panel .cp-vehicle-zone,.cs-panel .cp-insights{display:flex;flex-direction:column;gap:18px;min-width:0}
.cs-panel .cp-vehicle-zone>.hero-card{padding:20px;background:var(--cs-card);border:1px solid var(--cs-line);border-radius:28px;overflow:visible;min-width:0}
.cs-panel .cp-vehicle-name{font-size:22px;font-weight:750;line-height:1.4;letter-spacing:-.4px;margin-bottom:14px;overflow-wrap:anywhere}
.cs-panel .hero-top{flex-wrap:wrap;gap:7px}
.cs-panel .hero-stage{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-areas:'soc volt' 'model model' 'front rear';gap:10px;align-items:center;height:auto!important;min-height:300px;margin:18px 0 16px;padding:0!important;position:relative}
.cs-panel .hero-stage>.bignum{position:static!important;transform:none!important;min-width:0;inset:auto!important;display:flex;flex-direction:column;align-items:flex-start;max-width:100%;margin:0!important;padding:12px!important;border-radius:16px;background:var(--cs-inset)}
.cs-panel .hero-stage>.bignum.left{grid-area:soc}
.cs-panel .hero-stage>.bignum.right{grid-area:volt;align-items:flex-end}
.cs-panel .hero-stage>.bignum b{font-size:clamp(27px,7vw,42px);line-height:1.15}
.cs-panel .hero-stage>.bignum.left:before{content:'电池电量';font-size:11px;color:var(--cs-muted);margin-bottom:6px}
.cs-panel .hero-stage>.bignum.right:before{content:'电池电压';font-size:11px;color:var(--cs-muted);margin-bottom:6px}
.cs-panel .hero-stage>img,.cs-panel .hero-stage>svg.fallback,.cs-panel .hero-stage>model-viewer{grid-area:model;position:relative!important;inset:auto!important;transform:none!important;width:100%!important;height:clamp(180px,25svh,300px)!important;max-height:320px;object-fit:contain;justify-self:center;margin:0!important}
.cs-panel .hero-stage .vs-model-fallback{grid-area:model;position:relative!important;inset:auto!important;min-height:180px}
.cs-panel .hero-stage>.tirebub{position:static!important;transform:none!important;inset:auto!important;display:flex;flex-wrap:wrap;justify-content:center;gap:5px;min-height:44px;box-sizing:border-box;border-radius:14px;background:var(--cs-inset);box-shadow:none;max-width:100%;padding:10px!important}
.cs-panel .hero-stage>.tirebub.left{grid-area:front}.cs-panel .hero-stage>.tirebub.right{grid-area:rear}
.cs-panel .hero-stage>.tirebub.left:before{content:'前轮';font-size:10px;color:var(--cs-muted)}
.cs-panel .hero-stage>.tirebub.right:before{content:'后轮';font-size:10px;color:var(--cs-muted)}
.cs-panel .hero-meta{line-height:1.8;flex-wrap:wrap;gap:5px 10px;font-size:11px;margin-top:14px}
.cs-panel .cp-section-title{font-size:12px;letter-spacing:1px;font-weight:600;color:var(--cs-muted);margin:0 0 10px}
.cs-panel .actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.cs-panel .action{min-height:82px;border-radius:20px;gap:9px;border:1px solid var(--cs-line);background:var(--cs-card);color:var(--cs-ink);box-shadow:none}
.cs-panel .action .lbl{font-size:12px}.cs-panel .action .ico{color:var(--cs-accent)}
.cs-panel .cp-ride-entry{display:grid;grid-template-columns:1fr auto;gap:7px;align-items:center;text-align:left;border:0;border-radius:24px;background:var(--cs-accent);color:var(--cs-on-accent);padding:20px;cursor:pointer;min-height:108px;width:100%}
.cs-panel .cp-ride-entry .cp-eyebrow{color:inherit;opacity:.8;grid-column:1/-1}
.cs-panel .cp-ride-entry strong{font-size:26px;font-weight:750;letter-spacing:-.7px;grid-column:1/-1}
.cs-panel .cp-ride-entry>span:last-child{font-size:12px;opacity:.9;grid-column:1/-1}
.cs-panel .dashboard .duo{display:grid;grid-template-columns:minmax(0,1fr);gap:18px}
.cs-panel .dashboard .duo>.card,.cs-panel .recent-charge-card{min-width:0;border:1px solid var(--cs-line);border-radius:24px;padding:18px;box-shadow:none;background:var(--cs-card)}
.cs-panel .dashboard .duo .mapbox.sm{height:160px;border-radius:16px}
.cs-panel .dashboard .duo .card-head{flex-wrap:wrap;row-gap:6px}.cs-panel .dashboard .duo .card-actions{margin-left:auto}
.cs-panel .dashboard .duo .tile .v{font-size:24px;line-height:1.3}.cs-panel .dashboard .duo .tile .k{font-size:11px;line-height:1.5}
.cs-panel .dashboard .loc-meta{flex-wrap:wrap;gap:5px;font-size:11px;line-height:1.5;margin-top:12px}
.cs-panel .cp-collection-body{display:grid;grid-template-columns:minmax(0,1fr);gap:18px;align-items:start}
.cs-panel .cp-collection-body>.cp-module{min-width:0;margin:0;grid-column:1/-1}
.cs-panel .cp-collection-body>.card,.cs-panel .cp-collection-body>.section{border-radius:24px;border:1px solid var(--cs-line);box-shadow:none;padding:20px;background:var(--cs-card)}
.cs-panel .cp-collection-body .card-title{font-size:18px;font-weight:750;letter-spacing:-.3px}
.cs-panel .cp-collection-body .card-sub{font-size:12px;line-height:1.6}
.cs-panel .cp-collection .listrow{min-height:60px;padding:15px 18px;gap:14px}
.cs-panel .tabbar{background:color-mix(in srgb,var(--cs-card) 85%,transparent)!important;border:1px solid var(--cs-line)!important;box-shadow:0 6px 24px #00000012}
.cs-panel .tabbar.cs-speed-integrated{max-width:none!important;margin:0!important}
.cs-panel .topbar-controls>.iconbtn{min-height:44px}
.cs-panel button:focus-visible,.cs-panel [role=button]:focus-visible{outline:3px solid var(--cs-accent);outline-offset:3px}
@media(min-width:760px){.cs-panel .phone{--gutter:28px}.cs-panel .dashboard[data-cp-composed]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:start}.cs-panel .dashboard[data-cp-composed]>.center{grid-column:1/-1}.cs-panel .hero-stage>img,.cs-panel .hero-stage>model-viewer{height:320px!important}.cs-panel .cp-collection-body{grid-template-columns:repeat(2,minmax(0,1fr))}.cs-panel .cp-collection-body>.card{grid-column:auto}}
@media(max-width:359px){.cs-panel .phone{--gutter:14px}.cs-panel .cp-vehicle-zone>.hero-card{padding:14px}.cs-panel .hero-stage{gap:8px}.cs-panel .hero-stage>.bignum b{font-size:29px}}
@media(prefers-reduced-transparency:reduce){.cs-panel .tabbar{background:var(--cs-card)!important}}
`;
  if(d.body)start();else d.addEventListener('DOMContentLoaded',start,{once:true});
  w.addEventListener('pagehide',()=>{observer?.disconnect();w.cancelAnimationFrame(frame);},{once:true});
})(window);
