export class Congregation {
	id?: any;
	name?: string;
	language?: any;
	inventory?: boolean;
	publishers?: [Publisher];
	}

export class Publisher {
	id?: any;
	fname?: string;
	lname?: string;
	email?: string;
	role?: string;
	photoUrl?: string;
	orderCount?: number;
	order?: any;
}

export class Literature {
	id?: string;
	cover?: string;
	pubId?: string;
	name?: string;
	contextTitle?: string;
}

export class CongLiterature {
	id?: string;
	months?: [{
		in: number;
		onHand: number;
		out: number;
	}]
}

export class Order {
	id?: string;
	name?: string;
	uid?: string;
	oid?: string;
	quantity?: string;
	user?: string;
}

export class Orders {
	id?: string;
	name?: string;
	uid?: string;
	oid?: string;
	quantity?: string;
	user?: string;
}

export class Month {
	in: number;
	onHand: number;
	out: number;
}



