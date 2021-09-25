class RepsonseFeaturedPost {
	data: Array<object>;
	constructor(data: Array<object>) {
		this.data = data;
	}
}

class RepsonseAllPost {
	data: Array<object>;
	totalRecord: number;
	found: boolean;

	constructor(data: Array<object>, totalRecord: number, found: boolean) {
		this.data = data;
		this.totalRecord = totalRecord;
		this.found = found;
	}
}

interface Request {
	body: object;
}

interface Response {
	statusCode: number;
	json: (data: any) => void;
}

export { RepsonseFeaturedPost, RepsonseAllPost, Request, Response };
