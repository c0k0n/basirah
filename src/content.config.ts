import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const surahs = defineCollection({
	loader: glob({
		pattern: "**/*.json",
		base: "./src/assets/content/essential-surahs",
	}),
	schema: z.object({
		surah_metadata: z.object({
			surah_number: z.number(),
			name_arabic: z.string(),
			name_transliteration: z.string(),
			name_burmese_title: z.string(),
			alternative_names: z
				.array(
					z.object({
						arabic: z.string(),
						transliteration: z.string(),
						english: z.string(),
						burmese: z.string(),
					}),
				)
				.optional(),
			meaning_of_title: z.object({
				english: z.string(),
				burmese: z.string(),
			}),
			revelation_place: z.object({
				english: z.string(),
				burmese: z.string(),
			}),
			revelation_order: z.number(),
			revelation_order_note: z.string().optional(),
			total_verses: z.number(),
			prostration_verse: z
				.object({
					verse_number: z.number(),
					arabic_marker: z.string(),
					note_burmese: z.string(),
				})
				.optional(),
			summary_burmese: z.string(),
		}),
		bismillah: z.object({
			arabic: z.string(),
			english_translation: z.string(),
			burmese_translation: z.string(),
			burmese_transliteration: z.string(),
		}),
		verses: z.array(
			z.object({
				verse_number: z.number(),
				arabic: z.string(),
				english_translation: z.string(),
				burmese_translation: z.string(),
				burmese_transliteration: z.string(),
				arabic_marker: z.string().optional(),
				note: z.string().optional(),
			}),
		),
	}),
});

const duas = defineCollection({
	loader: file("src/assets/content/essential-duas/duas.json", {
		parser: (text) =>
			JSON.parse(text).items.map((item: { id: number }) => ({
				...item,
				id: String(item.id),
			})),
	}),
	schema: z.object({
		id: z.string(),
		title_mm: z.string(),
		title_en: z.string(),
		arabic: z.string(),
		burmese_pronunciation: z.string(),
		english_meaning: z.string(),
		burmese_meaning: z.string(),
	}),
});

const names = defineCollection({
	loader: file("src/assets/content/allah-names/names.json", {
		parser: (text) =>
			JSON.parse(text).names.map((name: { number: number }) => ({
				id: String(name.number),
				...name,
			})),
	}),
	schema: z.object({
		id: z.string(),
		number: z.number(),
		arabic: z.string(),
		transliteration: z.string(),
		english_meaning: z.string(),
		burmese_meaning: z.string(),
		burmese_transliteration: z.string(),
	}),
});

export const collections = { surahs, duas, names };
