import services from "../../app/data/services.json";

const BASE_URL = "https://empresaplana.cat";
// ca sin prefijo (strategy: prefix_except_default); es/en con prefijo
const LOCALES = ["ca", "es", "en", "fr"] as const;

const STATIC_PATHS = [
	"/",
	"/rutas-horarios",
	"/servicios-discrecionales",
	"/solicitar-presupuesto",
	"/donde-estamos",
	"/aviso-legal",
	"/politica-cookies",
	"/politica-privacidad",
];

function localizedUrl(path: string, locale: string): string {
	const prefix = locale === "ca" ? "" : `/${locale}`;
	// Sin barra final para coincidir con los canonical/hreflang que genera useLocaleHead
	return `${BASE_URL}${prefix}${path === "/" ? "" : path}`;
}

export default defineEventHandler((event) => {
	const paths = [
		...STATIC_PATHS,
		...services.services.map((service) => `/servicios/${service.slug}`),
	];

	const urls = paths
		.map((path) => {
			const alternates = LOCALES.map(
				(locale) =>
					`<xhtml:link rel="alternate" hreflang="${locale}" href="${localizedUrl(path, locale)}"/>`,
			).join("");
			const fallback = `<xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl(path, "ca")}"/>`;
			return `<url><loc>${localizedUrl(path, "ca")}</loc>${alternates}${fallback}</url>`;
		})
		.join("");

	setResponseHeader(event, "content-type", "application/xml; charset=utf-8");
	return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
});
