/**
 * Prisma seed — datos reales de Empresa Plana (demo de flota) + usuarios.
 * Run: pnpm run db:seed
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { hashPasskey } from "../server/utils/passkey";
import { FLEET_SEED } from "../src/data/app/fleet-seed";
import { DEMO_BUDGETS, DEMO_USERS } from "../src/data/app/seed";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
});

async function main() {
	console.log("Seeding Empresa Plana database...");

	// Usuarios (passkeys con hash scrypt real). Sin id explícito: el
	// autoincrement lo asigna, así el seed no choca con usuarios creados
	// previamente por `db:create-user`.
	const idByDemoId = new Map<number, number>();
	for (const user of DEMO_USERS) {
		const record = await prisma.user.upsert({
			where: { username: user.username },
			update: {},
			create: {
				username: user.username,
				passkey: hashPasskey(user.passkey),
				name: user.name,
				fullName: user.fullName,
				email: user.email,
				phone: user.phone,
				role: user.role,
			},
		});
		idByDemoId.set(user.id, record.id);
	}
	console.log(`  ✓ ${DEMO_USERS.length} users`);

	// Rutas.
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

	// Paradas (con la relación many-to-many a rutas).
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

	// Conectar paradas ↔ rutas (m2m).
	for (const stop of FLEET_SEED.stops) {
		await prisma.stop.update({
			where: { id: stop.id },
			data: {
				routes: {
					set: stop.routes.map((routeId) => ({ id: routeId })),
				},
			},
		});
	}
	console.log(`  ✓ stop–route connections`);

	// Horarios.
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

	// Autobuses.
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

	// Conductores.
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
				routeId: driver.routeId ?? null,
				shiftDays: driver.shiftDays ?? null,
				shiftHours: driver.shiftHours ?? null,
				status: driver.status,
			},
		});
	}
	console.log(`  ✓ ${FLEET_SEED.drivers.length} drivers`);

	// Notificaciones.
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

	// Actividad.
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

	// Presupuestos (userId resuelto por username, no por id quemado).
	for (const budget of DEMO_BUDGETS) {
		const userId = idByDemoId.get(budget.userId) ?? budget.userId;
		await prisma.budget.upsert({
			where: { id: budget.id },
			update: {},
			create: {
				id: budget.id,
				userId,
				clientName: budget.clientName,
				email: budget.email,
				phone: budget.phone,
				company: budget.company || null,
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
