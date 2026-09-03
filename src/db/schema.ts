/**
 * Temporary database schema stub.
 *
 * The original Turso + Drizzle schema was removed while you bring your own ORM.
 * This file only exists so the type/value imports across the codebase keep
 * resolving. Replace it (together with the stubbed `src/lib/db.ts` and
 * `src/lib/search.ts`) with your real schema when your ORM lands.
 */

export type UsuarioRole = "client" | "worker" | "admin";

export const USUARIO_ROLES = ["client", "worker", "admin"] as const;

export interface UsuarioRow {
	id: number;
	name: string;
	fullName: string;
	phone: string;
	email: string;
	passkeyHash: string;
	username: string;
	role: UsuarioRole;
	createdAt: Date | null;
}

// Table-shaped stub — only `$inferSelect` is consumed by `src/lib/users.ts`.
export const usuarios = {
	$inferSelect: {} as UsuarioRow,
	$inferInsert: {} as Partial<UsuarioRow>,
};
