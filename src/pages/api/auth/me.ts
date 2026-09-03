import type { APIRoute } from "astro";

export const prerender = false;

// Temporary stub — DB-backed session lookup will be reimplemented with your own ORM.
export const GET: APIRoute = async () => Response.json({ user: null });
