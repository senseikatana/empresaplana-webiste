/**
 * API endpoint: POST /api/sheets/sync
 * Pushes current fleet data to Google Sheets.
 * Reads from Prisma when DATABASE_URL is set, otherwise from localStorage seed.
 * POST /api/sheets/sync — push fleet data
 * GET  /api/sheets/sync — test connection
 */
import type { APIRoute } from "astro";
import { pushFleetToSheets, testSheetsConnection } from "@/lib/google-sheets";
import { prisma } from "@/lib/prisma";
import { FLEET_SEED } from "@/data/app/fleet-seed";

async function getFleetData() {
	try {
		await prisma.$queryRaw`SELECT 1`;
		// Database available — read from Prisma
		const [routes, buses, stops, schedules, drivers] = await Promise.all([
			prisma.route.findMany({ orderBy: { code: "asc" } }),
			prisma.bus.findMany({ orderBy: { number: "asc" } }),
			prisma.stop.findMany({ orderBy: { name: "asc" } }),
			prisma.schedule.findMany({ orderBy: { routeId: "asc" } }),
			prisma.driver.findMany({ orderBy: { name: "asc" } }),
		]);
		return { routes, buses, stops, schedules, drivers };
	} catch {
		// No database — use seed data
		return {
			routes: FLEET_SEED.routes,
			buses: FLEET_SEED.buses,
			stops: FLEET_SEED.stops,
			schedules: FLEET_SEED.schedules,
			drivers: FLEET_SEED.drivers,
		};
	}
}

export const GET: APIRoute = async () => {
	const result = await testSheetsConnection();
	return new Response(JSON.stringify(result), {
		headers: { "Content-Type": "application/json" },
	});
};

export const POST: APIRoute = async () => {
	const fleet = await getFleetData();
	const result = await pushFleetToSheets(fleet as Record<string, unknown>[]);
	return new Response(JSON.stringify(result), {
		headers: { "Content-Type": "application/json" },
		status: result.success ? 200 : 500,
	});
};
