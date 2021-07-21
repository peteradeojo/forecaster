const app = 'ForeCaster 0.1.1';
const cacheList = [
	'/',
	'/index.html',
	'main.js',
	'dist/style.css',
	'dist/style.css.map',
	'dist/colors.css',
	'dist/colors.css.map',
];

self.addEventListener('install', (e) => {
	console.log('installing');

	e.waitUntil(
		(async () => {
			let keys = await caches.keys();
			keys.forEach(async (key) => {
				if (key !== app) {
					await caches.delete(key);
				}
			});
			const cache = await caches.open(app);
			return await cache.addAll(cacheList);
		})(),
	);

	self.skipWaiting();
});

self.addEventListener('activate', (e) => {
	console.log('SW activated');
});

self.addEventListener('fetch', (e) => {
	e.preventDefault();
	e.respondWith(
		fetch(e.request)
			.then((response) => {
				if (response) {
					const clone = response.clone();
					caches.open(app).then((cache) => {
						cache.put(e.request, clone);
					});
					return response;
				}
			})
			.catch((err) => {
				return caches.open(app).then((cache) => {
					return cache.match(e.request);
				});
			}),
	);
});
