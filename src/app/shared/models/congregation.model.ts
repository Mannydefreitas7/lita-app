export class Congregation {
	id?: string;
	name?: string;
	publishers?: Publisher;
	dateCreated?: string;
	literature?: any;
	}

export class Publisher {
	id?: string;
	name?: string;
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



