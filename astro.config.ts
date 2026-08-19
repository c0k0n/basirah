import sitemap from "@astrojs/sitemap";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig, fontProviders } from "astro/config";
import { SITE } from "./src/site.config";

const iconGlyphGroups = [
	[
		"arrow_back",
		"arrow_forward",
		"auto_awesome",
		"book",
		"chevron_left",
		"chevron_right",
		"close",
		"favorite",
		"format_list_numbered",
		"home",
	],
	[
		"location_on",
		"menu",
		"menu_book",
		"pause",
		"play_arrow",
		"search",
		"star",
		"translate",
		"volunteer_activism",
		"123",
	],
];

export default defineConfig({
	output: "static",
	site: "https://basirah.pages.dev",
	integrations: [
		sitemap(),
		AstroPWA({
			registerType: "autoUpdate",
			injectRegister: "script",
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
					{ src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
					{ src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
					{ src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
					{
						src: "maskable-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,woff2}"],
				cleanupOutdatedCaches: true,
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
		...iconGlyphGroups.map((glyphs, index) => ({
			name: "Material Symbols Outlined",
			cssVariable: `--font-icons-${index + 1}`,
			provider: fontProviders.googleicons(),
			weights: [400] as [number],
			styles: ["normal"] as ["normal"],
			fallbacks: ["sans-serif"],
			options: { experimental: { glyphs } },
		})),
	],
});
