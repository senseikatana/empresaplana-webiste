import type { APIRoute } from "astro";

export const prerender = false;

// Temporary stubs — DB-backed user management will be reimplemented with your own ORM.
export const GET: APIRoute = async () =>
	Response.json({ error: "not_found" }, { status: 404 });
export const PATCH: APIRoute = async () =>
	Response.json({ error: "not_implemented" }, { status: 501 });
export const DELETE: APIRoute = async () =>
	Response.json({ error: "not_implemented" }, { status: 501 });
