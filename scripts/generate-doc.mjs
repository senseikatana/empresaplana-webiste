import {
	AlignmentType,
	BorderStyle,
	Document,
	Footer,
	HeadingLevel,
	NumberFormat,
	PageNumber,
	Packer,
	Paragraph,
	SectionType,
	ShadingType,
	Table,
	TableCell,
	TableLayoutType,
	TableOfContents,
	TableRow,
	TextRun,
	WidthType,
} from "docx";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

// ── Palette DS-1 (Deep Sea) ──────────────────────────────────────────────
const P = {
	bg: "0B1C2C",
	accent: "529286",
	cover: {
		titleColor: "FFFFFF",
		subtitleColor: "B0B8C0",
		metaColor: "90989F",
		footerColor: "687078",
	},
	table: {
		headerBg: "529286",
		headerText: "FFFFFF",
		accentLine: "529286",
		innerLine: "BECFCC",
		surface: "E8ECEB",
	},
	heading: "0B1C2C",
	body: "1A1C1E",
};

// ── Cover helpers (R1) ───────────────────────────────────────────────────
function splitTitleLines(title, charsPerLine) {
	if (title.length <= charsPerLine) return [title];
	const breakAfter = new Set([" ", "-", "·", "/", ",", ".", ":", "("]);
	const lines = [];
	let remaining = title;
	while (remaining.length > charsPerLine) {
		let breakAt = -1;
		for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
			if (i < remaining.length && breakAfter.has(remaining[i - 1])) {
				breakAt = i;
				break;
			}
		}
		if (breakAt === -1) breakAt = charsPerLine;
		lines.push(remaining.slice(0, breakAt).trim());
		remaining = remaining.slice(breakAt).trim();
	}
	if (remaining) lines.push(remaining);
	if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
		const last = lines.pop();
		lines[lines.length - 1] += last;
	}
	return lines;
}

function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
	const charsPerLine = (pt) => Math.floor(maxWidthTwips / (pt * 12)); // Latin ≈ 0.6em
	let titlePt = preferredPt;
	let lines;
	while (titlePt >= minPt) {
		const cpl = charsPerLine(titlePt);
		if (cpl < 2) {
			titlePt -= 2;
			continue;
		}
		lines = splitTitleLines(title, cpl);
		if (lines.length <= 3) break;
		titlePt -= 2;
	}
	if (!lines || lines.length > 3) {
		lines = splitTitleLines(title, charsPerLine(minPt));
		titlePt = minPt;
	}
	return { titlePt, titleLines: lines };
}

function calcCoverSpacing(params) {
	const {
		titleLineCount = 1,
		titlePt = 36,
		hasSubtitle = false,
		hasEnglishLabel = false,
		metaLineCount = 0,
		fixedHeight = 400,
		pageHeight = 16838,
	} = params;
	const SAFETY = 1200;
	const usableHeight = pageHeight - SAFETY;
	const titleHeight = titleLineCount * (titlePt * 23 + 200);
	const subtitleHeight = hasSubtitle ? 12 * 23 + 600 : 0;
	const englishLabelHeight = hasEnglishLabel ? 9 * 23 + 600 : 0;
	const metaHeight = metaLineCount * (10 * 23 + 100);
	const implicitParaHeight = 3 * 300;
	const contentHeight =
		titleHeight + subtitleHeight + englishLabelHeight + metaHeight + fixedHeight + implicitParaHeight;
	const remainingSpace = usableHeight - contentHeight;
	const safeRemaining = Math.max(remainingSpace, 400);
	const FOOTER_MIN = 800;
	const rawTop = Math.floor(safeRemaining * 0.45);
	const rawBottom = Math.floor(safeRemaining * 0.45);
	const bottomSpacing = Math.max(rawBottom, FOOTER_MIN);
	const topSpacing = Math.max(rawTop - Math.max(0, FOOTER_MIN - rawBottom), 400);
	const midSpacing = Math.max(safeRemaining - topSpacing - bottomSpacing, 0);
	return { topSpacing, midSpacing, bottomSpacing };
}

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = {
	top: NB,
	bottom: NB,
	left: NB,
	right: NB,
	insideHorizontal: NB,
	insideVertical: NB,
};

function buildCoverR1(config) {
	const padL = 1200;
	const padR = 800;
	const availableWidth = 11906 - padL - padR - 300;
	const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 40, 24);
	const titleSize = titlePt * 2;
	const spacing = calcCoverSpacing({
		titleLineCount: titleLines.length,
		titlePt,
		hasSubtitle: !!config.subtitle,
		hasEnglishLabel: !!config.englishLabel,
		metaLineCount: (config.metaLines || []).length,
		fixedHeight: 400,
	});
	const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: P.accent, space: 12 };
	const children = [];
	children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));
	if (config.englishLabel) {
		children.push(
			new Paragraph({
				indent: { left: padL, right: padR },
				spacing: { after: 500 },
				border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: P.accent, space: 8 } },
				children: [
					new TextRun({
						text: config.englishLabel.split("").join("  "),
						size: 18,
						color: P.accent,
						font: "Calibri",
						characterSpacing: 40,
					}),
				],
			}),
		);
	}
	for (let i = 0; i < titleLines.length; i++) {
		children.push(
			new Paragraph({
				indent: { left: padL },
				spacing: {
					after: i < titleLines.length - 1 ? 100 : 300,
					line: Math.ceil(titlePt * 23),
					lineRule: "atLeast",
				},
				children: [
					new TextRun({
						text: titleLines[i],
						size: titleSize,
						bold: true,
						color: P.cover.titleColor,
						font: "Calibri",
					}),
				],
			}),
		);
	}
	if (config.subtitle) {
		children.push(
			new Paragraph({
				indent: { left: padL },
				spacing: { after: 800 },
				children: [
					new TextRun({ text: config.subtitle, size: 24, color: P.cover.subtitleColor, font: "Calibri" }),
				],
			}),
		);
	}
	for (const line of config.metaLines || []) {
		children.push(
			new Paragraph({
				indent: { left: padL + 200 },
				spacing: { after: 80 },
				border: { left: accentLeft },
				children: [new TextRun({ text: line, size: 24, color: P.cover.metaColor, font: "Calibri" })],
			}),
		);
	}
	children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));
	children.push(
		new Paragraph({
			indent: { left: padL, right: padR },
			border: { top: { style: BorderStyle.SINGLE, size: 2, color: P.accent, space: 8 } },
			spacing: { before: 200 },
			children: [
				new TextRun({ text: config.footerLeft || "", size: 16, color: P.cover.footerColor, font: "Calibri" }),
				new TextRun({ text: "                                        " }),
				new TextRun({ text: config.footerRight || "", size: 16, color: P.cover.footerColor, font: "Calibri" }),
			],
		}),
	);
	return [
		new Table({
			width: { size: 100, type: WidthType.PERCENTAGE },
			layout: TableLayoutType.FIXED,
			borders: allNoBorders,
			rows: [
				new TableRow({
					height: { value: 16838, rule: "exact" },
					children: [
						new TableCell({
							shading: { type: ShadingType.CLEAR, fill: P.bg },
							borders: noBorders,
							children,
						}),
					],
				}),
			],
		}),
	];
}

// ── Body builders ────────────────────────────────────────────────────────
function h1(text) {
	return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text })] });
}
function h2(text) {
	return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text })] });
}
function h3(text) {
	return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text })] });
}
function p(text) {
	return new Paragraph({
		alignment: AlignmentType.JUSTIFIED,
		spacing: { line: 312, after: 120 },
		children: [new TextRun({ text })],
	});
}
function lead(text) {
	return new Paragraph({
		alignment: AlignmentType.JUSTIFIED,
		spacing: { line: 312, after: 160 },
		children: [new TextRun({ text, italics: true, color: "4A5A6A" })],
	});
}

function dataTable(header, rows) {
	const headerRow = new TableRow({
		tableHeader: true,
		cantSplit: true,
		children: header.map(
			(text) =>
				new TableCell({
					shading: { type: ShadingType.CLEAR, fill: P.table.headerBg },
					margins: { top: 60, bottom: 60, left: 120, right: 120 },
					children: [
						new Paragraph({
							children: [new TextRun({ text, bold: true, color: P.table.headerText, size: 21 })],
						}),
					],
				}),
		),
	});
	const bodyRows = rows.map(
		(cells) =>
			new TableRow({
				cantSplit: true,
				children: cells.map(
					(text) =>
						new TableCell({
							margins: { top: 60, bottom: 60, left: 120, right: 120 },
							children: [new Paragraph({ children: [new TextRun({ text, size: 21 })] })],
						}),
				),
			}),
	);
	return new Table({
		width: { size: 100, type: WidthType.PERCENTAGE },
		borders: {
			top: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
			bottom: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
			left: { style: BorderStyle.NONE },
			right: { style: BorderStyle.NONE },
			insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
			insideVertical: { style: BorderStyle.NONE },
		},
		rows: [headerRow, ...bodyRows],
	});
}

// ── Content data ─────────────────────────────────────────────────────────
const towns = JSON.parse(readFileSync(`${ROOT}src/data/stops.json`, "utf8")).stops;

const pages = [
	{ file: "empresaplana.cat_.md", url: "https://empresaplana.cat/", lang: "ES", desc: "Inicio" },
	{ file: "www.empresaplana.cat_ca.md", url: "https://www.empresaplana.cat/ca", lang: "CA", desc: "Inicio" },
	{ file: "www.empresaplana.cat_en.md", url: "https://www.empresaplana.cat/en", lang: "EN", desc: "Inicio" },
	{ file: "www.empresaplana.cat_ca_cercador-de-linies.md", url: "https://www.empresaplana.cat/ca/cercador-de-linies", lang: "CA", desc: "Buscador de líneas" },
	{ file: "www.empresaplana.cat_ca_empresa-plana.md", url: "https://www.empresaplana.cat/ca/empresa-plana", lang: "CA", desc: "Empresa (sobre nosotros)" },
	{ file: "www.empresaplana.cat_ca_presupuesto.md", url: "https://www.empresaplana.cat/ca/presupuesto", lang: "CA", desc: "Formulario de presupuesto" },
	{ file: "www.empresaplana.cat_en_presupuesto.md", url: "https://www.empresaplana.cat/en/presupuesto", lang: "EN", desc: "Formulario de presupuesto" },
	{ file: "www.empresaplana.cat_ca_serveis-discrecionals_2_serveis-a-empreses-i-fabriques.md", url: "https://www.empresaplana.cat/ca/serveis-discrecionals/2/serveis-a-empreses-i-fabriques", lang: "CA", desc: "Servicio: empresas y fábricas" },
	{ file: "www.empresaplana.cat_servicios-discrecionales_5_viajes-fin-de-curso.md", url: "https://www.empresaplana.cat/servicios-discrecionales/5/viajes-fin-de-curso", lang: "ES", desc: "Servicio: viajes fin de curso" },
	{ file: "www.empresaplana.cat_servicios-discrecionales_9_comidas-y-celebraciones.md", url: "https://www.empresaplana.cat/servicios-discrecionales/9/comidas-y-celebraciones", lang: "ES", desc: "Servicio: bodas y celebraciones" },
];

const popularLines = [
	["Barcelona - Aeropuerto", "Barcelona", "Tarragona - La Pineda - Salou - Cambrils"],
	["Tarragona - Barcelona", "Tarragona", "Barcelona"],
	["Tarragona - La Pineda - Salou - Cambrils", "Tarragona", "Cambrils"],
	["L68 Vilanova i la Geltrú - Vilafranca del Penedés", "Vilanova i la Geltrú", "Vilafranca del Penedés"],
	["Tarragona - Estació del Camp", "Tarragona", "Estació del Camp"],
	["L'Ametlla de Mar - El Perelló - L'Ampolla - Camarles - L'Aldea - Tortosa", "L'Ametlla de Mar", "Tortosa"],
	["e5 Reus - Salou", "Reus", "Salou"],
	["Tarragona - Vila-seca - Salou", "Tarragona", "Salou"],
];

const formFields = [
	["Nombre", "Sí", "Texto"],
	["E-mail", "Sí", "Texto"],
	["Teléfono", "Sí", "Texto"],
	["Empresa", "No", "Texto"],
	["Motivo", "Sí", "Desplegable (5 opciones)"],
	["Descripción del servicio", "Sí", "Texto largo"],
	["Ciudad de salida", "No", "Texto"],
	["Día de salida", "No", "Fecha"],
	["Hora de salida", "No", "Hora"],
	["Ciudad de llegada", "No", "Texto"],
	["Día de llegada", "No", "Fecha"],
	["Hora de llegada", "No", "Hora"],
	["Número de personas", "No", "Número"],
];

// ── Assemble document ────────────────────────────────────────────────────
const coverConfig = {
	title: "Documentación del Sitio Web",
	englishLabel: "EMPRESA PLANA · WEBSITE CONTENT",
	subtitle: "Extracción de contenidos del sitio web antiguo (empresaplana.cat)",
	metaLines: [
		"Fecha de extracción: 3 de septiembre de 2026",
		"Fuente: scrape con Firecrawl",
		"Idiomas disponibles: Español · Catalán · Inglés",
	],
	footerLeft: "Empresa Plana",
	footerRight: "2026",
};

const bodyChildren = [
	h1("1. Resumen ejecutivo"),
	lead(
		"Este documento recoge y estructura el contenido del sitio web antiguo de Empresa Plana, extraído mediante Firecrawl a partir de diez páginas en español, catalán e inglés. Sirve como inventario de referencia para la redacción del nuevo sitio.",
	),
	p(
		"Empresa Plana es una empresa de transporte público de viajeros por carretera con más de 60 años de trayectoria. Opera desde sus bases de Tarragona, Reus, Calafell y Vilanova i la Geltrú, y cubre las modalidades de línea regular (urbana e interurbana), transporte escolar, transporte de empresa y servicio discrecional.",
	),
	p(
		"Las páginas scrapeadas documentan la página de inicio, la sección de empresa, el buscador de líneas, el formulario de presupuesto y tres páginas de servicios discrecionales. Cada página conserva el mismo pie común: enlaces a redes sociales, entidades de financiación y el aviso de cookies.",
	),

	h1("2. Inventario de páginas"),
	p("La extracción consta de diez archivos Markdown, uno por página scrapeada."),
	dataTable(
		["Archivo", "URL", "Idioma", "Contenido"],
		pages.map((pg) => [pg.file, pg.url, pg.lang, pg.desc]),
	),

	h1("3. Página de inicio"),
	p(
		"La portada está disponible en tres idiomas (ES, CA y EN) y se organiza en los siguientes bloques: encabezado con llamada a los servicios discrecionales, buscador de líneas, líneas más buscadas, alquiler de autocares, aviso de patinetes eléctricos, transfers y excursiones, y los cuatro valores de la empresa.",
	),
	h2("3.1. Servicios discrecionales (encabezado)"),
	p(
		"«Desplazamientos en autobús a medida para empresas, organizaciones y particulares», con enlace a la sección de servicios discrecionales.",
	),
	h2("3.2. Buscador de líneas"),
	p(
		"Formulario con localidad de origen y de destino (una lista de más de 130 municipios), fecha, franja horaria y tipo de búsqueda (rutas directas o con transbordos). Las franjas horarias disponibles son: cualquier hora, 00:00–07:00, 07:00–10:00, 10:00–12:00, 12:00–16:00, 16:00–18:00, 18:00–20:00 y 20:00–23:59.",
	),
	h2("3.3. Líneas más buscadas"),
	p("La portada muestra ocho líneas destacadas con su origen, destino y enlace de descarga del horario en PDF."),
	dataTable(["Línea", "Origen", "Destino"], popularLines),
	h2("3.4. Alquiler de autocares"),
	p(
		"Empresa Plana ofrece la contratación de autobuses privados para eventos, excursiones o cualquier tipo de desplazamiento, destacando más de 60 años de experiencia y una amplia gama de autobuses adaptables a cada necesidad.",
	),
	h2("3.5. Aviso de patinetes eléctricos"),
	p(
		"Desde el 1 de febrero de 2023, y siguiendo las instrucciones de la Autoridad Territorial de Movilidad, está prohibido acceder o viajar en transporte público con patinetes eléctricos y otros vehículos de movilidad personal, ni siquiera plegados. El incumplimiento conlleva una sanción de 200 €.",
	),
	h2("3.6. Transfers y excursiones"),
	p(
		"Se ofrece la reserva en línea de transfers a los aeropuertos de Barcelona y Reus, así como de excursiones desde la Costa Daurada, a través de Busplana.com.",
	),
	h2("3.7. Valores de la empresa"),
	p(
		"Cuatro rasgos diferenciadores: rutas y horarios adaptados, accesibilidad para movilidades reducidas, flota moderna en constante renovación y servicios personalizados.",
	),

	h1("4. Empresa (sobre nosotros)"),
	p(
		"La página corporativa resume la política de calidad, medio ambiente, seguridad y salud en el trabajo, y seguridad vial, conforme a las normas ISO 9001, ISO 14001, UNE-EN 13816, ISO 45001 e ISO 39001.",
	),
	p(
		"Empresa Plana, S.L. ha sido beneficiaria de subvenciones para la transformación de flotas en el marco del Plan de Recuperación, Transformación y Resiliencia, financiado por la Unión Europea (NextGenerationEU).",
	),
	h2("4.1. Ámbito de operación"),
	p(
		"Opera en las principales ciudades del Camp de Tarragona y en los destinos turísticos de la Costa Daurada, conectando en autobús con los aeropuertos de Barcelona y Reus. Cuenta con delegaciones en Tarragona (garaje), Costa Daurada (c/ Colom) y Garraf–Vilanova.",
	),
	h2("4.2. Trabaja con nosotros"),
	p(
		"La empresa busca de forma constante conductores, mecánicos y otros perfiles profesionales, e invita a enviar el currículum a través de su formulario de empleo.",
	),

	h1("5. Buscador de líneas"),
	p(
		"Página específica de consulta de líneas regulares con campos de origen, destino, pasajeros, franja horaria, sentido (ida o ida y vuelta) y tipo de viaje. Incluye un enlace para quienes buscan un transfer al aeropuerto.",
	),

	h1("6. Formulario de presupuesto"),
	p(
		"El formulario de solicitud de presupuesto (disponible en catalán e inglés) consta de dos bloques: datos de contacto y descripción del servicio. Al enviarlo, se muestra el mensaje «Mensaje enviado correctamente. Gracias».",
	),
	dataTable(["Campo", "Obligatorio", "Tipo"], formFields),
	p(
		"El campo «Motivo» ofrece cinco opciones: viaje de fin de curso, desplazamientos deportivos, celebraciones familiares, convenciones y reuniones de trabajo. El formulario incluye consentimiento de política de privacidad y verificación reCAPTCHA.",
	),

	h1("7. Servicios discrecionales"),
	p(
		"Cada servicio comparte una introducción común («Despreocúpese del transporte») sobre transfers a aeropuertos, excursiones y conexiones con la Costa Daurada, y cierra con un formulario de presupuesto y los teléfonos de contacto.",
	),
	h2("7.1. Servicios a empresas y fábricas"),
	p(
		"Autobuses para el traslado regular de trabajadores hacia instalaciones, oficinas y fábricas, con rutas adaptadas a turnos y horarios, y servicios discrecionales puntuales para acompañar clientes en eventos. La empresa destaca el valor añadido, la puntualidad y la sostenibilidad del transporte colectivo.",
	),
	h2("7.2. Viajes de fin de curso"),
	p(
		"Viajes nacionales e internacionales en autocar para disfrutar de un viaje de fin de curso inolvidable. Autocares con sistemas de reproducción audiovisual, amplios maleteros y WC a bordo; para trayectos largos se habilitan varios conductores. Destinos por España, Portugal, Francia y otros países de Europa.",
	),
	h2("7.3. Bodas y celebraciones"),
	p(
		"Traslados en grupo en autocar con conductor para bodas y celebraciones, con rutas a medida desde uno o varios puntos de origen hasta el restaurante, sala de eventos, hotel o palacio de congresos. Adecuado para empresas, instituciones, celebraciones familiares y asociaciones.",
	),

	h1("8. Contacto y redes sociales"),
	h2("8.1. Teléfonos"),
	dataTable(
		["Teléfono", "Área"],
		[
			["+34 977 54 04 93", "Presupuestos – Área Tarragona"],
			["+34 663 854 611", "Presupuestos – Área Barcelona y Garraf"],
			["+34 977 55 36 80", "Atención general / contacto"],
		],
	),
	h2("8.2. Redes sociales"),
	dataTable(
		["Red", "URL"],
		[
			["Facebook", "https://www.facebook.com/BusPlana"],
			["Twitter / X", "https://twitter.com/BusPlanaOficial"],
			["YouTube", "https://www.youtube.com/user/busplana"],
			["Instagram", "https://www.instagram.com/busplana/"],
			["WhatsApp", "https://wa.me/34620201632"],
		],
	),
	h2("8.3. Enlaces de interés"),
	dataTable(
		["Entidad", "URL"],
		[
			["BusPlana (transfers y excursiones)", "https://www.busplana.com"],
			["Catalunya Convention Bureau", "https://www.catalunya.com/es/catalunya-convention-bureau-ccb"],
			["Costa Daurada Convention Bureau", "https://costadaurada.info/es/convention-bureau"],
		],
	),

	h1("9. Anexo: localidades servidas"),
	p(
		`La lista de localidades del buscador de líneas incluye ${towns.length} municipios y paradas. A continuación se enumeran alfabéticamente:`,
	),
];

// Anexo: localidades en tabla de 3 columnas
const COLS = 3;
const townRows = [];
for (let i = 0; i < towns.length; i += COLS) {
	townRows.push([towns[i] ?? "", towns[i + 1] ?? "", towns[i + 2] ?? ""]);
}
bodyChildren.push(
	dataTable(["Localidad", "Localidad", "Localidad"], townRows),
);

// ── Document ─────────────────────────────────────────────────────────────
const doc = new Document({
	styles: {
		default: {
			document: {
				run: { font: "Calibri", size: 24, color: P.body },
				paragraph: { spacing: { line: 312 } },
			},
			heading1: {
				run: { font: "Calibri", size: 32, bold: true, color: P.heading },
				paragraph: { spacing: { before: 360, after: 160 } },
			},
			heading2: {
				run: { font: "Calibri", size: 28, bold: true, color: P.heading },
				paragraph: { spacing: { before: 280, after: 120 } },
			},
			heading3: {
				run: { font: "Calibri", size: 26, bold: true, color: P.heading },
				paragraph: { spacing: { before: 240, after: 120 } },
			},
		},
	},
	sections: [
		{
			properties: {
				page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
			},
			children: buildCoverR1(coverConfig),
		},
		{
			properties: {
				type: SectionType.NEXT_PAGE,
				page: {
					size: { width: 11906, height: 16838 },
					margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
					pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
				},
			},
			footers: {
				default: new Footer({
					children: [
						new Paragraph({
							alignment: AlignmentType.CENTER,
							children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080" })],
						}),
					],
				}),
			},
			children: [
				new Paragraph({
					spacing: { after: 200 },
					children: [new TextRun({ text: "Índice", size: 32, bold: true, color: P.heading })],
				}),
				new TableOfContents("Índice", { hyperlink: true, headingStyleRange: "1-2" }),
				new Paragraph({
					spacing: { before: 120, after: 0 },
					children: [
						new TextRun({
							text: "Consejo: haga clic derecho sobre el índice y seleccione «Actualizar campos» para refrescar los números de página.",
							italics: true,
							size: 18,
							color: "808080",
						}),
					],
				}),
				new Paragraph({ children: [new TextRun({ text: "", break: 1 })], pageBreakBefore: true }),
				...bodyChildren,
			],
		},
	],
});

mkdirSync(`${ROOT}docs`, { recursive: true });
const out = `${ROOT}docs/empresa-plana-contenido-web.docx`;
Packer.toBuffer(doc).then((buf) => {
	writeFileSync(out, buf);
	console.log(`Generado: ${out}`);
});
