import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const requiredText = z.string().trim().min(1);
const requiredNumber = z.number().int().positive();
const numericId = z.string().regex(/^\d+$/);

const BISMILLAH_CANONICAL = {
	arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
	english_translation:
		"In the name of Allah, the Most Compassionate, the Most Merciful.",
	burmese_translation:
		"အနန္တကရုဏာတော်ရှင်၊ အလွန်သနားညှာတာတော်မူသော အလ္လာဟ်အရှင်မြတ်၏ နာမတော်ဖြင့် (စတင်ပါ၏)။",
	burmese_transliteration: "ဗိစ်မိလ္လာဟိရ် ရဟ်မာနိရ် ရဟီးမ်",
} as const;

const surahs = defineCollection({
	loader: glob({
		pattern: "**/*.json",
		base: "./src/assets/content/essential-surahs",
	}),
	schema: z.object({
		surah_metadata: z.object({
			surah_number: requiredNumber,
			name_arabic: requiredText,
			name_transliteration: requiredText,
			name_burmese_title: requiredText,
			meaning_of_title: z.object({
				english: requiredText,
				burmese: requiredText,
			}),
			revelation_place: z.object({
				english: requiredText,
				burmese: requiredText,
			}),
			revelation_order: requiredNumber,
			total_verses: requiredNumber,
			prostration_verse: z
				.object({
					verse_number: requiredNumber,
					arabic_marker: requiredText,
					note_burmese: requiredText,
				})
				.optional(),
			summary_burmese: requiredText,
		}),
		bismillah: z
			.object({
				arabic: requiredText,
				english_translation: requiredText,
				burmese_translation: requiredText,
				burmese_transliteration: requiredText,
			})
			.superRefine((bismillah, ctx) => {
				for (const key of Object.keys(BISMILLAH_CANONICAL)) {
					const value =
						BISMILLAH_CANONICAL[key as keyof typeof BISMILLAH_CANONICAL];
					if (bismillah[key as keyof typeof bismillah] !== value) {
						ctx.addIssue({
							code: "custom",
							path: [key],
							message: `bismillah.${key} must match the canonical text; fix the content file instead of adding a new variant`,
						});
					}
				}
			}),
		verses: z
			.array(
				z.object({
					verse_number: requiredNumber,
					arabic: requiredText,
					english_translation: requiredText,
					burmese_translation: requiredText,
					burmese_transliteration: requiredText,
					arabic_marker: requiredText.optional(),
					note: requiredText.optional(),
				}),
			)
			.min(1),
	}),
});

const duas = defineCollection({
	loader: file("src/assets/content/essential-duas/duas.json", {
		parser: (text) => {
			const parsed = z
				.object({
					title: z.string(),
					items: z.array(z.looseObject({ id: z.number() })),
				})
				.parse(JSON.parse(text));
			return parsed.items.map((item) => ({
				...item,
				id: String(item.id),
				meta: { title: parsed.title },
			}));
		},
	}),
	schema: z.object({
		id: numericId,
		meta: z.object({
			title: requiredText,
		}),
		title_mm: requiredText,
		title_en: requiredText,
		arabic: requiredText,
		burmese_pronunciation: requiredText,
		english_meaning: requiredText,
		burmese_meaning: requiredText,
	}),
});

const names = defineCollection({
	loader: file("src/assets/content/allah-names/names.json", {
		parser: (text) => {
			const parsed = z
				.object({
					metadata: z.looseObject({ title_arabic: z.string() }),
					names: z.array(z.looseObject({ number: z.number() })),
				})
				.parse(JSON.parse(text));
			return parsed.names.map((name) => ({
				id: String(name.number),
				...name,
				meta: parsed.metadata,
			}));
		},
	}),
	schema: z.object({
		id: numericId,
		number: requiredNumber,
		meta: z.object({
			title_arabic: requiredText,
			title_transliteration: requiredText,
			title_burmese: requiredText,
			name_count: requiredNumber,
			summary_burmese: requiredText,
		}),
		arabic: requiredText,
		transliteration: requiredText,
		english_meaning: requiredText,
		burmese_meaning: requiredText,
		burmese_transliteration: requiredText,
	}),
});

export const collections = { surahs, duas, names };
