export default defineEventHandler(async () => {
	const offices = await prisma().office.findMany({ orderBy: { order: "asc" } });
	return offices.map((o) => ({
		id: o.id,
		name: o.name,
		address: o.address,
		city: o.city,
		postalCode: o.postalCode,
		phone: o.phone,
		purpose: o.purpose,
	}));
});
