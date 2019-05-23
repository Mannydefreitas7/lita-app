export class Congregation {
	id?: any;
	name?: string;
	language?: any;
	publishers?: [Publisher]
	}

export class Publisher {
	id?: any;
	fname?: string;
	lname?: string;
	email?: string;
	role?: string;
	photoUrl?: string;
	orderCount?: number;
	order?: [Literature]
}

export class Literature {
	id?: string;
	cover?: string;
	url?: string;
	title?: string;
	contextTitle?: string;
	quantity?: {
		in: number;
		onHand: number;
		out: number;
	}
}



