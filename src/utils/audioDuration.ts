import { openSync, readSync, closeSync, fstatSync } from "node:fs";

const OGG_PAGE_MAGIC = "OggS";
const OPUS_HEAD_MAGIC = "OpusHead";
// Opus always decodes to 48 kHz regardless of the original input rate.
const OPUS_SAMPLE_RATE = 48_000;
const WINDOW_BYTES = 64 * 1024;

/**
 * Exact duration of an Ogg Opus file in seconds, derived from the granule
 * position of its final page minus the OpusHead pre-skip.
 *
 * Browsers normally learn this by range-probing the file's tail, which hosts
 * without HTTP Range support (e.g. Cloudflare Pages static assets) cannot
 * serve — leaving audio.duration permanently unknown there. Computing it at
 * build time makes the player's remaining-time readout work everywhere.
 *
 * Returns undefined when the file cannot be parsed as Ogg Opus.
 */
export function oggOpusDurationSeconds(path: string): number | undefined {
	let fd: number | undefined;
	try {
		fd = openSync(path, "r");
		const size = fstatSync(fd).size;
		if (size < 64) return undefined;

		// A page is at most 27 + 255 + 255·255 = 65,307 bytes and the final
		// page ends at EOF by definition, so this window always contains it.
		const tail = Buffer.alloc(Math.min(size, WINDOW_BYTES));
		readSync(fd, tail, 0, tail.length, size - tail.length);

		// The final page must end exactly at EOF; scan backwards until a
		// structurally valid candidate matches, so packet data containing the
		// "OggS" byte sequence cannot fool us.
		const lastPage = findLastPage(tail);
		if (!lastPage) return undefined;
		const granule = tail.readBigUInt64LE(lastPage + 6);

		const head = Buffer.alloc(Math.min(size, WINDOW_BYTES));
		readSync(fd, head, 0, head.length, 0);
		const opusHead = head.indexOf(OPUS_HEAD_MAGIC);
		const preSkip = opusHead !== -1 ? head.readUInt16LE(opusHead + 10) : 0;

		const seconds = Number(granule - BigInt(preSkip)) / OPUS_SAMPLE_RATE;
		return Number.isFinite(seconds) && seconds > 0 && seconds < 21_600
			? seconds
			: undefined;
	} catch {
		return undefined;
	} finally {
		if (fd !== undefined) closeSync(fd);
	}
}

/** Offset of the last Ogg page whose body runs to the end of the buffer. */
function findLastPage(tail: Buffer): number | undefined {
	for (
		let offset = tail.lastIndexOf(OGG_PAGE_MAGIC);
		offset !== -1;
		offset = offset > 0 ? tail.lastIndexOf(OGG_PAGE_MAGIC, offset - 1) : -1
	) {
		if (tail[offset + 4] !== 0) continue; // stream_structure_version
		const segments = tail[offset + 26];
		if (segments === undefined) continue;
		let bodyLength = 0;
		for (let i = 0; i < segments; i++) {
			const segmentSize = tail[offset + 27 + i];
			if (segmentSize === undefined) continue;
			bodyLength += segmentSize;
		}
		if (offset + 27 + segments + bodyLength === tail.length) return offset;
	}
	return undefined;
}
