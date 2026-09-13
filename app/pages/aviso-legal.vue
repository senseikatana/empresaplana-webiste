<script setup lang="ts">
const { t } = useI18n();
useHead({ title: () => t("legal.legalNotice.title") });

// Estructura real del diccionario: legal.legalNotice
const sectionKeys = [
	"userConcept",
	"links",
	"externalLinks",
	"cookies",
	"liability",
	"technical",
	"intellectualProperty",
] as const;

function openCookieSettings() {
	window.dispatchEvent(new Event("open-cookie-settings"));
}
</script>

<template>
	<main class="flex-grow flex flex-col items-center justify-start py-stack-lg px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
		<header class="w-full mb-stack-lg border-b border-outline-variant pb-stack-md">
			<h1 class="font-display-lg text-display-lg text-deep-navy mb-stack-sm">{{ t("legal.legalNotice.title") }}</h1>
			<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">{{ t("legal.legalNotice.heading") }}</p>
		</header>
		<div class="w-full flex flex-col md:flex-row gap-gutter md:gap-stack-lg">
			<!-- Sticky Sidebar Navigation -->
			<aside class="md:w-1/4 shrink-0">
				<nav class="sticky top-24 bg-surface-container-low rounded-xl p-stack-md">
					<ul class="space-y-stack-sm">
						<li v-for="key in sectionKeys" :key="key">
							<a
								class="block font-label-md text-label-md text-on-surface hover:text-deep-navy transition-colors duration-200"
								:href="`#${key}`"
							>
								{{ t(`legal.legalNotice.sectionTitles.${key}`) }}
							</a>
						</li>
					</ul>
					<div class="mt-stack-md pt-stack-sm border-t border-outline-variant">
						<button
							type="button"
							class="font-label-md text-label-md text-energetic-orange flex items-center gap-2 hover:text-deep-navy transition-colors duration-200"
							@click="openCookieSettings"
						>
							<span class="material-symbols-outlined">cookie</span>
							{{ t("legal.cookieBanner.settings") }}
						</button>
					</div>
				</nav>
			</aside>
			<!-- Legal Content -->
			<div class="md:w-3/4 space-y-stack-lg pb-stack-lg">
				<section id="info-general" class="scroll-mt-24">
					<h2 class="font-headline-lg text-headline-lg text-deep-navy mb-stack-md">1. {{ t("legal.legalNotice.heading") }}</h2>
					<div class="bg-surface-container-lowest p-stack-md rounded-xl shadow-sm space-y-stack-md border border-outline-variant/30">
						<p class="font-body-md text-body-md text-on-surface">{{ t("legal.legalNotice.intro") }}</p>
						<p class="font-body-md text-body-md text-on-surface">{{ t("legal.legalNotice.address") }}</p>
					</div>
				</section>

				<section v-for="key in sectionKeys" :id="key" :key="key" class="scroll-mt-24">
					<h2 class="font-headline-lg text-headline-lg text-deep-navy mb-stack-md">{{ t(`legal.legalNotice.sectionTitles.${key}`) }}</h2>
					<p class="font-body-md text-body-md text-on-surface whitespace-pre-line leading-relaxed">{{ t(`legal.legalNotice.sections.${key}`) }}</p>
				</section>
			</div>
		</div>
	</main>
</template>