import type { APIRoute } from "astro";

export const prerender = false;

// Temporary stubs — DB-backed user management will be reimplemented with your own ORM.
export const GET: APIRoute = async () => Response.json({ users: [] });
export const POST: APIRoute = async () =>
	Response.json({ error: "not_implemented" }, { status: 501 });
