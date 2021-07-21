const { query } = require('express');
const sql = require('mssql');

const constants = require('../utils/constants');
const {
  GET_MAIN_ARTICLE,
  GET_FEATURED_ARTICLE,
  GET_ARTICLE_AS_PAGE,
  COUNT_TOTAL_ARTICLE,
  FIND_DETAIL_POST,
  GET_FULL_DETAIL_POST,
  FIND_ALL_TOPIC,
  FIND_ARTICLE_AS_TOPIC,
  SEARCH_ARTICLES,
  FIND_ARTICLES_BELONG_IN_LIST_ID,
  ERROR_CODE,
} = constants;

exports.getMainPosts = async (req, res) => {
  const request = new sql.Request();

  request.query(GET_MAIN_ARTICLE, (err, data) => {
    if (err) {
      console.log('err', err);
      res.statusCode = 500;
      res.json(err);
    }
    console.log(data);
    const {
      recordset: [postData],
    } = data;
    res.json(postData);
  });
};

exports.getFeaturedPosts = async (req, res) => {
  let repsonse = {};
  repsonse['data'] = [];
  let index = 0;
  const { featuredLabels } = req.body;

  const temporyFunc = new Promise((resolve, reject) => {
    featuredLabels.forEach((item) => {
      const request = new sql.Request();

      request.query(GET_FEATURED_ARTICLE.replace('LabelValue', item), (err, data) => {
        if (err)
          reject({
            err: ERROR_CODE['500'],
            statusCode: 500,
          });
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
        if (index === featuredLabels.length) {
          resolve(repsonse);
        }
      });
    });
  });
  temporyFunc
    .then((data) => res.json(data))
    .catch(({ err, statusCode }) => {
      res.statusCode = statusCode;
      res.json(err);
    });
};
exports.getAllPostToCache = async (req, res) => {
  console.log('query', req.query);
  const paging = { pageIndex: parseInt(req.query.pageIndex), pageSize: parseInt(req.query.pageSize) };
  const orderList = { orderBy: req.query.orderBy, orderType: req.query.orderType };
  const headArticle = req.query.headArticle;
  const found = req.query.found;

  this.getAllPost({ body: { paging, orderList, headArticle, found } }, res);
};

const getFullDetailPost = (id) => {
  return new Promise((resolve, reject) => {
    const request = new sql.Request();

    request.query(GET_FULL_DETAIL_POST.replace('IdValue', id), (err, data) => {
      if (err) {
        reject(err);
      }
      const {
        recordset: [postData],
      } = data;
      console.log('postData', postData);
      resolve(postData);
    });
  });
};
const updateHeadArticle = async (list = [], id, pageIndex) => {
  if (!id) return { found: true };

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
exports.getAllPost = async (req, res) => {
  let repsonse = {};
  repsonse['data'] = [];
  repsonse['totalRecord'] = 0;
  let {
    paging: { pageIndex, pageSize },
    orderList: { orderType, orderBy },
    headArticle,
    found,
  } = req.body;
  let start = null;

  const callSearching = new Promise((resolve, reject) => {
    const request = new sql.Request();

    request.query(COUNT_TOTAL_ARTICLE, (err, data) => {
      if (err)
        reject({
          err: ERROR_CODE['500'],
          statusCode: 500,
        });
      const {
        recordset: [item],
      } = data;

      if (pageIndex == -1) {
        start = 0;
        pageSize = item[''];
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
          .replace('pageSizeValue', pageSize),
        async (err, data) => {
          if (err)
            reject({
              err: ERROR_CODE['500'],
              statusCode: 500,
            });
          const { recordset } = data;

          const { newList, found } = await updateHeadArticle(recordset, headArticle, pageIndex);
          const newRecordset = newList || recordset;

          resolve({
            data: newRecordset,
            totalRecord: item[''],
            found: found,
          });
        }
      );
    });
  });
  callSearching
    .then((response) => res.json(response))
    .catch(({ err, statusCode }) => {
      res.statusCode = statusCode;
      res.json(err);
    });
};

exports.getDetailPostToCache = async (req, res) => {
  this.getDetailPost({ body: { id: req.query.id } }, res);
};
exports.getDetailPost = async (req, res) => {
  const { id } = req.body;
  const request = new sql.Request();

  request.query(FIND_DETAIL_POST.replace('IdValue', id), (err, data) => {
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

exports.getAllTopic = async (req, res) => {
  let response = [];
  const request = new sql.Request();

  request.query(FIND_ALL_TOPIC, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json(500);
    }
    const { recordset } = data;
    recordset.map((item) => {
      response.push(item.Topic);
    });

    res.json(response.filter((a, b) => response.indexOf(a) === b));
  });
};

exports.getFollowTopic = async (req, res) => {
  const { topicName } = req.body;
  const request = new sql.Request();

  request.query(FIND_ARTICLE_AS_TOPIC.replace('LabelValue', topicName), (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json(500);
    }
    const { recordset } = data;
    res.json({ data: recordset });
  });
};

exports.searchArticles = async (req, res) => {
  const { searchTxt } = req.body;
  const request = new sql.Request();

  request.query(
    SEARCH_ARTICLES.replace('titleValue', searchTxt).replace('authorValue', searchTxt).replace('contentValue', searchTxt),
    (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.json(500);
      }
      const { recordset } = data;
      res.json({ data: recordset });
    }
  );
};

exports.getSavedPosts = async (req, res) => {
  const { listId } = req.body;
  let stringListId = `'${listId[0]}'`;
  for (i = 1; i < listId.length; i++) {
    stringListId = stringListId.concat(',', `'${listId[i]}'`);
  }

  const request = new sql.Request();
  request.query(FIND_ARTICLES_BELONG_IN_LIST_ID.replace('LIST_ID', stringListId), (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json(500);
    }
    const { recordset } = data;
    res.json({ data: recordset });
  });
};
