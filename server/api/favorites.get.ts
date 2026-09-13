import { getSessionUser } from "../utils/auth";

export default defineEventHandler(async (event) => {
	const session = await getSessionUser(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "No autenticat" });
	}

	const favorites = await prisma().favoriteRoute.findMany({
		where: { userId: session.id },
		orderBy: { createdAt: "desc" },
	});

	const routeIds = favorites.map((f) => f.routeId);
	const routes = routeIds.length
		? await prisma().route.findMany({ where: { id: { in: routeIds } } })
		: [];

	const byId = new Map(routes.map((r) => [r.id, r]));

	return favorites
		.map((f) => byId.get(f.routeId))
		.filter((r) => r !== undefined)
		.map((r) => ({
			id: r.id,
			code: r.code,
			name: r.name,
			origin: r.origin,
			destination: r.destination,
			color: r.color,
		}));
});
