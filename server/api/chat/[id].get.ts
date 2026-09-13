import { hasCapability } from "#shared/acl";
import { requireCapability } from "../../utils/acl";

export default defineEventHandler(async (event) => {
	const session = await requireCapability(event, "chat:access");

	const id = Number(event.context.params?.id);
	if (!Number.isInteger(id)) {
		throw createError({ statusCode: 400, statusMessage: "Id invàlid" });
	}

	const conv = await prisma().conversation.findUnique({
		where: { id },
		include: { participants: true },
	});
	if (!conv) {
		throw createError({
			statusCode: 404,
			statusMessage: "Conversa no trobada",
		});
	}

	const isParticipant = conv.participants.some((p) => p.userId === session.id);
	if (!isParticipant && !hasCapability(session.role, "chat:staff")) {
		throw createError({ statusCode: 403, statusMessage: "Sense accés" });
	}

	const messages = await prisma().message.findMany({
		where: { conversationId: id },
		orderBy: { createdAt: "asc" },
	});

	return {
		id: conv.id,
		type: conv.type,
		messages: messages.map((m) => ({
			id: m.id,
			body: m.body,
			senderId: m.senderId,
			senderRole: m.senderRole,
			readAt: m.readAt,
			createdAt: m.createdAt,
		})),
	};
});
