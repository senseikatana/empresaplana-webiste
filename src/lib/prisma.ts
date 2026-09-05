/**
 * Prisma Client singleton for Empresa Plana.
 * Uses @prisma/adapter-pg + pg driver for Prisma Postgres cloud.
 * Set DATABASE_URL in .env (Prisma Postgres connection string).
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		console.warn("[prisma] DATABASE_URL not set — database features will not work.");
		return new PrismaClient();
	}
	const adapter = new PrismaPg({ connectionString });
	return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
