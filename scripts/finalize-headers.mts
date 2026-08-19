// Rewrites the deploy artifact's CSP after Astro has transformed and possibly
// inlined processed scripts. Hashing the final HTML prevents CSP drift.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("dist/index.html", "utf8");
const hashes = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
	.filter(([, attributes]) => {
		return (
			!attributes?.includes("src=") &&
			!attributes?.includes("application/ld+json")
		);
	})
	.map(([, , body]) => {
		return `sha256-${createHash("sha256")
			.update(body ?? "")
			.digest("base64")}`;
	});

if (hashes.length === 0) {
	throw new Error(
		"finalize-headers: no inline executable scripts found in dist/index.html",
	);
}

const headersPath = "dist/_headers";
const headers = readFileSync(headersPath, "utf8");
const csp = headers.match(/Content-Security-Policy: ([^\n]+)/);
const cspValue = csp?.[1];
if (!cspValue) {
	throw new Error("finalize-headers: CSP header not found in dist/_headers");
}

const updatedCsp = cspValue.replace(/script-src ([^;]+)/, (directive) => {
	const missingHashes = hashes
		.filter((hash) => !directive.includes(`'${hash}'`))
		.map((hash) => `'${hash}'`)
		.join(" ");
	return missingHashes ? `${directive} ${missingHashes}` : directive;
});
writeFileSync(headersPath, headers.replace(cspValue, updatedCsp));
console.log(
	`finalize-headers: added ${hashes.length} final inline-script CSP hash(es)`,
);
