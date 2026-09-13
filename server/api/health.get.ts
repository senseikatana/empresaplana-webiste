export default defineEventHandler(async (event) => {
	try {
		await prisma().$queryRaw`SELECT 1`;
		return { ok: true, db: "up" };
	} catch (error) {
		// Log interno para debugging sin exponer driver/host al público.
		console.error("[health] DB check failed:", error);
		setResponseStatus(event, 503);
		return { ok: false, db: "down" };
	}
});
