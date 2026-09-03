import type { TimeRange } from "@/interfaces/towns";
import stopsData from "./stops.json";

// Town names used by the origin/destination selectors.
export const STOPS: string[] = stopsData.stops;

// Time-of-day ranges for the route search filter.
export const TIME_RANGES: TimeRange[] = [
	{ value: "00:00-06:00", label: "00:00 – 06:00" },
	{ value: "06:00-12:00", label: "06:00 – 12:00" },
	{ value: "12:00-18:00", label: "12:00 – 18:00" },
	{ value: "18:00-24:00", label: "18:00 – 24:00" },
];
