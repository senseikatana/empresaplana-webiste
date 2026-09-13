<script setup lang="ts">
// La raíz del panel redirige al área según el rol del usuario.
const { data, error } = await useFetch("/api/me", {
	headers: useRequestHeaders(["cookie"]),
});

const localePath = useLocalePath();

if (error.value || !data.value?.user) {
	await navigateTo(localePath("/dashboard/login"));
} else {
	const role = data.value.user.role;
	const home =
		role === "client"
			? "/dashboard/cliente"
			: role === "worker"
				? "/dashboard/trabajador"
				: "/dashboard/gestion";
	await navigateTo(localePath(home));
}
</script>

<template>
	<div />
</template>