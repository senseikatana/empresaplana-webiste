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

	const notifications = await prisma().notification.findMany({
		orderBy: { createdAt: "desc" },
		take: 50,
	});
	return notifications.map((n) => ({
		id: n.id,
		type: n.type,
		title: n.title,
		desc: n.desc,
		createdAt: n.createdAt,
		read: n.read,
		routeId: n.routeId,
	}));
});
