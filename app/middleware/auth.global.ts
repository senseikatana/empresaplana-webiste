import { type Capability, hasCapability, isRole } from "#shared/acl";

// Ruta del panel con o sin prefijo de locale (ca vive en la raíz).
const dashboardPathPattern = /^\/(?:es|en|fr)?\/dashboard(?:\/|$)/;
const publicAuthPaths = ["/dashboard/login", "/dashboard/register"];

function isPublicAuthPath(path: string): boolean {
	return publicAuthPaths.some((p) => path === p || p === path.replace(/^\/(?:es|en|fr)(?=\/dashboard)/, ""));
}

export default defineNuxtRouteMiddleware(async (to) => {
	if (!dashboardPathPattern.test(to.path) || isPublicAuthPath(to.path)) return;

	const localePath = useLocalePath();

	let session: { user?: { role?: string } } | null = null;
	try {
		session = await $fetch("/api/me", {
			headers: useRequestHeaders(["cookie"]),
		});
	} catch {
		session = null;
	}

	const role = session?.user?.role;
	if (!role || !isRole(role)) {
		// Query construido manualmente: navigateTo con string + query no
		// garantiza la serialización del redirect en SSR.
		const loginUrl = `${localePath("/dashboard/login")}?redirect=${encodeURIComponent(to.fullPath)}`;
		return navigateTo(loginUrl);
	}

	// Guard por capability (no por rol): la página declara lo que necesita
	// con `definePageMeta({ capability: "..." })`.
	const required = to.meta.capability as Capability | undefined;
	if (required && !hasCapability(role, required)) {
		return navigateTo(localePath("/dashboard"));
	}
});