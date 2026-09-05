/**
 * Fleet-management store for /dashboard/gestion. Demo layer over localStorage
 * (`plana-app:fleet`), seeded from src/data/app/fleet-seed.ts.
 * Every mutation appends a FleetActivity entry.
 */
import type {
	FleetActivity,
	FleetCollection,
	FleetData,
	FleetNotification,
} from "@/interfaces/fleet";
import { FLEET_SEED } from "@/data/app/fleet-seed";

const KEY = "plana-app:fleet";

type CollectionNames = Exclude<FleetCollection, "activity">;

export type AnyFleetItem = FleetData[CollectionNames][number] | FleetActivity;

function read(): FleetData | null {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? (JSON.parse(raw) as FleetData) : null;
	} catch {
		return null;
	}
}

function write(data: FleetData): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(data));
	} catch {
		/* storage unavailable: keep demo in memory only */
	}
}

function cloneSeed(): FleetData {
	return JSON.parse(JSON.stringify(FLEET_SEED)) as FleetData;
}

export function getFleet(): FleetData {
	return read() ?? cloneSeed();
}

export function seedFleetIfEmpty(): void {
	if (!read()) write(cloneSeed());
}

export function listFleet<K extends CollectionNames>(collection: K): FleetData[K] {
	return getFleet()[collection];
}

/** Max numeric id across a collection (items use numeric ids). */
function nextId(collection: CollectionNames): number {
	const items = listFleet(collection) as { id: number }[];
	return items.length > 0 ? Math.max(...items.map((i) => Number(i.id))) + 1 : 1;
}

function logActivity(data: FleetData, action: string, user = "Jefe"): void {
	const maxId = data.activity.reduce((max, a) => Math.max(max, a.id), 0);
	data.activity.unshift({
		id: maxId + 1,
		at: new Date().toISOString(),
		action,
		user,
	});
	// Keep a bounded history.
	data.activity = data.activity.slice(0, 50);
}

export function addFleetItem<K extends CollectionNames>(
	collection: K,
	item: Omit<FleetData[K][number], "id">,
	activity: string,
): FleetData[K][number] {
	const data = getFleet();
	const full = { ...item, id: nextId(collection) } as FleetData[K][number];
	(data[collection] as unknown as { id: number }[]).push(full as { id: number });
	logActivity(data, activity);
	write(data);
	return full;
}

/** Route and notification collections key by string ids — kept separate. */
export function addFleetRoute(route: Omit<FleetData["routes"][number], "id"> & { id: string }, activity: string): void {
	const data = getFleet();
	data.routes.push({ ...route, id: route.id } as FleetData["routes"][number]);
	logActivity(data, activity);
	write(data);
}

export function updateFleetRoute(route: FleetData["routes"][number], activity: string): void {
	const data = getFleet();
	const index = data.routes.findIndex((r) => r.id === route.id);
	if (index !== -1) data.routes[index] = route;
	logActivity(data, activity);
	write(data);
}

export function addFleetNotification(item: Omit<FleetNotification, "id">, activity: string): void {
	const data = getFleet();
	const notification: FleetNotification = { ...item, id: nextId("notifications") };
	data.notifications.unshift(notification);
	logActivity(data, activity);
	write(data);
}

export function updateFleetItem<K extends CollectionNames>(
	collection: K,
	id: number,
	item: Partial<FleetData[K][number]>,
	activity: string,
): void {
	const data = getFleet();
	const items = data[collection] as unknown as { id: number }[];
	const index = items.findIndex((i) => i.id === id);
	if (index !== -1) items[index] = { ...items[index], ...item };
	logActivity(data, activity);
	write(data);
}

export function removeFleetItem(collection: CollectionNames, id: number | string, activity: string): void {
	const data = getFleet();
	const items = data[collection] as unknown as { id: number | string }[];
	const filtered = items.filter((i) => i.id !== id);
	(data[collection] as unknown as { id: number | string }[]) = filtered;
	logActivity(data, activity);
	write(data);
}

export function toggleFleetStatus(collection: "routes" | "schedules" | "drivers", id: number | string, activity: string): void {
	const data = getFleet();
	const items = data[collection] as unknown as { id: number | string; status: string }[];
	const item = items.find((i) => i.id === id);
	if (item) item.status = item.status === "active" ? "inactive" : "active";
	logActivity(data, activity);
	write(data);
}

export function setNotificationRead(id: number, read: boolean): void {
	const data = getFleet();
	const item = data.notifications.find((n) => n.id === id);
	if (item) item.read = read;
	write(data);
}

export function setAllNotificationsRead(): void {
	const data = getFleet();
	data.notifications.forEach((n) => (n.read = true));
	write(data);
}

export function listActivity(): FleetActivity[] {
	return getFleet().activity;
}

/** Demo-only: JSON export/import of the whole fleet dataset. */
export function exportFleet(): string {
	return JSON.stringify(getFleet(), null, 2);
}

export function importFleet(raw: string): boolean {
	try {
		const parsed = JSON.parse(raw) as FleetData;
		if (!parsed.routes || !parsed.buses) return false;
		write(parsed);
		return true;
	} catch {
		return false;
	}
}
