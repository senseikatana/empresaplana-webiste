/**
 * Small DOM/format helpers shared by the PWA page scripts.
 * These run in the browser (bundled by Astro from <script> blocks).
 */
import type { BudgetStatus } from "@/interfaces/app";

/** 2026-09-05T… → "5 sept 2026" (locale aware). */
export function fmtDate(iso: string, locale: string): string {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return date.toLocaleDateString(locale === "ca" ? "ca-ES" : locale === "en" ? "en-GB" : "es-ES", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

/** 2026-09-05 (date input value) → readable. */
export function fmtDay(day: string, locale: string): string {
	return fmtDate(`${day}T12:00:00`, locale);
}

export function fmtTime(iso: string, locale: string): string {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return date.toLocaleTimeString(locale === "ca" ? "ca-ES" : locale === "en" ? "en-GB" : "es-ES", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

/** Is `day` (YYYY-MM-DD) today, in the visitor's timezone? */
export function isToday(iso: string): boolean {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return false;
	const now = new Date();
	return (
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate()
	);
}

export function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

export interface StatusMeta {
	chipClass: string;
	icon: string;
	label: string;
}

export function statusMeta(status: BudgetStatus, labels: Record<BudgetStatus, string>): StatusMeta {
	const base = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-label-md text-label-md";
	const byStatus: Record<BudgetStatus, { chipClass: string; icon: string }> = {
		received: { chipClass: "bg-primary-fixed text-on-primary-fixed", icon: "mail" },
		review: { chipClass: "bg-tertiary-fixed text-on-tertiary-fixed", icon: "visibility" },
		answered: { chipClass: "bg-secondary-fixed text-on-secondary-fixed", icon: "reply" },
		contracted: { chipClass: "bg-deep-navy text-on-primary", icon: "verified" },
	};
	const meta = byStatus[status];
	return { chipClass: `${base} ${meta.chipClass}`, icon: meta.icon, label: labels[status] };
}

export function budgetStatusLabels(labels: { received: string; review: string; answered: string; contracted: string }): Record<BudgetStatus, string> {
	return labels;
}
