import { requireCapability } from "../../utils/acl";

export default defineEventHandler(async (event) => {
	await requireCapability(event, "fleet:view");

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
