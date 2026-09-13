<script setup lang="ts">
definePageMeta({ middleware: "auth", layout: "dashboard" });

const { t } = useI18n();
const route = useRoute();

// Etiquetas de las secciones de gestión (misma key que en la nav).
const sectionKeys: Record<string, string> = {
	mapa: "app.gestion.nav.map",
	rutas: "app.gestion.nav.routes",
	autobuses: "app.gestion.nav.buses",
	paradas: "app.gestion.nav.stops",
	horarios: "app.gestion.nav.schedules",
	conductores: "app.gestion.nav.drivers",
	notificaciones: "app.gestion.nav.notifications",
	reportes: "app.gestion.nav.reports",
	integraciones: "app.gestion.nav.integrations",
};

const section = route.params.seccion as string;
const title = sectionKeys[section] ? t(sectionKeys[section]) : section;
</script>

<template>
	<div>
		<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-deep-navy">
			{{ title }}
		</h1>
		<UAlert
			class="mt-6"
			variant="soft"
			color="neutral"
			:title="t('app.worker.noLineData')"
		/>
	</div>
</template>