/**
 * Small UI helpers for the /dashboard/gestion area (browser-side).
 */

export type ToastTone = "success" | "error" | "info";

const TOAST_TONES: Record<ToastTone, { border: string; icon: string; iconColor: string }> = {
	success: { border: "border-l-coastal-teal", icon: "check_circle", iconColor: "text-coastal-teal" },
	error: { border: "border-l-error", icon: "error", iconColor: "text-error" },
	info: { border: "border-l-deep-navy", icon: "info", iconColor: "text-deep-navy" },
};

/** Singleton toast, stacked above the bottom nav. */
export function toast(message: string, tone: ToastTone = "info"): void {
	const meta = TOAST_TONES[tone];
	let container = document.getElementById("gestion-toasts");
	if (!container) {
		container = document.createElement("div");
		container.id = "gestion-toasts";
		container.className = "fixed inset-x-0 bottom-24 lg:bottom-8 z-[70] flex flex-col items-center gap-2 px-margin-mobile pointer-events-none";
		document.body.appendChild(container);
	}
	const el = document.createElement("div");
	el.className = `pointer-events-auto flex items-center gap-3 rounded-xl border border-surface-variant border-l-4 ${meta.border} bg-surface-container-lowest shadow-ambient-lg px-4 py-3 max-w-md`;
	el.innerHTML = `
		<span class="material-symbols-outlined ${meta.iconColor}">${meta.icon}</span>
		<p class="font-body-md text-body-md text-on-surface">${escapeHtml(message)}</p>`;
	container.appendChild(el);
	setTimeout(() => {
		el.style.opacity = "0";
		el.style.transition = "opacity .3s";
		setTimeout(() => el.remove(), 300);
	}, 3200);
}

export function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

/** Colored pill for fleet statuses (labels come from the gestion dict). */
export function statusPill(status: string, labels: Record<string, string>): string {
	const styles: Record<string, string> = {
		active: "bg-coastal-teal/15 text-on-secondary-container",
		online: "bg-coastal-teal/15 text-on-secondary-container",
		enRoute: "bg-coastal-teal/15 text-on-secondary-container",
		delayed: "bg-tertiary-fixed text-on-tertiary-fixed",
		maintenance: "bg-error-container text-on-error-container",
		offline: "bg-error-container text-on-error-container",
		inactive: "bg-surface-container-high text-on-surface-variant",
	};
	const icons: Record<string, string> = {
		active: "check_circle",
		online: "wifi",
		enRoute: "directions_bus",
		delayed: "schedule",
		maintenance: "build",
		offline: "wifi_off",
		inactive: "pause_circle",
	};
	const cls = styles[status] ?? styles.inactive;
	const icon = icons[status] ?? "circle";
	const label = labels[status] ?? status;
	return `<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label-md text-label-md ${cls}">
		<span class="material-symbols-outlined text-[15px]">${icon}</span>${escapeHtml(label)}</span>`;
}

/** Relative time like "hace 10 min" / "fa 2 h" (es/ca/en). */
export function timeAgo(iso: string, locale: string): string {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	const diff = Date.now() - date.getTime();
	const min = Math.floor(diff / 60_000);
	const units =
		locale === "ca"
			? { min: "min", hour: "h", day: "d", just: "ara", ago: "fa" }
			: locale === "en"
				? { min: "min", hour: "h", day: "d", just: "now", ago: "" }
				: { min: "min", hour: "h", day: "d", just: "ahora", ago: "hace" };
	if (min < 1) return units.just;
	if (min < 60) return locale === "en" ? `${min} ${units.min} ago` : `${units.ago} ${min} ${units.min}`;
	const hours = Math.floor(min / 60);
	if (hours < 24) return locale === "en" ? `${hours} ${units.hour} ago` : `${units.ago} ${hours} ${units.hour}`;
	const days = Math.floor(hours / 24);
	return locale === "en" ? `${days} ${units.day} ago` : `${units.ago} ${days} ${units.day}`;
}

/** Today's short weekday labels (Lun…Dom) for the given locale. */
export function weekDayLabels(locale: string): string[] {
	const lang = locale === "ca" ? "ca-ES" : locale === "en" ? "en-GB" : "es-ES";
	const now = new Date();
	const monday = new Date(now);
	monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		return d.toLocaleDateString(lang, { weekday: "short" });
	});
}
