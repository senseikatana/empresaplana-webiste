export interface HomeValueProp {
	title: string;
	desc: string;
}

export interface HomeValueProps {
	title: string;
	items: {
		routes: HomeValueProp;
		accessibility: HomeValueProp;
		fleet: HomeValueProp;
		personalized: HomeValueProp;
	};
}

export interface HomeAirportPromo {
	tag: string;
	title: string;
	subtitle: string;
	cta: string;
}

export interface HomeCoachRental {
	title: string;
	subtitle: string;
	quoteCta: string;
}

export interface HomeFundedBy {
	title: string;
	items: string[];
}

export interface HomeContent {
	valueProps: HomeValueProps;
	airportPromo: HomeAirportPromo;
	coachRental: HomeCoachRental;
	fundedBy: HomeFundedBy;
}
