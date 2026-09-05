/**
 * Client-side i18n hydration for static Astro pages.
 *
 * Prerendered HTML has Spanish content. This script reads `?lang=` from the
 * URL (or `localStorage("plana-lang")` for returning visitors), loads the
 * matching dictionary, and swaps every `data-i18n` attribute's textContent.
 *
 * No framework, no dependencies — works with vanilla Astro output.
 */
import es from "@/config/i18n/es.json";
import ca from "@/config/i18n/ca.json";
import en from "@/config/i18n/en.json";

type Dict = Record<string, unknown>;

const DICTS: Record<string, Dict> = { es, ca, en };
const STORAGE_KEY = "plana-lang";
const VALID_LOCALES = new Set(["es", "ca", "en"]);

function resolve(obj: unknown, path: string): string | undefined {
	let node: unknown = obj;
	for (const part of path.split(".")) {
		if (node && typeof node === "object") {
			if (Array.isArray(node)) {
				const idx = Number(part);
				if (Number.isInteger(idx) && idx >= 0 && idx < node.length) {
					node = (node as unknown[])[idx];
				} else {
					return undefined;
				}
			} else if (part in (node as Record<string, unknown>)) {
				node = (node as Record<string, unknown>)[part];
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	}
	return typeof node === "string" ? node : undefined;
}

/** Build an href that preserves all current query params and sets `lang`. */
function langHref(lang: string): string {
	const url = new URL(window.location.href);
	url.searchParams.set("lang", lang);
	return `${url.pathname}${url.search}`;
}

function getLocale(): string {
	// 1. URL param (highest priority).
	const param = new URLSearchParams(window.location.search).get("lang");
	if (param && VALID_LOCALES.has(param.toLowerCase())) return param.toLowerCase();
	// 2. localStorage (returning visitor).
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored && VALID_LOCALES.has(stored)) return stored;
	} catch {
		/* storage unavailable */
	}
	return "es";
}

function apply(dict: Dict, locale: string): void {
	// 1. Text content: data-i18n="path.to.key"
	document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
		const key = el.dataset.i18n ?? "";
		const value = resolve(dict, key);
		if (value !== undefined) el.textContent = value;
	});

	// 2. Placeholders: data-i18n-placeholder="path.to.key"
	document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-i18n-placeholder]").forEach((el) => {
		const key = el.dataset.i18nPlaceholder ?? "";
		const value = resolve(dict, key);
		if (value !== undefined) el.placeholder = value;
	});

	// 3. Title / aria-label: data-i18n-title="path.to.key"
	document.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((el) => {
		const key = el.dataset.i18nTitle ?? "";
		const value = resolve(dict, key);
		if (value !== undefined) el.title = value;
	});

	// 4. Option text for <select> elements: data-i18n-option="path.to.key"
	document.querySelectorAll<HTMLOptionElement>("[data-i18n-option]").forEach((el) => {
		const key = el.dataset.i18nOption ?? "";
		const value = resolve(dict, key);
		if (value !== undefined) el.textContent = value;
	});

	// 5. HTML lang attribute.
	document.documentElement.lang = locale;

	// 6. Active language link highlighting.
	document.querySelectorAll<HTMLElement>("[data-lang-link]").forEach((el) => {
		const lang = el.dataset.langLink ?? "";
		const isActive = lang === locale;
		el.classList.toggle("font-bold", isActive);
		el.classList.toggle("text-deep-navy", isActive);
		el.classList.toggle("text-on-primary", isActive);
		el.classList.toggle("!text-on-primary", isActive);
	});

	// 7. Language switcher hrefs.
	document.querySelectorAll<HTMLAnchorElement>("[data-lang-href]").forEach((el) => {
		const lang = el.dataset.langHref ?? "";
		el.href = langHref(lang);
	});

	// 8. Dispatch event for reactive components.
	window.dispatchEvent(new CustomEvent("langchange", { detail: { locale, dict } }));
}

function init(): void {
	const locale = getLocale();
	const dict = DICTS[locale] ?? DICTS.es;

	// Save preference (even for the default, so we know it's been visited).
	try {
		localStorage.setItem(STORAGE_KEY, locale);
	} catch {
		/* storage unavailable */
	}

	// If the locale is Spanish (the prerendered default), we only need to fix
	// the lang hrefs and link highlighting — no text swapping needed.
	apply(dict, locale);
}

// Run as early as possible (after DOM is parsed).
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}

// Expose for other scripts that need the current locale.
declare global {
	interface Window {
		__lang: string;
		__dict: Dict;
	}
}
const locale = getLocale();
window.__lang = locale;
window.__dict = DICTS[locale] ?? DICTS.es;
