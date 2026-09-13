import { requireCapability } from "../../utils/acl";

export default defineEventHandler(async (event) => {
	await requireCapability(event, "fleet:view");

	const [routes, buses, stops, schedules, drivers] = await Promise.all([
		prisma().route.count(),
		prisma().bus.count(),
		prisma().stop.count(),
		prisma().schedule.count(),
		prisma().driver.count(),
	]);

	return { routes, buses, stops, schedules, drivers };
});
