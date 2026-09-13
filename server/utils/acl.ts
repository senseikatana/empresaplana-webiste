import type { H3Event } from "h3";
import { type Capability, hasCapability } from "#shared/acl";
import { getSessionUser, type SessionUser } from "./auth";

/** ¿Tiene la sesión esta capability? Punto único de autorización en servidor. */
export function can(user: SessionUser | null, capability: Capability): boolean {
	if (!user) return false;
	return hasCapability(user.role, capability);
}

/**
 * Guard para endpoints: 401 sin sesión, 403 sin capability.
 * Devuelve la sesión para no tener que volver a pedirla.
 */
export async function requireCapability(
	event: H3Event,
	capability: Capability,
): Promise<SessionUser> {
	const session = await getSessionUser(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: "No autenticat" });
	}
	if (!can(session, capability)) {
		throw createError({ statusCode: 403, statusMessage: "Sense accés" });
	}
	return session;
}
