// Generates all PWA and brand icons from the brand source SVGs.
// Run with: bun run generate-pwa-assets

import { readFile, writeFile } from "node:fs/promises";
import {
	defaultPngCompressionOptions,
	generateFavicon,
	generateMaskableAsset,
	generateTransparentAsset,
} from "@vite-pwa/assets-generator/api";

const out = "public";
const faviconSvg = await readFile("public/favicon.svg");
const brandSvg = await readFile("src/assets/brand/icon-maskable.svg");
const png = { outputOptions: defaultPngCompressionOptions };

for (const size of [64, 192, 512]) {
	const image = await (
		await generateTransparentAsset(
			"png",
			faviconSvg,
			{ width: size, height: size },
			png,
		)
	).toBuffer();
	await writeFile(`${out}/pwa-${size}x${size}.png`, image);
}

const faviconIco = await generateFavicon(
	"png",
	await (
		await generateTransparentAsset(
			"png",
			faviconSvg,
			{ width: 48, height: 48 },
			png,
		)
	).toBuffer(),
);
await writeFile(`${out}/favicon.ico`, faviconIco);

for (const [name, size] of [
	["maskable-icon-512x512.png", 512],
	["apple-touch-icon-180x180.png", 180],
] as const) {
	const image = await (
		await generateMaskableAsset(
			"png",
			brandSvg,
			{ width: size, height: size },
			{ padding: 0, ...png },
		)
	).toBuffer();
	await writeFile(`${out}/${name}`, image);
}

console.log("PWA assets generated in public/");
