// Lógica compartida entre el endpoint REST y el WebSocket de chat.
import { hasCapability, type Role } from "#shared/acl";

export interface ChatSession {
	id: number;
	username: string;
	role: Role;
}

export async function canAccessConversation(
	session: ChatSession,
	conversationId: number,
): Promise<boolean> {
	const conv = await prisma().conversation.findUnique({
		where: { id: conversationId },
		include: { participants: true },
	});
	if (!conv) return false;
	const isParticipant = conv.participants.some((p) => p.userId === session.id);
	return isParticipant || hasCapability(session.role, "chat:staff");
}

/** Añade al staff como participante si responde por primera vez. */
export async function ensureParticipant(
	session: ChatSession,
	conversationId: number,
): Promise<void> {
	if (!hasCapability(session.role, "chat:staff")) return;
	const exists = await prisma().conversationParticipant.findUnique({
		where: {
			conversationId_userId: { conversationId, userId: session.id },
		},
	});
	if (!exists) {
		await prisma().conversationParticipant.create({
			data: { conversationId, userId: session.id, role: session.role },
		});
	}
}

export async function createMessage(
	session: ChatSession,
	conversationId: number,
	body: string,
) {
	const message = await prisma().message.create({
		data: {
			conversationId,
			senderId: session.id,
			senderRole: session.role,
			body,
		},
	});
	await prisma().conversation.update({
		where: { id: conversationId },
		data: { updatedAt: new Date() },
	});
	return {
		id: message.id,
		conversationId,
		body: message.body,
		senderId: message.senderId,
		senderRole: message.senderRole,
		createdAt: message.createdAt,
	};
}
