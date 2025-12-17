/* 
 * Shand Medical Centre - Service Worker
 * Enables offline functionality and PWA capabilities
 */

const CACHE_NAME = 'shand-medical-v1.0.0';
const RUNTIME_CACHE = 'shand-runtime-v1';

// Assets to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/offline.html'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Pre-caching core assets');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                        .map((name) => {
                            console.log('[Service Worker] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Claiming clients');
                try {
                    return self.clients.claim();
                } catch (e) {
                    console.log('[Service Worker] Claim skipped - already active');
                }
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Skip Firebase Auth requests (always fetch fresh)
    if (url.pathname.includes('firebaseauth') ||
        url.pathname.includes('identitytoolkit') ||
        url.pathname.includes('securetoken')) {
        return event.respondWith(fetch(request));
    }

    // Skip API calls to Firestore (let Firestore handle offline)
    if (url.pathname.includes('firestore.googleapis.com')) {
        return event.respondWith(fetch(request));
    }

    // For navigation requests (HTML pages)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache successful navigation responses
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // If offline, serve cached version or offline page
                    return caches.match(request)
                        .then((cachedResponse) => {
                            return cachedResponse || caches.match('/offline.html');
                        });
                })
        );
        return;
    }

    // For all other requests - Network first, fallback to cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache successful responses
                if (response.ok && request.method === 'GET') {
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // If network fails, try cache
                return caches.match(request);
            })
    );
});

// Background sync event - sync data when back online
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);

    if (event.tag === 'sync-hospital-data') {
        event.waitUntil(
            syncHospitalData()
        );
    }
});

// Sync function
async function syncHospitalData() {
    console.log('[Service Worker] Syncing hospital data...');

    try {
        // Get all pending sync items from IndexedDB
        const db = await openDatabase();
        const pendingItems = await getPendingItems(db);

        if (pendingItems.length === 0) {
            console.log('[Service Worker] No pending items to sync');
            return;
        }

        // Sync each item
        for (const item of pendingItems) {
            await syncItem(item);
        }

        console.log('[Service Worker] Sync complete!');

        // Notify clients
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'SYNC_COMPLETE',
                    count: pendingItems.length
                });
            });
        });
    } catch (error) {
        console.error('[Service Worker] Sync failed:', error);
    }
}

// Helper functions (placeholders - will integrate with your data layer)
async function openDatabase() {
    // Placeholder - integrate with your IndexedDB implementation
    return null;
}

async function getPendingItems(db) {
    // Placeholder - get items from sync queue
    return [];
}

async function syncItem(item) {
    // Placeholder - sync individual item to Firestore
    console.log('[Service Worker] Syncing item:', item);
}

// Message event - listen for commands from main thread
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);

    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data.type === 'CACHE_URLS') {
        const urls = event.data.urls;
        event.waitUntil(
            caches.open(RUNTIME_CACHE).then((cache) => {
                return cache.addAll(urls);
            })
        );
    }
});

console.log('[Service Worker] Service Worker loaded successfully!');
