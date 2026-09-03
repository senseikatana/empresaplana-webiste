import type { SearchResults } from "@/interfaces/search";

/**
 * Temporary search stub.
 *
 * The Drizzle-backed route search was removed while you bring your own ORM.
 * This returns empty results so `/rutas-horarios` renders its empty state.
 * Reimplement with your real data layer when ready.
 */
export async function searchRoutes(
	_origin: string,
	_destination: string,
	_withTransfers = false,
): Promise<SearchResults> {
	return { direct: [], transfers: [], through: [] };
}
