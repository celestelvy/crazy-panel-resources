// Shared integration hooks for the owned panel artifact; no account or vehicle data is copied.
(function(w){
  'use strict';
  if(w!==w.top || w.__crazyCacheIntegration) return;
  w.__crazyCacheIntegration=true;
  w.__crazyConfigureCache=function(r){
    if(r.configured)return;
    r.configured=true;
    [['gpsPlaces','GPS 地名缓存','内存中的地名文本，大小为估算；清理后按需查询。'],
     ['gpsNetwork','App 网络响应缓存','原生网络内存和磁盘缓存，与网页网络缓存分别统计。']].forEach(function(item){
      var id='native:'+item[0];r.allowed.add(id);r.known.add(id);
      if(!r.recommended.includes(id))r.recommended.push(id);
      r.meta[id]=item.slice(1);
    });
    var records='native:gpsRecords';r.known.add(records);
    if(!r.protected.includes(records))r.protected.push(records);
    r.meta[records]=['GPS 骑行记录与草稿','轨迹、未结束骑行与备份均保留，请到 GPS 骑行历史管理。'];
  };
  function size(bytes){
    var units=['B','KB','MB','GB'],i=0;
    while(bytes>=1024 && i<3){bytes/=1024;i++;}
    return (i?bytes.toFixed(1):Math.round(bytes))+' '+units[i];
  }
  w.__crazyCacheFooter=function(state,selected,busy){
    var known=0,unknown=false,estimated=false;
    selected.forEach(function(row){
      if(Number.isSafeInteger(row.bytes)&&row.bytes>=0)known+=row.bytes;else unknown=true;
      if(row.id==='native:gpsPlaces')estimated=true;
    });
    var total=(estimated?'约 ':'')+size(known)+(unknown?' + 未统计部分':'');
    return '<div class="cache-actions"><span class="cache-selection" aria-live="polite">'+
      (selected.length?'已选 '+selected.length+' 项 · 骑行与账号数据保留':'请勾选需要清理的缓存')+
      '</span><button class="btn" data-act="cacheconfirm" '+(busy||!selected.length?'disabled':'')+
      '><span>清理已选缓存'+(selected.length?' · '+total:'')+'</span></button></div>';
  };
  var style=document.createElement('style');style.id='crazy-cache-layout';
  style.textContent='.cache-actions{display:flex;flex-direction:column;gap:10px;flex-shrink:0;padding:12px 18px max(12px,var(--sab,0px));box-sizing:border-box}.cache-actions>.btn{width:100%;min-height:48px;height:auto;white-space:normal;padding:12px 16px}.cache-actions>.btn span{white-space:normal;line-height:1.5;overflow-wrap:anywhere}.cache-selection{white-space:normal;text-align:center;line-height:1.5}.cache-sheet{box-sizing:border-box;max-height:100%}.cache-sheet .sheet-body{min-height:0;overflow:auto}';
  function mountStyle(){
    if(!document.getElementById(style.id)) (document.head||document.documentElement).appendChild(style);
  }
  if(document.documentElement)mountStyle();else document.addEventListener('DOMContentLoaded',mountStyle,{once:true});
})(window);
