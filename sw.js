const CACHE_NAME = 'final-stream-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/scenes/call/call.js',
    '/scenes/call/call.html',
    '/scenes/call/call.css',
    '/scenes/stream/stream.js',
    '/scenes/stream/stream.html',
    '/scenes/stream/stream.css',
    '/scenes/phonebook/phonebook.js',
    '/scenes/phonebook/phonebook.html',
    '/scenes/phonebook/phonebook.css',
    '/scenes/gps/gps.js',
    '/scenes/gps/gps.html',
    '/scenes/gps/gps.css',
    '/scenes/gps/track.png',
    '/scenes/dialer/dialer.js',
    '/scenes/dialer/dialer.html',
    '/scenes/dialer/dialer.css',
    '/scenes/dark-chat/dark-chat.js',
    '/scenes/dark-chat/dark-chat.html',
    '/scenes/dark-chat/dark-chat.css',
    '/scenes/chat/chat.js',
    '/scenes/chat/chat.html',
    '/scenes/chat/chat.css',
    '/scenes/stream-end/stream-end.js',
    '/scenes/stream-end/stream-end.html',
    '/scenes/stream-end/stream-end.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.ttf'
];

// Install event - cache all static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app assets');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // Clone the request because it can only be used once
                const fetchRequest = event.request.clone();

                // Make network request and cache the response
                return fetch(fetchRequest)
                    .then(response => {
                        // Check if response is valid
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response because it can only be used once
                        const responseToCache = response.clone();

                        // Cache the new resource
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // If both cache and network fail, show offline page
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
}); 