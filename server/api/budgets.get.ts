import { getSessionUser } from "../utils/auth";

export default defineEventHandler(async (event) => {
	const session = await getSessionUser(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "No autenticat" });
	}

	const budgets = await prisma().budget.findMany({
		where: { userId: session.id },
		orderBy: { createdAt: "desc" },
	});

	return budgets.map((b) => ({
		id: b.id,
		clientName: b.clientName,
		reasonId: b.reasonId,
		description: b.description,
		departureCity: b.departureCity,
		departureDay: b.departureDay,
		departureTime: b.departureTime,
		arrivalCity: b.arrivalCity,
		arrivalDay: b.arrivalDay,
		arrivalTime: b.arrivalTime,
		people: b.people,
		status: b.status,
		createdAt: b.createdAt,
	}));
});
