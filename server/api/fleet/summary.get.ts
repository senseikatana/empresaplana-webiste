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

	const [routes, buses, stops, schedules, drivers] = await Promise.all([
		prisma().route.count(),
		prisma().bus.count(),
		prisma().stop.count(),
		prisma().schedule.count(),
		prisma().driver.count(),
	]);

	return { routes, buses, stops, schedules, drivers };
});
