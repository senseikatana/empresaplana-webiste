<script setup lang="ts">
const { t } = useI18n();
useHead({ title: () => t("legal.cookiePolicy.title") });

// Estructura real del diccionario: legal.cookiePolicy
const sections = computed(() => {
	const p = (k: string) => t(`legal.cookiePolicy.${k}`);
	return [
		{
			title: p("definitionTitle"),
			body: `${p("definition")}\n\n${p("definitionBody")}`,
		},
		{
			title: p("typesTitle"),
			body: [
				p("typesByTime"),
				p("sessionCookies"),
				p("persistentCookies"),
				p("typesByPurpose"),
				p("ownCookies"),
				p("thirdPartyCookies"),
				p("technicalCookies"),
				p("analyticsCookies"),
				p("advertisingCookies"),
			].join("\n\n"),
		},
		{ title: p("thirdPartyTitle"), body: p("googleCookies") },
		{
			title: p("configureTitle"),
			body: `${p("configure")}\n\n${p("configureHelp")}`,
		},
	];
});
</script>

<template>
	<LegalPage
		:title="t('legal.cookiePolicy.heading')"
		:intro="t('legal.cookiePolicy.definition')"
		:sections="sections"
	/>
</template>