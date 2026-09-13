// Lógica compartida entre el endpoint REST y el WebSocket de chat.

export interface ChatSession {
	id: number;
	username: string;
	role: string;
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
	const isStaff = session.role === "admin" || session.role === "worker";
	return isParticipant || isStaff;
}

/** Añade al staff como participante si responde por primera vez. */
export async function ensureParticipant(
	session: ChatSession,
	conversationId: number,
): Promise<void> {
	const isStaff = session.role === "admin" || session.role === "worker";
	if (!isStaff) return;
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

export function isStaffRole(role: string): boolean {
	return role === "admin" || role === "worker";
}
