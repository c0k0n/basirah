/** Shared Unicode-aware folding for search filtering.
 * Normalizes Arabic presentation forms, removes diacritics and tatweel,
 * and collapses whitespace. Used by ListFilter and SurahJumpDialog.
 */
export const foldText = (text: string): string =>
	text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, "")
		.replace(/[\u0622\u0623\u0625\u0671]/g, "ا")
		.replace(/\u0649/g, "ي")
		.replace(/\u0629/g, "ه")
		.replace(/\u0640/g, "")
		.replace(/\s+/g, " ");
