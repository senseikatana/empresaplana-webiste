<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	capability: "fleet:view",
});

const { t } = useI18n();

const { data: notifications } = await useFetch("/api/fleet/notifications", {
	headers: useRequestHeaders(["cookie"]),
});
</script>

<template>
	<div>
		<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy">
			{{ t("app.panel.incidents") }}
		</h1>

		<div class="flex flex-col gap-3 mt-6">
			<UCard v-for="n in notifications ?? []" :key="n.id">
				<div class="flex items-start justify-between gap-4">
					<div>
						<h3 class="font-headline-md text-headline-md font-bold text-deep-navy">{{ n.title }}</h3>
						<p class="font-body-md text-body-md text-on-surface-variant mt-1">{{ n.desc }}</p>
					</div>
					<span class="font-label-md text-label-md text-outline shrink-0">
						{{ new Date(n.createdAt).toLocaleDateString() }}
					</span>
				</div>
			</UCard>
		</div>
	</div>
</template>