/**
 * Temporary database stub.
 *
 * The Turso client + Drizzle instance were removed while you bring your own ORM.
 * Keep the `db`/`client` seam so call sites stay resolvable; wire them to your
 * real client when your ORM lands.
 */
export const client = {} as unknown;
export const db = {} as unknown;
