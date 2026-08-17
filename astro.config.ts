import sitemap from "@astrojs/sitemap";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig, fontProviders } from "astro/config";
import { SITE } from "./src/site.config";

export default defineConfig({
	output: "static",
	site: "https://basirah.pages.dev",
	// CSS is externalized to a single hashed, immutable /_astro/*.css file
	// (served with Cache-Control: immutable). Inlining into every one of the
	// ~140 HTML pages duplicated ~7.5KB each, defeated shared caching, and
	// inflated every ClientRouter view-transition swap.
	build: {
		inlineStylesheets: "auto",
	},
	integrations: [
		sitemap({ lastmod: new Date() }),
		AstroPWA({
			registerType: "autoUpdate",
			injectRegister: false,
			strategies: "injectManifest",
			srcDir: "src",
			filename: "sw.ts",
			// Build the service worker as a single IIFE bundle. Avoids the
			// deprecated `inlineDynamicImports` rollup option (and its warning)
			// that vite-plugin-pwa otherwise applies to the ES-module SW build.
			injectManifest: {
				rollupFormat: "iife",
			},
			includeAssets: [
				"favicon.svg",
				"favicon.ico",
				"apple-touch-icon-180x180.png",
				"pwa-64x64.png",
				"pwa-192x192.png",
				"pwa-512x512.png",
				"maskable-icon-512x512.png",
			],
			manifest: {
				name: SITE.title,
				short_name: SITE.shortName,
				description: SITE.description,
				lang: "my",
				start_url: "/",
				display: "standalone",
				theme_color: "#101613",
				background_color: "#101613",
				icons: [
					{
						src: "pwa-64x64.png",
						sizes: "64x64",
						type: "image/png",
					},
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "maskable-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				// Precache only the app shell assets (JS/CSS/fonts) plus the 404
				// document. HTML pages are cached at runtime (StaleWhileRevalidate,
				// see src/sw.ts) so the first SW install no longer forces a ~4MB
				// download of every page. The 404 doc must be precached so the
				// catch handler can serve it offline on a failed navigation.
				globPatterns: ["**/*.{js,css,woff2}", "404.html"],
				cleanupOutdatedCaches: true,
			},
			experimental: {
				directoryAndTrailingSlashHandler: true,
			},
		}),
	],
	fonts: [
		{
			name: "Noto Serif Myanmar",
			cssVariable: "--font-myanmar-serif",
			provider: fontProviders.google(),
			weights: [400, 700],
			styles: ["normal"],
			subsets: ["myanmar"],
			fallbacks: ["serif"],
		},
		{
			name: "Noto Sans Myanmar",
			cssVariable: "--font-myanmar-sans",
			provider: fontProviders.google(),
			weights: ["400 700"],
			styles: ["normal"],
			subsets: ["myanmar"],
			fallbacks: ["sans-serif"],
		},
		{
			name: "Noto Naskh Arabic",
			cssVariable: "--font-arabic",
			provider: fontProviders.google(),
			weights: ["400 700"],
			styles: ["normal"],
			subsets: ["arabic"],
			fallbacks: ["serif"],
		},
		{
			name: "Noto Serif",
			cssVariable: "--font-serif",
			provider: fontProviders.google(),
			weights: ["400 700"],
			styles: ["normal"],
			fallbacks: ["serif"],
		},
		{
			name: "Noto Sans",
			cssVariable: "--font-sans",
			provider: fontProviders.google(),
			weights: ["400 700"],
			styles: ["normal"],
			fallbacks: ["sans-serif"],
		},
		{
			name: "Noto Sans Mono",
			cssVariable: "--font-mono",
			provider: fontProviders.google(),
			weights: ["400 700"],
			styles: ["normal"],
			fallbacks: ["monospace"],
		},
		{
			name: "Material Symbols Outlined",
			cssVariable: "--font-icons",
			provider: fontProviders.googleicons(),
			weights: ["400 700"],
			styles: ["normal"],
			fallbacks: ["sans-serif"],
			options: {
				experimental: {
					glyphs: [
						"menu",
						"home",
						"search",
						"play_arrow",
						"pause",
						"book",
						"favorite",
						"arrow_back",
						"arrow_forward",
						"dark_mode",
						"light_mode",
						"close",
						"star",
						"chevron_right",
						"chevron_left",
						"translate",
						"location_on",
						"123",
						"format_list_numbered",
						"menu_book",
						"volunteer_activism",
						"auto_awesome",
					],
				},
			},
		},
	],
});
