const C="antor-v3";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(clients.claim()));
self.addEventListener("fetch",e=>{const r=e.request,h=new URL(r.url).hostname;
if(r.method!=="GET"||/accounts\.google\.com$/.test(h)||/googleapis\.com$/.test(h)&&!/fonts/.test(h))return;
e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(C).then(k=>k.put(r,c));return x}).catch(()=>caches.match(r,{ignoreSearch:true})))});
