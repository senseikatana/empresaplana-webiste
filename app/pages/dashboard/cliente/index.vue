<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "dashboard" });

const { t } = useI18n();
const localePath = useLocalePath();

const { data } = await useFetch("/api/account", {
	headers: useRequestHeaders(["cookie"]),
});

const roleLabel = computed(() =>
	t(`app.role.${data.value?.user?.role ?? "client"}`),
);

const shortcuts = [
	{
		href: "/dashboard/cliente/cuenta",
		icon: "person",
		label: t("app.panel.account"),
	},
	{
		href: "/dashboard/cliente/favoritas",
		icon: "star",
		label: t("app.panel.favorites"),
	},
	{
		href: "/dashboard/cliente/cotizaciones",
		icon: "request_quote",
		label: t("app.panel.quotes"),
	},
	{
		href: "/dashboard/mensajes",
		icon: "forum",
		label: t("app.panel.messages"),
	},
];
</script>

<template>
	<div>
		<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy">
			{{ t("app.auth.welcome") }}, {{ data?.user?.name }}
		</h1>
		<p class="font-body-md text-body-md text-on-surface-variant mt-1">{{ roleLabel }}</p>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
			<NuxtLink
				v-for="s in shortcuts"
				:key="s.href"
				:to="localePath(s.href)"
				class="bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-variant p-6 flex flex-col items-start gap-4 hover:border-coastal-teal/40 transition-colors"
			>
				<div class="w-12 h-12 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center">
					<span class="material-symbols-outlined icon-filled">{{ s.icon }}</span>
				</div>
				<span class="font-label-md text-label-md text-deep-navy">{{ s.label }}</span>
			</NuxtLink>
		</div>
	</div>
</template>