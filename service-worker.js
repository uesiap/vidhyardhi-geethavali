const CACHE_NAME = 'melam-rahul';
const urlsToCache = [
  '/vidhyardhi-geethavali/',
  '/vidhyardhi-geethavali/index.html',
  '/vidhyardhi-geethavali/Icon192.jpg',
  '/vidhyardhi-geethavali/Icon521.jpg',
  '/vidhyardhi-geethavali/uesisongsmain.jpg'  // Add the splash screen image to the cache
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching');
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Service Worker: Cache hit');
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('Service Worker: Invalid response');
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('Service Worker: Caching new resource');
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(error => {
        console.error('Service Worker: Fetch error:', error);
      })
  );
});
