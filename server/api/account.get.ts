import { getSessionUser } from "../utils/auth";

export default defineEventHandler(async (event) => {
	const session = await getSessionUser(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "No autenticat" });
	}

	const user = await prisma().user.findUnique({ where: { id: session.id } });
	if (!user) {
		throw createError({ statusCode: 404, statusMessage: "Usuari no trobat" });
	}

	return {
		user: {
			id: user.id,
			username: user.username,
			name: user.name,
			fullName: user.fullName,
			email: user.email,
			phone: user.phone,
			role: user.role,
			totpEnabled: Boolean(user.totpSecret),
			emailVerified: user.emailVerified,
			createdAt: user.createdAt,
		},
	};
});
