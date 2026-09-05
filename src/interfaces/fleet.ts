/** Fleet-management entities for the /app/gestion area (admin/bosses). */

export type FleetStatus = "active" | "inactive" | "delayed" | "maintenance";

export type LatLng = [number, number];

export interface FleetRoute {
	id: string;
	code: string;
	name: string;
	origin: string;
	destination: string;
	driverId?: string;
	color: string;
	status: "active" | "delayed" | "inactive";
	path: LatLng[];
}

export interface BusGps {
	lat: number;
	lng: number;
	speed: number;
	battery: number;
	online: boolean;
}

export interface FleetBus {
	id: number;
	number: string;
	plate: string;
	company: string;
	capacity: number;
	routeId: string;
	status: "active" | "maintenance" | "inactive";
	gps: BusGps;
}

export interface FleetStop {
	id: number;
	name: string;
	address: string;
	lat: number;
	lng: number;
	routes: string[];
}

export interface FleetSchedule {
	id: number;
	routeId: string;
	departure: string;
	arrival: string;
	frequency: string;
	days: string;
	status: "active" | "inactive";
}

export interface FleetDriver {
	id: number;
	name: string;
	phone: string;
	license: string;
	busNumber?: string;
	status: "active" | "inactive";
}

export type FleetNotifType = "delay" | "accident" | "detour" | "info";

export interface FleetNotification {
	id: number;
	type: FleetNotifType;
	title: string;
	desc: string;
	/** ISO timestamp of creation (demo copy shows a relative time). */
	createdAt: string;
	read: boolean;
	routeId?: string;
}

export interface FleetActivity {
	id: number;
	at: string;
	action: string;
	user: string;
}

/** Deterministic report figures per route id (demo dashboard charts). */
export interface FleetReportData {
	passengers: Record<string, number>;
	occupancy: Record<string, number>;
	weeklyPunctuality: number[];
	satisfaction: { name: string; value: number }[];
}

export interface FleetData {
	routes: FleetRoute[];
	buses: FleetBus[];
	stops: FleetStop[];
	schedules: FleetSchedule[];
	drivers: FleetDriver[];
	notifications: FleetNotification[];
	activity: FleetActivity[];
	reports: FleetReportData;
	config: {
		motisUrl: string;
		traccarUrl: string;
		traccarProtocol: string;
	};
}

export const FLEET_COLLECTIONS = [
	"routes",
	"buses",
	"stops",
	"schedules",
	"drivers",
	"notifications",
	"activity",
] as const;

export type FleetCollection = (typeof FLEET_COLLECTIONS)[number];
