const https = require('https');

export const delay = async (ms: number): Promise<any> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(`Delay ${ms}ms done`);
		}, ms);
	});
};
interface RetryFetch {
	url: string;
	retries?: number;
	retryDelay?: number;
	timeout?: number;
}
export const retryFetch = (params: RetryFetch): Promise<any> => {
	const { url, retries = 3, retryDelay = 3000, timeout } = params;
	return new Promise((resolve, reject) => {
		if (timeout) {
			setTimeout(() => {
				reject('[retryFetch]: Try fetch timeout');
			}, timeout);
		}
		const wrapper = (n: number) => {
			https.get(url, async (res: any) => {
				if (res.statusCode === 200) {
					resolve(res);
				} else {
					if (n > 0) {
						await delay(retryDelay);
						wrapper(--n);
					} else {
						reject(`[retryFetch]: ${url} cannot found. Status code: ${res.statusCode}`);
					}
				}
			});
		};
		wrapper(retries);
	});
};
