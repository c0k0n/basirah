// Single source of truth for site-wide title/description strings.
// Imported by astro.config.ts (PWA manifest) and Layout.astro (meta defaults)
// so the canonical tagline lives in exactly one place (AGENTS.md: no duplication).

export const SITE = {
	// Kept <= ~60 visible chars to avoid SERP truncation of the highest-traffic page.
	title: "Basirah — ကုရ်အာန်နှင့် စွန္နသ် ဗဟုသုတ",
	description:
		"ကုရ်အာန်နှင့် စွန္နသ်မှ အသိပညာ ဗဟုသုတများကို မြန်မာဘာသာဖြင့် လေ့လာနိုင်သော မရှိမဖြစ် စူရဟ်များ၊ ဒိုအာများနှင့် အလ္လာဟ်အရှင်မြတ်၏ အလှပဆုံး နာမတော်များ။",
	shortName: "Basirah",
	navLinks: [
		{ href: "/", label: "မူလစာမျက်နှာ", icon: "home" },
		{ href: "/surahs/", label: "စူရဟ်များ", icon: "menu_book" },
		{ href: "/duas/", label: "ဒိုအာများ", icon: "volunteer_activism" },
		{
			href: "/names-of-allah/",
			label: "အလ္လာဟ်၏ နာမတော်များ",
			icon: "auto_awesome",
		},
	],
} as const;
