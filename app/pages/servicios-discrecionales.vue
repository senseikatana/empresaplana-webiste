<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

useHead({ title: () => t("discretionary.title") });
useSeoMeta({ description: () => t("discretionary.intro.subtitle") });

// Servicios con detalle en services.json (slug). El resto de cards enlazan
// al presupuesto porque no tienen página de detalle en el contenido real.
const detailByKey: Record<string, string> = {
	companies: "servicios-a-empreses-i-fabriques",
	endOfYearTrips: "viajes-fin-de-curso",
	weddings: "comidas-y-celebraciones",
};

const iconMap: Record<string, string> = {
	transfers: "flight",
	weddings: "celebration",
	adapted: "accessible",
	mice: "groups",
	companies: "factory",
	school: "school",
	endOfYearTrips: "emoji_events",
	touristTrips: "tour",
	internationalExcursions: "public",
};

const serviceKeys = [
	"transfers",
	"weddings",
	"adapted",
	"mice",
	"companies",
	"school",
	"endOfYearTrips",
	"touristTrips",
	"internationalExcursions",
] as const;

const professionals = computed(() => ({
	title: t("discretionary.professionals.title"),
	subtitle: t("discretionary.professionals.subtitle"),
	bullets: [
		t("discretionary.professionals.bullets.0"),
		t("discretionary.professionals.bullets.1"),
		t("discretionary.professionals.bullets.2"),
		t("discretionary.professionals.bullets.3"),
		t("discretionary.professionals.bullets.4"),
	],
}));

function hrefFor(key: string): string {
	const slug = detailByKey[key];
	return slug
		? localePath(`/servicios/${slug}`)
		: localePath("/solicitar-presupuesto");
}
</script>

<template>
	<div>
		<!-- Hero -->
		<section class="relative w-full h-[500px] md:h-[600px] bg-deep-navy flex items-center">
			<div class="absolute inset-0 z-0">
				<img
					class="w-full h-full object-cover opacity-60"
					:alt="t('discretionary.hero.title')"
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRSV_uQ_hMRij0gBiydYU7JI8qQLaF9JFQCA2lezGnY4FVHWJFGcnV7LOvsXj0YyDlKD1WMoJsmns7rRXgcRF5oqGeKAHXTAF3czPcfFo3122cJr8FtxwE6mWJCbRwGptf9LRCwIdg3yrsAWTZysfMBdtfU6b19_yjSuxc7dCsMO0BOSf658kl4TTXWR1FgB9PqO0aJRN8X88dyv_oekWLAHXxiLKLI-2BTJIsuQWzVANvg5tAM3uI"
				/>
				<div class="absolute inset-0 bg-gradient-to-r from-deep-navy/90 to-transparent"></div>
			</div>
			<div class="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
				<div class="max-w-2xl text-on-primary">
					<h1 class="font-display-lg text-display-lg md:text-[56px] md:leading-[64px] mb-stack-md font-bold drop-shadow-md">{{ t("discretionary.hero.title") }}</h1>
					<p class="font-body-lg text-body-lg opacity-90 mb-stack-lg max-w-xl">{{ t("discretionary.hero.subtitle") }}</p>
					<a class="inline-flex items-center justify-center bg-energetic-orange text-on-primary px-8 py-4 rounded font-button text-button shadow-lg hover:opacity-90 transition-opacity min-h-[48px]" href="#contacto">{{ t("discretionary.hero.cta") }}</a>
				</div>
			</div>
		</section>

		<!-- Intro / Professionals -->
		<section class="py-16 md:py-24 bg-surface-container-lowest">
			<div class="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row gap-12 items-center">
				<div class="md:w-1/2">
					<h2 class="font-headline-lg text-headline-lg text-deep-navy mb-stack-md">{{ professionals.title }}</h2>
					<p class="font-body-md text-body-md text-on-surface-variant mb-4">{{ professionals.subtitle }}</p>
					<ul class="space-y-3 mt-6">
						<li v-for="bullet in professionals.bullets" :key="bullet" class="flex items-start gap-3">
							<span class="material-symbols-outlined text-coastal-teal icon-filled mt-0.5">check_circle</span>
							<span class="font-body-md text-body-md text-on-surface">{{ bullet }}</span>
						</li>
					</ul>
				</div>
				<div class="md:w-1/2 grid grid-cols-2 gap-4">
					<img loading="lazy" decoding="async" class="rounded-xl w-full h-48 object-cover shadow-sm" alt="Conductor profesional Empresa Plana" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4QJAB9ThJJ-3VbdbjWh1XWcNkLHxQl0XGi05aNrkcQv5Ez16YVgDw9wYLg8PIiFwPbLgfXdYGDbR8qLiJKhcA90wuRXijW9xBcAx7ji68SEA689ISdGrB3CQTC7eUtyK8i8pXwCIlSz94s9PCSHLtHDRsSEe2XHYjxnEDDeM1RD5OG5QuAe0YJpnYRNYcEmmnIqSOBxf9_CD3DDqfoPywYVpPlA_FpHF17VpSq3EFrITMdEcQGYsc" />
					<img loading="lazy" decoding="async" class="rounded-xl w-full h-48 object-cover shadow-sm mt-8" alt="Interior de autocar Empresa Plana" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9BGFDiq-ALhzllY4TcOk-GaWMOovbPUyLl1-pFpxeWbv1Cqj2fFFZOY8QnAJNNw6djscnTCL1I_i1S8D13Gyr0wSzeaKK7PH9Qn37XFTgUoxjoTD2Nxp2Kw8BuNl4AEcS2dynlBXxY68PUtDPATnZRYRa0XKvMNhPDpJVwEeg1rwQRV44zzBPvhA5u2j8po-XNimNQTrBZzEFFOSvgghERs1WdmPha6kZCT_IhWxd74v2E0U_02NZ" />
				</div>
			</div>
		</section>

		<!-- Services Grid -->
		<section class="py-16 md:py-24 bg-surface-gray">
			<div class="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
				<div class="text-center mb-16">
					<h2 class="font-headline-lg text-headline-lg text-deep-navy mb-4">{{ t("discretionary.services.title") }}</h2>
					<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">{{ t("discretionary.services.subtitle") }}</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
					<div v-for="key in serviceKeys" :key="key" class="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient border border-surface-variant/50 flex flex-col h-full">
						<div class="p-6 flex-grow flex flex-col justify-between">
							<div>
								<div class="w-12 h-12 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center mb-4">
									<span class="material-symbols-outlined icon-filled">{{ iconMap[key] ?? "directions_bus" }}</span>
								</div>
								<h3 class="font-headline-md text-headline-md text-deep-navy mb-2">{{ t(`discretionary.services.cards.${key}.title`) }}</h3>
								<p class="font-body-md text-body-md text-on-surface-variant mb-4">{{ t(`discretionary.services.cards.${key}.desc`) }}</p>
							</div>
							<a class="inline-flex items-center text-coastal-teal font-button text-button group-hover:text-deep-navy transition-colors mt-auto pt-2" :href="hrefFor(key)">
								{{ t("discretionary.services.moreInfo") }}
								<span class="material-symbols-outlined ml-1 text-[20px]">arrow_forward</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section id="contacto" class="relative py-20 bg-deep-navy text-on-primary overflow-hidden">
			<div class="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
				<h2 class="font-display-lg text-display-lg md:text-[40px] md:leading-[48px] mb-4">{{ t("discretionary.cta.title") }}</h2>
				<p class="font-body-lg text-body-lg text-primary-fixed-dim max-w-2xl mx-auto mb-10">{{ t("discretionary.cta.subtitle") }}</p>
				<div class="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
					<div class="bg-on-primary/10 backdrop-blur-md border border-on-primary/20 rounded-xl p-6 flex flex-col items-center min-w-[280px]">
						<span class="material-symbols-outlined text-coastal-teal text-[32px] mb-2">location_city</span>
						<span class="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider mb-1">{{ t("discretionary.cta.areaTarragona") }}</span>
						<a class="font-headline-lg text-headline-lg font-bold" :href="`tel:${t('discretionary.cta.phoneTarragona').replace(/\s/g, '')}`">{{ t("discretionary.cta.phoneTarragona") }}</a>
					</div>
					<div class="bg-on-primary/10 backdrop-blur-md border border-on-primary/20 rounded-xl p-6 flex flex-col items-center min-w-[280px]">
						<span class="material-symbols-outlined text-coastal-teal text-[32px] mb-2">apartment</span>
						<span class="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider mb-1">{{ t("discretionary.cta.areaBarcelona") }}</span>
						<a class="font-headline-lg text-headline-lg font-bold" :href="`tel:${t('discretionary.cta.phoneBarcelona').replace(/\s/g, '')}`">{{ t("discretionary.cta.phoneBarcelona") }}</a>
					</div>
				</div>
				<a class="inline-flex items-center justify-center bg-energetic-orange text-on-primary px-10 py-4 rounded font-button text-button shadow-lg hover:opacity-90 transition-opacity min-h-[48px]" :href="localePath('/solicitar-presupuesto')">{{ t("discretionary.cta.submit") }}</a>
			</div>
		</section>
	</div>
</template>