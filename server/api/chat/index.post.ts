import { z } from "zod";
import { getSessionUser } from "../utils/auth";

const sendSchema = z.object({
	conversationId: z.number().int().optional(),
	body: z.string().min(1).max(2000),
});

export default defineEventHandler(async (event) => {
	const session = await getSessionUser(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "No autenticat" });
	}

	const parsed = sendSchema.safeParse(await readBody(event).catch(() => ({})));
	if (!parsed.success) {
		throw createError({ statusCode: 400, statusMessage: "Missatge buit" });
	}

	const { body } = parsed.data;
	let conversationId = parsed.data.conversationId;

	if (!conversationId) {
		// Crear (o recuperar) la conversación del cliente con la empresa.
		if (session.role !== "client") {
			throw createError({
				statusCode: 400,
				statusMessage: "El staff ha d'indicar la conversa",
			});
		}
		let conv = await prisma().conversation.findFirst({
			where: {
				type: "client-company",
				participants: { some: { userId: session.id, role: "client" } },
			},
		});
		if (!conv) {
			conv = await prisma().conversation.create({
				data: {
					type: "client-company",
					participants: {
						create: { userId: session.id, role: "client" },
					},
				},
			});
		}
		conversationId = conv.id;
	}

	const conv = await prisma().conversation.findUnique({
		where: { id: conversationId },
		include: { participants: true },
	});
	if (!conv) {
		throw createError({
			statusCode: 404,
			statusMessage: "Conversa no trobada",
		});
	}

	const isParticipant = conv.participants.some((p) => p.userId === session.id);
	const isStaff = session.role === "admin" || session.role === "worker";
	if (!isParticipant && !isStaff) {
		throw createError({ statusCode: 403, statusMessage: "Sense accés" });
	}

	// Si el staff no es participante aún, se agrega.
	if (isStaff && !isParticipant) {
		await prisma().conversationParticipant.create({
			data: { conversationId, userId: session.id, role: session.role },
		});
	}

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
});
