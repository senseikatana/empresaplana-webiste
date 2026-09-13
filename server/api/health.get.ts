export default defineEventHandler(async () => {
	try {
		await prisma().$queryRaw`SELECT 1`;
		return { ok: true, db: "up" };
	} catch (error) {
		return { ok: false, db: "down", error: String(error) };
	}
});
