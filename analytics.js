(function(){
  const SUPABASE_URL='https://ppzdwearxmxrkqgcphvt.supabase.co';
  const SUPABASE_KEY='sb_publishable_S9TK4Q45LNUE-iD2QeNeZQ_-_KvRBFb';
  const start=function(){
    if(!window.supabase)return;
    const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    const key='ricoh_smart_hub_visitor_id';
    let visitorId=localStorage.getItem(key);
    if(!visitorId){visitorId=(crypto.randomUUID?crypto.randomUUID():'v-'+Date.now()+'-'+Math.random().toString(36).slice(2));localStorage.setItem(key,visitorId)}
    const page=location.pathname.split('/').pop()||'index.html';
    const title=document.title||page;
    function send(action,target,metadata){db.from('usage_events').insert({page,page_title:title,action:action||'view',target:target||null,session_id:visitorId,metadata:Object.assign({referrer:document.referrer?new URL(document.referrer).pathname:null},metadata||{})}).then(()=>{}).catch(()=>{})}
    window.ricohTrack=function(action,target,metadata){send(action,target,metadata)};
    function addRecent(){let arr=[];try{arr=JSON.parse(localStorage.getItem('ricoh_smart_hub_recent')||'[]')}catch(_){};arr=arr.filter(x=>x.url!==location.href);arr.unshift({url:location.href,title,at:new Date().toISOString()});localStorage.setItem('ricoh_smart_hub_recent',JSON.stringify(arr.slice(0,30)))}
    window.ricohFavorite=function(item){let arr=[];try{arr=JSON.parse(localStorage.getItem('ricoh_smart_hub_favorites')||'[]')}catch(_){};const k=item.key||item.url;const i=arr.findIndex(x=>(x.key||x.url)===k);if(i>=0){arr.splice(i,1);send('favorite_remove',k)}else{arr.unshift(item);send('favorite_add',k)}localStorage.setItem('ricoh_smart_hub_favorites',JSON.stringify(arr.slice(0,100)));return i<0};
    window.ricohIsFavorite=function(k){try{return JSON.parse(localStorage.getItem('ricoh_smart_hub_favorites')||'[]').some(x=>(x.key||x.url)===k)}catch(_){return false}};
    function injectHubNav(){if(document.getElementById('hubDock'))return;const d=document.createElement('div');d.id='hubDock';d.innerHTML='<a href="search.html">⌕ 全站搜尋</a><a href="cases.html">🛠 維修案例</a><a href="announcements.html">📢 公告</a><a href="favorites.html">★ 收藏</a><a href="ai.html">🤖 AI 助理</a>';Object.assign(d.style,{position:'fixed',right:'16px',bottom:'16px',zIndex:9999,display:'flex',gap:'6px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'430px'});d.querySelectorAll('a').forEach(a=>Object.assign(a.style,{background:'#08295d',color:'#fff',padding:'8px 10px',borderRadius:'8px',font:'700 11px Arial,sans-serif',textDecoration:'none',boxShadow:'0 5px 18px #08295d33'}));document.body.appendChild(d)}
    function injectQrHistory(){if(page!=='qr.html'||document.getElementById('qrMachineHistory'))return;const input=document.querySelector('#machine,#machineNo,#machine-number,input[name="machine"]');if(!input)return;const a=document.createElement('a');a.id='qrMachineHistory';a.textContent='查看此機號維修履歷 →';a.target='_blank';Object.assign(a.style,{display:'inline-block',marginTop:'8px',color:'#0878e8',fontWeight:'800',fontSize:'12px'});const sync=()=>{a.href='machine.html?machine='+encodeURIComponent(input.value.trim());a.style.opacity=input.value.trim()?'1':'.45'};input.addEventListener('input',sync);sync();input.parentElement?.appendChild(a)}
    addRecent();
    window.addEventListener('load',function(){send('view',null);injectHubNav();injectQrHistory()});
    document.addEventListener('click',function(e){
      const a=e.target.closest('a');
      if(a){const href=a.getAttribute('href')||'';if(href&&!href.startsWith('#')&&!href.startsWith('javascript:')){let target=href;try{target=new URL(href,location.href).pathname.split('/').pop()||'index.html'}catch(_){}send('click',target)}}
      const b=e.target.closest('button');
      if(b){const text=(b.innerText||b.getAttribute('aria-label')||'').trim();if(text)send('button',text.slice(0,80))}
    },true);
    document.querySelectorAll('input[type="search"],#q,#search').forEach(input=>{let timer=null,last='';input.addEventListener('input',function(){clearTimeout(timer);const value=input.value.trim().slice(0,80);timer=setTimeout(()=>{if(value&&value!==last){last=value;send('search',value)}},700)})});
  };
  if(window.supabase)start();else{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=start;document.head.appendChild(s)}
})();