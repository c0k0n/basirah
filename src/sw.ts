/// <reference lib="webworker" />
import {
	cleanupOutdatedCaches,
	matchPrecache,
	precacheAndRoute,
} from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

declare let self: ServiceWorkerGlobalScope;

// Precache the app shell (JS/CSS/fonts) and the 404 document. The manifest
// is injected by @vite-pwa/astro at build time.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Cache visited HTML pages at runtime so they work offline. This is the ONLY
// navigation handler, so real pages are served correctly (stale-while-
// revalidate) instead of being hijacked by a 404 fallback.
registerRoute(
	({ request }) => request.mode === "navigate",
	new StaleWhileRevalidate({
		cacheName: "pages",
		plugins: [
			new ExpirationPlugin({ maxEntries: 120, maxAgeSeconds: 86400 }),
			new CacheableResponsePlugin({ statuses: [0, 200] }),
		],
	}),
);

// Offline / failed navigation fallback: only when a navigation can neither be
// fetched from the network nor served from the "pages" cache do we show the
// precached 404 document. The 404 doc is registered under the "/404" key by
// Workbox's directoryAndTrailingSlashHandler, so matchPrecache("/404").
setCatchHandler(async ({ request }): Promise<Response> => {
	if (request.mode === "navigate") {
		return (await matchPrecache("/404")) ?? Response.error();
	}
	return Response.error();
});

self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.skipWaiting();
