const CACHE_NAME='rogershub-pwa-v2-public-only';
const PUBLIC_PAGES=new Set(['/','/index.html','/about.html','/package.html','/pricing.html','/gallery.html','/blog.html','/news.html','/testimonials.html','/join.html','/contact.html','/privacy.html','/terms.html','/community.html','/faq.html','/portfolio.html','/reviews.html','/support.html','/careers.html','/404.html']);
const STATIC_FILES=new Set(['/manifest.webmanifest','/site.css','/site.js','/index.css','/index.js','/contact.css','/contact.js','/gallery.css','/gallery.js','/join.css','/join.js']);
const CORE=['/','/index.html','/about.html','/package.html','/pricing.html','/contact.html','/faq.html','/portfolio.html','/manifest.webmanifest','/site.css','/site.js','/assets/rogershub-app-icon.svg','/assets/rogershub-logo.svg'];
function cacheable(url){return PUBLIC_PAGES.has(url.pathname)||STATIC_FILES.has(url.pathname)||(url.pathname.startsWith('/assets/')&&/\.(svg|png|jpg|jpeg|webp|gif|ico|woff2?)$/i.test(url.pathname));}
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==self.location.origin||url.pathname.startsWith('/api/')||url.pathname.startsWith('/auth/'))return;
 if(!cacheable(url))return;
 event.respondWith(fetch(request).then(response=>{if(response.ok&&response.type==='basic'){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request).then(cached=>cached||(request.mode==='navigate'?caches.match('/index.html'):undefined))));
});