import type { Locale, SiteInfoProps } from "@/interfaces";

const SITE_BASE_URL = "https://empresaplana.cat";

export const SITE_INFO = {
	brand: "Empresa Plana",
	title: "Empresa Plana - Autocares y movilidad para la Costa Dorada",
	description:
		"Empresa Plana: horarios de autobús, rutas, traslados al aeropuerto y servicios discrecionales en la Costa Dorada, Camp de Tarragona y Barcelona.",
	baseUrl: SITE_BASE_URL,
	defaultLang: "es",
	author: "Empresa Plana",
	themeColor: "#013990",
	keywords: [
		"Empresa Plana",
		"autocares",
		"autobuses",
		"horarios",
		"Tarragona",
		"Costa Dorada",
		"traslados aeropuerto",
	],
} as const;

export const title = SITE_INFO.title;
export const description = SITE_INFO.description;

export function getSiteInfo(page: Partial<SiteInfoProps> = {}): SiteInfoProps {
	const { lang = SITE_INFO.defaultLang as Locale, ...rest } = page;

	return {
		title: SITE_INFO.title,
		description: SITE_INFO.description,
		author: SITE_INFO.author,
		themeColor: SITE_INFO.themeColor,
		keywords: [...SITE_INFO.keywords],
		lang,
		...rest,
	};
}

export function getCanonicalUrl(pathname: string): string {
	return `${SITE_BASE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
