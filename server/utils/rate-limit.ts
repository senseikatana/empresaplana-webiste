import type { H3Event } from "h3";

// Rate-limit en memoria (ventana fija por IP). Válido para un solo proceso
// (Render: una instancia). Si se escala a varias instancias, migrar a Redis.
//
// Nota: detrás de proxy se confía en `x-forwarded-for`/`cf-connecting-ip`;
// Render siempre inyecta cabeceras de proxy, así que no es spoofeable ahí.

interface Bucket {
	count: number;
	resetAt: number;
}

const DEFAULT_WINDOW_MS = 60_000;
const MAX_BUCKETS = 10_000;

const buckets = new Map<string, Bucket>();

function clientKey(event: H3Event): string {
	const forwarded = getRequestHeader(event, "x-forwarded-for");
	const ip =
		getRequestHeader(event, "cf-connecting-ip") ??
		forwarded?.split(",")[0]?.trim() ??
		"local";
	return ip;
}

export function rateLimit(
	event: H3Event,
	options: { limit: number; windowMs?: number },
): void {
	const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
	const key = `${clientKey(event)}:${options.limit}:${windowMs}`;
	const now = Date.now();

	let bucket = buckets.get(key);
	if (!bucket || now >= bucket.resetAt) {
		bucket = { count: 0, resetAt: now + windowMs };
		buckets.set(key, bucket);
	}

	bucket.count += 1;
	if (bucket.count > options.limit) {
		throw createError({
			statusCode: 429,
			statusMessage: "Massa peticions, torna-ho a provar més tard",
		});
	}

	// Mantener la tabla acotada: purga de buckets expirados cuando crece.
	if (buckets.size > MAX_BUCKETS) {
		for (const [k, b] of buckets) {
			if (now >= b.resetAt) buckets.delete(k);
		}
	}
}
