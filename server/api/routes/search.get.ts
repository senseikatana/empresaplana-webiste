import { z } from "zod";

const searchSchema = z.object({
	origin: z.string().min(1).max(120),
	destination: z.string().min(1).max(120),
});

export default defineEventHandler(async (event) => {
	const q = getQuery(event);
	const parsed = searchSchema.safeParse(q);
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Origen i destinació requerits",
		});
	}

	const { origin, destination } = parsed.data;
	const routes = await prisma().route.findMany({ where: { status: "active" } });

	// Coincidencia simple por subcadena (insensible a mayúsculas) sobre
	// origen y destino. No es un grafo de transbordos: cobertura real en F3+.
	const lower = (s: string) => s.toLowerCase();
	const matches = routes.filter((r) => {
		const o = lower(r.origin);
		const d = lower(r.destination);
		const oq = lower(origin);
		const dq = lower(destination);
		return (
			(o.includes(oq) || dq.includes(o)) && (d.includes(dq) || oq.includes(d))
		);
	});

	return matches.map((r) => ({
		id: r.id,
		code: r.code,
		name: r.name,
		origin: r.origin,
		destination: r.destination,
		color: r.color,
	}));
});
