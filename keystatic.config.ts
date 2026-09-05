import { config, fields, collection, singleton } from "@keystatic/core";

const ROUTE_COLORS = [
	{ label: "Deep Navy", value: "#013990" },
	{ label: "Coastal Teal", value: "#00696F" },
	{ label: "Teal Accent", value: "#13AEB8" },
	{ label: "Orange CTA", value: "#EB8E02" },
	{ label: "Cyan", value: "#0E7490" },
	{ label: "Purple", value: "#7C3AED" },
	{ label: "Burnt Orange", value: "#C2410C" },
	{ label: "Forest Green", value: "#4D7C0F" },
];

export default config({
	storage: { kind: "local" },
	ui: {
		brand: "Empresa Plana",
		navigation: {
			"Flota": ["routes", "buses", "stops", "schedules", "drivers"],
			"Operaciones": ["notifications"],
			"Configuración": ["users", "reports-data"],
		},
	},
	collections: {
		routes: collection({
			label: "Rutas",
			slugField: "code",
			path: "src/content/routes/*",
			format: { data: "json" },
			columns: ["code", "name", "origin", "destination", "status"],
			schema: {
				code: fields.slug({ name: { label: "Código" }, slug: { label: "Slug (ID)" } }),
				name: fields.text({ label: "Nombre", validation: { isRequired: true } }),
				origin: fields.text({ label: "Origen", validation: { isRequired: true } }),
				destination: fields.text({ label: "Destino", validation: { isRequired: true } }),
				color: fields.select({ label: "Color", options: ROUTE_COLORS, defaultValue: "#013990" }),
				status: fields.select({
					label: "Estado",
					options: [
						{ label: "Activa", value: "active" },
						{ label: "Con retraso", value: "delayed" },
						{ label: "Inactiva", value: "inactive" },
					],
					defaultValue: "active",
				}),
				path: fields.array(
					fields.object({
						lat: fields.number({ label: "Latitud", validation: { isRequired: true } }),
						lng: fields.number({ label: "Longitud", validation: { isRequired: true } }),
					}),
					{ label: "Trazado (coordenadas)", itemLabel: (item) => `${item.fields.lat.value ?? "?"}, ${item.fields.lng.value ?? "?"}` },
				),
				pdfUrl: fields.object({
					es: fields.url({ label: "PDF Español" }),
					ca: fields.url({ label: "PDF Catalán" }),
					en: fields.url({ label: "PDF Inglés" }),
				}),
			},
		}),
		buses: collection({
			label: "Autobuses",
			slugField: "number",
			path: "src/content/buses/*",
			format: { data: "json" },
			columns: ["number", "plate", "routeId", "capacity", "status"],
			schema: {
				number: fields.slug({ name: { label: "Número" }, slug: { label: "Slug (ID)" } }),
				plate: fields.text({ label: "Matrícula", validation: { isRequired: true } }),
				company: fields.text({ label: "Empresa", defaultValue: "Empresa Plana" }),
				capacity: fields.integer({ label: "Capacidad", defaultValue: 50, validation: { min: 1 } }),
				routeId: fields.relationship({ label: "Ruta", collection: "routes" }),
				status: fields.select({
					label: "Estado",
					options: [
						{ label: "Activo", value: "active" },
						{ label: "En taller", value: "maintenance" },
						{ label: "Inactivo", value: "inactive" },
					],
					defaultValue: "active",
				}),
			},
		}),
		stops: collection({
			label: "Paradas",
			slugField: "name",
			path: "src/content/stops/*",
			format: { data: "json" },
			columns: ["name", "address"],
			schema: {
				name: fields.slug({ name: { label: "Nombre" }, slug: { label: "Slug (ID)" } }),
				address: fields.text({ label: "Dirección" }),
				lat: fields.number({ label: "Latitud", validation: { isRequired: true } }),
				lng: fields.number({ label: "Longitud", validation: { isRequired: true } }),
				routes: fields.array(
					fields.relationship({ label: "Ruta", collection: "routes" }),
					{ label: "Rutas asociadas", itemLabel: (item) => item.value ?? "" },
				),
			},
		}),
		schedules: collection({
			label: "Horarios",
			slugField: "id",
			path: "src/content/schedules/*",
			format: { data: "json" },
			columns: ["routeId", "departure", "arrival", "frequency", "status"],
			schema: {
				id: fields.slug({ name: { label: "ID" }, slug: { label: "Slug" } }),
				routeId: fields.relationship({ label: "Ruta", collection: "routes" }),
				departure: fields.text({ label: "Salida (HH:MM)", validation: { isRequired: true, pattern: { regex: "^\\d{2}:\\d{2}$", message: "Formato HH:MM" } } }),
				arrival: fields.text({ label: "Llegada (HH:MM)", validation: { isRequired: true, pattern: { regex: "^\\d{2}:\\d{2}$", message: "Formato HH:MM" } } }),
				frequency: fields.text({ label: "Frecuencia", defaultValue: "60 min" }),
				days: fields.text({ label: "Días", defaultValue: "Lun–Dom" }),
				status: fields.select({
					label: "Estado",
					options: [
						{ label: "Activo", value: "active" },
						{ label: "Inactivo", value: "inactive" },
					],
					defaultValue: "active",
				}),
			},
		}),
		drivers: collection({
			label: "Conductores",
			slugField: "name",
			path: "src/content/drivers/*",
			format: { data: "json" },
			columns: ["name", "busNumber", "routeId", "status"],
			schema: {
				name: fields.slug({ name: { label: "Nombre" }, slug: { label: "Slug (ID)" } }),
				phone: fields.text({ label: "Teléfono" }),
				license: fields.text({ label: "Licencia" }),
				busNumber: fields.relationship({ label: "Autobús", collection: "buses" }),
				routeId: fields.relationship({ label: "Ruta", collection: "routes" }),
				shiftDays: fields.text({ label: "Días de turno", defaultValue: "Lun–Vie" }),
				shiftHours: fields.text({ label: "Horario de turno", defaultValue: "07:00–15:00" }),
				status: fields.select({
					label: "Estado",
					options: [
						{ label: "Activo", value: "active" },
						{ label: "Inactivo", value: "inactive" },
					],
					defaultValue: "active",
				}),
			},
		}),
		notifications: collection({
			label: "Notificaciones",
			slugField: "id",
			path: "src/content/notifications/*",
			format: { data: "json" },
			columns: ["type", "title", "createdAt"],
			schema: {
				id: fields.slug({ name: { label: "ID" }, slug: { label: "Slug" } }),
				type: fields.select({
					label: "Tipo",
					options: [
						{ label: "Retraso", value: "delay" },
						{ label: "Accidente", value: "accident" },
						{ label: "Desvío", value: "detour" },
						{ label: "Aviso", value: "info" },
					],
					defaultValue: "info",
				}),
				title: fields.text({ label: "Título", validation: { isRequired: true } }),
				desc: fields.text({ label: "Descripción", validation: { isRequired: true } }),
				createdAt: fields.datetime({ label: "Fecha de creación" }),
				read: fields.checkbox({ label: "Leída", defaultValue: false }),
				routeId: fields.relationship({ label: "Ruta afectada", collection: "routes" }),
			},
		}),
	},
	singletons: {
		users: singleton({
			label: "Usuarios",
			path: "src/content/users.json",
			format: { data: "json" },
			schema: {
				items: fields.array(
					fields.object({
						username: fields.text({ label: "Usuario", validation: { isRequired: true } }),
						passkey: fields.text({ label: "Contraseña", validation: { isRequired: true } }),
						name: fields.text({ label: "Nombre", validation: { isRequired: true } }),
						fullName: fields.text({ label: "Nombre completo", validation: { isRequired: true } }),
						email: fields.text({ label: "Email", validation: { isRequired: true } }),
						phone: fields.text({ label: "Teléfono" }),
						role: fields.select({
							label: "Rol",
							options: [
								{ label: "Cliente", value: "client" },
								{ label: "Trabajador", value: "worker" },
								{ label: "Administrador", value: "admin" },
							],
							defaultValue: "client",
						}),
						driverId: fields.integer({ label: "ID de conductor (solo trabajadores)" }),
					}),
					{ label: "Usuarios", itemLabel: (item) => `${item.fields.name.value ?? "?"} (${item.fields.role.value ?? "?"})` },
				),
			},
		}),
		"reports-data": singleton({
			label: "Datos de reportes",
			path: "src/content/reports-data.json",
			format: { data: "json" },
			schema: {
				passengers: fields.object({
					barcelonaAirport: fields.integer({ label: "BCN Aeropuerto", defaultValue: 2450 }),
					tarragonaBarcelona: fields.integer({ label: "TGN–BCN", defaultValue: 3200 }),
					costaDorada: fields.integer({ label: "Costa Dorada", defaultValue: 1800 }),
					penedes: fields.integer({ label: "Penedés", defaultValue: 950 }),
					estacioCamp: fields.integer({ label: "Estació del Camp", defaultValue: 420 }),
					ametllaTortosa: fields.integer({ label: "L'Ametlla–Tortosa", defaultValue: 620 }),
					reusSalou: fields.integer({ label: "Reus–Salou", defaultValue: 2100 }),
					tarragonaVilasecaSalou: fields.integer({ label: "TGN–Vila-seca–Salou", defaultValue: 1500 }),
				}),
				occupancy: fields.object({
					barcelonaAirport: fields.integer({ label: "BCN Aeropuerto (%)", defaultValue: 88 }),
					tarragonaBarcelona: fields.integer({ label: "TGN–BCN (%)", defaultValue: 92 }),
					costaDorada: fields.integer({ label: "Costa Dorada (%)", defaultValue: 76 }),
					penedes: fields.integer({ label: "Penedés (%)", defaultValue: 64 }),
					estacioCamp: fields.integer({ label: "Estació del Camp (%)", defaultValue: 55 }),
					ametllaTortosa: fields.integer({ label: "L'Ametlla–Tortosa (%)", defaultValue: 48 }),
					reusSalou: fields.integer({ label: "Reus–Salou (%)", defaultValue: 85 }),
					tarragonaVilasecaSalou: fields.integer({ label: "TGN–Vila-seca–Salou (%)", defaultValue: 71 }),
				}),
				weeklyPunctuality: fields.array(
					fields.number({ label: "%" }),
					{ label: "Puntualidad semanal (7 valores: Lun–Dom)", itemLabel: (item) => `${item.value ?? 0}%` },
				),
				satisfaction: fields.array(
					fields.object({
						name: fields.text({ label: "Métrica" }),
						value: fields.number({ label: "Valor (%)", validation: { min: 0, max: 100 } }),
					}),
					{ label: "Satisfacción", itemLabel: (item) => `${item.fields.name.value ?? "?"}: ${item.fields.value.value ?? 0}%` },
				),
			},
		}),
	},
});
