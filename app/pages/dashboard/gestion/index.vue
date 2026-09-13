<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	capability: "users:manage",
});

const { t } = useI18n();

const { data: summary } = await useFetch("/api/fleet/summary", {
	headers: useRequestHeaders(["cookie"]),
});

const kpis = computed(() => [
	{
		label: t("app.gestion.nav.routes"),
		value: summary.value?.routes ?? 0,
		icon: "route",
	},
	{
		label: t("app.gestion.nav.buses"),
		value: summary.value?.buses ?? 0,
		icon: "directions_bus",
	},
	{
		label: t("app.gestion.nav.stops"),
		value: summary.value?.stops ?? 0,
		icon: "location_on",
	},
	{
		label: t("app.gestion.nav.drivers"),
		value: summary.value?.drivers ?? 0,
		icon: "badge",
	},
]);
</script>

<template>
	<div>
		<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy">
			{{ t("app.gestion.nav.panel") }}
		</h1>
		<p class="font-body-md text-body-md text-on-surface-variant mt-1">{{ t("app.title") }}</p>

		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
			<UCard v-for="k in kpis" :key="k.label">
				<div class="flex items-center gap-3">
					<span class="material-symbols-outlined text-coastal-teal text-[28px]">{{ k.icon }}</span>
					<div>
						<p class="font-headline-lg font-bold text-deep-navy">{{ k.value }}</p>
						<p class="font-label-md text-label-md text-on-surface-variant">{{ k.label }}</p>
					</div>
				</div>
			</UCard>
		</div>
	</div>
</template>