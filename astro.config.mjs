// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Static output keeps the knowledge library fast, inexpensive, and deployable to Pages.
export default defineConfig({
	output: 'static',
	site: 'https://hikmah.sanctum.workers.dev', // Replace with the production domain before launch.
	integrations: [sitemap()],
	fonts: [
		{
			name: 'Noto Sans Myanmar',
			cssVariable: '--font-myanmar',
			provider: fontProviders.google(),
			weights: [400, 500, 600, 700],
			styles: ['normal'],
			subsets: ['latin', 'myanmar'],
			fallbacks: ['sans-serif'],
		},
		{
			name: 'Noto Naskh Arabic',
			cssVariable: '--font-arabic',
			provider: fontProviders.google(),
			weights: [400, 500, 600, 700],
			styles: ['normal'],
			subsets: ['arabic'],
			fallbacks: ['serif'],
		},
	],
	vite: { plugins: [tailwindcss()] },
});
