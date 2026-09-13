<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	capability: "dashboard:access",
});

const { t } = useI18n();

const { data: favorites, refresh } = await useFetch("/api/favorites", {
	headers: useRequestHeaders(["cookie"]),
});

async function toggle(routeId: string) {
	await $fetch("/api/favorites", { method: "PUT", body: { routeId } });
	await refresh();
}
</script>

<template>
	<div>
		<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy">{{ t("app.panel.favorites") }}</h1>

		<UAlert
			v-if="!favorites || favorites.length === 0"
			class="mt-6"
			variant="soft"
			color="neutral"
			:title="t('app.panel.favoritesEmpty')"
		/>

		<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
			<UCard v-for="r in favorites" :key="r.id">
				<div class="flex items-center justify-between gap-4">
					<div>
						<div class="flex items-center gap-2">
							<span class="h-3 w-3 rounded-full inline-block" :style="{ backgroundColor: r.color }" />
							<span class="font-label-md text-label-md font-bold text-on-surface">{{ r.code }}</span>
						</div>
						<p class="font-headline-md text-headline-md font-bold text-deep-navy mt-1">{{ r.name }}</p>
						<p class="font-body-md text-body-md text-on-surface-variant">{{ r.origin }} → {{ r.destination }}</p>
					</div>
					<UButton color="neutral" variant="ghost" icon="i-lucide-star" aria-label="Quitar" @click="toggle(r.id)" />
				</div>
			</UCard>
		</div>
	</div>
</template>