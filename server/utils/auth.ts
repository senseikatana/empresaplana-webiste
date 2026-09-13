import type { H3Event } from "h3";
import { deleteCookie, getCookie, setCookie } from "h3";
import { jwtVerify, SignJWT } from "jose";
import { isRole, type Role } from "#shared/acl";

const SESSION_COOKIE = "ep_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const ISSUER = "empresaplana";

// Alias de compatibilidad: la fuente de verdad del rol es shared/acl.ts
export type UsuarioRole = Role;

export interface SessionUser {
	id: number;
	username: string;
	role: UsuarioRole;
}

function secret(): Uint8Array {
	const value = process.env.AUTH_SECRET;
	if (!value) {
		throw new Error(
			"AUTH_SECRET is not set. Copy .env.example locally or configure the secret in Cloudflare.",
		);
	}
	return new TextEncoder().encode(value);
}

export async function signSessionToken(user: SessionUser): Promise<string> {
	return new SignJWT({ username: user.username, role: user.role })
		.setSubject(String(user.id))
		.setIssuer(ISSUER)
		.setIssuedAt()
		.setExpirationTime("7d")
		.setProtectedHeader({ alg: "HS256" })
		.sign(secret());
}

export async function getSessionUser(
	event: H3Event,
): Promise<SessionUser | null> {
	const token = getCookie(event, SESSION_COOKIE);
	if (!token) return null;
	try {
		const { payload } = await jwtVerify(token, secret(), { issuer: ISSUER });
		const id = Number(payload.sub);
		if (!Number.isInteger(id) || typeof payload.username !== "string")
			return null;
		if (!isRole(payload.role)) return null;
		return {
			id,
			username: payload.username,
			role: payload.role,
		};
	} catch {
		return null;
	}
}

export function setSessionCookie(event: H3Event, token: string): void {
	setCookie(event, SESSION_COOKIE, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: SESSION_MAX_AGE,
	});
}

export function clearSessionCookie(event: H3Event): void {
	deleteCookie(event, SESSION_COOKIE, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});
}
