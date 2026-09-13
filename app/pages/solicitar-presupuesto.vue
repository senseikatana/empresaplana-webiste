<script setup lang="ts">
import { contact } from "~/data/contact";
import presupuesto from "~/data/presupuesto.json";

const { locale, t } = useI18n();
const localePath = useLocalePath();

const loc = computed(() => locale.value as "ca" | "es" | "en");

const contactFields = presupuesto.fields.filter((f) => f.group === "contact");
const serviceFields = presupuesto.fields.filter((f) => f.group === "service");
const reasons = presupuesto.reasons;

const contactCards = computed(() => [
	{
		icon: "call",
		label: contact.generalPhone,
		href: `tel:${contact.generalPhone.replace(/\s/g, "")}`,
		sublabel: t("about.phoneHours"),
	},
	...contact.phones.map((p) => ({
		icon: "location_city",
		label: p.phone,
		href: `tel:${p.phone.replace(/\s/g, "")}`,
		sublabel: p.area[loc.value],
	})),
	{
		icon: "mail",
		label: "info@empresaplana.cat",
		href: "mailto:info@empresaplana.cat",
		sublabel: t("common.footer.contact"),
	},
	{
		icon: "chat",
		label: "WhatsApp",
		href: contact.whatsapp,
		sublabel: "+34 620 201 632",
	},
]);

const baseKeys = [
	"tarragona",
	"reus",
	"garraf",
	"calafell",
	"barcelona",
	"hospitalet",
] as const;

const form = reactive<Record<string, string>>({});
const consent = ref(false);
const pending = ref(false);
const error = ref<string | null>(null);
const sent = ref(false);

function label(f: (typeof presupuesto.fields)[number]): string {
	return f.labels[loc.value] ?? f.id;
}

async function submit() {
	if (!consent.value) return;
	error.value = null;
	pending.value = true;
	try {
		await $fetch("/api/budget", {
			method: "POST",
			body: { ...form, consent: undefined },
		});
		sent.value = true;
	} catch {
		error.value = t("app.register.invalid");
	} finally {
		pending.value = false;
	}
}
</script>

<template>
	<div>
		<!-- Hero -->
		<section class="bg-deep-navy text-on-primary relative overflow-hidden">
			<div class="absolute -top-24 -right-24 w-96 h-96 bg-surface-tint rounded-full blur-3xl opacity-40 pointer-events-none"></div>
			<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg md:py-16 relative">
				<p class="font-label-md text-label-md uppercase tracking-widest text-secondary-fixed mb-2">{{ t("discretionary.cta.areaTarragona") }}</p>
				<h1 class="font-display-lg text-display-lg-mobile md:text-display-lg font-bold mb-3">{{ t("discretionary.hero.cta") }}</h1>
				<p class="font-body-lg text-body-lg text-on-primary/85 max-w-2xl">{{ t("about.contactCta") }}</p>
			</div>
		</section>

		<!-- Contact info cards -->
		<section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-8 relative z-10 mb-stack-lg">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				<a
					v-for="card in contactCards"
					:key="card.label"
					:href="card.href"
					:target="card.href.startsWith('http') ? '_blank' : undefined"
					:rel="card.href.startsWith('http') ? 'noopener noreferrer' : undefined"
					class="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient p-5 flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-ambient-lg transition-all"
				>
					<span class="w-11 h-11 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center flex-shrink-0">
						<span class="material-symbols-outlined icon-filled text-[22px]">{{ card.icon }}</span>
					</span>
					<div class="min-w-0">
						<p class="font-headline-md text-headline-md font-bold text-deep-navy break-all">{{ card.label }}</p>
						<p class="font-body-md text-body-md text-on-surface-variant mt-0.5">{{ card.sublabel }}</p>
					</div>
				</a>
			</div>
		</section>

		<!-- Delegations -->
		<section class="bg-surface-gray w-full mb-stack-lg">
			<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
				<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy mb-8">{{ t("locations.delegations.title") }}</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					<div v-for="(key, i) in baseKeys" :key="key" class="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient p-5 flex flex-col gap-2">
						<div class="flex items-center gap-2">
							<span class="w-9 h-9 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center flex-shrink-0">
								<span class="material-symbols-outlined text-[18px]">business</span>
							</span>
							<div>
								<p class="font-label-md text-label-md text-coastal-teal uppercase tracking-wider">{{ t("locations.delegations.label").replace("{n}", String(i + 1)) }}</p>
								<p class="font-headline-md text-headline-md font-bold text-deep-navy">{{ t(`locations.delegations.bases.${key}.name`) }}</p>
							</div>
						</div>
						<p class="font-body-md text-body-md text-on-surface-variant">{{ t(`locations.delegations.bases.${key}.address`) }}</p>
						<p class="font-body-md text-body-md font-semibold text-on-surface">{{ t(`locations.delegations.bases.${key}.city`) }}</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Quote form -->
		<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-stack-lg">
			<section class="mx-auto max-w-3xl rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md shadow-ambient md:p-stack-lg">
				<h2 class="mb-stack-sm font-headline-lg text-headline-lg font-bold text-deep-navy">{{ presupuesto.title[loc] }}</h2>
				<p class="mb-stack-lg text-body-md text-on-surface-variant">{{ presupuesto.sections.service[loc] }}</p>

				<form class="space-y-stack-md" @submit.prevent="submit">
					<fieldset class="space-y-stack-sm">
						<legend class="mb-stack-sm font-headline-md text-headline-md font-bold text-deep-navy">{{ presupuesto.sections.contact[loc] }}</legend>
						<div class="grid gap-stack-sm md:grid-cols-2">
							<label v-for="f in contactFields" :key="f.id" class="space-y-1 text-label-md font-semibold text-on-surface">
								<span>{{ label(f) }}{{ f.required ? " *" : "" }}</span>
								<input
									v-model="form[f.id]"
									class="w-full rounded border border-outline-variant bg-surface px-stack-sm py-2 focus:border-coastal-teal focus:ring-1 focus:ring-coastal-teal outline-none transition-colors"
									:type="f.type"
									:required="f.required"
								/>
							</label>
						</div>
					</fieldset>

					<fieldset class="space-y-stack-sm">
						<legend class="mb-stack-sm font-headline-md text-headline-md font-bold text-deep-navy">{{ presupuesto.sections.service[loc] }}</legend>
						<div class="grid gap-stack-sm md:grid-cols-2">
							<label v-for="f in serviceFields" :key="f.id" :class="['space-y-1 text-label-md font-semibold text-on-surface', f.type === 'textarea' && 'md:col-span-2']">
								<span>{{ label(f) }}{{ f.required ? " *" : "" }}</span>
								<textarea
									v-if="f.type === 'textarea'"
									v-model="form[f.id]"
									class="min-h-32 w-full rounded border border-outline-variant bg-surface px-stack-sm py-2 focus:border-coastal-teal focus:ring-1 focus:ring-coastal-teal outline-none transition-colors"
									:required="f.required"
								/>
								<select
									v-else-if="f.type === 'select'"
									v-model="form[f.id]"
									class="w-full rounded border border-outline-variant bg-surface px-stack-sm py-2 focus:border-coastal-teal focus:ring-1 focus:ring-coastal-teal outline-none transition-colors"
									:required="f.required"
								>
									<option value="">{{ f.placeholder?.[loc] ?? "" }}</option>
									<option v-for="r in reasons" :key="r.id" :value="r.id">{{ r.labels[loc] }}</option>
								</select>
								<input
									v-else
									v-model="form[f.id]"
									class="w-full rounded border border-outline-variant bg-surface px-stack-sm py-2 focus:border-coastal-teal focus:ring-1 focus:ring-coastal-teal outline-none transition-colors"
									:type="f.type"
									:required="f.required"
								/>
							</label>
						</div>
					</fieldset>

					<label class="flex gap-2 text-body-md text-on-surface-variant">
						<input v-model="consent" type="checkbox" required />
						<span>{{ presupuesto.consent[loc] }}</span>
					</label>

					<UAlert v-if="sent" color="success" variant="soft" :title="presupuesto.success[loc]" />
					<UAlert v-if="error" color="error" variant="soft" :title="error" />

					<UButton type="submit" :loading="pending" class="bg-energetic-orange text-on-primary font-semibold min-h-[48px]">
						{{ presupuesto.submit[loc] }}
					</UButton>
				</form>
			</section>
		</div>
	</div>
</template>