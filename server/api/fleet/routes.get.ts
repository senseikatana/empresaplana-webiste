import { requireCapability } from "../../utils/acl";

export default defineEventHandler(async (event) => {
	await requireCapability(event, "fleet:view");

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
