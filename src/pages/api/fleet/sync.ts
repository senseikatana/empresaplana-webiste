/**
 * API endpoint: /api/fleet/[action]
 * Server-side fleet store backed by Prisma Postgres.
 * Falls back gracefully when DATABASE_URL is not set.
 */
import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

async function hasDb(): Promise<boolean> {
	try {
		await prisma.$queryRaw`SELECT 1`;
		return true;
	} catch {
		return false;
	}
}

/** GET /api/fleet/routes — list all routes */
export const GET: APIRoute = async ({ url }) => {
	if (!(await hasDb())) {
		return new Response(JSON.stringify({ error: "Database not configured" }), { status: 503 });
	}

	const collection = url.searchParams.get("collection") ?? "routes";

	try {
		let data: unknown[];
		switch (collection) {
			case "routes": data = await prisma.route.findMany({ orderBy: { code: "asc" } }); break;
			case "buses": data = await prisma.bus.findMany({ orderBy: { number: "asc" } }); break;
			case "stops": data = await prisma.stop.findMany({ orderBy: { name: "asc" } }); break;
			case "schedules": data = await prisma.schedule.findMany({ orderBy: { routeId: "asc" } }); break;
			case "drivers": data = await prisma.driver.findMany({ orderBy: { name: "asc" } }); break;
			case "notifications": data = await prisma.notification.findMany({ orderBy: { createdAt: "desc" } }); break;
			case "activity": data = await prisma.activity.findMany({ orderBy: { at: "desc" }, take: 50 }); break;
			case "budgets": data = await prisma.budget.findMany({ orderBy: { createdAt: "desc" } }); break;
			case "reports": data = await prisma.report.findMany({ orderBy: { createdAt: "desc" } }); break;
			default: return new Response(JSON.stringify({ error: `Unknown collection: ${collection}` }), { status: 400 });
		}
		return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
	}
};

/** POST /api/fleet/sync — bulk sync a full fleet dataset to Prisma */
export const POST: APIRoute = async ({ request }) => {
	if (!(await hasDb())) {
		return new Response(JSON.stringify({ error: "Database not configured" }), { status: 503 });
	}

	try {
		const body = await request.json();
		const { routes, buses, stops, schedules, drivers, notifications, activity, budgets } = body;

		// Upsert routes
		if (routes) {
			for (const r of routes) {
				await prisma.route.upsert({
					where: { id: r.id },
					update: { ...r, path: r.path ?? [] },
					create: { ...r, path: r.path ?? [] },
				});
			}
		}

		// Upsert buses
		if (buses) {
			for (const b of buses) {
				await prisma.bus.upsert({
					where: { number: b.number },
					update: { ...b, gps: b.gps ?? {} },
					create: { ...b, gps: b.gps ?? {} },
				});
			}
		}

		// Upsert stops
		if (stops) {
			for (const s of stops) {
				await prisma.stop.upsert({
					where: { id: s.id },
					update: s,
					create: s,
				});
			}
		}

		// Upsert schedules
		if (schedules) {
			for (const s of schedules) {
				await prisma.schedule.upsert({
					where: { id: s.id },
					update: s,
					create: s,
				});
			}
		}

		// Upsert drivers
		if (drivers) {
			for (const d of drivers) {
				await prisma.driver.upsert({
					where: { id: d.id },
					update: d,
					create: d,
				});
			}
		}

		// Upsert notifications
		if (notifications) {
			for (const n of notifications) {
				await prisma.notification.upsert({
					where: { id: n.id },
					update: n,
					create: { ...n, createdAt: new Date(n.createdAt) },
				});
			}
		}

		// Upsert budgets
		if (budgets) {
			for (const b of budgets) {
				await prisma.budget.upsert({
					where: { id: b.id },
					update: { ...b, createdAt: new Date(b.createdAt), updatedAt: new Date(b.updatedAt) },
					create: { ...b, createdAt: new Date(b.createdAt), updatedAt: new Date(b.updatedAt) },
				});
			}
		}

		// Append activity
		if (activity) {
			for (const a of activity) {
				await prisma.activity.create({
					data: { at: new Date(a.at), action: a.action, user: a.user ?? "Sistema" },
				});
			}
		}

		return new Response(JSON.stringify({ success: true, message: "Datos sincronizados con la base de datos." }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ success: false, error: String(error) }), { status: 500 });
	}
};
