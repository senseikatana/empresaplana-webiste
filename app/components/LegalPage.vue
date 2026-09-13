<script setup lang="ts">
defineProps<{
	title: string;
	intro: string;
	sections: Array<{ title: string; body: string }>;
}>();

const { t } = useI18n();
</script>

<template>
	<main class="mx-auto w-full max-w-container-max px-margin-mobile py-stack-lg md:px-margin-desktop">
		<section class="mx-auto max-w-4xl rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md shadow-ambient md:p-stack-lg">
			<p class="mb-stack-sm text-label-md font-semibold uppercase text-energetic-orange">
				{{ t("legal.cookieBanner.privacyTitle") }}
			</p>
			<h1 class="mb-stack-sm text-display-lg font-bold text-deep-navy">{{ title }}</h1>
			<p class="mb-stack-lg text-body-md text-on-surface-variant">{{ intro }}</p>
			<div class="space-y-stack-lg">
				<section v-for="s in sections" :key="s.title" class="border-t border-outline-variant pt-stack-md">
					<h2 class="mb-stack-sm text-headline-md font-bold text-deep-navy">{{ s.title }}</h2>
					<p class="whitespace-pre-line text-body-md leading-relaxed text-on-surface">{{ s.body }}</p>
				</section>
			</div>
		</section>
	</main>
</template>