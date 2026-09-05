/**
 * API endpoint: POST /api/fleet/content
 * Handles CRUD mutations on Keystatic content files.
 * Writes JSON files to src/content/{entity}/ directories.
 */
import type { APIRoute } from "astro";
import { writeFileSync, unlinkSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CONTENT_ROOT = join(process.cwd(), "src/content");

function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function getEntityPath(entity: string): string {
	const map: Record<string, string> = {
		routes: "routes",
		buses: "buses",
		stops: "stops",
		schedules: "schedules",
		drivers: "drivers",
		notifications: "notifications",
	};
	const dir = map[entity];
	if (!dir) throw new Error(`Unknown entity: ${entity}`);
	return join(CONTENT_ROOT, dir);
}

function findFileByField(entity: string, field: string, value: string): string | null {
	const dir = getEntityPath(entity);
	if (!existsSync(dir)) return null;
	for (const file of readdirSync(dir)) {
		if (!file.endsWith(".json")) continue;
		try {
			const content = JSON.parse(require("node:fs").readFileSync(join(dir, file), "utf-8"));
			if (String(content[field]) === value) return file;
		} catch {
			/* skip unreadable files */
		}
	}
	return null;
}

export const POST: APIRoute = async ({ request }) => {
	try {
		const { entity, action, data } = await request.json();
		const dir = getEntityPath(entity);

		if (action === "add") {
			const slug = slugify(data.code || data.number || data.name || data.id || String(Date.now()));
			const filePath = join(dir, `${slug}.json`);
			writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
			return new Response(JSON.stringify({ success: true, slug }), { headers: { "Content-Type": "application/json" } });
		}

		if (action === "update") {
			// Find the file by id field
			const idField = entity === "routes" ? "code" : entity === "buses" ? "number" : "name";
			const idValue = data[idField] || data.id;
			const existing = findFileByField(entity, idField, idValue);
			if (!existing) {
				// Try by slug
				const slug = slugify(String(idValue));
				const filePath = join(dir, `${slug}.json`);
				if (existsSync(filePath)) {
					const current = JSON.parse(require("node:fs").readFileSync(filePath, "utf-8"));
					writeFileSync(filePath, JSON.stringify({ ...current, ...data }, null, 2) + "\n");
					return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
				}
				return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
			}
			const filePath = join(dir, existing);
			const current = JSON.parse(require("node:fs").readFileSync(filePath, "utf-8"));
			writeFileSync(filePath, JSON.stringify({ ...current, ...data }, null, 2) + "\n");
			return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
		}

		if (action === "delete") {
			const idField = entity === "routes" ? "code" : entity === "buses" ? "number" : "name";
			const idValue = data[idField] || data.id;
			const slug = slugify(String(idValue));
			const filePath = join(dir, `${slug}.json`);
			if (existsSync(filePath)) {
				unlinkSync(filePath);
				return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
			}
			return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
		}

		return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), { status: 400 });
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
	}
};
