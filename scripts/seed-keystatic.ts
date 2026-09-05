/**
 * Seed script: generates Keystatic content files from fleet-seed data.
 * Run with: bun run seed:keystatic
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { FLEET_SEED } from "../src/data/app/fleet-seed";
import { DEMO_USERS, DEMO_BUDGETS } from "../src/data/app/seed";
import popularLines from "../src/data/popular-lines.json";

const ROOT = join(import.meta.dirname, "..");
const CONTENT = join(ROOT, "src/content");

function ensureDir(path: string) {
	if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function writeJson(relPath: string, data: unknown) {
	const fullPath = join(CONTENT, relPath);
	ensureDir(fullPath.substring(0, fullPath.lastIndexOf("/")));
	writeFileSync(fullPath, JSON.stringify(data, null, 2) + "\n");
	console.log(`  ✓ ${relPath}`);
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

// Merge fleet routes with popular-lines PDF URLs
const pdfMap = new Map(popularLines.lines.map((l) => [l.id, l.pdfUrls]));

console.log("Seeding Keystatic content...\n");

// Routes
const routeSlugs: Record<string, string> = {};
for (const route of FLEET_SEED.routes) {
	const slug = slugify(route.code);
	routeSlugs[route.id] = slug;
	const pdfs = pdfMap.get(route.id) ?? {};
	writeJson(`routes/${slug}.json`, {
		code: route.code,
		name: route.name,
		origin: route.origin,
		destination: route.destination,
		color: route.color,
		status: route.status,
		path: route.path.map(([lat, lng]) => ({ lat, lng })),
		pdfUrl: {
			es: pdfs.es ?? "",
			ca: pdfs.ca ?? "",
			en: pdfs.en ?? "",
		},
	});
}
console.log(`  → ${FLEET_SEED.routes.length} routes\n`);

// Buses
for (const bus of FLEET_SEED.buses) {
	const slug = slugify(bus.number);
	writeJson(`buses/${slug}.json`, {
		number: bus.number,
		plate: bus.plate,
		company: bus.company,
		capacity: bus.capacity,
		routeId: routeSlugs[bus.routeId] ?? "",
		status: bus.status,
	});
}
console.log(`  → ${FLEET_SEED.buses.length} buses\n`);

// Stops
for (const stop of FLEET_SEED.stops) {
	const slug = slugify(stop.name);
	writeJson(`stops/${slug}.json`, {
		name: stop.name,
		address: stop.address,
		lat: stop.lat,
		lng: stop.lng,
		routes: stop.routes.map((r) => routeSlugs[r] ?? r),
	});
}
console.log(`  → ${FLEET_SEED.stops.length} stops\n`);

// Schedules
for (const sched of FLEET_SEED.schedules) {
	const slug = String(sched.id);
	writeJson(`schedules/${slug}.json`, {
		id: slug,
		routeId: routeSlugs[sched.routeId] ?? "",
		departure: sched.departure,
		arrival: sched.arrival,
		frequency: sched.frequency,
		days: sched.days,
		status: sched.status,
	});
}
console.log(`  → ${FLEET_SEED.schedules.length} schedules\n`);

// Drivers
const busNumberSlugs: Record<string, string> = {};
for (const bus of FLEET_SEED.buses) busNumberSlugs[bus.number] = slugify(bus.number);

for (const driver of FLEET_SEED.drivers) {
	const slug = slugify(driver.name);
	writeJson(`drivers/${slug}.json`, {
		name: driver.name,
		phone: driver.phone,
		license: driver.license,
		busNumber: driver.busNumber ? busNumberSlugs[driver.busNumber] ?? "" : "",
		routeId: driver.routeId ? routeSlugs[driver.routeId] ?? "" : "",
		shiftDays: driver.shiftDays ?? "",
		shiftHours: driver.shiftHours ?? "",
		status: driver.status,
	});
}
console.log(`  → ${FLEET_SEED.drivers.length} drivers\n`);

// Notifications
for (const notif of FLEET_SEED.notifications) {
	const slug = String(notif.id);
	writeJson(`notifications/${slug}.json`, {
		id: slug,
		type: notif.type,
		title: notif.title,
		desc: notif.desc,
		createdAt: notif.createdAt,
		read: notif.read,
		routeId: notif.routeId ? routeSlugs[notif.routeId] ?? "" : "",
	});
}
console.log(`  → ${FLEET_SEED.notifications.length} notifications\n`);

// Users singleton
writeJson("users.json", {
	items: DEMO_USERS.map((u) => ({
		username: u.username,
		passkey: u.passkey,
		name: u.name,
		fullName: u.fullName,
		email: u.email,
		phone: u.phone,
		role: u.role,
		driverId: u.driverId ?? 0,
	})),
});
console.log(`  → ${DEMO_USERS.length} users\n`);

// Reports-data singleton
const satisfactionNames = ["punctuality", "cleanliness", "comfort", "information", "attention"];
writeJson("reports-data.json", {
	passengers: FLEET_SEED.reports.passengers,
	occupancy: FLEET_SEED.reports.occupancy,
	weeklyPunctuality: FLEET_SEED.reports.weeklyPunctuality,
	satisfaction: FLEET_SEED.reports.satisfaction.map((s, i) => ({
		name: satisfactionNames[i] ?? s.name,
		value: s.value,
	})),
});
console.log("  → reports-data\n");

console.log("Seeding complete. Files written to src/content/");
