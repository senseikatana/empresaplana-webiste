import type { APIRoute } from "astro";

export const prerender = false;

// Temporary stub — DB-backed login will be reimplemented with your own ORM.
export const POST: APIRoute = async () =>
	Response.json({ error: "not_implemented" }, { status: 501 });
