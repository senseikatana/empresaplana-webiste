import { z } from "zod";
import { isRole } from "#shared/acl";
import { setSessionCookie, signSessionToken } from "../../utils/auth";
import { verifyPasskey } from "../../utils/passkey";

const loginSchema = z.object({
	username: z.string().min(1).max(60),
	passkey: z.string().min(1).max(128),
});

export default defineEventHandler(async (event) => {
	rateLimit(event, { limit: 10, windowMs: 15 * 60_000 });

	const parsed = loginSchema.safeParse(await readBody(event).catch(() => ({})));
	if (!parsed.success) {
		throw createError({ statusCode: 400, statusMessage: "Falten credencials" });
	}

	const { username, passkey } = parsed.data;

	const user = await prisma().user.findUnique({ where: { username } });
	// Fantasmas anónimos (passkey "") y roles corruptos nunca autentican.
	if (!user || !isRole(user.role) || !verifyPasskey(passkey, user.passkey)) {
		throw createError({
			statusCode: 401,
			statusMessage: "Credencials invàlides",
		});
	}

	const token = await signSessionToken({
		id: user.id,
		username: user.username,
		role: user.role,
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
