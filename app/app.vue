<script setup lang="ts">
useHead({
	titleTemplate: (title?: string) =>
		title ? `${title} — Empresa Plana` : "Empresa Plana",
});
</script>

<template>
	<UApp>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>