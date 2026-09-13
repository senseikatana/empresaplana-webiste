import { z } from "zod";
import { getSessionUser } from "../../utils/auth";
import {
	canAccessConversation,
	createMessage,
	ensureParticipant,
} from "../../utils/chat";

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

	if (!(await canAccessConversation(session, conversationId))) {
		throw createError({ statusCode: 403, statusMessage: "Sense accés" });
	}

	await ensureParticipant(session, conversationId);
	return createMessage(session, conversationId, body);
});
