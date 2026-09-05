import type { UsuarioRole } from "@/db/schema";

/** Demo user stored locally. `passkey` is plaintext on purpose: demo only. */
export interface AppUser {
	id: number;
	username: string;
	passkey: string;
	name: string;
	fullName: string;
	email: string;
	phone: string;
	role: UsuarioRole;
	/** Links the user to a fleet driver record (for workers). */
	driverId?: number;
}

export interface AppSession {
	userId: number;
	role: UsuarioRole;
}

export const BUDGET_STATUSES = [
	"received",
	"review",
	"answered",
	"contracted",
] as const;

export type BudgetStatus = (typeof BUDGET_STATUSES)[number];

export interface AppBudget {
	id: string;
	userId: number;
	/** Snapshot of the requester data at submission time. */
	clientName: string;
	email: string;
	phone: string;
	company?: string;
	/** Reason id from src/data/presupuesto.json `reasons`. */
	reasonId: string;
	description?: string;
	departureCity: string;
	departureDay: string;
	departureTime: string;
	arrivalCity: string;
	arrivalDay: string;
	arrivalTime: string;
	people: string;
	status: BudgetStatus;
	createdAt: string;
	updatedAt: string;
}

export interface AppLineStatus {
	lineId: string;
	reportsToday: number;
	negativeToday: number;
}
