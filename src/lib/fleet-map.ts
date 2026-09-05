/**
 * Leaflet live-map for /dashboard/gestion (browser-side).
 * Draws the Empresa Plana routes (Costa Daurada), stops and animated buses
 * from the fleet store. Simulates GPS movement along each route's path.
 */
import L from "leaflet";
import { getFleet } from "@/lib/fleet-store";
import type { FleetRoute, LatLng } from "@/interfaces/fleet";

export interface FleetMapOptions {
	/** Animate buses along their routes (default true). */
	animate?: boolean;
	/** Show only routes (skip stops) — used by compact panels. */
	routesOnly?: boolean;
}

interface BusActor {
	marker: L.Marker;
	pos: number;
	dir: 1 | -1;
	speed: number;
}

function busIcon(color: string, delayed: boolean): L.DivIcon {
	return L.divIcon({
		className: "",
		html: `<div style="width:36px;height:36px;background:${color};border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.35);${delayed ? "animation:pulse 1.6s infinite;" : ""}">
			<span style="font-size:18px;line-height:1">🚌</span></div>`,
		iconSize: [36, 36],
		iconAnchor: [18, 18],
	});
}

function stopIcon(): L.DivIcon {
	return L.divIcon({
		className: "",
		html: `<div style="width:20px;height:20px;background:#13AEB8;border:3px solid #fff;border-radius:50%;box-shadow:0 1px 6px rgba(0,0,0,.3);"></div>`,
		iconSize: [20, 20],
		iconAnchor: [10, 10],
	});
}

function interpolate(path: LatLng[], pos: number): LatLng {
	if (path.length < 2) return path[0] ?? [41.12, 1.24];
	const scaled = pos * (path.length - 1);
	const idx = Math.min(Math.floor(scaled), path.length - 2);
	const frac = scaled - idx;
	const a = path[idx];
	const b = path[idx + 1];
	return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
}

export function initFleetMap(
	container: HTMLElement,
	options: FleetMapOptions = {},
): { map: L.Map; actors: Map<string, BusActor> } {
	const { animate = true, routesOnly = false } = options;
	const data = getFleet();

	const map = L.map(container, {
		center: [41.16, 1.3],
		zoom: 9,
		zoomControl: false,
		attributionControl: false,
	});
	L.control.zoom({ position: "bottomright" }).addTo(map);
	L.control.attribution({ position: "bottomleft", prefix: false }).addAttribution("© OpenStreetMap").addTo(map);
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
	}).addTo(map);

	const actors = new Map<string, BusActor>();
	const bounds = L.latLngBounds([]);

	for (const route of data.routes) {
		if (!route.path || route.path.length < 2) continue;
		const polyline = L.polyline(route.path, {
			color: route.color,
			weight: route.status === "inactive" ? 3 : 5,
			opacity: route.status === "inactive" ? 0.35 : 0.75,
			dashArray: route.status === "inactive" ? "6 8" : undefined,
		}).addTo(map);
		bounds.extend(polyline.getBounds());

		// A bus marker per route: the assigned online bus, or a static one.
		const bus = data.buses.find((b) => b.routeId === route.id && b.status === "active" && b.gps.online);
		const isDelayed = route.status === "delayed";
		const marker = L.marker(interpolate(route.path, 0.2), {
			icon: busIcon(route.color, isDelayed),
		}).addTo(map);
		const busLabel = bus ? `${bus.number} · ${route.code}` : route.code;
		marker.bindPopup(
			`<strong>${route.code}</strong> ${route.name}<br><small>${busLabel}${bus ? ` · ${bus.gps.speed} km/h · 🔋 ${bus.gps.battery}%` : ""}</small>`,
		);
		actors.set(route.id, { marker, pos: 0.2, dir: 1, speed: isDelayed ? 0.0004 : 0.0011 });
	}

	if (!routesOnly) {
		for (const stop of data.stops) {
			L.marker([stop.lat, stop.lng], { icon: stopIcon() })
				.addTo(map)
				.bindPopup(`<strong>${stop.name}</strong><br><small>${stop.address}</small>`);
		}
	}

	if (!bounds.isEmpty()) map.fitBounds(bounds.pad(0.12));

	if (animate) {
		window.setInterval(() => {
			for (const route of data.routes) {
				if (route.status === "inactive" || route.path.length < 2) continue;
				const actor = actors.get(route.id);
				if (!actor) continue;
				actor.pos += actor.dir * actor.speed;
				if (actor.pos >= 1) {
					actor.pos = 1;
					actor.dir = -1;
				}
				if (actor.pos <= 0) {
					actor.pos = 0;
					actor.dir = 1;
				}
				actor.marker.setLatLng(interpolate(route.path, actor.pos));
			}
		}, 500);
	}

	return { map, actors };
}
