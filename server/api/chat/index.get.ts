import { hasCapability } from "#shared/acl";
import { requireCapability } from "../../utils/acl";

export default defineEventHandler(async (event) => {
	const session = await requireCapability(event, "chat:access");

	// El staff (chat:staff) ve todas las conversaciones; el cliente, las suyas.
	const conversations = await prisma().conversation.findMany({
		where: hasCapability(session.role, "chat:staff")
			? { type: "client-company" }
			: {
					participants: {
						some: { userId: session.id, role: "client" },
					},
				},
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
