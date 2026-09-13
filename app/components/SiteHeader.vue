<script setup lang="ts">
import { contact } from "~/data/contact";

const { locale, t } = useI18n();

const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const locales = computed(() =>
	(["ca", "es", "en"] as const).map((code) => ({
		code,
		label: t(`common.lang.${code}`),
		href: switchLocalePath(code),
	})),
);

const links = computed(() => [
	{ href: "/rutas-horarios", label: t("homeVariant2.nav.routesSchedules") },
	{
		href: "/servicios-discrecionales",
		label: t("homeVariant2.nav.privateServices"),
	},
	{ href: "/donde-estamos", label: t("homeVariant2.nav.aboutUs") },
	{ href: "/solicitar-presupuesto", label: t("homeVariant2.nav.contact") },
]);

const menuOpen = ref(false);
</script>

<template>
	<!-- Utility bar -->
	<div class="w-full bg-surface-container-lowest border-b border-surface-variant hidden md:block">
		<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2 flex justify-end items-center gap-gutter text-sm font-label-md text-on-surface-variant">
			<div class="flex gap-2 items-center">
				<a
					v-for="l in locales"
					:key="l.code"
					:class="[
						'hover:text-deep-navy transition-colors cursor-pointer',
						l.code === locale ? 'font-bold text-deep-navy' : '',
					]"
					:href="l.href"
					:hreflang="l.code"
					:aria-label="l.label"
				>
					{{ l.label }}
				</a>
			</div>
			<a class="flex items-center gap-1 hover:text-deep-navy transition-colors" :href="`tel:${contact.generalPhone.replace(/\s/g, '')}`">
				<span class="material-symbols-outlined text-[18px]">call</span>
				{{ contact.generalPhone }}
			</a>
		</div>
	</div>

	<header class="sticky top-0 z-50 w-full bg-surface-container-lowest border-b border-surface-variant shadow-sm">
		<nav class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20" aria-label="Main">
			<a class="font-headline-md text-headline-md font-bold text-deep-navy flex items-center gap-2" :href="localePath('/')">
				<span class="material-symbols-outlined icon-filled" aria-hidden="true">directions_bus</span>
				{{ t("common.brand") }}
			</a>

			<ul class="hidden md:flex items-center gap-8 h-full">
				<li v-for="link in links" :key="link.href" class="h-full flex items-center">
					<a
						:class="[
							'font-label-md text-label-md h-full flex items-center border-b-2 transition-colors duration-200',
							$route.path.startsWith(link.href)
								? 'text-deep-navy border-coastal-teal'
								: 'text-on-surface-variant border-transparent hover:text-deep-navy',
						]"
						:href="localePath(link.href)"
						:aria-current="$route.path.startsWith(link.href) ? 'page' : undefined"
					>
						{{ link.label }}
					</a>
				</li>
			</ul>

			<div class="hidden md:flex items-center gap-4">
				<a
					:href="localePath('/solicitar-presupuesto')"
					class="bg-energetic-orange text-on-primary font-button text-button px-6 py-3 rounded min-h-[48px] flex items-center hover:opacity-90 transition-opacity"
				>
					{{ t("common.nav.bookNow") }}
				</a>
			</div>

			<button
				class="md:hidden text-deep-navy p-2"
				aria-expanded="false"
				aria-controls="site-mobile-menu"
				aria-label="Menu"
				@click="menuOpen = !menuOpen"
			>
				<span class="material-symbols-outlined text-[28px]">menu</span>
			</button>
		</nav>

		<div v-if="menuOpen" id="site-mobile-menu" class="md:hidden border-t border-surface-variant bg-surface-container-lowest">
			<ul class="flex flex-col px-margin-mobile py-stack-sm">
				<li v-for="link in links" :key="link.href">
					<a
						:class="[
							'block py-stack-sm font-label-md text-label-md border-l-2 pl-3 transition-colors',
							$route.path.startsWith(link.href)
								? 'text-deep-navy border-coastal-teal'
								: 'text-on-surface-variant border-transparent',
						]"
						:href="localePath(link.href)"
						@click="menuOpen = false"
					>
						{{ link.label }}
					</a>
				</li>
				<li class="pt-stack-sm pb-stack-md">
					<a
						:href="localePath('/solicitar-presupuesto')"
						class="block bg-energetic-orange text-on-primary font-button text-button px-6 py-3 rounded text-center min-h-[48px]"
						@click="menuOpen = false"
					>
						{{ t("common.nav.bookNow") }}
					</a>
				</li>
				<li class="flex items-center justify-between py-stack-sm border-t border-surface-variant">
					<div class="flex gap-3 font-label-md text-label-md">
						<a
							v-for="l in locales"
							:key="l.code"
							:class="['transition-colors', l.code === locale ? 'font-bold text-deep-navy' : 'text-on-surface-variant']"
							:href="l.href"
							:hreflang="l.code"
						>
							{{ l.label }}
						</a>
					</div>
					<a class="flex items-center gap-1 font-label-md text-label-md text-deep-navy" :href="`tel:${contact.generalPhone.replace(/\s/g, '')}`">
						<span class="material-symbols-outlined text-[18px]">call</span>
						{{ contact.generalPhone }}
					</a>
				</li>
			</ul>
		</div>
	</header>
</template>