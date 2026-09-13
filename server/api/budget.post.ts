import { randomUUID } from "node:crypto";
import { z } from "zod";

const budgetSchema = z.object({
	name: z.string().min(1).max(200),
	email: z.string().email().max(200),
	phone: z.string().min(1).max(30),
	company: z.string().max(200).optional().default(""),
	reasonId: z.string().max(60),
	description: z.string().max(2000).optional().default(""),
	departureCity: z.string().max(120).optional().default(""),
	departureDay: z.string().max(12).optional().default(""),
	departureTime: z.string().max(10).optional().default(""),
	arrivalCity: z.string().max(120).optional().default(""),
	arrivalDay: z.string().max(12).optional().default(""),
	arrivalTime: z.string().max(10).optional().default(""),
	people: z.string().max(10).optional().default(""),
});

export default defineEventHandler(async (event) => {
	rateLimit(event, { limit: 20, windowMs: 60_000 });

	const parsed = budgetSchema.safeParse(
		await readBody(event).catch(() => ({})),
	);
	if (!parsed.success) {
		throw createError({ statusCode: 400, statusMessage: "Dades invàlides" });
	}

	const d = parsed.data;

	// Asociar a un usuario si hay sesión (cliente autenticado); si no, presupuesto anónimo.
	const session = await getSessionUser(event);
	const userId = session?.id ?? (await ensureAnonymousUser(d.email));

	const budget = await prisma().budget.create({
		data: {
			id: randomUUID(),
			userId,
			clientName: d.name,
			email: d.email,
			phone: d.phone,
			company: d.company || null,
			reasonId: d.reasonId,
			description: d.description || null,
			departureCity: d.departureCity,
			departureDay: d.departureDay,
			departureTime: d.departureTime,
			arrivalCity: d.arrivalCity,
			arrivalDay: d.arrivalDay,
			arrivalTime: d.arrivalTime,
			people: d.people,
			status: "received",
		},
	});

	return { id: budget.id, status: budget.status };
});

// Para presupuestos anónimos: crea (o reutiliza) un usuario fantasma "client"
// ligado al email, para no romper la FK userId. Los fantasmas tienen
// `passkey: ""` (marca) y nunca pueden iniciar sesión: `verifyPasskey` los
// rechaza y el login exige passkey no vacía.
//
// Solo se reutiliza un fantasma PREVIO (passkey ""). Si el email pertenece a
// una cuenta real (passkey con sal), se crea un fantasma nuevo: así los
// presupuestos anónimos nunca se pegan a cuentas reales.
async function ensureAnonymousUser(email: string): Promise<number> {
	const ghost = await prisma().user.findFirst({
		where: { email, role: "client", passkey: "" },
	});
	if (ghost) return ghost.id;

	const created = await prisma().user.create({
		data: {
			username: `anon-${randomUUID().slice(0, 8)}`,
			email,
			name: email.split("@")[0] ?? "Anònim",
			fullName: email.split("@")[0] ?? "Anònim",
			phone: "",
			passkey: "",
			role: "client",
		},
	});
	return created.id;
}
