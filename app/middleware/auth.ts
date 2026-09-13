export default defineNuxtRouteMiddleware(async (to) => {
	if (!to.path.startsWith("/dashboard")) return;
	const publicAuth = [
		"/dashboard/login",
		"/dashboard/register",
		"/es/dashboard/login",
		"/en/dashboard/login",
		"/es/dashboard/register",
		"/en/dashboard/register",
	];
	if (publicAuth.includes(to.path)) {
		return;
	}

	try {
		await $fetch("/api/me", { headers: useRequestHeaders(["cookie"]) });
	} catch {
		const localePath = useLocalePath();
		return navigateTo(localePath("/dashboard/login"), {
			query: { redirect: to.fullPath },
		});
	}
});
