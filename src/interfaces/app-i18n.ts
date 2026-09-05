export interface AppAuthDict {
	welcome: string;
	subtitle: string;
	username: string;
	passkey: string;
	login: string;
	demoHint: string;
	asClient: string;
	asWorker: string;
	asBoss: string;
	invalid: string;
}

export interface AppRoleDict {
	client: string;
	worker: string;
	admin: string;
}

export interface AppStatusDict {
	label: string;
	received: string;
	review: string;
	answered: string;
	contracted: string;
}

export interface AppNavDict {
	home: string;
	routes: string;
	budgets: string;
	profile: string;
	fleet: string;
	requests: string;
	lines: string;
	reports: string;
	logout: string;
	switchRole: string;
}

export interface AppClientDict {
	greeting: string;
	nextService: string;
	noNextService: string;
	quickAccess: string;
	quickRoutes: string;
	quickBudgets: string;
	quickProfile: string;
	myBudgets: string;
	newBudget: string;
	budgetTitle: string;
	budgetSubtitle: string;
	noBudgets: string;
	noBudgetsDesc: string;
	sentOn: string;
	updatedOn: string;
	details: string;
	hide: string;
	trip: string;
	sentOk: string;
	sentOkDesc: string;
	goBudgets: string;
	historyTitle: string;
	historyDesc: string;
}

export interface AppWorkerDict {
	linesTitle: string;
	linesDesc: string;
	kpiLines: string;
	kpiOnTime: string;
	kpiReports: string;
	kpiRequests: string;
	lineStatusTitle: string;
	lineStatusDesc: string;
	noLineData: string;
	negativeToday: string;
	statReports: string;
	statRate: string;
	statNegative: string;
	requestsTitle: string;
	requestsDesc: string;
	filterAll: string;
	noRequests: string;
	noRequestsDesc: string;
	actReview: string;
	actAnswer: string;
	actContract: string;
	reportsTitle: string;
	reportsDesc: string;
	chooseLine: string;
	noReports: string;
	today: string;
	addReport: string;
	reportOk: string;
}

export interface AppMiscDict {
	demoNote: string;
	cancel: string;
	save: string;
	close: string;
	language: string;
}

export interface GestionNavDict {
	panel: string;
	map: string;
	routes: string;
	buses: string;
	stops: string;
	schedules: string;
	drivers: string;
	notifications: string;
	reports: string;
	integrations: string;
}

export interface GestionCommonDict {
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
	back: string;
	updated: string;
	created: string;
	deleted: string;
}

export interface GestionStatesDict {
	active: string;
	inactive: string;
	delayed: string;
	maintenance: string;
	online: string;
	offline: string;
	enRoute: string;
}

export interface GestionDashboardDict {
	title: string;
	subtitle: string;
	kpiBuses: string;
	kpiRoutes: string;
	kpiStops: string;
	kpiDrivers: string;
	kpiAlerts: string;
	upcomingTitle: string;
	noUpcoming: string;
	linesTitle: string;
	linesDesc: string;
	notifTitle: string;
	quickTitle: string;
	openMap: string;
	activityTitle: string;
}

export interface GestionMapDict {
	title: string;
	subtitle: string;
	live: string;
	searchPlaceholder: string;
	legendTitle: string;
	legendActive: string;
	legendDelayed: string;
	legendInactive: string;
	legendStop: string;
	locate: string;
	notFound: string;
}

export interface GestionEntityDict {
	label: string;
	fields: Record<string, string>;
}

export interface GestionNotificationsDict {
	title: string;
	subtitle: string;
	markAll: string;
	newNotif: string;
	types: { delay: string; accident: string; detour: string; info: string };
	unread: string;
	noResults: string;
}

export interface GestionReportsDict {
	title: string;
	subtitle: string;
	kpiPassengers: string;
	kpiPunctuality: string;
	kpiKm: string;
	kpiFuel: string;
	passengersByRoute: string;
	occupancyByRoute: string;
	weeklyPunctuality: string;
	satisfaction: string;
	satisfactionNames: {
		punctuality: string;
		cleanliness: string;
		comfort: string;
		information: string;
		attention: string;
	};
}

export interface GestionIntegrationsDict {
	title: string;
	subtitle: string;
	connected: string;
	motis: {
		title: string;
		desc: string;
		url: string;
		port: string;
		gtfsFile: string;
		region: string;
		regionOptions: string[];
		test: string;
		importGtfs: string;
		docs: string;
	};
	traccar: {
		title: string;
		desc: string;
		url: string;
		apiKey: string;
		protocol: string;
		test: string;
		sync: string;
		devicesTitle: string;
		bus: string;
		device: string;
		lastPos: string;
		speed: string;
		battery: string;
	};
	gtfs: {
		title: string;
		desc: string;
		agency: string;
		timezone: string;
		generate: string;
		download: string;
	};
	data: {
		title: string;
		desc: string;
		export: string;
		import: string;
		activityTitle: string;
	};
	stepLabels: string[];
}

export interface GestionDict {
	nav: GestionNavDict;
	common: GestionCommonDict;
	states: GestionStatesDict;
	dashboard: GestionDashboardDict;
	map: GestionMapDict;
	entities: {
		route: GestionEntityDict;
		bus: GestionEntityDict;
		stop: GestionEntityDict;
		schedule: GestionEntityDict;
		driver: GestionEntityDict;
	};
	notifications: GestionNotificationsDict;
	reports: GestionReportsDict;
	integrations: GestionIntegrationsDict;
}

export interface AppDictionary {
	title: string;
	tagline: string;
	auth: AppAuthDict;
	role: AppRoleDict;
	status: AppStatusDict;
	nav: AppNavDict;
	client: AppClientDict;
	worker: AppWorkerDict;
	misc: AppMiscDict;
	gestion: GestionDict;
}
