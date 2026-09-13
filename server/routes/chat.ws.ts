import { jwtVerify } from "jose";
import { isRole } from "#shared/acl";
import type { ChatSession } from "../utils/chat";
import {
	canAccessConversation,
	createMessage,
	ensureParticipant,
} from "../utils/chat";

const ISSUER = "empresaplana";

async function sessionFromUpgrade(
	headers: Headers,
): Promise<ChatSession | null> {
	const cookie = headers.get("cookie") ?? "";
	const token = getCookieValue(cookie, "ep_session");
	if (!token) return null;

	const secret = process.env.AUTH_SECRET;
	if (!secret) return null;

	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(secret),
			{
				issuer: ISSUER,
			},
		);
		const id = Number(payload.sub);
		if (!Number.isInteger(id) || typeof payload.username !== "string")
			return null;
		if (!isRole(payload.role)) return null;
		return { id, username: payload.username, role: payload.role };
	} catch {
		return null;
	}
}

function getCookieValue(
	cookieHeader: string,
	name: string,
): string | undefined {
	for (const part of cookieHeader.split(";")) {
		const [key, ...rest] = part.trim().split("=");
		if (key === name) return rest.join("=");
	}
	return undefined;
}

export default defineWebSocketHandler({
	async upgrade(request, context) {
		const session = await sessionFromUpgrade(request.headers);
		if (!session) {
			throw new Error("No autenticat");
		}
		context.session = session;
	},

	open(peer) {
		const session = peer.context.session as ChatSession;
		peer.subscribe(`user:${session.id}`);
	},

	async message(peer, message) {
		const session = peer.context.session as ChatSession;
		const text = message.text();
		let data: { type?: string; conversationId?: number; body?: string };
		try {
			data = JSON.parse(text);
		} catch {
			return;
		}

		if (data.type === "subscribe" && typeof data.conversationId === "number") {
			const allowed = await canAccessConversation(session, data.conversationId);
			if (allowed) {
				peer.subscribe(`conv:${data.conversationId}`);
			}
			return;
		}

		if (data.type === "message" && typeof data.conversationId === "number") {
			const body = (data.body ?? "").trim();
			if (!body) return;
			const allowed = await canAccessConversation(session, data.conversationId);
			if (!allowed) return;
			await ensureParticipant(session, data.conversationId);
			const saved = await createMessage(session, data.conversationId, body);
			peer.publish(`conv:${data.conversationId}`, {
				type: "message",
				message: saved,
			});
			// Avisa también al propio emisor (para múltiples pestañas).
			peer.publish(`user:${session.id}`, {
				type: "message",
				message: saved,
			});
			return;
		}
	},
});
