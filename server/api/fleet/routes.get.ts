import { getSessionUser } from "../../utils/auth";
import { isStaffRole } from "../../utils/chat";

export default defineEventHandler(async (event) => {
	const session = await getSessionUser(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "No autenticat" });
	}
	if (!isStaffRole(session.role)) {
		throw createError({ statusCode: 403, statusMessage: "Sense accés" });
	}

	const routes = await prisma().route.findMany({ orderBy: { code: "asc" } });
	return routes.map((r) => ({
		id: r.id,
		code: r.code,
		name: r.name,
		origin: r.origin,
		destination: r.destination,
		color: r.color,
		status: r.status,
	}));
});
