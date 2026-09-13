<script setup lang="ts">
import { hasCapability, isRole } from "#shared/acl";

// La raíz del panel redirige al área según las capabilities del usuario.
const { data, error } = await useFetch("/api/me", {
	headers: useRequestHeaders(["cookie"]),
});

const localePath = useLocalePath();

if (error.value || !data.value?.user || !isRole(data.value.user.role)) {
	await navigateTo(localePath("/dashboard/login"));
} else {
	const role = data.value.user.role;
	const home = hasCapability(role, "users:manage")
		? "/dashboard/gestion"
		: hasCapability(role, "fleet:view")
			? "/dashboard/trabajador"
			: "/dashboard/cliente";
	await navigateTo(localePath(home));
}
</script>

<template>
	<div />
</template>