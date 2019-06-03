export class Congregation {
	id?: any;
	name?: string;
	language?: any;
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

export class Orders {
	id?: string;
	name?: string;
	quantity: string;
}



