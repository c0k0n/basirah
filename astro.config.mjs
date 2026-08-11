// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
	output: 'static',
	site: 'https://hikmah.sanctum.workers.dev',
	integrations: [sitemap()],
	vite: { plugins: [tailwindcss()] },
	fonts: [
		{
			name: 'Noto Sans Myanmar',
			cssVariable: '--font-myanmar',
			provider: fontProviders.google(),
			weights: [400, 500, 600, 700],
			styles: ['normal'],
			subsets: ['myanmar'],
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
});
