import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
	compatibilityDate: "2026-09-13",
	devtools: { enabled: true },
	modules: ["@nuxt/ui", "@nuxt/fonts", "@nuxtjs/i18n"],
	css: ["~/assets/css/main.css"],
	fonts: {
		families: [{ name: "Geist", provider: "google" }],
	},
	app: {
		head: {
			meta: [{ name: "theme-color", content: "#013990" }],
			link: [
				// Preconnect a los origenes de fuentes/imagenes remotas
				{ rel: "preconnect", href: "https://fonts.googleapis.com" },
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossorigin: "",
				},
				{ rel: "preconnect", href: "https://lh3.googleusercontent.com" },
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap",
				},
				{ rel: "manifest", href: "/manifest.webmanifest" },
			],
		},
	},
	i18n: {
		restructureDir: "i18n",
		langDir: "locales",
		defaultLocale: "ca",
		strategy: "prefix_except_default",
		baseUrl: "https://empresaplana.cat",
		lazy: true,
		locales: [
			{ code: "ca", language: "ca", name: "CA", file: "ca.json" },
			{ code: "es", language: "es", name: "ES", file: "es.json" },
			{ code: "en", language: "en", name: "EN", file: "en.json" },
		],
		bundle: {
			optimizeTranslationDirective: false,
		},
	},
	nitro: {
		// Default = Node (Render). Override with NITRO_PRESET=cloudflare_pages
		// once Prisma ships a Workers-compatible build (issue #28657).
		preset: process.env.NITRO_PRESET || "node_server",
		experimental: {
			websocket: true,
		},
		alias: {
			"pg-native": fileURLToPath(
				new URL("./server/utils/pg-native-stub.ts", import.meta.url),
			),
		},
	},
	typescript: {
		strict: true,
		typeCheck: false,
	},
});
