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
    function send(action,target){db.from('usage_events').insert({page,page_title:title,action:action||'view',target:target||null,session_id:visitorId,metadata:{referrer:document.referrer?new URL(document.referrer).pathname:null}}).then(()=>{}).catch(()=>{})}
    window.ricohTrack=function(action,target){send(action,target)};
    window.addEventListener('load',function(){send('view',null)});
    document.addEventListener('click',function(e){
      const a=e.target.closest('a');
      if(a){const href=a.getAttribute('href')||'';if(href&&!href.startsWith('#')&&!href.startsWith('javascript:')){let target=href;try{target=new URL(href,location.href).pathname.split('/').pop()||'index.html'}catch(_){}send('click',target)}}
      const b=e.target.closest('button');
      if(b){const text=(b.innerText||b.getAttribute('aria-label')||'').trim();if(text)send('button',text.slice(0,80))}
    },true);
  };
  if(window.supabase)start();else{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=start;document.head.appendChild(s)}
})();