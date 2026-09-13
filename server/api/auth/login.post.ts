import { setSessionCookie, signSessionToken } from "../../utils/auth";
import { verifyPasskey } from "../../utils/passkey";

export default defineEventHandler(async (event) => {
	const body = await readBody<{
		username?: string;
		passkey?: string;
	}>(event).catch(() => ({}));

	const username = String(body?.username ?? "").trim();
	const passkey = String(body?.passkey ?? "");

	if (!username || !passkey) {
		throw createError({ statusCode: 400, statusMessage: "Falten credencials" });
	}

	const user = await prisma().user.findUnique({ where: { username } });
	if (!user || !verifyPasskey(passkey, user.passkey)) {
		throw createError({
			statusCode: 401,
			statusMessage: "Credencials invàlides",
		});
	}

	const token = await signSessionToken({
		id: user.id,
		username: user.username,
		role: user.role as "client" | "worker" | "admin",
	});
	setSessionCookie(event, token);

	return {
		user: {
			id: user.id,
			username: user.username,
			name: user.name,
			fullName: user.fullName,
			email: user.email,
			role: user.role,
		},
	};
});
