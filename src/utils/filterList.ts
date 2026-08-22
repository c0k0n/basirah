import { foldText } from "./foldText";

/** Shared list filtering for ListFilter and SurahJumpDialog.
 * Folds query and item text, toggles items, and reports the visible count
 * to an aria-live region so screen readers announce result changes.
 */
export function filterList(options: {
	term: string;
	items: HTMLElement[];
	empty: HTMLElement | null | undefined;
	live: HTMLElement | null | undefined;
}): number {
	const folded = foldText(options.term);
	let visible = 0;
	for (const item of options.items) {
		const match =
			!folded ||
			(item.textContent ? foldText(item.textContent).includes(folded) : false);
		item.hidden = !match;
		if (match) visible++;
	}
	if (options.empty) options.empty.hidden = visible === 0;
	if (options.live) {
		options.live.textContent =
			visible === 0 ? "ရလဒ် မတွေ့ပါ" : `ရလဒ် ${visible} ခု`;
	}
	return visible;
}
