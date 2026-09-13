<script setup lang="ts">
const { locale, t } = useI18n();
const localeHead = useLocaleHead({ dir: true, key: "id", seo: true });

const ogLocale = computed(
	() => ({ ca: "ca_ES", es: "es_ES", en: "en_GB" })[locale.value] ?? "ca_ES",
);

useHead(() => ({
	...(localeHead.value ?? {}),
	titleTemplate: (title?: string) =>
		title ? `${title} — Empresa Plana` : "Empresa Plana",
}));

useSeoMeta({
	// Descripció real del lloc en producció (empresaplana.cat). La versió en
	// anglès del lloc original també servia aquest text en català.
	description: () => t("meta.description"),
	ogSiteName: "Empresa Plana",
	ogType: "website",
	ogLocale: () => ogLocale.value,
	ogImage: "https://empresaplana.cat/img/thumbnail.png",
	twitterCard: "summary",
});
</script>

<template>
	<UApp>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
