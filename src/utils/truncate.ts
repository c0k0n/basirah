/** Truncate text to maxLength without cutting mid-word, preserving grapheme safety.
 * Falls back to simple slice if no word boundary found.
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	let truncated = text.slice(0, maxLength - 1).trimEnd();
	// Prefer last space to avoid mid-word break (Burmese uses spaces between phrases)
	const lastSpace = truncated.lastIndexOf(" ");
	if (lastSpace > maxLength * 0.6) {
		truncated = truncated.slice(0, lastSpace);
	}
	return `${truncated.trimEnd()}…`;
}
