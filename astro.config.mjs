// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";
import { fileURLToPath } from "node:url";

// https://astro.build/config
export default defineConfig({
	output: "server",
	base: "/",
	adapter: node({ mode: "standalone" }),
	integrations: [react(), markdoc(), keystatic()],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
	},
});
