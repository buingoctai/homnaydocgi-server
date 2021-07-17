var { query: any } = require('express');
var sql: any = require('mssql');

import constants from '../utils/constants';
import { HCommon } from '../utils/log-system';

const {
  GET_MAIN_ARTICLE,
  FIND_FEATURED_ARTICLE,
  FIND_ARTICLE_AS_PAGE,
  COUNT_TOTAL_ARTICLE,
  FIND_DETAIL_POST,
  FIND_FULL_DETAIL_POST,
  FIND_ALL_TOPIC,
  FIND_ARTICLE_AS_TOPIC,
  SEARCH_ARTICLES,
  FIND_ARTICLES_BELONG_IN_LIST_ID,
  ERROR_CODE,
} = constants;

export const getMainPosts = async (req: object, res: { statusCode: number; json: Function }) => {
  const request = new sql.Request();

  request.query(GET_MAIN_ARTICLE, (err: object, data: { recordset: Array<string> }) => {
    if (err) {
      HCommon.logError(`[blogController][getMainPosts]: ${err}`);
      res.statusCode = 500;
      res.json(err);
    }

    const {
      recordset: [postData],
    } = data;

    res.json(postData);
  });
};
