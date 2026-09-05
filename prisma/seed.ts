/**
 * Prisma seed — populates the database with the Empresa Plana demo data.
 * Run with: bunx --bun prisma db seed
 */
import { PrismaClient } from "@prisma/client";
import { FLEET_SEED } from "../src/data/app/fleet-seed";
import { DEMO_USERS, DEMO_BUDGETS } from "../src/data/app/seed";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding Empresa Plana database...");

	// Users
	for (const user of DEMO_USERS) {
		await prisma.user.upsert({
			where: { username: user.username },
			update: {},
			create: {
				id: user.id,
				username: user.username,
				passkey: user.passkey, // plaintext demo — see src/lib/passkey.ts for hashing
				name: user.name,
				fullName: user.fullName,
				email: user.email,
				phone: user.phone,
				role: user.role,
			},
		});
	}
	console.log(`  ✓ ${DEMO_USERS.length} users`);

	// Routes
	for (const route of FLEET_SEED.routes) {
		await prisma.route.upsert({
			where: { id: route.id },
			update: {},
			create: {
				id: route.id,
				code: route.code,
				name: route.name,
				origin: route.origin,
				destination: route.destination,
				color: route.color,
				status: route.status,
				path: route.path,
			},
		});
	}
	console.log(`  ✓ ${FLEET_SEED.routes.length} routes`);

	// Drivers
	for (const driver of FLEET_SEED.drivers) {
		await prisma.driver.upsert({
			where: { id: driver.id },
			update: {},
			create: {
				id: driver.id,
				name: driver.name,
				phone: driver.phone,
				license: driver.license,
				busNumber: driver.busNumber ?? null,
				status: driver.status,
			},
		});
	}
	console.log(`  ✓ ${FLEET_SEED.drivers.length} drivers`);

	// Buses
	for (const bus of FLEET_SEED.buses) {
		await prisma.bus.upsert({
			where: { number: bus.number },
			update: {},
			create: {
				id: bus.id,
				number: bus.number,
				plate: bus.plate,
				company: bus.company,
				capacity: bus.capacity,
				routeId: bus.routeId || null,
				status: bus.status,
				gps: bus.gps,
			},
		});
	}
	console.log(`  ✓ ${FLEET_SEED.buses.length} buses`);

	// Stops (many-to-many with routes handled after)
	for (const stop of FLEET_SEED.stops) {
		await prisma.stop.upsert({
			where: { id: stop.id },
			update: {},
			create: {
				id: stop.id,
				name: stop.name,
				address: stop.address,
				lat: stop.lat,
				lng: stop.lng,
			},
		});
	}
	console.log(`  ✓ ${FLEET_SEED.stops.length} stops`);

	// Connect stops to routes
	for (const stop of FLEET_SEED.stops) {
		const stopRecord = await prisma.stop.findUnique({ where: { id: stop.id } });
		if (!stopRecord) continue;
		await prisma.stop.update({
			where: { id: stop.id },
			data: {
				routes: {
					connect: stop.routes.map((routeId) => ({ id: routeId })),
				},
			},
		});
	}
	console.log(`  ✓ stop–route connections`);

	// Schedules
	for (const schedule of FLEET_SEED.schedules) {
		await prisma.schedule.upsert({
			where: { id: schedule.id },
			update: {},
			create: {
				id: schedule.id,
				routeId: schedule.routeId,
				departure: schedule.departure,
				arrival: schedule.arrival,
				frequency: schedule.frequency,
				days: schedule.days,
				status: schedule.status,
			},
		});
	}
	console.log(`  ✓ ${FLEET_SEED.schedules.length} schedules`);

	// Notifications
	for (const notif of FLEET_SEED.notifications) {
		await prisma.notification.upsert({
			where: { id: notif.id },
			update: {},
			create: {
				id: notif.id,
				type: notif.type,
				title: notif.title,
				desc: notif.desc,
				createdAt: new Date(notif.createdAt),
				read: notif.read,
				routeId: notif.routeId ?? null,
			},
		});
	}
	console.log(`  ✓ ${FLEET_SEED.notifications.length} notifications`);

	// Activity
	for (const act of FLEET_SEED.activity) {
		await prisma.activity.upsert({
			where: { id: act.id },
			update: {},
			create: {
				id: act.id,
				at: new Date(act.at),
				action: act.action,
				user: act.user,
			},
		});
	}
	console.log(`  ✓ ${FLEET_SEED.activity.length} activity entries`);

	// Budgets
	for (const budget of DEMO_BUDGETS) {
		await prisma.budget.upsert({
			where: { id: budget.id },
			update: {},
			create: {
				id: budget.id,
				userId: budget.userId,
				clientName: budget.clientName,
				email: budget.email,
				phone: budget.phone,
				company: budget.company ?? null,
				reasonId: budget.reasonId,
				description: budget.description ?? null,
				departureCity: budget.departureCity,
				departureDay: budget.departureDay,
				departureTime: budget.departureTime,
				arrivalCity: budget.arrivalCity,
				arrivalDay: budget.arrivalDay,
				arrivalTime: budget.arrivalTime,
				people: budget.people,
				status: budget.status,
				createdAt: new Date(budget.createdAt),
				updatedAt: new Date(budget.updatedAt),
			},
		});
	}
	console.log(`  ✓ ${DEMO_BUDGETS.length} budgets`);

	console.log("Seeding complete.");
}

main()
	.catch((e) => {
		console.error("Seed failed:", e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
