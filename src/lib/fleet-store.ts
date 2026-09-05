/**
 * Fleet store — reads from Keystatic content files (src/content/) via direct
 * JSON imports at build time. Runtime mutations (add/update/delete/toggle)
 * go through API endpoints that write back to the filesystem.
 *
 * GPS telemetry, activity log, and session data stay in localStorage.
 * Budgets/reports stay in app-store.ts (localStorage).
 */
import type {
	FleetActivity,
	FleetCollection,
	FleetData,
	FleetNotification,
} from "@/interfaces/fleet";
import { FLEET_SEED } from "@/data/app/fleet-seed";

// ── Build-time JSON imports via import.meta.glob (Astro/Vite resolves these) ──
const routeModules = import.meta.glob("../../content/routes/*.json", { eager: true, import: "default" });
const busModules = import.meta.glob("../../content/buses/*.json", { eager: true, import: "default" });
const stopModules = import.meta.glob("../../content/stops/*.json", { eager: true, import: "default" });
const scheduleModules = import.meta.glob("../../content/schedules/*.json", { eager: true, import: "default" });
const driverModules = import.meta.glob("../../content/drivers/*.json", { eager: true, import: "default" });
const notificationModules = import.meta.glob("../../content/notifications/*.json", { eager: true, import: "default" });

const KEY_ACTIVITY = "plana-app:fleet-activity";

// ── Helpers ──

function readLocal<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : null;
	} catch {
		return null;
	}
}

function writeLocal(key: string, value: unknown): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		/* storage unavailable */
	}
}

function loadCollection<T>(modules: Record<string, unknown>): T[] {
	return Object.values(modules).map((mod) => mod as T);
}

/** Read fleet data from Keystatic content files (build-time resolved). */
function readContentFleet(): Omit<FleetData, "activity"> {
	const routes = loadCollection<FleetData["routes"][number]>(routeModules);
	const buses = loadCollection<FleetData["buses"][number]>(busModules);
	const stops = loadCollection<FleetData["stops"][number]>(stopModules);
	const schedules = loadCollection<FleetData["schedules"][number]>(scheduleModules);
	const drivers = loadCollection<FleetData["drivers"][number]>(driverModules);
	const notifications = loadCollection<FleetData["notifications"][number]>(notificationModules);
	return { routes, buses, stops, schedules, drivers, notifications } as Omit<FleetData, "activity">;
}

// ── Public API ──

export function getFleet(): FleetData {
	const content = readContentFleet();
	const activity = readLocal<FleetActivity[]>(KEY_ACTIVITY) ?? [];
	return { ...content, activity } as FleetData;
}

export function seedFleetIfEmpty(): void {
	// Content is always available from the JSON files.
	// Activity needs localStorage seeding.
	if (!readLocal(KEY_ACTIVITY)) {
		writeLocal(KEY_ACTIVITY, FLEET_SEED.activity);
	}
}

export function listFleet<K extends FleetCollection>(collection: K): FleetData[K] {
	return getFleet()[collection];
}

// ── Mutations (write to API endpoint + log activity locally) ──

async function persistChange(entity: string, action: string, data: unknown): Promise<void> {
	try {
		await fetch("/api/fleet/content", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ entity, action, data }),
		});
	} catch {
		/* API unavailable — changes only in current session */
	}
}

function logActivity(action: string, user = "Jefe"): void {
	const activity = readLocal<FleetActivity[]>(KEY_ACTIVITY) ?? [];
	const maxId = activity.reduce((max, a) => Math.max(max, a.id), 0);
	activity.unshift({ id: maxId + 1, at: new Date().toISOString(), action, user });
	writeLocal(KEY_ACTIVITY, activity.slice(0, 50));
}

export function nextId(collection: Exclude<FleetCollection, "activity">): number {
	const items = listFleet(collection) as unknown as { id: number }[];
	return items.length > 0 ? Math.max(...items.map((i) => Number(i.id))) + 1 : 1;
}

export async function addFleetItem<K extends Exclude<FleetCollection, "activity">>(
	collection: K,
	item: Omit<FleetData[K][number], "id">,
	activity: string,
): Promise<FleetData[K][number]> {
	const full = { ...item, id: nextId(collection) } as FleetData[K][number];
	await persistChange(collection, "add", full);
	logActivity(activity);
	return full;
}

export async function addFleetRoute(
	route: Omit<FleetData["routes"][number], "id"> & { id: string },
	activity: string,
): Promise<void> {
	await persistChange("routes", "add", route);
	logActivity(activity);
}

export async function updateFleetRoute(route: FleetData["routes"][number], activity: string): Promise<void> {
	await persistChange("routes", "update", route);
	logActivity(activity);
}

export async function addFleetNotification(item: Omit<FleetNotification, "id">, activity: string): Promise<void> {
	const id = nextId("notifications");
	await persistChange("notifications", "add", { ...item, id });
	logActivity(activity);
}

export async function updateFleetItem<K extends Exclude<FleetCollection, "activity">>(
	collection: K,
	id: number,
	item: Partial<FleetData[K][number]>,
	activity: string,
): Promise<void> {
	await persistChange(collection, "update", { id, ...item });
	logActivity(activity);
}

export async function removeFleetItem(
	collection: Exclude<FleetCollection, "activity">,
	id: number | string,
	activity: string,
): Promise<void> {
	await persistChange(collection, "delete", { id });
	logActivity(activity);
}

export async function toggleFleetStatus(
	collection: "routes" | "schedules" | "drivers",
	id: number | string,
	activity: string,
): Promise<void> {
	const items = listFleet(collection) as unknown as { id: number | string; status: string }[];
	const item = items.find((i) => i.id === id);
	if (!item) return;
	const newStatus = item.status === "active" ? "inactive" : "active";
	await persistChange(collection, "update", { id, status: newStatus });
	logActivity(activity);
}

export function setNotificationRead(id: number, read: boolean): void {
	const readKey = "plana-app:read-notifications";
	const readIds = new Set<number>(readLocal<number[]>(readKey) ?? []);
	if (read) readIds.add(id);
	else readIds.delete(id);
	writeLocal(readKey, [...readIds]);
}

export function setAllNotificationsRead(): void {
	const fleet = getFleet();
	writeLocal("plana-app:read-notifications", fleet.notifications.map((n) => n.id));
}

export function listActivity(): FleetActivity[] {
	return readLocal<FleetActivity[]>(KEY_ACTIVITY) ?? [];
}

export function exportFleet(): string {
	return JSON.stringify(getFleet(), null, 2);
}

export function importFleet(raw: string): boolean {
	try {
		const parsed = JSON.parse(raw) as FleetData;
		if (!parsed.routes || !parsed.buses) return false;
		writeLocal(KEY_ACTIVITY, parsed.activity ?? []);
		return true;
	} catch {
		return false;
	}
}
