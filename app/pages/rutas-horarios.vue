<script setup lang="ts">
import popularLines from "~/data/popular-lines.json";
import stopsData from "~/data/stops.json";

const { locale, t } = useI18n();
const localePath = useLocalePath();

useHead({ title: () => t("routes.title") });
useSeoMeta({ description: () => t("routes.hero.subtitle") });

const towns = stopsData.stops;
const timeRanges = [
	{ value: "00:00-06:00", label: "00:00 – 06:00" },
	{ value: "06:00-12:00", label: "06:00 – 12:00" },
	{ value: "12:00-18:00", label: "12:00 – 18:00" },
	{ value: "18:00-24:00", label: "18:00 – 24:00" },
];

const lineIcons: Record<string, string> = {
	barcelonaAirport: "flight_takeoff",
	tarragonaBarcelona: "location_city",
	costaDorada: "beach_access",
	penedes: "map",
	estacioCamp: "train",
	ametllaTortosa: "alt_route",
	reusSalou: "directions_bus",
	tarragonaVilasecaSalou: "tour",
};

const popularCards = popularLines.lines.map((line) => ({
	name: line.name,
	origin: line.origin,
	destination: line.destination,
	icon: lineIcons[line.id] ?? "directions_bus",
	pdfUrl:
		line.pdfUrls[locale.value as "ca" | "es" | "en" | "fr"] ??
		line.pdfUrls.es ??
		line.pdfUrls.en ??
		line.pdfUrls.ca,
}));

const origin = ref("Tarragona");
const destination = ref("Salou");
const date = ref("");
const time = ref("");
const searchType = ref<"direct" | "transfer">("direct");

const results = ref<Array<{
	id: string;
	code: string;
	name: string;
	origin: string;
	destination: string;
	color: string;
}> | null>(null);
const searched = ref(false);
const error = ref<string | null>(null);
const pending = ref(false);

async function search() {
	searched.value = true;
	error.value = null;
	pending.value = true;
	results.value = null;
	try {
		if (!origin.value.trim() || !destination.value.trim()) {
			error.value = t("routes.results.missingSelection");
			return;
		}
		results.value = await $fetch("/api/routes/search", {
			query: { origin: origin.value, destination: destination.value },
		});
	} catch {
		error.value = t("routes.results.databaseError");
	} finally {
		pending.value = false;
	}
}
</script>

<template>
	<div>
		<!-- Hero + Search -->
		<section class="relative w-full pt-12 pb-24 md:pt-20 md:pb-32 px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center min-h-[500px]">
			<div class="absolute inset-0 z-0">
				<div class="w-full h-full bg-cover bg-center" role="img" :aria-label="t('routes.hero.title')" :style="{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDCT_DQ6eMxgF0yrSOajgjIT1aocZsjEi7wlpLIbaUbLo3Oux_VBSyoMPtR6KZW2G_6x-y7PLBKB5zbHe--97W2rCcZ0t6wduzIaWNvs-pT8x65mppwMQzKjYNde5vFUXI8u_8tJH_cGQCcqZjYsBD1TvQEMJQjY8kwXCsqiTs1FC5Y92j8WqLolI-sTHX-uiqFyYbg_W54ecT8snpGkKtxCBq9tOmaGsZ9ryHtOU4joYjN6Yb-O2li)' }"></div>
				<div class="absolute inset-0 bg-primary-fixed/80 backdrop-blur-sm mix-blend-multiply"></div>
				<div class="absolute inset-0 bg-gradient-to-b from-transparent to-background/90"></div>
			</div>

			<div class="relative z-10 w-full max-w-container-max mx-auto flex flex-col gap-stack-lg items-center">
				<div class="text-center max-w-3xl text-on-primary">
					<h1 class="font-display-lg text-display-lg md:text-[56px] leading-tight mb-4 drop-shadow-md">{{ t("routes.hero.title") }}</h1>
					<p class="font-body-lg text-body-lg text-on-primary/90">{{ t("routes.hero.subtitle") }}</p>
				</div>

				<div class="w-full max-w-5xl glass-panel rounded-xl ambient-shadow p-6 md:p-8 mt-6">
					<h2 class="font-headline-md text-headline-md text-deep-navy flex items-center gap-2 mb-6 border-b border-outline-variant/30 pb-4">
						<span class="material-symbols-outlined">directions_bus</span>
						<span>{{ t("routes.search.title") }}</span>
					</h2>
					<form class="flex flex-col gap-6" @submit.prevent="search">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div class="flex flex-col gap-2">
								<label class="font-label-md text-label-md text-on-surface-variant" for="route-origin">{{ t("routes.search.originLabel") }}</label>
								<div class="relative">
									<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">location_on</span>
									<input id="route-origin" v-model="origin" list="towns-list" :placeholder="t('routes.search.originPlaceholder')" class="w-full pl-10 pr-4 py-3 rounded border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-coastal-teal focus:ring-1 focus:ring-coastal-teal transition-colors font-body-md text-body-md" />
								</div>
							</div>
							<div class="flex flex-col gap-2">
								<label class="font-label-md text-label-md text-on-surface-variant" for="route-destination">{{ t("routes.search.destinationLabel") }}</label>
								<div class="relative">
									<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">pin_drop</span>
									<input id="route-destination" v-model="destination" list="towns-list" :placeholder="t('routes.search.destinationPlaceholder')" class="w-full pl-10 pr-4 py-3 rounded border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-coastal-teal focus:ring-1 focus:ring-coastal-teal transition-colors font-body-md text-body-md" />
								</div>
							</div>
							<div class="flex flex-col gap-2">
								<label class="font-label-md text-label-md text-on-surface-variant" for="route-date">{{ t("routes.search.dateLabel") }}</label>
								<input id="route-date" v-model="date" type="date" class="w-full pl-4 pr-4 py-3 rounded border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-coastal-teal focus:ring-1 focus:ring-coastal-teal transition-colors font-body-md text-body-md" />
							</div>
							<div class="flex flex-col gap-2">
								<label class="font-label-md text-label-md text-on-surface-variant" for="route-time">{{ t("routes.search.timeLabel") }}</label>
								<select v-model="time" id="route-time" class="w-full pl-4 pr-4 py-3 rounded border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-coastal-teal focus:ring-1 focus:ring-coastal-teal transition-colors appearance-none font-body-md text-body-md">
									<option value="">{{ t("routes.search.anyTime") }}</option>
									<option v-for="r in timeRanges" :key="r.value" :value="r.value">{{ r.label }}</option>
								</select>
							</div>
						</div>
						<datalist id="towns-list">
							<option v-for="town in towns" :key="town" :value="town" />
						</datalist>

						<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 border-t border-outline-variant/30">
							<div class="flex items-center gap-6">
								<label class="flex items-center gap-2 cursor-pointer">
									<input v-model="searchType" type="radio" value="direct" class="w-4 h-4 text-coastal-teal" />
									<span class="font-body-md text-body-md text-on-surface-variant">{{ t("routes.search.direct") }}</span>
								</label>
								<label class="flex items-center gap-2 cursor-pointer">
									<input v-model="searchType" type="radio" value="transfer" class="w-4 h-4 text-coastal-teal" />
									<span class="font-body-md text-body-md text-on-surface-variant">{{ t("routes.search.withTransfers") }}</span>
								</label>
							</div>
							<UButton type="submit" :loading="pending" class="bg-energetic-orange text-on-primary font-button min-h-[48px]">
								<span class="material-symbols-outlined">search</span>
								{{ t("routes.search.submit") }}
							</UButton>
						</div>
					</form>
					<p class="text-xs text-outline mt-4 italic">{{ t("routes.search.disclaimer") }}</p>
				</div>
			</div>
		</section>

		<!-- Results -->
		<section v-if="searched" id="results" class="w-full py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-t border-outline-variant/20">
			<div class="max-w-container-max mx-auto">
				<h2 class="font-headline-lg text-headline-lg text-deep-navy mb-2">{{ t("routes.results.title") }}</h2>
				<p class="font-body-lg text-body-lg text-on-surface-variant mb-8 flex items-center gap-2">
					{{ t("routes.results.summaryLabel") }}:
					<strong class="text-deep-navy">{{ origin }}</strong>
					<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
					<strong class="text-deep-navy">{{ destination }}</strong>
				</p>

				<UAlert v-if="error" color="error" variant="soft" :title="error" class="mb-8" />

				<div v-else-if="results && results.length === 0" class="bg-surface-container-low rounded-xl p-10 text-center border border-outline-variant/30">
					<span class="material-symbols-outlined text-[40px] text-outline">search_off</span>
					<h3 class="font-headline-md text-headline-md text-deep-navy mt-3">{{ t("routes.results.emptyTitle") }}</h3>
					<p class="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xl mx-auto">{{ t("routes.results.emptyBody") }}</p>
					<p class="font-body-md text-body-md text-on-surface-variant">{{ t("routes.results.emptyHint") }}</p>
				</div>

				<div v-else-if="results && results.length > 0" class="flex flex-col gap-4">
					<h3 class="font-headline-md text-headline-md text-deep-navy flex items-center gap-2">
						<span class="material-symbols-outlined text-coastal-teal">alt_route</span>
						{{ t("routes.results.directTitle") }} ({{ results.length }})
					</h3>
					<UCard v-for="r in results" :key="r.id">
						<div class="flex items-center gap-3">
							<span class="h-3 w-3 rounded-full inline-block" :style="{ backgroundColor: r.color }" />
							<span class="font-label-md text-label-md font-bold text-on-surface">{{ r.code }}</span>
						</div>
						<p class="font-headline-md text-headline-md font-bold text-deep-navy mt-2">{{ r.name }}</p>
						<p class="font-body-md text-body-md text-on-surface-variant">{{ r.origin }} → {{ r.destination }}</p>
					</UCard>
				</div>
			</div>
		</section>

		<!-- Most searched lines -->
		<section class="w-full py-16 px-margin-mobile md:px-margin-desktop bg-surface-gray">
			<div class="max-w-container-max mx-auto">
				<div class="mb-10">
					<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy mb-2">{{ t("routes.lines.title") }}</h2>
					<p class="font-body-lg text-body-lg text-on-surface-variant">{{ t("routes.lines.subtitle") }}</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
					<div v-for="line in popularCards" :key="line.name" class="bg-surface-container-lowest rounded-xl ambient-shadow border border-outline-variant/20 overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-ambient-lg transition-all duration-300">
						<div class="bg-deep-navy text-on-primary p-4 border-b border-outline-variant/10 flex items-center gap-3">
							<span class="material-symbols-outlined text-secondary-fixed">{{ line.icon }}</span>
							<h3 class="font-headline-md text-headline-md text-[20px] leading-tight">{{ line.name }}</h3>
						</div>
						<div class="p-6 flex-grow flex flex-col justify-between">
							<div class="mb-6">
								<ul class="flex flex-col gap-3">
									<li class="flex items-start gap-3">
										<span class="w-6 h-6 rounded-full bg-surface-bright border-2 border-coastal-teal flex-shrink-0 mt-0.5"></span>
										<span class="font-body-md text-body-md text-on-surface font-medium">{{ line.origin }}</span>
									</li>
									<li class="flex items-start gap-3">
										<span class="w-6 h-6 rounded-full bg-surface-bright border-2 border-energetic-orange flex-shrink-0 mt-0.5"></span>
										<span class="font-body-md text-body-md text-on-surface-variant">{{ line.destination }}</span>
									</li>
								</ul>
							</div>
							<a class="w-full py-3 px-4 rounded border border-outline-variant text-deep-navy font-button text-button flex items-center justify-center gap-2 hover:bg-surface-container-low hover:border-deep-navy transition-all" :href="line.pdfUrl" target="_blank" rel="noopener noreferrer">
								<span class="material-symbols-outlined">download</span>
								{{ t("routes.lines.downloadPdf") }}
							</a>
						</div>
					</div>
				</div>
				<div class="mt-12 text-center">
					<a class="bg-surface-container-lowest text-deep-navy font-button text-button px-8 py-3 rounded-full hover:bg-surface-container-low transition-colors border border-outline-variant shadow-sm inline-flex items-center gap-2" href="https://www.empresaplana.cat/ca/cercador-de-linies" target="_blank" rel="noopener noreferrer">
						{{ t("routes.lines.viewAll") }}
						<span class="material-symbols-outlined text-lg">arrow_forward</span>
					</a>
				</div>
			</div>
		</section>

		<!-- Patinetes banner -->
		<section class="w-full py-12 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-t border-outline-variant/20">
			<div class="max-w-4xl mx-auto bg-surface-bright rounded-xl p-6 md:p-8 border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center gap-6">
				<div class="bg-error-container text-on-error-container p-4 rounded-full flex-shrink-0">
					<span class="material-symbols-outlined text-[32px]">electric_scooter</span>
				</div>
				<div>
					<h3 class="font-headline-md text-headline-md text-deep-navy mb-2">{{ t("routes.banner.title") }}</h3>
					<p class="font-body-md text-body-md text-on-surface-variant">{{ t("routes.banner.body") }}</p>
				</div>
			</div>
		</section>
	</div>
</template>