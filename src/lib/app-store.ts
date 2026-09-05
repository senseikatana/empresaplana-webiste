/**
 * Client-side demo store for the Empresa Plana PWA.
 *
 * Everything is persisted in localStorage under the `plana-app:*` keys and
 * seeded from src/data/app/seed.ts on first run. This is the only layer that
 * talks to "storage": when a real backend (e.g. InsForge + own ORM) arrives,
 * replace the bodies of these functions — page scripts keep working.
 *
 * NOTE: only call these from browser code (they read/write localStorage).
 */
import type { AppBudget, AppSession, AppUser, BudgetStatus } from "@/interfaces/app";
import { DEMO_BUDGETS, DEMO_USERS } from "@/data/app/seed";

const KEY_USERS = "plana-app:users";
const KEY_SESSION = "plana-app:session";
const KEY_BUDGETS = "plana-app:budgets";
const KEY_REPORTS = "plana-app:reports";

function read<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : null;
	} catch {
		return null;
	}
}

function write(key: string, value: unknown): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		/* storage full or unavailable: keep demo in memory only */
	}
}

/** Demo reports with relative timestamps so they always look like "today". */
function demoReports(): LocalReport[] {
	const now = Date.now();
	const hour = 3600_000;
	const mk = (offsetHours: number, partial: Omit<LocalReport, "id" | "createdAt">) => ({
		...partial,
		id: `demo-r-${offsetHours}-${partial.lineId}`,
		createdAt: new Date(now - offsetHours * hour).toISOString(),
	});
	return [
		mk(6, { lineId: "penedes", stop: "Vilafranca del Penedés", action: "onTime" }),
		mk(5, { lineId: "penedes", stop: "Vilanova i la Geltrú", action: "onTime" }),
		mk(4, { lineId: "penedes", stop: "Vilafranca del Penedés", action: "late", minutesLate: 4, comment: "Retención en la C-15 por obras." }),
		mk(3, { lineId: "reusSalou", stop: "Salou", action: "onTime" }),
		mk(2, { lineId: "reusSalou", stop: "Salou", action: "early", minutesLate: 2 }),
		mk(1, { lineId: "reusSalou", stop: "Reus", action: "late", minutesLate: 6, comment: "Subida de pasajeros con PMR, salida más lenta." }),
	];
}

export function seedIfEmpty(): void {
	if (!read(KEY_USERS)) write(KEY_USERS, DEMO_USERS);
	if (!read(KEY_BUDGETS)) write(KEY_BUDGETS, DEMO_BUDGETS);
	if (!read(KEY_REPORTS)) write(KEY_REPORTS, demoReports());
}

export function listUsers(): AppUser[] {
	return read<AppUser[]>(KEY_USERS) ?? DEMO_USERS;
}

export function findUser(username: string): AppUser | undefined {
	return listUsers().find(
		(u) => u.username.toLowerCase() === username.trim().toLowerCase(),
	);
}

/** Demo login: username + plaintext passkey. */
export function login(username: string, passkey: string): AppUser | null {
	const user = findUser(username);
	if (!user || user.passkey !== passkey) return null;
	const session: AppSession = { userId: user.id, role: user.role };
	write(KEY_SESSION, session);
	return user;
}

export function getSession(): AppSession | null {
	return read<AppSession>(KEY_SESSION);
}

export function getUser(id: number): AppUser | undefined {
	return listUsers().find((u) => u.id === id);
}

export function getCurrentUser(): AppUser | null {
	const session = getSession();
	if (!session) return null;
	return getUser(session.userId) ?? null;
}

/** Demo role switch: keeps the same user but escalates/derogates its role. */
export function setSessionRole(role: AppUser["role"]): void {
	const session = getSession();
	if (!session) return;
	write(KEY_SESSION, { ...session, role });
}

export function logout(): void {
	try {
		localStorage.removeItem(KEY_SESSION);
	} catch {
		/* noop */
	}
}

/* ── Budgets ─────────────────────────────────────────────────────────── */

export function listBudgets(userId?: number): AppBudget[] {
	const budgets = read<AppBudget[]>(KEY_BUDGETS) ?? [];
	const sorted = [...budgets].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	return userId === undefined ? sorted : sorted.filter((b) => b.userId === userId);
}

export function saveBudget(input: Omit<AppBudget, "id" | "createdAt" | "updatedAt" | "status">): AppBudget {
	const budget: AppBudget = {
		...input,
		id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		status: "received",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
	const budgets = read<AppBudget[]>(KEY_BUDGETS) ?? [];
	write(KEY_BUDGETS, [...budgets, budget]);
	return budget;
}

export function updateBudgetStatus(id: string, status: BudgetStatus): AppBudget | null {
	const budgets = read<AppBudget[]>(KEY_BUDGETS) ?? [];
	const index = budgets.findIndex((b) => b.id === id);
	if (index === -1) return null;
	const updated: AppBudget = {
		...budgets[index],
		status,
		updatedAt: new Date().toISOString(),
	};
	budgets[index] = updated;
	write(KEY_BUDGETS, budgets);
	return updated;
}

/* ── Bus punctuality reports (per line, local) ───────────────────────── */

export interface LocalReport {
	id: string;
	lineId: string;
	stop: string;
	action: string;
	minutesLate?: number;
	comment?: string;
	createdAt: string;
}

export const NEGATIVE_ACTIONS = ["late", "early", "notPassed", "cancelled"];

export function listReports(lineId: string): LocalReport[] {
	const reports = read<LocalReport[]>(KEY_REPORTS) ?? [];
	return reports
		.filter((r) => r.lineId === lineId)
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addReport(report: Omit<LocalReport, "id" | "createdAt">): LocalReport {
	const full: LocalReport = {
		...report,
		id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		createdAt: new Date().toISOString(),
	};
	const reports = read<LocalReport[]>(KEY_REPORTS) ?? [];
	write(KEY_REPORTS, [...reports, full]);
	return full;
}

export function lineStats(lineId: string): {
	total: number;
	negative: number;
	onTimeRate: number;
} {
	const reports = listReports(lineId);
	const total = reports.length;
	const negative = reports.filter((r) => NEGATIVE_ACTIONS.includes(r.action)).length;
	const onTimeRate = total === 0 ? 100 : Math.round(((total - negative) / total) * 100);
	return { total, negative, onTimeRate };
}
