const C="antor-v4";
self.addEventListener("install",e=>e.waitUntil(
 caches.open(C).then(c=>Promise.all(["./","index.html"].map(u=>fetch(u,{cache:"reload"}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))).then(()=>self.skipWaiting())
));
self.addEventListener("activate",e=>e.waitUntil(clients.claim()));
self.addEventListener("fetch",e=>{
 const r=e.request,u=new URL(r.url),h=u.hostname;
 if(r.method!=="GET"||/accounts\.google\.com$/.test(h)||/googleapis\.com$/.test(h)&&!/fonts/.test(h))return;
 const same=u.origin===location.origin;
 e.respondWith(
  fetch(r,same?{cache:"no-cache"}:undefined).then(x=>{
   if(x&&(x.ok||x.type==="opaque")){const c=x.clone();caches.open(C).then(k=>k.put(r,c))}
   return x
  }).catch(()=>caches.open(C).then(k=>k.match(r,{ignoreSearch:true})).then(m=>m||caches.match(r,{ignoreSearch:true})))
 )});
