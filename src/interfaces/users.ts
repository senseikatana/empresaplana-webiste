import type { UsuarioRole } from "@/db/schema";



export interface PublicUser {
	id: number;
	name: string;
	fullName: string;
	email: string;
	username: string;
	role: UsuarioRole;
	createdAt?: Date | null;
	phone?: string;
}


export interface AdminUser extends PublicUser {}
