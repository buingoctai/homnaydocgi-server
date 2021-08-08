var { query: any } = require('express');
var sql: any = require('mssql');

import constants from '../utils/constants';
import { HCommon } from '../utils/log-system';
import { RepsonseFeaturedPost, RepsonseAllPost } from '../utils/response-params';
const {
	GET_MAIN_ARTICLE,
	GET_FEATURED_ARTICLE,
	GET_ARTICLE_AS_PAGE,
	COUNT_TOTAL_ARTICLE,
	GET_DETAIL_POST,
	GET_FULL_DETAIL_POST,
	FIND_ALL_TOPIC,
	FIND_ARTICLE_AS_TOPIC,
	SEARCH_ARTICLES,
	FIND_ARTICLES_BELONG_IN_LIST_ID,
	ERROR_CODE,
} = constants;

export const getMainPosts = async (req: object, res: { statusCode: number; json: Function }) => {
	const request = new sql.Request();

	request.query(GET_MAIN_ARTICLE, (err: object, data: { recordset: Array<object> }) => {
		if (err) {
			HCommon.logError(`[blogController] -> [getMainPosts]: ${err}`);
			res.statusCode = 500;
			res.json(err);
		}

		const {
			recordset: [postData],
		} = data;

		res.json(postData);
	});
};

export const getFeaturedPosts = async (req: { body: { featuredLabels: Array<string> } }, res: { statusCode: number; json: (data: any) => void }) => {
	const repsonse = new RepsonseFeaturedPost([]);

	let index = 0;
	const { featuredLabels } = req.body;

	const executeQuery = new Promise((resolve, reject) => {
		featuredLabels.forEach((item) => {
			const request = new sql.Request();

			request.query(GET_FEATURED_ARTICLE.replace('LabelValue', item), (err: object, data: { recordset: Array<object> }) => {
				if (err) {
					HCommon.logError(`[blogController] -> [getFeaturedPosts] -> [query]: ${err}`);
					reject({
						err: ERROR_CODE['500'],
						statusCode: 500,
					});
				}

				const {
					recordset: [postData],
				} = data;
				if (!postData) {
					reject({
						err: ERROR_CODE['410'],
						statusCode: 410,
					});
				}
				repsonse['data'].push(postData);
				index++;
				if (index === featuredLabels.length) resolve(repsonse);
			});
		});
	});

	executeQuery
		.then((data) => res.json(data))
		.catch(({ err, statusCode }) => {
			HCommon.logError(`[blogController] -> [getFeaturedPosts] -> [response]: ${err}`);
			res.statusCode = statusCode;
			res.json(err);
		});
};

const getFullDetailPost = (id: string) => {
	return new Promise((resolve, reject) => {
		const request = new sql.Request();

		request.query(GET_FULL_DETAIL_POST.replace('IdValue', id), (err: any, data: { recordset: Array<object> }) => {
			if (err) {
				HCommon.logError(`[getFullDetailPost] -> [query]: ${err}`);
				reject(err);
			}
			const {
				recordset: [postData],
			} = data;
			resolve(postData);
		});
	});
};

const updateHeadArticle = async (list: Array<{ Id: string }>, id: string, pageIndex: number): Promise<{ newList: any; found: boolean }> => {
	if (!id) return { newList: null, found: true };

	return new Promise(async (resolve, reject) => {
		let newList = [];
		const headArticle = await getFullDetailPost(id);
		const inPage = list.filter((item, index) => item.Id === id).length > 0;

		if (inPage) {
			if (pageIndex === 1) {
				const restList = list.filter((item, index) => item.Id !== id);
				newList = [headArticle, ...restList];
			} else {
				newList = list.filter((item, index) => item.Id !== id);
			}
			resolve({ newList, found: true });
		} else {
			if (pageIndex === 1) {
				newList = [headArticle, ...list.slice(0, list.length - 1)];
			} else {
				newList = list.slice(0, list.length - 1);
			}
			resolve({ newList, found: false });
		}
	});
};

export const getAllPost = async (
	req: {
		body: {
			paging: { pageIndex: number; pageSize: number };
			orderList: { orderType: string; orderBy: string };
			headArticle: string;
			found: boolean;
		};
	},
	res: { statusCode: number; json: (data: any) => void }
) => {
	const response = new RepsonseAllPost([], 0, false);

	let {
		paging: { pageIndex },
		orderList: { orderType, orderBy },
		headArticle,
		found,
	} = req.body;
	let start: any = null;
	let pageSize: number = req.body.paging.pageSize;

	const executeQuery = new Promise((resolve, reject) => {
		const request = new sql.Request();

		request.query(COUNT_TOTAL_ARTICLE, (err: object, data: { recordset: Array<object> }) => {
			if (err) {
				HCommon.logError(`[getAllPost] -> [query count total article]: ${err}`);
				reject({
					err: ERROR_CODE['500'],
					statusCode: 500,
				});
			}

			const {
				recordset: [item],
			} = data;
			const [total] = Object.values(item);

			if (pageIndex == -1) {
				start = 0;
				pageSize = total;
			} else {
				start = pageSize * (pageIndex - 1);
			}
			if (!found && pageIndex !== 1 && pageIndex !== -1) {
				start = start - 1;
			}

			request.query(
				GET_ARTICLE_AS_PAGE.replace('orderByValue', orderBy)
					.replace('orderTypeValue', orderType)
					.replace('startValue', start)
					.replace('pageSizeValue', pageSize.toString()),
				async (err: object, data: { recordset: Array<{ Id: string }> }) => {
					if (err) {
						HCommon.logError(`[getAllPost] -> [query articles as page]: ${err}`);
						reject({
							err: ERROR_CODE['500'],
							statusCode: 500,
						});
					}

					const { recordset } = data;
					const { newList, found } = await updateHeadArticle(recordset, headArticle, pageIndex);
					const newRecordset = newList || recordset;

					response.data = newRecordset;
					response.totalRecord = total;
					response.found = found;
					resolve(response);
				}
			);
		});
	});

	executeQuery
		.then((response) => res.json(response))
		.catch(({ err, statusCode }) => {
			res.statusCode = statusCode;
			res.json(err);
		});
};

export const getAllPostToCache = async (
	req: { query: { pageIndex: string; pageSize: string; orderBy: string; orderType: string; headArticle: string; found: boolean } },
	res: { statusCode: number; json: (data: any) => void }
) => {
	const { query } = req;
	const paging = { pageIndex: parseInt(query.pageIndex), pageSize: parseInt(query.pageSize) };
	const orderList = { orderBy: query.orderBy, orderType: query.orderType };
	const headArticle = query.headArticle;
	const found = Boolean(query.found);

	getAllPost({ body: { paging, orderList, headArticle, found } }, res);
};

export const getDetailPost = async (req: { body: { id: string } }, res: { statusCode: number; json: (data: any) => void }) => {
	const { id } = req.body;
	const request = new sql.Request();

	request.query(GET_DETAIL_POST.replace('IdValue', id), (err: any, data: { recordset: Array<object> }) => {
		if (err) {
			res.statusCode = 500;
			res.json(500);
		}
		const {
			recordset: [postData],
		} = data;
		res.json(postData);
	});
};

export const getDetailPostToCache = async (req: { query: { id: string } }, res: any) => {
	getDetailPost({ body: { id: req.query.id } }, res);
};
