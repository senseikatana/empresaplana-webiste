<script setup lang="ts">
// Pàgina de proposta interna. NO enllaçada a la navegació, NO al sitemap i noindex.
// Monolingüe (ca) a propòsit: material intern que no va a producció.
useHead({ title: "Tap to Pay — Proposta interna" });
useSeoMeta({
	description:
		"Proposta interna: pagament amb targeta bancària contactless (Tap to Pay) a bord dels autobusos.",
	robots: "noindex, nofollow",
});

const facts = [
	{
		icon: "calendar_month",
		title: "Madrid, juliol 2025",
		text: "El CRTM va estendre el pagament EMV a tota la xarxa interurbana, amb simplificació de 21 preus a 2 tarifes planes.",
	},
	{
		icon: "credit_card",
		title: "AUVASA ja ho accepta",
		text: "A Valladolid es pot pagar amb targeta bancària EMV, targeta de transport o app amb QR.",
	},
	{
		icon: "travel_explore",
		title: "Pensat per al turista",
		text: "A la Costa Daurada el visitant paga com a casa: amb la seva targeta o el mòbil, sense efectiu.",
	},
];

const flowSteps = [
	{
		icon: "contactless",
		title: "Fes tap",
		text: "Apropa la targeta, el mòbil o el rellotge al validador en pujar.",
	},
	{
		icon: "speed",
		title: "Validació instantània",
		text: "El validador confirma en menys d'un segon, fins i tot sense cobertura (store & forward).",
	},
	{
		icon: "payments",
		title: "Liquidació",
		text: "El cobrament es processa després; en un model agregat, un sol càrrec al dia.",
	},
	{
		icon: "fact_check",
		title: "Inspecció sense paper",
		text: "L'inspector llegeix el mateix token de la targeta. No cal bitllet físic.",
	},
];

const models = [
	{
		badge: "Recomanat per al pilot",
		icon: "looks_one",
		title: "Model 1 · Tarifa plana",
		text: "Import fix conegut a l'instant. És el camí de Madrid: simplificar tarifes abans de posar hardware.",
	},
	{
		badge: "Segon pas",
		icon: "looks_two",
		title: "Model 2 · Agregació",
		text: "S'acumulen els taps del dia i es cobra un únic càrrec amb la tarifa real. Permet preu per trajecte.",
	},
	{
		badge: "Horitzó",
		icon: "cloud",
		title: "Model 3 · ABT",
		text: "La targeta identifica un compte al núvol amb saldo i abonaments. Màxima flexibilitat, màxima inversió.",
	},
];

const layers = [
	{
		icon: "directions_bus",
		title: "A bord",
		text: "Validador amb EMV L1+L2 i PCI PTS, GPS i impressora opcional. Compra o renting amb manteniment.",
	},
	{
		icon: "cell_tower",
		title: "Comunicacions",
		text: "4G amb emmagatzematge local: la validació mai depèn de la cobertura en ruta.",
	},
	{
		icon: "dns",
		title: "Back-office",
		text: "Motor tarifari, agregació, liquidació, DEN list i gestió del risc del primer viatge.",
	},
	{
		icon: "monitoring",
		title: "Inspecció i dades",
		text: "App d'inspector i exportació de dades de demanda cap al nostre Postgres/dashboard.",
	},
];

const phases = [
	{
		tag: "Fase 0",
		title: "Estudi",
		text: "Decisió tarifària, RFP a 2–3 proveïdors i conveni amb l'adquirent.",
	},
	{
		tag: "Fase 1",
		title: "Pilot",
		text: "1 línia, 3–5 validadors, certificació EMV L3 i formació de conductors i inspectors.",
	},
	{
		tag: "Fase 2",
		title: "Desplegament",
		text: "Resta de la flota per lots, DEN list operativa i comunicació al viatger.",
	},
	{
		tag: "Fase 3",
		title: "Evolució",
		text: "Agregació amb topall diari (Model 2) o salt a ABT. Acostament a T-Mobilitat.",
	},
];

const costs = [
	[
		"Validador (EMV L1+L2, PCI PTS, 4G)",
		"1.500 – 3.000 €/ud",
		"CAPEX o renting",
	],
	["Certificació EMV L3 + integració", "Partida única", "CAPEX"],
	["Back-office de bitlletatge", "Quota mensual + fee/operació", "OPEX (SaaS)"],
	[
		"Adquirent (passarel·la i cobrament)",
		"% per transacció",
		"OPEX — negociar tarifa plana",
	],
	["Connectivitat 4G de la flota", "Quota mensual per bus", "OPEX"],
];

const risks = [
	{
		icon: "sell",
		title: "Tarifes incompatibles",
		text: "Sense tarifa plana no hi ha Model 1. La decisió tarifària va primer.",
	},
	{
		icon: "money_off",
		title: "Impagats (first-ride risk)",
		text: "DEN list a la flota, reintents de cobrament i límits per targeta.",
	},
	{
		icon: "signal_cellular_off",
		title: "Cobertura 4G",
		text: "Store & forward al validador i autorització diferida.",
	},
	{
		icon: "undo",
		title: "Contracarrecs",
		text: "Registre probatori del tap (GPS, hora, bus).",
	},
	{
		icon: "percent",
		title: "Fees de micropagament",
		text: "Negociar tarifa plana amb adquirent especialitzat en transport.",
	},
	{
		icon: "campaign",
		title: "Adopció baixa",
		text: "Comunicació a parades i a bord. L'efectiu sempre hi conviu.",
	},
];

// Simulació del tap (només visual, client-side).
type TapState = "idle" | "reading" | "approved";
const tapState = ref<TapState>("idle");
let tapTimer: ReturnType<typeof setTimeout> | undefined;

function simulateTap() {
	if (tapState.value === "reading") return;
	tapState.value = "reading";
	tapTimer = setTimeout(() => {
		tapState.value = "approved";
		tapTimer = setTimeout(() => {
			tapState.value = "idle";
		}, 2600);
	}, 1400);
}

onUnmounted(() => clearTimeout(tapTimer));
</script>

<template>
	<div>
		<!-- Banner d'esborrany -->
		<div class="bg-error-container text-on-error-container">
			<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2 flex items-center justify-center gap-2 font-label-md text-label-md">
				<span class="material-symbols-outlined text-[18px]">warning</span>
				<span>Proposta interna · Esborrany — pàgina no pública, fora de navegació, sitemap i indexació.</span>
			</div>
		</div>

		<!-- Hero -->
		<section class="bg-deep-navy text-on-primary">
			<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg text-center">
				<span class="inline-flex items-center gap-2 bg-on-primary/10 rounded-full px-4 py-1 font-label-md text-label-md uppercase tracking-wider text-on-primary/80 mb-stack-md">
					<span class="material-symbols-outlined text-[16px]">contactless</span>
					Proposta · Tap to Pay
				</span>
				<h1 class="font-display-lg text-display-lg mb-stack-sm">Pagament amb targeta a bord</h1>
				<p class="font-body-lg text-body-lg text-on-primary/85 max-w-2xl mx-auto mb-stack-md">
					Com podria funcionar el pagament contactless (EMV) als nostres autobusos quan s'implementi el pagament amb targeta.
				</p>
				<div class="flex flex-wrap justify-center gap-2 font-label-md text-label-md">
					<span class="bg-on-primary/10 rounded-full px-4 py-1.5">Targeta contactless</span>
					<span class="bg-on-primary/10 rounded-full px-4 py-1.5">Apple Pay / Google Pay</span>
					<span class="bg-on-primary/10 rounded-full px-4 py-1.5">L'efectiu hi conviu</span>
				</div>
			</div>
		</section>

		<!-- Per què ara -->
		<section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
			<div class="flex items-center gap-4 mb-8">
				<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy">Per què ara</h2>
				<div class="h-px bg-surface-variant flex-grow"></div>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
				<div v-for="fact in facts" :key="fact.title" class="bg-surface-container-lowest rounded-xl shadow-ambient p-6 border border-surface-variant">
					<div class="w-12 h-12 bg-primary-fixed text-primary-container rounded-xl flex items-center justify-center mb-4">
						<span class="material-symbols-outlined text-[24px]">{{ fact.icon }}</span>
					</div>
					<h3 class="font-headline-md text-headline-md text-deep-navy mb-2">{{ fact.title }}</h3>
					<p class="font-body-md text-body-md text-on-surface-variant">{{ fact.text }}</p>
				</div>
			</div>
		</section>

		<!-- Com funciona -->
		<section class="bg-surface-container-low">
			<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
				<div class="flex items-center gap-4 mb-8">
					<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy">Com funcionaria</h2>
					<div class="h-px bg-surface-variant flex-grow"></div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
					<div v-for="(step, i) in flowSteps" :key="step.title" class="bg-surface-container-lowest rounded-xl shadow-ambient p-6 border border-surface-variant relative">
						<span class="absolute top-4 right-5 font-headline-lg text-headline-lg text-surface-variant select-none">{{ i + 1 }}</span>
						<span class="material-symbols-outlined text-coastal-teal text-[32px] mb-4 block">{{ step.icon }}</span>
						<h3 class="font-headline-md text-headline-md text-deep-navy mb-2">{{ step.title }}</h3>
						<p class="font-body-md text-body-md text-on-surface-variant">{{ step.text }}</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Simulador de tap -->
		<section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
			<div class="flex items-center gap-4 mb-8">
				<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy">Simulació de l'experiència</h2>
				<div class="h-px bg-surface-variant flex-grow"></div>
			</div>
			<div class="bg-deep-navy rounded-xl shadow-ambient p-8 md:p-12 flex flex-col items-center text-center">
				<div
					class="w-full max-w-xs rounded-2xl border-2 p-8 transition-colors duration-300 mb-6"
					:class="tapState === 'approved' ? 'border-coastal-teal bg-coastal-teal/10' : 'border-on-primary/25 bg-on-primary/5'"
				>
					<span
						class="material-symbols-outlined text-[56px] block mb-3 transition-colors duration-300"
						:class="tapState === 'approved' ? 'text-coastal-teal' : 'text-on-primary/70'"
					>
						{{ tapState === "approved" ? "check_circle" : "contactless" }}
					</span>
					<p class="font-headline-md text-headline-md text-on-primary">
						{{ tapState === "approved" ? "Pagament acceptat" : tapState === "reading" ? "Llegint targeta…" : "Validador a punt" }}
					</p>
					<p class="font-body-md text-body-md text-on-primary/60 mt-1">
						{{ tapState === "approved" ? "Bon viatge!" : tapState === "reading" ? "No t'hi precipitis" : "Apropa la targeta o el mòbil" }}
					</p>
				</div>
				<button
					type="button"
					class="bg-energetic-orange text-on-primary font-button text-button rounded-full px-8 py-3 shadow-ambient transition-opacity hover:opacity-90 disabled:opacity-60"
					:disabled="tapState === 'reading'"
					@click="simulateTap"
				>
					{{ tapState === "idle" ? "Simula un tap" : tapState === "reading" ? "Processant…" : "Repeteix la simulació" }}
				</button>
				<p class="font-label-md text-label-md text-on-primary/50 mt-4">Demostració visual. No processa cap pagament real.</p>
			</div>
		</section>

		<!-- Models cEMV -->
		<section class="bg-surface-container-low">
			<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
				<div class="flex items-center gap-4 mb-4">
					<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy">Tres models possibles</h2>
					<div class="h-px bg-surface-variant flex-grow"></div>
				</div>
				<p class="font-body-md text-body-md text-on-surface-variant mb-8 max-w-3xl">
					La decisió que ho condiciona tot no és el hardware: és l'estructura tarifària. Madrid va simplificar 21 preus a 2 tarifes planes el mateix dia que va activar el pagament amb targeta.
				</p>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
					<div v-for="model in models" :key="model.title" class="bg-surface-container-lowest rounded-xl shadow-ambient p-6 border border-surface-variant">
						<span class="inline-block bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-md text-label-md rounded-full px-3 py-1 mb-4">{{ model.badge }}</span>
						<span class="material-symbols-outlined text-primary-container text-[28px] mb-2 block">{{ model.icon }}</span>
						<h3 class="font-headline-md text-headline-md text-deep-navy mb-2">{{ model.title }}</h3>
						<p class="font-body-md text-body-md text-on-surface-variant">{{ model.text }}</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Arquitectura -->
		<section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
			<div class="flex items-center gap-4 mb-8">
				<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy">Arquitectura en quatre capes</h2>
				<div class="h-px bg-surface-variant flex-grow"></div>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
				<div v-for="layer in layers" :key="layer.title" class="bg-surface-container-lowest rounded-xl shadow-ambient p-6 border border-surface-variant flex gap-4">
					<div class="w-12 h-12 shrink-0 bg-primary-fixed text-primary-container rounded-xl flex items-center justify-center">
						<span class="material-symbols-outlined text-[24px]">{{ layer.icon }}</span>
					</div>
					<div>
						<h3 class="font-headline-md text-headline-md text-deep-navy mb-1">{{ layer.title }}</h3>
						<p class="font-body-md text-body-md text-on-surface-variant">{{ layer.text }}</p>
					</div>
				</div>
			</div>
			<p class="font-body-md text-body-md text-on-surface-variant mt-6">
				Complements no excloents: app pròpia amb QR (model AUVASA PAY) i interoperabilitat amb <strong class="text-deep-navy">T-Mobilitat</strong> per al viatger recurrent de la xarxa catalana.
			</p>
		</section>

		<!-- Fases -->
		<section class="bg-surface-container-low">
			<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
				<div class="flex items-center gap-4 mb-8">
					<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy">Pla per fases</h2>
					<div class="h-px bg-surface-variant flex-grow"></div>
				</div>
				<ol class="grid grid-cols-1 md:grid-cols-4 gap-gutter list-none p-0 m-0">
					<li v-for="phase in phases" :key="phase.tag" class="bg-surface-container-lowest rounded-xl shadow-ambient p-6 border-t-4 border-energetic-orange">
						<span class="font-label-md text-label-md text-energetic-orange uppercase tracking-wider">{{ phase.tag }}</span>
						<h3 class="font-headline-md text-headline-md text-deep-navy mt-2 mb-2">{{ phase.title }}</h3>
						<p class="font-body-md text-body-md text-on-surface-variant">{{ phase.text }}</p>
					</li>
				</ol>
			</div>
		</section>

		<!-- Costos orientatius -->
		<section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
			<div class="flex items-center gap-4 mb-8">
				<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy">Costos orientatius</h2>
				<div class="h-px bg-surface-variant flex-grow"></div>
			</div>
			<div class="bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-variant overflow-hidden">
				<table class="w-full font-body-md text-body-md">
					<thead>
						<tr class="bg-surface-container text-left text-deep-navy">
							<th class="px-6 py-4 font-headline-md text-headline-md">Partida</th>
							<th class="px-6 py-4 font-headline-md text-headline-md">Rang</th>
							<th class="px-6 py-4 font-headline-md text-headline-md hidden md:table-cell">Tipus</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="cost in costs" :key="cost[0]" class="border-t border-surface-variant">
							<td class="px-6 py-4 text-on-surface">{{ cost[0] }}</td>
							<td class="px-6 py-4 text-on-surface-variant">{{ cost[1] }}</td>
							<td class="px-6 py-4 text-on-surface-variant hidden md:table-cell">{{ cost[2] }}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p class="font-label-md text-label-md text-on-surface-variant mt-4">Estimació de mercat pendent de RFP real (fase 0). No és un pressupost.</p>
		</section>

		<!-- Riscos -->
		<section class="bg-surface-container-low">
			<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
				<div class="flex items-center gap-4 mb-8">
					<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy">Riscos i mitigacions</h2>
					<div class="h-px bg-surface-variant flex-grow"></div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
					<div v-for="risk in risks" :key="risk.title" class="bg-surface-container-lowest rounded-xl shadow-ambient p-6 border border-surface-variant">
						<span class="material-symbols-outlined text-energetic-orange text-[26px] mb-3 block">{{ risk.icon }}</span>
						<h3 class="font-headline-md text-headline-md text-deep-navy mb-2">{{ risk.title }}</h3>
						<p class="font-body-md text-body-md text-on-surface-variant">{{ risk.text }}</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Tancament -->
		<section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg text-center">
			<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-navy mb-4">Document complet</h2>
			<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
				Tota la propuesta —normativa (PCI DSS, PSD2, RGPD), certificacions EMV L1–L3, KPIs del pilot i referències— està a
				<code class="bg-surface-container rounded px-2 py-0.5 font-mono text-sm">docs/tap-to-pay.md</code>, dins la branca
				<code class="bg-surface-container rounded px-2 py-0.5 font-mono text-sm">feat/tap-to-pay-proposal</code>.
			</p>
			<p class="font-label-md text-label-md text-on-surface-variant mt-6">Material intern d'exploració. Cap part d'aquesta pàgina va a producció.</p>
		</section>
	</div>
</template>
