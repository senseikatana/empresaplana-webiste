import type { UsuarioRole } from "@/db/schema";

export interface SessionUser {
	id: number;
	username: string;
	role: UsuarioRole;
}
