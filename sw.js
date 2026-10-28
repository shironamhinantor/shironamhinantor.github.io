const C="antor-v11";
self.addEventListener("install",e=>e.waitUntil(
 caches.open(C).then(c=>Promise.all(["./","index.html"].map(u=>fetch(u,{cache:"reload"}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))).then(()=>self.skipWaiting())
));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{
 const r=e.request,u=new URL(r.url),h=u.hostname;
 if(r.method!=="GET"||/accounts\.google\.com$/.test(h)||/googleapis\.com$/.test(h)&&!/fonts/.test(h))return;
 const same=u.origin===location.origin;
 if(!same){
  /* libraries & fonts: cache first, refresh in background */
  e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>{
   const f=fetch(r).then(x=>{if(x&&(x.ok||x.type==="opaque"))c.put(r,x.clone());return x}).catch(()=>m);
   return m||f})));
  return}
 /* own pages: network first, but fall back to the saved copy if the network is slow */
 e.respondWith(new Promise(res=>{
  let done=false;const fb=()=>caches.open(C).then(k=>k.match(r,{ignoreSearch:true})).then(m=>m||caches.match(r,{ignoreSearch:true}));
  const t=setTimeout(()=>fb().then(m=>{if(m&&!done){done=true;res(m)}}),3000);
  fetch(r,{cache:"no-cache"}).then(x=>{clearTimeout(t);if(x&&x.ok){const c=x.clone();caches.open(C).then(k=>k.put(r,c))}if(!done){done=true;res(x)}}).catch(()=>{clearTimeout(t);fb().then(m=>{if(!done){done=true;res(m||Response.error())}})})
 }))});
