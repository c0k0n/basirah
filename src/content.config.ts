import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const verse = z.object({
	verse_number: z.number(),
	arabic: z.string(),
	english_translation: z.string(),
	burmese_translation: z.string(),
	burmese_transliteration: z.string(),
});

const surahs = defineCollection({
	loader: glob({
		base: './src/assets/content/essential-surahs',
		pattern: '*.json',
	}),
	schema: z.object({
		surah_metadata: z.object({
			surah_number: z.number(),
			name_arabic: z.string(),
			name_transliteration: z.string(),
			name_burmese_title: z.string(),
			meaning_of_title: z.object({ english: z.string(), burmese: z.string() }),
			revelation_place: z.object({ english: z.string(), burmese: z.string() }),
			total_verses: z.number(),
			summary_burmese: z.string(),
		}),
		bismillah: z
			.object({
				arabic: z.string(),
				english_translation: z.string(),
				burmese_translation: z.string(),
				burmese_transliteration: z.string(),
			})
			.optional(),
		verses: z.array(verse),
	}),
});

const duas = defineCollection({
	loader: glob({ base: './src/assets/content/essential-duas', pattern: 'duas.json' }),
	schema: z.object({
		title: z.string(),
		language: z.object({ source: z.array(z.string()) }),
		items: z.array(
			z.object({
				id: z.number(),
				title_mm: z.string(),
				title_en: z.string(),
				arabic: z.string(),
				burmese_pronunciation: z.string(),
				english_meaning: z.string(),
				burmese_meaning: z.string(),
			}),
		),
	}),
});

const names = defineCollection({
	loader: glob({ base: './src/assets/content/99-names', pattern: 'names.json' }),
	schema: z.object({
		metadata: z.object({
			title_arabic: z.string(),
			title_transliteration: z.string(),
			title_burmese: z.string(),
			summary_burmese: z.string(),
		}),
		names: z.array(
			z.object({
				number: z.number(),
				arabic: z.string(),
				transliteration: z.string(),
				english_meaning: z.string(),
				burmese_meaning: z.string(),
				burmese_transliteration: z.string(),
			}),
		),
	}),
});

export const collections = { surahs, duas, names };
