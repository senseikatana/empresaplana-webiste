<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "dashboard" });

const { t } = useI18n();
</script>

<template>
	<div>
		<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy">
			{{ t("app.panel.reports") }}
		</h1>
		<UAlert
			class="mt-6"
			variant="soft"
			color="neutral"
			:title="t('app.worker.noLineData')"
		/>
	</div>
</template>