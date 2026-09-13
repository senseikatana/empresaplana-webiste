<script setup lang="ts">
const { t } = useI18n();
useHead({ title: () => t("legal.privacyPolicy.title") });

// Estructura real del diccionario: legal.privacyPolicy.sectionTitles
const sectionKeys = [
	"object",
	"responsible",
	"collectedData",
	"purpose",
	"recipients",
	"retention",
	"rights",
	"incidents",
	"contact",
	"userCommitment",
	"userLiability",
	"lssi",
	"cookiesInfo",
	"socialInfo",
] as const;

const sections = computed(() =>
	sectionKeys.map((key) => ({
		title: t(`legal.privacyPolicy.sectionTitles.${key}`),
		body: t(`legal.privacyPolicy.sections.${key}`),
	})),
);
</script>

<template>
	<LegalPage
		:title="t('legal.privacyPolicy.heading')"
		:intro="sections[0]?.body ?? ''"
		:sections="sections"
	/>
</template>