<script setup lang="ts">
const { t } = useI18n();

const CONSENT_KEY = "plana-cookie-consent";

const showBanner = ref(false);
const showModal = ref(false);
const analyticsChecked = ref(false);

function storeConsent(analytics: boolean) {
	try {
		localStorage.setItem(
			CONSENT_KEY,
			JSON.stringify({
				necessary: true,
				analytics,
				date: new Date().toISOString(),
			}),
		);
	} catch {
		/* storage unavailable (private mode): consent is not persisted */
	}
	showBanner.value = false;
	showModal.value = false;
}

function openModal() {
	try {
		const raw = localStorage.getItem(CONSENT_KEY);
		if (raw) {
			analyticsChecked.value = Boolean(JSON.parse(raw).analytics);
		}
	} catch {
		/* ignore malformed stored consent */
	}
	showModal.value = true;
}

function closeModal() {
	showModal.value = false;
}

onMounted(() => {
	try {
		if (!localStorage.getItem(CONSENT_KEY)) {
			showBanner.value = true;
		}
	} catch {
		/* storage unavailable: show the banner so the choice can still be made */
		showBanner.value = true;
	}
	window.addEventListener("open-cookie-settings", openModal);
});

onUnmounted(() => {
	window.removeEventListener("open-cookie-settings", openModal);
});
</script>

<template>
	<!-- Consent banner (shown when no stored consent) -->
	<div
		v-if="showBanner"
		class="fixed inset-x-0 bottom-0 z-50 px-margin-mobile md:px-margin-desktop pb-margin-mobile"
		role="dialog"
		aria-live="polite"
		:aria-label="t('legal.cookieBanner.privacyTitle')"
	>
		<div class="max-w-container-max mx-auto glass-panel rounded-xl shadow-ambient-lg p-stack-md md:p-stack-lg flex flex-col md:flex-row items-start md:items-center gap-stack-md">
			<p class="flex-1 font-body-md text-body-md text-on-surface">{{ t("legal.cookieBanner.intro") }}</p>
			<div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
				<UButton class="bg-deep-navy text-on-primary font-button text-button px-6 py-3 rounded min-h-[48px] hover:opacity-90 transition-opacity" @click="storeConsent(true)">
					{{ t("legal.cookieBanner.accept") }}
				</UButton>
				<UButton
					variant="outline"
					class="font-button text-button px-6 py-3 rounded min-h-[48px]"
					@click="storeConsent(false)"
				>
					{{ t("legal.cookieBanner.deny") }}
				</UButton>
				<UButton
					variant="outline"
					class="font-button text-button px-6 py-3 rounded min-h-[48px]"
					@click="openModal"
				>
					{{ t("legal.cookieBanner.settings") }}
				</UButton>
			</div>
		</div>
	</div>

	<!-- Settings modal -->
	<div
		v-if="showModal"
		class="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm px-margin-mobile"
		role="dialog"
		aria-modal="true"
		:aria-label="t('legal.cookieBanner.privacyTitle')"
	>
		<div class="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-ambient-lg flex flex-col max-h-[90vh]">
			<div class="p-stack-md border-b border-surface-variant flex justify-between items-center gap-4">
				<h3 class="font-headline-md text-headline-md text-deep-navy">{{ t("legal.cookieBanner.privacyTitle") }}</h3>
				<button class="text-on-surface-variant hover:text-on-surface" :aria-label="t('legal.cookieBanner.settings')" @click="closeModal">
					<span class="material-symbols-outlined">close</span>
				</button>
			</div>
			<div class="p-stack-md overflow-y-auto font-body-md text-body-md text-on-surface space-y-stack-md">
				<p class="text-on-surface-variant">{{ t("legal.cookieBanner.privacyDesc") }}</p>

				<div class="flex items-start justify-between gap-4 bg-surface-container rounded-lg p-stack-md">
					<div>
						<p class="font-label-md text-label-md text-on-surface">{{ t("legal.cookieBanner.technicalTitle") }}</p>
						<p class="text-on-surface-variant mt-1">{{ t("legal.cookieBanner.technicalDesc") }}</p>
						<ul class="mt-stack-sm space-y-1 text-on-surface-variant text-sm">
							<li>{{ t("legal.cookieBanner.sessionCookie") }}</li>
							<li>{{ t("legal.cookieBanner.xsrfCookie") }}</li>
						</ul>
					</div>
					<input checked disabled class="mt-1 h-5 w-5 rounded border-outline-variant text-deep-navy focus:ring-deep-navy cursor-not-allowed" type="checkbox" :aria-label="t('legal.cookieBanner.technicalTitle')" />
				</div>

				<div class="flex items-start justify-between gap-4 bg-surface-container rounded-lg p-stack-md">
					<div>
						<p class="font-label-md text-label-md text-on-surface">{{ t("legal.cookieBanner.analyticsTitle") }}</p>
						<p class="text-on-surface-variant mt-1">{{ t("legal.cookieBanner.analyticsDesc") }}</p>
						<ul class="mt-stack-sm space-y-1 text-on-surface-variant text-sm">
							<li>{{ t("legal.cookieBanner.googleAnalytics") }}</li>
						</ul>
					</div>
					<input v-model="analyticsChecked" class="mt-1 h-5 w-5 rounded border-outline-variant text-deep-navy focus:ring-deep-navy" type="checkbox" />
				</div>

				<p class="text-sm text-outline">{{ t("legal.cookieBanner.lastReview") }}</p>
			</div>
			<div class="p-stack-md border-t border-surface-variant bg-surface-container-low rounded-b-xl flex flex-wrap justify-end gap-2">
				<UButton
					variant="outline"
					class="font-button text-button px-5 py-3 rounded min-h-[48px]"
					@click="storeConsent(false)"
				>
					{{ t("legal.cookieBanner.rejectAll") }}
				</UButton>
				<UButton class="bg-deep-navy text-on-primary font-button text-button px-5 py-3 rounded min-h-[48px] hover:opacity-90 transition-opacity" @click="storeConsent(true)">
					{{ t("legal.cookieBanner.acceptAll") }}
				</UButton>
				<UButton class="bg-energetic-orange text-on-primary font-button text-button px-5 py-3 rounded min-h-[48px] hover:opacity-90 transition-opacity" @click="storeConsent(analyticsChecked)">
					{{ t("legal.cookieBanner.save") }}
				</UButton>
			</div>
		</div>
	</div>
</template>