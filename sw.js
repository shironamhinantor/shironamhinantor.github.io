const C="antor-v13";
self.addEventListener("install",e=>e.waitUntil(
 caches.open(C).then(c=>Promise.all(["./","index.html"].map(u=>fetch(u,{cache:"reload"}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))).then(()=>self.skipWaiting())
));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{
 const r=e.request,u=new URL(r.url),h=u.hostname;
 if(r.method!=="GET"||/accounts\.google\.com$/.test(h)||/googleapis\.com$/.test(h)&&!/fonts/.test(h))return;
 const same=u.origin===location.origin;
 if(!same){
  /* Network-first for libraries and fonts: prefer current versions, use cache offline. */
  e.respondWith(caches.open(C).then(async c=>{
   try{const x=await fetch(r,{cache:"no-cache"});if(x&&(x.ok||x.type==="opaque"))c.put(r,x.clone()).catch(()=>{});return x}
   catch(_){const m=await c.match(r);return m||Response.error()}
  }));return}
 /* Own pages: network-first, with a short offline fallback. */
 e.respondWith(new Promise(res=>{
  let done=false;const fb=()=>caches.open(C).then(k=>k.match(r,{ignoreSearch:true})).then(m=>m||caches.match(r,{ignoreSearch:true}));
  const t=setTimeout(()=>fb().then(m=>{if(m&&!done){done=true;res(m)}}),3000);
  fetch(r,{cache:"no-cache"}).then(x=>{clearTimeout(t);if(x&&x.ok)caches.open(C).then(k=>k.put(r,x.clone()));if(!done){done=true;res(x)}}).catch(()=>{clearTimeout(t);fb().then(m=>{if(!done){done=true;res(m||Response.error())}})})
 }));
});
