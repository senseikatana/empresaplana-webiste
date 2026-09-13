import { z } from "zod";
import { getSessionUser } from "../utils/auth";

const toggleSchema = z.object({
	routeId: z.string().min(1),
});

export default defineEventHandler(async (event) => {
	const session = await getSessionUser(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "No autenticat" });
	}

	const body = await readBody(event).catch(() => ({}));
	const parsed = toggleSchema.safeParse(body);
	if (!parsed.success) {
		throw createError({ statusCode: 400, statusMessage: "routeId requerit" });
	}

	const { routeId } = parsed.data;

	// FavoriteRoute no tiene FK a Route: validamos explícitamente.
	const route = await prisma().route.findUnique({
		where: { id: routeId },
		select: { id: true },
	});
	if (!route) {
		throw createError({ statusCode: 404, statusMessage: "Ruta no trobada" });
	}

	const existing = await prisma().favoriteRoute.findUnique({
		where: { userId_routeId: { userId: session.id, routeId } },
	});

	if (existing) {
		await prisma().favoriteRoute.delete({ where: { id: existing.id } });
		return { favorite: false };
	}

	await prisma().favoriteRoute.create({
		data: { userId: session.id, routeId },
	});
	return { favorite: true };
});
