const CacheName = '23_49_04_Oct_21';
const assets = [
    '/Book-Cover-Template/',
    '/Book-Cover-Template/index.html',
    '/Book-Cover-Template/assets/reset.css',
    '/Book-Cover-Template/assets/style.css',
    '/Book-Cover-Template/assets/script.js',
    '/Book-Cover-Template/assets/images/icon_48.png',
    '/Book-Cover-Template/assets/images/icon_72.png',
    '/Book-Cover-Template/assets/images/icon_96.png',
    '/Book-Cover-Template/assets/images/icon_144.png',
    '/Book-Cover-Template/assets/images/icon_168.png',
    '/Book-Cover-Template/assets/images/icon_192.png',
    '/Book-Cover-Template/assets/images/icon_256.png',
    '/Book-Cover-Template/assets/images/icon_512.png'
];

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CacheName)
        .map(key => caches.delete(key))
      );
    }));
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});