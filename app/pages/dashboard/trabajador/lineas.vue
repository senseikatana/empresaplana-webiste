<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	capability: "fleet:view",
});

const { t } = useI18n();

const { data: routes } = await useFetch("/api/fleet/routes", {
	headers: useRequestHeaders(["cookie"]),
});
</script>

<template>
	<div>
		<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy">
			{{ t("app.panel.lines") }}
		</h1>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
			<UCard v-for="r in routes ?? []" :key="r.id">
				<div class="flex items-center gap-2">
					<span class="h-3 w-3 rounded-full inline-block" :style="{ backgroundColor: r.color }" />
					<span class="font-label-md text-label-md font-bold text-on-surface">{{ r.code }}</span>
					<UBadge :color="r.status === 'active' ? 'success' : 'neutral'" variant="soft" class="ml-auto">
						{{ r.status }}
					</UBadge>
				</div>
				<p class="font-headline-md text-headline-md font-bold text-deep-navy mt-2">{{ r.name }}</p>
				<p class="font-body-md text-body-md text-on-surface-variant">{{ r.origin }} → {{ r.destination }}</p>
			</UCard>
		</div>
	</div>
</template>