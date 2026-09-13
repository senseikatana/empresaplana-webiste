import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPasskey(passkey: string): string {
	const salt = randomBytes(16).toString("hex");
	const hash = scryptSync(passkey, salt, 32).toString("hex");
	return `${salt}:${hash}`;
}

export function verifyPasskey(passkey: string, stored: string): boolean {
	if (!stored.includes(":")) {
		return safeEqualText(passkey, stored);
	}
	const [salt, hash] = stored.split(":");
	if (!salt || !hash) return false;
	const candidate = scryptSync(passkey, salt, 32);
	const expected = Buffer.from(hash, "hex");
	return (
		candidate.length === expected.length && timingSafeEqual(candidate, expected)
	);
}

function safeEqualText(a: string, b: string): boolean {
	const ba = Buffer.from(a, "utf8");
	const bb = Buffer.from(b, "utf8");
	return ba.length === bb.length && timingSafeEqual(ba, bb);
}
