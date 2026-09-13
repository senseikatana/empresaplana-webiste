<script setup lang="ts">
import { contact } from "~/data/contact";

const { t } = useI18n();
useHead({ title: () => t("locations.title") });

const { data: offices } = await useFetch("/api/offices");

const baseKeys = [
	"tarragona",
	"reus",
	"garraf",
	"calafell",
	"barcelona",
	"hospitalet",
] as const;
</script>

<template>
	<div>
		<!-- Hero -->
		<section class="relative w-full h-[400px] md:h-[500px] bg-deep-navy flex items-center justify-center overflow-hidden">
			<div class="absolute inset-0 z-0">
				<img class="w-full h-full object-cover opacity-60 mix-blend-overlay" :alt="t('locations.hero.title')" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ66k6zbgB5Vgn8Hx9fGVwFHtK3EOPeLBG2Ss3MLMIOqZaSkkFadbrCUmoWzFVF5o83CuRNEHXrqS3NUJQjcHy3QdWOVbj1fSikfRprsEb4qwNLyxBW1qKzr7mrtPF989QMCAfxB-xb3d762CNT62ilPy99M9Fq7zzJkJuIyQ4_cYQITtVDDtZBJsynafq9jZVorRKhyCv3MCl0xWd_qDcvJ7vFUUGH-FOgu1EBImHD87C5AVE_KVX" />
			</div>
			<div class="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
				<h1 class="font-display-lg text-display-lg text-on-primary mb-stack-md">{{ t("locations.hero.title") }}</h1>
				<p class="font-body-lg text-body-lg text-on-primary/90 max-w-2xl mx-auto">{{ t("locations.hero.subtitle") }}</p>
			</div>
		</section>

		<!-- Map & Central Office -->
		<section class="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-20 z-20 mb-stack-lg">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
				<div class="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden relative h-[400px] lg:h-auto min-h-[400px] border border-surface-variant">
					<img class="w-full h-full object-cover" alt="Red de oficinas Empresa Plana" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZHw_XR0BwP0YOlStJLT07Jp0AG0k95rXPHKX6xj5y2k6DpQQm7lZnNdJQNNCyfdPbE884aNXiIDDN-R0vAa3soUdwrcnQ8A3Fg7yo-mZQXceLw95zwH_EbIrM-41WkGrMHKuyR-mZKRIxHmEHzwmAaVeD5DXGMkFKcowjofQSMKi8Ohj5Y5jukSTt2rB3r4iGIBuiEPQJgMO5mouwQQAu5PBjcust9EW3xg5Ivk4vhHK2VyWO4eXD" />
					<div class="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
						<span class="material-symbols-outlined text-energetic-orange text-sm">my_location</span>
						<span class="font-label-md text-label-md text-deep-navy">{{ t("locations.mapBadge") }}</span>
					</div>
				</div>
				<div class="lg:col-span-4 flex flex-col">
					<div class="bg-surface-container-lowest rounded-xl shadow-ambient p-8 flex-grow border border-surface-variant relative overflow-hidden group">
						<div class="relative z-10">
							<div class="w-12 h-12 bg-primary-fixed text-primary-container rounded-xl flex items-center justify-center mb-6">
								<span class="material-symbols-outlined text-[28px]">business</span>
							</div>
							<h2 class="font-headline-md text-headline-md text-deep-navy mb-2">{{ t("locations.central.title") }}</h2>
							<h3 class="font-label-md text-label-md text-coastal-teal mb-6 uppercase tracking-wider">{{ t("locations.central.tag") }}</h3>
							<div class="space-y-4 font-body-md text-body-md text-on-surface-variant">
								<div class="flex items-start gap-3">
									<span class="material-symbols-outlined text-outline mt-1 text-xl">location_on</span>
									<div>
										<p>{{ t("locations.central.address1") }}<br />{{ t("locations.central.address2") }}</p>
										<p class="font-bold text-deep-navy mt-1">{{ t("locations.central.city") }}</p>
									</div>
								</div>
								<div class="flex items-center gap-3 pt-4 border-t border-surface-variant">
									<span class="material-symbols-outlined text-outline text-xl">phone</span>
									<a class="hover:text-coastal-teal transition-colors font-button text-button" :href="`tel:${contact.generalPhone.replace(/\s/g, '')}`">{{ contact.generalPhone }}</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Oficines d'atenció (reclamaciones y gestiones) -->
		<section v-if="offices && offices.length > 0" class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg mb-24">
			<div class="flex items-center gap-4 mb-8">
				<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy">{{ t("locations.hero.title") }}</h2>
				<div class="h-px bg-surface-variant flex-grow"></div>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
				<div v-for="o in offices" :key="o.id" class="bg-surface-container-lowest rounded-xl shadow-ambient p-6 border border-surface-variant">
					<h3 class="font-headline-md text-headline-md text-deep-navy mb-1">{{ o.name }}</h3>
					<p v-if="o.purpose" class="font-label-md text-label-md text-energetic-orange mb-4">{{ o.purpose }}</p>
					<div class="flex items-start gap-3 font-body-md text-body-md text-on-surface-variant">
						<span class="material-symbols-outlined text-outline/60 mt-0.5 text-lg">map</span>
						<div>
							<p>{{ o.address }}</p>
							<p class="font-bold text-on-surface mt-1">{{ o.postalCode }} {{ o.city }}</p>
						</div>
					</div>
					<a v-if="o.phone" class="mt-4 flex items-center gap-2 font-button text-button text-deep-navy hover:text-coastal-teal" :href="`tel:${o.phone.replace(/\s/g, '')}`">
						<span class="material-symbols-outlined text-[18px]">call</span>{{ o.phone }}
					</a>
				</div>
			</div>
		</section>

		<!-- Delegations Grid -->
		<section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg mb-24">
			<div class="flex items-center gap-4 mb-8">
				<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy">{{ t("locations.delegations.title") }}</h2>
				<div class="h-px bg-surface-variant flex-grow"></div>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
				<div v-for="(key, i) in baseKeys" :key="key" class="bg-surface-container-lowest rounded-xl shadow-ambient p-6 border border-surface-variant">
					<h3 class="font-headline-md text-headline-md text-deep-navy mb-1">{{ t(`locations.delegations.bases.${key}.name`) }}</h3>
					<p class="font-label-md text-label-md text-energetic-orange mb-4 uppercase">{{ t("locations.delegations.label").replace("{n}", String(i + 1)) }}</p>
					<div class="flex items-start gap-3 font-body-md text-body-md text-on-surface-variant">
						<span class="material-symbols-outlined text-outline/60 mt-0.5 text-lg">map</span>
						<div>
							<p>{{ t(`locations.delegations.bases.${key}.address`) }}</p>
							<p class="font-bold text-on-surface mt-1">{{ t(`locations.delegations.bases.${key}.city`) }}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>