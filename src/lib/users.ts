import type { usuarios } from "@/db/schema";
import type { PublicUser } from "@/interfaces/users";

export function publicUser(row: typeof usuarios.$inferSelect): PublicUser {
	return {
		id: row.id,
		name: row.name,
		fullName: row.fullName,
		phone: row.phone,
		email: row.email,
		username: row.username,
		role: row.role,
		createdAt: row.createdAt,
	};
}
