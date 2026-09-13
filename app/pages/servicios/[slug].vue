<script setup lang="ts">
import services from "~/data/services.json";

const { locale, t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const slug = route.params.slug as string;
const service = services.services.find((s) => s.slug === slug);

if (!service) {
	throw createError({ statusCode: 404, statusMessage: "Servei no trobat" });
}

// El contenido real tiene locales incompletos (algunos solo ca o solo es).
// Fallback: idioma actual → es → ca.
const loc = computed(() => {
	const l = locale.value as "ca" | "es" | "en" | "fr";
	if (service.locales[l]) return l;
	if (service.locales.es) return "es";
	if (service.locales.ca) return "ca";
	return "es";
});

const content = computed(() => service.locales[loc.value]);
useHead({ title: () => content.value?.title ?? "" });
useSeoMeta({ description: () => content.value?.tagline ?? "" });

const professionalsBullets = computed(() => [
	t("discretionary.professionals.bullets.0"),
	t("discretionary.professionals.bullets.1"),
	t("discretionary.professionals.bullets.2"),
	t("discretionary.professionals.bullets.3"),
]);
</script>

<template>
	<div>
		<main class="mx-auto w-full max-w-container-max px-margin-mobile py-stack-lg md:px-margin-desktop">
			<NuxtLink class="mb-stack-md inline-flex text-label-md text-deep-navy" :to="localePath('/servicios-discrecionales')">
				← {{ t("discretionary.services.title") }}
			</NuxtLink>
			<section class="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-ambient">
				<img
					v-if="content?.imageUrl"
					class="h-64 w-full object-cover md:h-96"
					:src="content.imageUrl"
					:alt="content.imageCaption ?? content.title"
				/>
				<div class="p-stack-md md:p-stack-lg">
					<p class="mb-stack-sm text-label-md font-semibold uppercase text-coastal-teal">{{ t("common.brand") }}</p>
					<h1 class="mb-stack-sm text-display-lg font-bold text-deep-navy">{{ content?.title }}</h1>
					<p class="mb-stack-lg max-w-3xl text-body-lg text-on-surface-variant">{{ content?.tagline }}</p>
					<div class="grid gap-stack-md md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
						<div class="space-y-stack-sm text-body-md leading-relaxed text-on-surface">
							<p v-for="(paragraph, i) in content?.body ?? []" :key="i">{{ paragraph }}</p>
						</div>
						<aside class="h-fit rounded-lg bg-surface-container-low p-stack-md">
							<h2 class="mb-stack-sm text-headline-md font-bold text-deep-navy">{{ content?.sectionTitle }}</h2>
							<ul class="space-y-stack-sm text-body-md text-on-surface-variant">
								<li v-for="b in professionalsBullets" :key="b">✓ {{ b }}</li>
							</ul>
						</aside>
					</div>
					<NuxtLink class="mt-stack-lg inline-flex rounded bg-energetic-orange px-stack-md py-stack-sm font-semibold text-on-primary" :to="localePath('/solicitar-presupuesto')">
						{{ t("discretionary.cta.submit") }} →
					</NuxtLink>
				</div>
			</section>
		</main>
	</div>
</template>