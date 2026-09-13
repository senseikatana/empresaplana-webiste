<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const route = useRoute();

const { data } = await useFetch<{
	user: { id: number; username: string; role: string };
}>("/api/me", { headers: useRequestHeaders(["cookie"]) });

// El panel es privado: no debe indexarse
useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });

const role = computed(() => data.value?.user?.role ?? "client");

const locales = computed(() =>
	(["ca", "es", "en", "fr"] as const).map((code) => ({
		code,
		label: t(`common.lang.${code}`),
		href: switchLocalePath(code),
	})),
);

const navItems = computed(() => {
	const common = [
		{
			key: "messages",
			href: "/dashboard/mensajes",
			icon: "forum",
			label: t("app.panel.messages"),
		},
	];
	if (role.value === "client") {
		return [
			{
				key: "home",
				href: "/dashboard/cliente",
				icon: "home",
				label: t("app.panel.home"),
			},
			{
				key: "account",
				href: "/dashboard/cliente/cuenta",
				icon: "person",
				label: t("app.panel.account"),
			},
			{
				key: "favorites",
				href: "/dashboard/cliente/favoritas",
				icon: "star",
				label: t("app.panel.favorites"),
			},
			{
				key: "quotes",
				href: "/dashboard/cliente/cotizaciones",
				icon: "request_quote",
				label: t("app.panel.quotes"),
			},
			...common,
		];
	}
	if (role.value === "worker") {
		return [
			{
				key: "home",
				href: "/dashboard/trabajador",
				icon: "directions_bus",
				label: t("app.panel.home"),
			},
			{
				key: "lines",
				href: "/dashboard/trabajador/lineas",
				icon: "route",
				label: t("app.panel.lines"),
			},
			{
				key: "incidents",
				href: "/dashboard/trabajador/incidencias",
				icon: "notifications",
				label: t("app.panel.incidents"),
			},
			{
				key: "reports",
				href: "/dashboard/trabajador/reportes",
				icon: "fact_check",
				label: t("app.panel.reports"),
			},
			...common,
		];
	}
	return [
		{
			key: "panel",
			href: "/dashboard/gestion",
			icon: "space_dashboard",
			label: t("app.gestion.nav.panel"),
		},
		{
			key: "map",
			href: "/dashboard/gestion/mapa",
			icon: "map",
			label: t("app.gestion.nav.map"),
		},
		{
			key: "routes",
			href: "/dashboard/gestion/rutas",
			icon: "route",
			label: t("app.gestion.nav.routes"),
		},
		{
			key: "buses",
			href: "/dashboard/gestion/autobuses",
			icon: "directions_bus",
			label: t("app.gestion.nav.buses"),
		},
		{
			key: "stops",
			href: "/dashboard/gestion/paradas",
			icon: "location_on",
			label: t("app.gestion.nav.stops"),
		},
		{
			key: "schedules",
			href: "/dashboard/gestion/horarios",
			icon: "schedule",
			label: t("app.gestion.nav.schedules"),
		},
		{
			key: "drivers",
			href: "/dashboard/gestion/conductores",
			icon: "badge",
			label: t("app.gestion.nav.drivers"),
		},
		{
			key: "notifications",
			href: "/dashboard/gestion/notificaciones",
			icon: "notifications",
			label: t("app.gestion.nav.notifications"),
		},
		{
			key: "reports",
			href: "/dashboard/gestion/reportes",
			icon: "bar_chart",
			label: t("app.gestion.nav.reports"),
		},
		{
			key: "integrations",
			href: "/dashboard/gestion/integraciones",
			icon: "hub",
			label: t("app.gestion.nav.integrations"),
		},
		...common,
	];
});

async function logout() {
	await $fetch("/api/auth/logout", { method: "POST" });
	await navigateTo(localePath("/dashboard/login"));
}
</script>

<template>
	<div class="min-h-screen bg-background text-on-surface">
		<!-- App bar -->
		<header class="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-variant">
			<div class="flex items-center justify-between gap-4 px-margin-mobile md:px-margin-desktop h-16">
				<div class="flex items-center gap-3">
					<a :href="localePath('/')" class="flex items-center gap-2.5">
						<span class="material-symbols-outlined icon-filled text-deep-navy">directions_bus</span>
						<span class="font-headline-md text-headline-md font-bold text-deep-navy leading-none">{{ t("common.brand") }}</span>
						<span class="rounded bg-coastal-teal/15 px-1.5 py-0.5 font-label-md text-label-md text-on-secondary-container hidden sm:inline">App</span>
					</a>
				</div>
				<div class="flex items-center gap-4">
					<nav class="hidden md:flex items-center gap-2 font-label-md text-label-md">
						<a
							v-for="l in locales"
							:key="l.code"
							:class="['transition-colors', l.code === locale ? 'font-bold text-deep-navy' : 'text-on-surface-variant hover:text-deep-navy']"
							:href="l.href"
						>
							{{ l.label }}
						</a>
					</nav>
					<a :href="localePath('/')" class="text-on-surface-variant hover:text-deep-navy transition-colors" :aria-label="t('app.panel.backToSite')">
						<span class="material-symbols-outlined text-[26px]">open_in_new</span>
					</a>
					<UButton variant="ghost" color="neutral" @click="logout">
						{{ t("app.nav.logout") }}
					</UButton>
				</div>
			</div>
		</header>

		<div class="flex">
			<!-- Sidebar (desktop) -->
			<aside class="hidden lg:block w-64 shrink-0 border-r border-surface-variant">
				<nav class="sticky top-16 py-stack-lg pr-3" aria-label="Dashboard">
					<ul class="flex flex-col gap-1.5">
						<li v-for="item in navItems" :key="item.key">
							<a
								:class="[
									'flex items-center gap-3 rounded-lg px-4 py-3.5 font-label-md text-label-md transition-colors',
									$route.path === item.href
										? 'bg-deep-navy text-on-primary shadow-sm'
										: 'text-on-surface-variant hover:bg-surface-container-low hover:text-deep-navy',
								]"
								:href="localePath(item.href)"
								:aria-current="$route.path === item.href ? 'page' : undefined"
							>
								<span class="material-symbols-outlined text-[22px]">{{ item.icon }}</span>
								{{ item.label }}
							</a>
						</li>
					</ul>
				</nav>
			</aside>

			<!-- Content -->
			<div class="min-w-0 flex-1 px-margin-mobile md:px-margin-desktop py-stack-lg pb-28 lg:pb-20">
				<slot />
			</div>
		</div>

		<!-- Bottom nav (mobile) -->
		<nav class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest border-t border-surface-variant shadow-ambient">
			<div class="mx-auto max-w-6xl px-2 py-1.5 flex justify-between items-center">
				<a
					v-for="item in navItems.slice(0, 5)"
					:key="item.key"
					:class="[
						'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 min-w-[64px] transition-colors',
						$route.path === item.href ? 'text-deep-navy' : 'text-on-surface-variant hover:text-deep-navy',
					]"
					:href="localePath(item.href)"
				>
					<span :class="['material-symbols-outlined text-[24px]', $route.path === item.href ? 'icon-filled' : '']">{{ item.icon }}</span>
					<span class="text-[10px] font-label-md leading-none">{{ item.label }}</span>
				</a>
			</div>
		</nav>
	</div>
</template>