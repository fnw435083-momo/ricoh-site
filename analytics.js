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
    window.ricohFavorite=function(item){let arr=[];try{arr=JSON.parse(localStorage.getItem('ricoh_smart_hub_favorites')||'[]')}catch(_){};const key=item.key||item.url;const i=arr.findIndex(x=>(x.key||x.url)===key);if(i>=0){arr.splice(i,1);send('favorite_remove',key)}else{arr.unshift(item);send('favorite_add',key)}localStorage.setItem('ricoh_smart_hub_favorites',JSON.stringify(arr.slice(0,100)));return i<0};
    window.ricohIsFavorite=function(key){try{return JSON.parse(localStorage.getItem('ricoh_smart_hub_favorites')||'[]').some(x=>(x.key||x.url)===key)}catch(_){return false}};
    addRecent();
    window.addEventListener('load',function(){send('view',null)});
    document.addEventListener('click',function(e){
      const a=e.target.closest('a');
      if(a){const href=a.getAttribute('href')||'';if(href&&!href.startsWith('#')&&!href.startsWith('javascript:')){let target=href;try{target=new URL(href,location.href).pathname.split('/').pop()||'index.html'}catch(_){}send('click',target)}}
      const b=e.target.closest('button');
      if(b){const text=(b.innerText||b.getAttribute('aria-label')||'').trim();if(text)send('button',text.slice(0,80))}
    },true);
    const searchInputs=document.querySelectorAll('input[type="search"],#q,#search');
    searchInputs.forEach(input=>{let timer=null,last='';input.addEventListener('input',function(){clearTimeout(timer);const value=input.value.trim().slice(0,80);timer=setTimeout(()=>{if(value&&value!==last){last=value;send('search',value)}},700)})});
  };
  if(window.supabase)start();else{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=start;document.head.appendChild(s)}
})();