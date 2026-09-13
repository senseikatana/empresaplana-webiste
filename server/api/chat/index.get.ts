import { getSessionUser } from "../utils/auth";

export default defineEventHandler(async (event) => {
	const session = await getSessionUser(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "No autenticat" });
	}

	const conversations = await prisma().conversation.findMany({
		where:
			session.role === "client"
				? {
						participants: {
							some: { userId: session.id, role: "client" },
						},
					}
				: { type: "client-company" },
		include: {
			participants: true,
			messages: { orderBy: { createdAt: "desc" }, take: 1 },
		},
		orderBy: { updatedAt: "desc" },
	});

	return conversations.map((c) => {
		const last = c.messages[0];
		const client = c.participants.find((p) => p.role === "client");
		return {
			id: c.id,
			type: c.type,
			clientUserId: client?.userId ?? null,
			updatedAt: c.updatedAt,
			lastMessage: last
				? {
						body: last.body,
						senderRole: last.senderRole,
						createdAt: last.createdAt,
					}
				: null,
		};
	});
});
