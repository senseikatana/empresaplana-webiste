/**
 * Reusable CRUD engine for the /dashboard/gestion entity pages (browser-side).
 * Mounts toolbar (add/filter/search) + table + modal inside a root element,
 * reads/writes through src/lib/fleet-store.ts and toasts through fleet-ui.
 */
import {
	listFleet,
	addFleetItem,
	addFleetRoute,
	updateFleetRoute,
	updateFleetItem,
	removeFleetItem,
	toggleFleetStatus,
} from "@/lib/fleet-store";
import { toast, escapeHtml, statusPill } from "@/lib/fleet-ui";
import { getCurrentUser } from "@/lib/app-store";

export type CrudEntityKey = "routes" | "buses" | "stops" | "schedules" | "drivers";

export interface CrudUi {
	common: {
		add: string;
		edit: string;
		delete: string;
		save: string;
		cancel: string;
		search: string;
		actions: string;
		empty: string;
		confirmDelete: string;
		all: string;
		newEntity: string;
		editEntity: string;
		statusLabel: string;
		updated: string;
		created: string;
		deleted: string;
	};
	states: Record<string, string>;
	fields: Record<string, string>;
	entityLabel: string;
	locale: string;
}

export interface CrudOptions {
	root: HTMLElement;
	entity: CrudEntityKey;
	ui: CrudUi;
}

type Row = Record<string, unknown> & { id: number | string };

interface EntitySpec {
	statusKey?: string;
	toggleable: boolean;
	searchKeys: string[];
	columns: { key: string; render?: (row: Row, ui: CrudUi) => string }[];
	fields: {
		key: string;
		type: "text" | "number" | "select" | "time" | "tel" | "email";
		required?: boolean;
		options?: () => string[];
	}[];
	/** Defaults applied when creating. */
	defaults: (ui: CrudUi) => Partial<Row>;
	displayName: (row: Row) => string;
}

const routesList = () => listFleet("routes");
const busesList = () => listFleet("buses");
const driversList = () => listFleet("drivers");

const ROUTE_COLORS = ["#013990", "#00696F", "#13AEB8", "#EB8E02", "#0E7490", "#7C3AED", "#C2410C", "#4D7C0F"];

const SPECS: Record<CrudEntityKey, EntitySpec> = {
	routes: {
		statusKey: "status",
		toggleable: true,
		searchKeys: ["code", "name", "origin", "destination"],
		columns: [
			{
				key: "code",
				render: (r) => `<span class="inline-flex items-center gap-2 font-bold text-deep-navy"><span class="w-2.5 h-2.5 rounded-full" style="background:${escapeHtml(String(r.color ?? "#013990"))}"></span>${escapeHtml(String(r.code))}</span>`,
			},
			{ key: "name" },
			{ key: "origin", render: (r) => `${escapeHtml(String(r.origin))} → ${escapeHtml(String(r.destination))}` },
			{
				key: "driver",
				render: (r) => {
					const driver = driversList().find((d) => d.id === Number(r.driverId));
					return driver ? escapeHtml(driver.name) : '<span class="text-outline">—</span>';
				},
			},
		],
		fields: [
			{ key: "code", type: "text", required: true },
			{ key: "name", type: "text", required: true },
			{ key: "origin", type: "text", required: true },
			{ key: "destination", type: "text", required: true },
			{
				key: "driverId",
				type: "select",
				options: () => driversList().map((d) => String(d.id)),
			},
			{ key: "status", type: "select", options: () => ["active", "delayed", "inactive"] },
			{
				key: "color",
				type: "select",
				options: () => ROUTE_COLORS,
			},
		],
		defaults: () => ({ status: "active", color: ROUTE_COLORS[0], path: [] }),
		displayName: (r) => `${String(r.code)} · ${String(r.name)}`,
	},
	buses: {
		statusKey: "status",
		toggleable: false,
		searchKeys: ["number", "plate", "company"],
		columns: [
			{ key: "number", render: (r) => `<strong>${escapeHtml(String(r.number))}</strong>` },
			{ key: "plate" },
			{ key: "company" },
			{ key: "capacity" },
			{
				key: "route",
				render: (r) => {
					const route = routesList().find((x) => x.id === r.routeId);
					return route ? `<span style="color:${escapeHtml(route.color)}">${escapeHtml(route.code)}</span>` : '<span class="text-outline">—</span>';
				},
			},
		],
		fields: [
			{ key: "number", type: "text", required: true },
			{ key: "plate", type: "text", required: true },
			{ key: "company", type: "text" },
			{ key: "capacity", type: "number" },
			{ key: "routeId", type: "select", options: () => routesList().map((r) => r.id) },
			{ key: "status", type: "select", options: () => ["active", "maintenance", "inactive"] },
		],
		defaults: () => ({
			company: "Empresa Plana",
			status: "active",
			gps: { lat: 41.12, lng: 1.24, speed: 0, battery: 100, online: false },
		}),
		displayName: (r) => String(r.number),
	},
	stops: {
		toggleable: false,
		searchKeys: ["name", "address"],
		columns: [
			{ key: "name", render: (r) => `<strong>${escapeHtml(String(r.name))}</strong>` },
			{ key: "address" },
			{
				key: "lat",
				render: (r) => `<code class="text-xs">${Number(r.lat).toFixed(4)}, ${Number(r.lng).toFixed(4)}</code>`,
			},
			{
				key: "routes",
				render: (r) =>
					(Array.isArray(r.routes) ? r.routes : [])
						.map((id: string) => {
							const route = routesList().find((x) => x.id === id);
							return route ? `<span class="inline-flex items-center gap-1 mr-1 font-label-md text-label-md"><span class="w-2 h-2 rounded-full" style="background:${escapeHtml(route.color)}"></span>${escapeHtml(route.code)}</span>` : "";
						})
						.join(""),
			},
		],
		fields: [
			{ key: "name", type: "text", required: true },
			{ key: "address", type: "text" },
			{ key: "lat", type: "number", required: true },
			{ key: "lng", type: "number", required: true },
			{ key: "routesText", type: "text" },
		],
		defaults: () => ({ routes: [] }),
		displayName: (r) => String(r.name),
	},
	schedules: {
		statusKey: "status",
		toggleable: true,
		searchKeys: ["routeId", "departure"],
		columns: [
			{
				key: "route",
				render: (r) => {
					const route = routesList().find((x) => x.id === r.routeId);
					return route ? `<span style="color:${escapeHtml(route.color)}"><strong>${escapeHtml(route.code)}</strong></span>` : escapeHtml(String(r.routeId));
				},
			},
			{
				key: "departure",
				render: (r) => `<strong>${escapeHtml(String(r.departure))}</strong> → ${escapeHtml(String(r.arrival))}`,
			},
			{ key: "frequency" },
			{ key: "days" },
		],
		fields: [
			{ key: "routeId", type: "select", options: () => routesList().map((r) => r.id) },
			{ key: "departure", type: "time", required: true },
			{ key: "arrival", type: "time", required: true },
			{ key: "frequency", type: "text" },
			{ key: "days", type: "text" },
			{ key: "status", type: "select", options: () => ["active", "inactive"] },
		],
		defaults: () => ({ status: "active", frequency: "60 min", days: "Lun–Dom" }),
		displayName: (r) => `${String(r.routeId)} · ${String(r.departure)}`,
	},
	drivers: {
		statusKey: "status",
		toggleable: true,
		searchKeys: ["name", "license"],
		columns: [
			{ key: "name", render: (r) => `<strong>${escapeHtml(String(r.name))}</strong>` },
			{ key: "phone" },
			{ key: "license", render: (r) => `<code class="text-xs">${escapeHtml(String(r.license))}</code>` },
			{
				key: "bus",
				render: (r) => (r.busNumber ? escapeHtml(String(r.busNumber)) : '<span class="text-outline">—</span>'),
			},
		],
		fields: [
			{ key: "name", type: "text", required: true },
			{ key: "phone", type: "tel" },
			{ key: "license", type: "text" },
			{ key: "busNumber", type: "select", options: () => busesList().map((b) => b.number) },
			{ key: "status", type: "select", options: () => ["active", "inactive"] },
		],
		defaults: () => ({ status: "active" }),
		displayName: (r) => String(r.name),
	},
};

/** Option labels for status/select fields when they come from a fixed set. */

function fieldLabel(specField: { key: string }, ui: CrudUi): string {
	const entityFields: Record<string, string> = {
		driverId: ui.fields.driver ?? "Conductor",
		routeId: ui.fields.route ?? "Ruta",
		routesText: ui.fields.routes ?? "Rutas",
		busNumber: ui.fields.bus ?? "Autobús",
		status: ui.common.statusLabel,
	};
	return entityFields[specField.key] ?? ui.fields[specField.key] ?? specField.key;
}

export function mountCrud({ root, entity, ui }: CrudOptions): void {
	const spec = SPECS[entity];
	const collection = entity as "routes" | "buses" | "stops" | "schedules" | "drivers";
	const actor = getCurrentUser()?.fullName ?? "Jefe";

	let filterStatus = "all";
	let query = "";
	let editing: Row | null = null;
	let open = false;
	const selected = new Set<number | string>();

	const isNumeric = entity !== "routes";

	function statuses(): string[] {
		if (entity === "buses") return ["active", "maintenance", "inactive"];
		if (entity === "routes") return ["active", "delayed", "inactive"];
		return ["active", "inactive"];
	}

	function itemStatus(row: Row): string {
		return spec.statusKey ? String(row[spec.statusKey] ?? "inactive") : "active";
	}

	function iconForStatus(status: string): string {
		const map: Record<string, string> = { active: "check_circle", delayed: "schedule", maintenance: "build", inactive: "pause_circle" };
		return map[status] ?? "circle";
	}

	function searchable(row: Row): string {
		return spec.searchKeys.map((k) => String(row[k] ?? "")).join(" ").toLowerCase();
	}

	function rows(): Row[] {
		const all = listFleet(collection) as unknown as Row[];
		return all.filter((row) => {
			if (filterStatus !== "all" && itemStatus(row) !== filterStatus) return false;
			if (query && !searchable(row).includes(query)) return false;
			return true;
		});
	}

	function render() {
		const list = rows();
		const statusFilterHtml = spec.statusKey
			? `<select id="crud-filter" class="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 font-body-md text-body-md outline-none focus:border-coastal-teal">
					<option value="all">${escapeHtml(ui.common.all)}</option>
					${statuses().map((s) => `<option value="${s}" ${filterStatus === s ? "selected" : ""}>${escapeHtml(ui.states[s] ?? s)}</option>`).join("")}
				</select>`
			: "";

		const selectedCount = selected.size;
		const bulkBarHtml = selectedCount > 0
			? `<div class="flex flex-wrap items-center justify-between gap-3 bg-deep-navy text-on-primary rounded-xl px-5 py-3">
				<span class="font-label-md text-label-md">${selectedCount} ${selectedCount === 1 ? "seleccionado" : "seleccionados"}</span>
				<div class="flex gap-2">
					<button id="bulk-status" class="inline-flex items-center gap-1.5 rounded-lg bg-on-primary/15 text-on-primary font-button text-button px-4 py-2 min-h-[40px] hover:bg-on-primary/25 transition-colors">
						<span class="material-symbols-outlined text-[18px]">swap_horiz</span> Estado
					</button>
					<button id="bulk-export" class="inline-flex items-center gap-1.5 rounded-lg bg-on-primary/15 text-on-primary font-button text-button px-4 py-2 min-h-[40px] hover:bg-on-primary/25 transition-colors">
						<span class="material-symbols-outlined text-[18px]">download</span> Exportar
					</button>
					<button id="bulk-delete" class="inline-flex items-center gap-1.5 rounded-lg bg-error text-on-error font-button text-button px-4 py-2 min-h-[40px] hover:opacity-90 transition-opacity">
						<span class="material-symbols-outlined text-[18px]">delete</span> Eliminar
					</button>
				</div>
			</div>`
			: "";

		root.innerHTML = `
			<div class="flex flex-col gap-4">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex flex-wrap items-center gap-3">
						<button id="crud-add" class="inline-flex items-center gap-1.5 rounded-lg bg-deep-navy text-on-primary font-button text-button px-5 py-3 min-h-[48px] hover:opacity-90 transition-opacity">
							<span class="material-symbols-outlined text-[20px]">add</span>
							${escapeHtml(ui.common.add)}
						</button>
						${statusFilterHtml}
					</div>
					<div class="relative">
						<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
						<input id="crud-search" type="search" value="${escapeHtml(query)}" placeholder="${escapeHtml(ui.common.search)}…" class="w-full sm:w-72 rounded-lg border border-outline-variant bg-surface-container-lowest pl-10 pr-3 py-3 font-body-md text-body-md outline-none focus:border-coastal-teal" />
					</div>
				</div>
				${bulkBarHtml}
				<div class="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient overflow-x-auto">
					<table class="w-full min-w-[720px]">
						<thead>
							<tr class="text-left">
								<th class="px-3 py-3.5 border-b border-surface-variant">
									<input id="select-all" type="checkbox" class="w-4 h-4 rounded border-outline-variant text-deep-navy focus:ring-deep-navy" ${selectedCount > 0 && selectedCount === list.length ? "checked" : ""} />
								</th>
								${spec.columns.map((col) => `<th class="px-5 py-3.5 font-label-md text-label-md uppercase tracking-wider text-outline border-b border-surface-variant whitespace-nowrap">${escapeHtml(ui.fields[col.key] ?? col.key)}</th>`).join("")}
								${spec.statusKey ? `<th class="px-5 py-3.5 font-label-md text-label-md uppercase tracking-wider text-outline border-b border-surface-variant">${escapeHtml(ui.common.statusLabel)}</th>` : ""}
								<th class="px-5 py-3.5 font-label-md text-label-md uppercase tracking-wider text-outline border-b border-surface-variant text-right">${escapeHtml(ui.common.actions)}</th>
							</tr>
						</thead>
						<tbody>
								${
									list.length === 0
										? `<tr><td colspan="10" class="px-5 py-12 text-center font-body-md text-body-md text-on-surface-variant">${escapeHtml(ui.common.empty)}</td></tr>`
										: list
												.map((row) => {
													const id = String(row.id);
													const status = itemStatus(row);
													const isSelected = selected.has(row.id);
													return `<tr class="border-b border-surface-variant last:border-0 hover:bg-surface-container-low/50 ${isSelected ? "bg-primary-fixed/30" : ""}">
														<td class="px-3 py-4">
															<input type="checkbox" data-row-select="${escapeHtml(id)}" class="w-4 h-4 rounded border-outline-variant text-deep-navy focus:ring-deep-navy" ${isSelected ? "checked" : ""} />
														</td>
														${spec.columns.map((col) => `<td class="px-5 py-4 font-body-md text-body-md text-on-surface">${col.render ? col.render(row, ui) : escapeHtml(String(row[col.key] ?? "—"))}</td>`).join("")}
														${spec.statusKey ? `<td class="px-5 py-4">${statusPill(status, ui.states)}</td>` : ""}
														<td class="px-5 py-4">
															<div class="flex justify-end gap-2">
																${spec.toggleable ? `<button data-act="toggle" data-id="${escapeHtml(id)}" title="${escapeHtml(status === "active" ? ui.states.inactive : ui.states.active)}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg ${status === "active" ? "bg-coastal-teal/15 text-on-secondary-container hover:bg-coastal-teal hover:text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-deep-navy hover:text-on-primary"} transition-colors"><span class="material-symbols-outlined text-[20px]">${status === "active" ? "power_off" : "power"}</span></button>` : ""}
																<button data-act="edit" data-id="${escapeHtml(id)}" title="${escapeHtml(ui.common.edit)}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed hover:bg-deep-navy hover:text-on-primary transition-colors"><span class="material-symbols-outlined text-[20px]">edit</span></button>
																<button data-act="delete" data-id="${escapeHtml(id)}" title="${escapeHtml(ui.common.delete)}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors"><span class="material-symbols-outlined text-[20px]">delete</span></button>
															</div>
														</td>
													</tr>`;
												})
												.join("")
								}
						</tbody>
					</table>
				</div>
			</div>`;

		wire();
	}

	function wire() {
		root.querySelector("#crud-add")?.addEventListener("click", () => openModal(null));
		root.querySelector("#crud-filter")?.addEventListener("change", (e) => {
			filterStatus = (e.target as HTMLSelectElement).value;
			render();
		});
		root.querySelector("#crud-search")?.addEventListener("input", (e) => {
			query = (e.target as HTMLInputElement).value.trim().toLowerCase();
			render();
		});

		// Row selection checkboxes
		root.querySelectorAll<HTMLInputElement>("[data-row-select]").forEach((checkbox) => {
			checkbox.addEventListener("change", () => {
				const id = checkbox.dataset.rowSelect ?? "";
				const row = (listFleet(collection) as unknown as Row[]).find((r) => String(r.id) === id);
				if (!row) return;
				if (checkbox.checked) selected.add(row.id);
				else selected.delete(row.id);
				render();
			});
		});

		// Select all checkbox
		root.querySelector<HTMLInputElement>("#select-all")?.addEventListener("change", (e) => {
			const checked = (e.target as HTMLInputElement).checked;
			const list = rows();
			if (checked) list.forEach((row) => selected.add(row.id));
			else selected.clear();
			render();
		});

		// Bulk action buttons
		root.querySelector("#bulk-delete")?.addEventListener("click", () => {
			if (selected.size === 0) return;
			openBulkDeleteModal();
		});

		root.querySelector("#bulk-status")?.addEventListener("click", () => {
			if (selected.size === 0) return;
			openBulkStatusModal();
		});

		root.querySelector("#bulk-export")?.addEventListener("click", () => {
			if (selected.size === 0) return;
			bulkExport();
		});

		// Single row actions
		root.querySelectorAll<HTMLButtonElement>("[data-act]").forEach((button) => {
			button.addEventListener("click", () => {
				const id = button.dataset.id ?? "";
				const row = (listFleet(collection) as unknown as Row[]).find((r) => String(r.id) === id);
				if (!row) return;
				const action = button.dataset.act;
				if (action === "edit") openModal(row);
				if (action === "delete") remove(row);
				if (action === "toggle") toggle(row);
			});
		});
	}

	function openBulkDeleteModal() {
		const count = selected.size;
		const modal = document.createElement("div");
		modal.className = "fixed inset-0 z-[70] flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm px-margin-mobile";
		modal.innerHTML = `
			<div class="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-ambient-lg flex flex-col">
				<div class="px-6 py-5 border-b border-surface-variant">
					<h3 class="font-headline-md text-headline-md font-bold text-deep-navy">Eliminar ${count} ${count === 1 ? ui.entityLabel.toLowerCase() : ui.entityLabel.toLowerCase() + "s"}</h3>
				</div>
				<div class="px-6 py-5">
					<p class="font-body-md text-body-md text-on-surface-variant">¿Estás seguro? Esta acción no se puede deshacer.</p>
				</div>
				<div class="px-6 py-4 border-t border-surface-variant flex justify-end gap-3">
					<button data-close class="rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-button text-button px-6 py-3 min-h-[48px] hover:border-deep-navy transition-colors">${escapeHtml(ui.common.cancel)}</button>
					<button id="confirm-bulk-delete" class="rounded-lg bg-error text-on-error font-button text-button px-6 py-3 min-h-[48px] hover:opacity-90 transition-opacity">Eliminar</button>
				</div>
			</div>`;
		document.body.appendChild(modal);
		modal.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", () => modal.remove()));
		modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
		modal.querySelector("#confirm-bulk-delete")?.addEventListener("click", () => {
			const ids = [...selected];
			ids.forEach((id) => {
				if (entity === "routes") removeFleetItem(collection, id, `${ui.common.delete} ${ui.entityLabel.toLowerCase()}`);
				else removeFleetItem(collection, Number(id), `${ui.common.delete} ${ui.entityLabel.toLowerCase()}`);
			});
			selected.clear();
			modal.remove();
			toast(`${ids.length} ${ids.length === 1 ? "eliminado" : "eliminados"}`, "success");
			render();
		});
	}

	function openBulkStatusModal() {
		const count = selected.size;
		const statusOptions = statuses();
		const modal = document.createElement("div");
		modal.className = "fixed inset-0 z-[70] flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm px-margin-mobile";
		modal.innerHTML = `
			<div class="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-ambient-lg flex flex-col">
				<div class="px-6 py-5 border-b border-surface-variant">
					<h3 class="font-headline-md text-headline-md font-bold text-deep-navy">Cambiar estado · ${count} seleccionados</h3>
				</div>
				<div class="px-6 py-5">
					<label class="font-label-md text-label-md text-on-surface block mb-2">Nuevo estado</label>
					<select id="bulk-new-status" class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md text-body-md outline-none focus:border-coastal-teal">
						${statusOptions.map((s) => `<option value="${s}">${escapeHtml(ui.states[s] ?? s)}</option>`).join("")}
					</select>
				</div>
				<div class="px-6 py-4 border-t border-surface-variant flex justify-end gap-3">
					<button data-close class="rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-button text-button px-6 py-3 min-h-[48px] hover:border-deep-navy transition-colors">${escapeHtml(ui.common.cancel)}</button>
					<button id="confirm-bulk-status" class="rounded-lg bg-deep-navy text-on-primary font-button text-button px-6 py-3 min-h-[48px] hover:opacity-90 transition-opacity">Aplicar</button>
				</div>
			</div>`;
		document.body.appendChild(modal);
		modal.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", () => modal.remove()));
		modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
		modal.querySelector("#confirm-bulk-status")?.addEventListener("click", () => {
			const newStatus = modal.querySelector<HTMLSelectElement>("#bulk-new-status")?.value ?? "active";
			const ids = [...selected];
			ids.forEach((id) => {
				if (spec.statusKey) {
					if (entity === "routes") updateFleetRoute({ ...((listFleet("routes") as unknown as Row[]).find((r) => r.id === id) as never), status: newStatus }, `Estado cambiado a ${newStatus}`);
					else updateFleetItem(collection, Number(id), { [spec.statusKey]: newStatus } as never, `Estado cambiado a ${newStatus}`);
				}
			});
			selected.clear();
			modal.remove();
			toast(`Estado actualizado para ${ids.length} elementos`, "success");
			render();
		});
	}

	function bulkExport() {
		const ids = [...selected];
		const allRows = listFleet(collection) as unknown as Row[];
		const selectedRows = allRows.filter((r) => ids.includes(r.id));
		const json = JSON.stringify(selectedRows, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${entity}-seleccionados.json`;
		link.click();
		URL.revokeObjectURL(url);
		toast(`${ids.length} elementos exportados`, "success");
		selected.clear();
		render();
	}

	function toggle(row: Row) {
		if (!spec.toggleable) return;
		const next = itemStatus(row) === "active" ? "inactive" : "active";
		toggleFleetStatus(
			collection as "routes" | "schedules" | "drivers",
			row.id,
			`${ui.states[next] ?? next} ${ui.entityLabel.toLowerCase()}: ${spec.displayName(row)}`,
		);
		render();
	}

	function remove(row: Row) {
		const modal = document.createElement("div");
		modal.className = "fixed inset-0 z-[70] flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm px-margin-mobile";
		modal.innerHTML = `
			<div class="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-ambient-lg flex flex-col">
				<div class="px-6 py-5 border-b border-surface-variant">
					<h3 class="font-headline-md text-headline-md font-bold text-deep-navy">${escapeHtml(ui.common.delete)} ${escapeHtml(ui.entityLabel)}</h3>
				</div>
				<div class="px-6 py-5">
					<p class="font-body-md text-body-md text-on-surface-variant">${escapeHtml(ui.common.confirmDelete)}</p>
					<p class="font-body-md text-body-md text-on-surface font-semibold mt-2">${escapeHtml(spec.displayName(row))}</p>
				</div>
				<div class="px-6 py-4 border-t border-surface-variant flex justify-end gap-3">
					<button data-close class="rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-button text-button px-6 py-3 min-h-[48px] hover:border-deep-navy transition-colors">${escapeHtml(ui.common.cancel)}</button>
					<button class="rounded-lg bg-error text-on-error font-button text-button px-6 py-3 min-h-[48px] hover:opacity-90 transition-opacity" data-confirm-delete>${escapeHtml(ui.common.delete)}</button>
				</div>
			</div>`;
		document.body.appendChild(modal);
		modal.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", () => modal.remove()));
		modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
		modal.querySelector("[data-confirm-delete]")?.addEventListener("click", () => {
			removeFleetItem(collection, row.id, `${ui.common.delete} ${ui.entityLabel.toLowerCase()}: ${spec.displayName(row)}`);
			toast(`${ui.common.deleted}: ${spec.displayName(row)}`, "success");
			modal.remove();
			render();
		});
	}

	function openModal(row: Row | null) {
		editing = row;
		open = true;
		const title = (row ? ui.common.editEntity : ui.common.newEntity).replace("{entity}", ui.entityLabel);
		const nextIdHint = !row && isNumeric ? `Siguiente ID: ${nextId(entity)}` : !row && entity === "routes" ? "El código de ruta será el identificador" : "";
		const valueFor = (fieldKey: string, field: { key: string; type: string }) => {
			if (!row) return "";
			if (fieldKey === "routesText") return (row.routes as string[] | undefined)?.join(", ") ?? "";
			if (fieldKey === "routeId") return String(row.routeId ?? "");
			if (fieldKey === "driverId") return String(row.driverId ?? "");
			if (fieldKey === "busNumber") return String(row.busNumber ?? "");
			if (fieldKey === "color") return String(row.color ?? "");
			return String(row[fieldKey] ?? "");
		};

		const modal = document.createElement("div");
		modal.className = "fixed inset-0 z-[65] flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm px-margin-mobile";
		modal.innerHTML = `
			<div class="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-ambient-lg flex flex-col max-h-[92vh]">
				<div class="flex items-center justify-between gap-4 px-6 py-5 border-b border-surface-variant">
					<div>
						<h3 class="font-headline-md text-headline-md font-bold text-deep-navy">${escapeHtml(title)}</h3>
						${nextIdHint ? `<p class="font-label-md text-label-md text-coastal-teal mt-1">${escapeHtml(nextIdHint)}</p>` : ""}
					</div>
					<button data-close class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
				</div>
				<form data-form class="overflow-y-auto px-6 py-5 flex flex-col gap-4">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						${spec.fields
							.map((field) => {
								const label = fieldLabel(field, ui);
								const value = escapeHtml(valueFor(field.key, field));
								const options = field.options?.() ?? [];
								const labelFor = (opt: string) => {
									if (field.key === "status") return ui.states[opt] ?? opt;
									if (field.key === "driverId") return driversList().find((d) => String(d.id) === opt)?.name ?? opt;
									if (field.key === "routeId") return routesList().find((r) => r.id === opt)?.code ?? opt;
									return opt;
								};
								let control = "";
								if (field.type === "select") {
									control = `<select name="${field.key}" class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md text-body-md outline-none focus:border-coastal-teal">
										<option value="">—</option>
										${options.map((opt) => `<option value="${escapeHtml(opt)}" ${value === opt ? "selected" : ""}>${escapeHtml(field.key === "color" ? opt : labelFor(opt))}</option>`).join("")}
									</select>`;
								} else {
									control = `<input name="${field.key}" type="${field.type}" value="${value}" ${field.required ? "required" : ""} class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md text-body-md outline-none focus:border-coastal-teal" />`;
								}
								const optionBadge =
									field.key === "color"
										? `<span class="mt-1.5 flex gap-1.5">${ROUTE_COLORS.map((c) => `<span class="w-5 h-5 rounded-full border border-surface-variant cursor-pointer" style="background:${c}" data-color-pick="${c}"></span>`).join("")}</span>`
										: "";
								return `<div class="flex flex-col gap-1 ${field.type === "select" && (field.key === "routeId" || field.key === "driverId" || field.key === "busNumber") ? "sm:col-span-2" : ""}">
									<label class="font-label-md text-label-md text-on-surface">${escapeHtml(label)}${field.required ? ' <span class="text-energetic-orange">*</span>' : ""}</label>
									${control}${optionBadge}
								</div>`;
							})
							.join("")}
					</div>
					<div class="flex justify-end gap-3 pt-2">
						<button type="button" data-close class="rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-button text-button px-6 py-3 min-h-[48px] hover:border-deep-navy transition-colors">${escapeHtml(ui.common.cancel)}</button>
						<button type="submit" class="rounded-lg bg-deep-navy text-on-primary font-button text-button px-8 py-3 min-h-[48px] hover:opacity-90 transition-opacity inline-flex items-center gap-2">
							<span class="material-symbols-outlined text-[20px]">save</span>${escapeHtml(ui.common.save)}
						</button>
					</div>
				</form>
			</div>`;
		document.body.appendChild(modal);

		modal.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", () => modal.remove()));
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.remove();
		});
		modal.querySelectorAll<HTMLElement>("[data-color-pick]").forEach((dot) => {
			dot.addEventListener("click", () => {
				const select = modal.querySelector<HTMLSelectElement>('select[name="color"]');
				if (select) select.value = dot.dataset.colorPick ?? "";
			});
		});
		modal.querySelector<HTMLFormElement>("[data-form]")?.addEventListener("submit", (e) => {
			e.preventDefault();
			save(modal);
		});
		(modal.querySelector("input, select") as HTMLElement | null)?.focus();
	}

	function save(modal: HTMLElement) {
		const form = modal.querySelector<HTMLFormElement>("[data-form]");
		if (!form) return;
		const data = new FormData(form);
		const value = (key: string) => String(data.get(key) ?? "").trim();

		const payload: Partial<Row> = {};
		for (const field of spec.fields) {
			if (field.key === "routesText") {
				payload.routes = (value("routesText") || "")
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
				continue;
			}
			let val: string | number | boolean = value(field.key);
			if (field.type === "number") val = Number(val) || 0;
			// Empty selects fall back to the entity defaults.
			if (val === "" || val === "—") continue;
			payload[field.key] = val;
		}

		const display = editing ? spec.displayName(editing) : String(payload[spec.searchKeys[0]] ?? ui.entityLabel);

		if (entity === "routes") {
			const full = { ...(editing ?? ({} as Row)), ...payload, id: editing ? editing.id : (payload.code as string) };
			if (!full.path || !Array.isArray(full.path) || full.path.length === 0) full.path = [[41.12, 1.24], [41.15, 1.1]];
			if (editing) {
				updateFleetRoute(full as never, `${ui.common.edit} ${ui.entityLabel.toLowerCase()}: ${spec.displayName(full as Row)}`);
			} else {
				addFleetRoute(full as never, `${ui.common.add} ${ui.entityLabel.toLowerCase()}: ${spec.displayName(full as Row)}`);
			}
		} else if (editing) {
			updateFleetItem(collection, Number(editing.id), payload, `${ui.common.edit} ${ui.entityLabel.toLowerCase()}: ${display}`);
		} else {
			const full = { ...spec.defaults(ui), ...payload } as Omit<Row, "id">;
			addFleetItem(collection, full as never, `${ui.common.add} ${ui.entityLabel.toLowerCase()}: ${display}`);
		}

		toast(editing ? ui.common.updated : ui.common.created, "success");
		modal.remove();
		editing = null;
		render();
	}

	render();
}
