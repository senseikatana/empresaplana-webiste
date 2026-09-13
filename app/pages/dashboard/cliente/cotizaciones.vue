<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
	capability: "dashboard:access",
});

const { t } = useI18n();

const { data: budgets } = await useFetch("/api/budgets", {
	headers: useRequestHeaders(["cookie"]),
});

const statusLabel = (s: string) => t(`app.status.${s}`);
</script>

<template>
	<div>
		<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy">{{ t("app.panel.quotes") }}</h1>

		<UAlert
			v-if="!budgets || budgets.length === 0"
			class="mt-6"
			variant="soft"
			color="neutral"
			:title="t('app.panel.quotesEmpty')"
		/>

		<div v-else class="flex flex-col gap-4 mt-6">
			<UCard v-for="b in budgets" :key="b.id">
				<div class="flex items-start justify-between gap-4">
					<div>
						<h3 class="font-headline-md text-headline-md font-bold text-deep-navy">
							{{ b.departureCity }} → {{ b.arrivalCity }}
						</h3>
						<p class="font-body-md text-body-md text-on-surface-variant mt-1">
							{{ b.departureDay }} {{ b.departureTime }}{{ b.people ? ` · ${b.people}` : "" }}
						</p>
					</div>
					<UBadge :color="b.status === 'contracted' ? 'success' : 'neutral'" variant="soft">
						{{ statusLabel(b.status) }}
					</UBadge>
				</div>
			</UCard>
		</div>
	</div>
</template>