import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { hashPasskey } from "../server/utils/passkey.ts";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not set");

const db = new PrismaClient({
	adapter: new PrismaPg({ connectionString: url }),
});

const username = process.argv[2] ?? "admin";
const passkey = process.argv[3] ?? "12345678";
const role = process.argv[4] ?? "admin";

async function main() {
	const user = await db.user.upsert({
		where: { username },
		update: { passkey: hashPasskey(passkey), role },
		create: {
			username,
			passkey: hashPasskey(passkey),
			name: username,
			fullName: username,
			email: `${username}@empresaplana.cat`,
			phone: "",
			role,
		},
	});
	console.log(
		`User ready: id=${user.id} username=${user.username} role=${user.role}`,
	);
}

main()
	.catch((e) => {
		console.error("Failed:", e);
		process.exit(1);
	})
	.finally(() => db.$disconnect());
