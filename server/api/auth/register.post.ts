import { z } from "zod";
import { setSessionCookie, signSessionToken } from "../../utils/auth";
import { hashPasskey } from "../../utils/passkey";

const registerSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(60)
		.regex(/^[a-z0-9._-]+$/i, "sin espacios ni símbolos"),
	email: z.string().email().max(200),
	password: z.string().min(8).max(128),
	name: z.string().min(1).max(60),
});

export default defineEventHandler(async (event) => {
	rateLimit(event, { limit: 5, windowMs: 60 * 60_000 });

	const body = await readBody(event).catch(() => ({}));
	const parsed = registerSchema.safeParse(body);
	if (!parsed.success) {
		const first = parsed.error.issues[0];
		throw createError({
			statusCode: 400,
			statusMessage: first?.message ?? "Dades invàlides",
		});
	}

	const { username, email, password, name } = parsed.data;

	const existingUser = await prisma().user.findFirst({
		where: { OR: [{ username }, { email }] },
	});
	if (existingUser) {
		throw createError({
			statusCode: 409,
			statusMessage: "username_exists",
		});
	}

	const user = await prisma().user.create({
		data: {
			username,
			email,
			name,
			fullName: name,
			phone: "",
			passkey: hashPasskey(password),
			role: "client",
		},
	});

	const token = await signSessionToken({
		id: user.id,
		username: user.username,
		role: "client",
	});
	setSessionCookie(event, token);

	return {
		user: {
			id: user.id,
			username: user.username,
			name: user.name,
			email: user.email,
			role: user.role,
		},
	};
});
