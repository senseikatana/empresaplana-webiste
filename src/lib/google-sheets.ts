/**
 * Google Sheets bidirectional sync for Empresa Plana dashboard.
 *
 * Uses Google Sheets API v4 with a service account to push/pull fleet data.
 * Set GOOGLE_SHEETS_CREDENTIALS (JSON) and GOOGLE_SHEETS_SPREADSHEET_ID in .env.
 *
 * Falls back gracefully when credentials are not configured.
 */
import { google, type sheets_v4 } from "googleapis";

interface SheetsConfig {
	credentials: string | undefined;
	spreadsheetId: string | undefined;
}

function getConfig(): SheetsConfig {
	return {
		credentials: process.env.GOOGLE_SHEETS_CREDENTIALS,
		spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
	};
}

function isConfigured(): boolean {
	const { credentials, spreadsheetId } = getConfig();
	return Boolean(credentials && spreadsheetId);
}

function getSheetsClient(): sheets_v4.Sheets {
	const { credentials } = getConfig();
	if (!credentials) throw new Error("GOOGLE_SHEETS_CREDENTIALS not set");

	const keyFile = JSON.parse(credentials);
	const auth = new google.auth.GoogleAuth({
		credentials: keyFile,
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});
	return google.sheets({ version: "v4", auth });
}

/**
 * Push fleet data to Google Sheets.
 * Creates/updates one sheet tab per entity: Rutas, Autobuses, Paradas, Horarios, Conductores.
 */
export async function pushFleetToSheets(fleetData: {
	routes: Record<string, unknown>[];
	buses: Record<string, unknown>[];
	stops: Record<string, unknown>[];
	schedules: Record<string, unknown>[];
	drivers: Record<string, unknown>[];
}): Promise<{ success: boolean; message: string }> {
	if (!isConfigured()) {
		return { success: false, message: "Google Sheets no configurado. Añade GOOGLE_SHEETS_CREDENTIALS y GOOGLE_SHEETS_SPREADSHEET_ID en .env" };
	}

	const sheets = getSheetsClient();
	const { spreadsheetId } = getConfig();

	try {
		const tabs = [
			{ name: "Rutas", data: fleetData.routes },
			{ name: "Autobuses", data: fleetData.buses },
			{ name: "Paradas", data: fleetData.stops },
			{ name: "Horarios", data: fleetData.schedules },
			{ name: "Conductores", data: fleetData.drivers },
		];

		for (const tab of tabs) {
			await updateSheetTab(sheets, spreadsheetId!, tab.name, tab.data);
		}

		return { success: true, message: `Sincronizado: ${tabs.map((t) => `${t.name} (${t.data.length})`).join(", ")}` };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Error desconocido";
		return { success: false, message: `Error al sincronizar: ${message}` };
	}
}

async function updateSheetTab(
	sheets: sheets_v4.Sheets,
	spreadsheetId: string,
	tabName: string,
	data: Record<string, unknown>[],
): Promise<void> {
	if (data.length === 0) return;

	const headers = Object.keys(data[0]);
	const rows = data.map((item) => headers.map((h) => {
		const val = item[h];
		if (typeof val === "object") return JSON.stringify(val);
		return String(val ?? "");
	}));

	// Clear existing content
	try {
		await sheets.spreadsheets.values.clear({
			spreadsheetId,
			range: `${tabName}!A:ZZ`,
		});
	} catch {
		// Tab might not exist — create it
		await sheets.spreadsheets.batchUpdate({
			spreadsheetId,
			requestBody: {
				requests: [{ addSheet: { properties: { title: tabName } } }],
			},
		});
	}

	// Write headers + data
	await sheets.spreadsheets.values.update({
		spreadsheetId,
		range: `${tabName}!A1`,
		valueInputOption: "RAW",
		requestBody: {
			values: [headers, ...rows],
		},
	});
}

/**
 * Pull data from a specific sheet tab.
 * Returns array of objects keyed by the header row.
 */
export async function pullFromSheet(
	tabName: string,
): Promise<{ success: boolean; data?: Record<string, unknown>[]; message: string }> {
	if (!isConfigured()) {
		return { success: false, message: "Google Sheets no configurado." };
	}

	const sheets = getSheetsClient();
	const { spreadsheetId } = getConfig();

	try {
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: spreadsheetId!,
			range: `${tabName}!A:ZZ`,
		});

		const values = response.data.values;
		if (!values || values.length < 2) {
			return { success: true, data: [], message: "Hoja vacía o sin datos." };
		}

		const headers = values[0] as string[];
		const data = values.slice(1).map((row) => {
			const item: Record<string, unknown> = {};
			headers.forEach((h, i) => {
				let val: unknown = row[i] ?? "";
				// Try to parse JSON values back
				if (typeof val === "string" && (val.startsWith("{") || val.startsWith("["))) {
					try { val = JSON.parse(val); } catch { /* keep as string */ }
				}
				item[h] = val;
			});
			return item;
		});

		return { success: true, data, message: `${data.length} filas leídas de "${tabName}".` };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Error desconocido";
		return { success: false, message: `Error al leer "${tabName}": ${message}` };
	}
}

/**
 * Check if Google Sheets is configured and accessible.
 */
export async function testSheetsConnection(): Promise<{ success: boolean; message: string }> {
	if (!isConfigured()) {
		return { success: false, message: "Credenciales no configuradas. Añade GOOGLE_SHEETS_CREDENTIALS y GOOGLE_SHEETS_SPREADSHEET_ID en .env" };
	}

	try {
		const sheets = getSheetsClient();
		const { spreadsheetId } = getConfig();
		const response = await sheets.spreadsheets.get({ spreadsheetId: spreadsheetId! });
		const title = response.data.properties?.title ?? "Sin título";
		const tabCount = response.data.sheets?.length ?? 0;
		return { success: true, message: `Conectado: "${title}" (${tabCount} pestañas)` };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Error desconocido";
		return { success: false, message: `Error de conexión: ${message}` };
	}
}
