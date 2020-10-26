const sql = require("mssql");

const constants = require("../utils/constants");
const {
  FIND_MAIN_ARTICLE,
  FIND_FEATURED_ARTICLE,
  FIND_ARTICLE_AS_PAGE,
  COUNT_TOTAL_ARTICLE,
  FIND_DETAIL_POST,
  FIND_ALL_TOPIC,
  FIND_ARTICLE_AS_TOPIC,
  SEARCH_ARTICLES,
  FIND_ARTICLES_BELONG_IN_LIST_ID,
  ERROR_CODE,
} = constants;

exports.getMainPosts = async (req, res) => {
  const request = new sql.Request();

  request.query(FIND_MAIN_ARTICLE, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json(err);
    }
    const {
      recordset: [postData],
    } = data;
    res.json(postData);
  });
};

exports.getFeaturedPosts = async (req, res) => {
  let repsonse = {};
  repsonse["data"] = [];
  let index = 0;
  const { featuredLabels } = req.body;

  const temporyFunc = new Promise((resolve, reject) => {
    featuredLabels.forEach((item) => {
      const request = new sql.Request();

      request.query(
        FIND_FEATURED_ARTICLE.replace("LabelValue", item),
        (err, data) => {
          if (err) reject({ err: ERROR_CODE["500"], statusCode: 500 });
          const {
            recordset: [postData],
          } = data;
          if (!postData) {
            reject({ err: ERROR_CODE["410"], statusCode: 410 });
          }
          repsonse["data"].push(postData);
          index++;
          if (index === featuredLabels.length) {
            resolve(repsonse);
          }
        }
      );
    });
  });
  temporyFunc
    .then((data) => res.json(data))
    .catch(({ err, statusCode }) => {
      res.statusCode = statusCode;
      res.json(err);
    });
};

exports.getAllPost = async (req, res) => {
  let repsonse = {};
  repsonse["data"] = [];
  repsonse["totalRecord"] = 0;
  const {
    paging: { pageIndex, pageSize },
    orderList: { orderType, orderBy },
  } = req.body;

  const callSearching = new Promise((resolve, reject) => {
    const request = new sql.Request();

    request.query(COUNT_TOTAL_ARTICLE, (err, data) => {
      if (err) reject({ err: ERROR_CODE["500"], statusCode: 500 });
      const {
        recordset: [item],
      } = data;

      request.query(
        FIND_ARTICLE_AS_PAGE.replace("orderByValue", orderBy)
          .replace("orderTypeValue", orderType)
          .replace("startValue", pageSize * (pageIndex - 1))
          .replace("pageSizeValue", pageSize),
        (err, data) => {
          if (err) reject({ err: ERROR_CODE["500"], statusCode: 500 });
          const { recordset } = data;
          resolve({ data: recordset, totalRecord: item[""] });
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

exports.getDetailPost = async (req, res) => {
  const { id } = req.body;
  const request = new sql.Request();

  request.query(FIND_DETAIL_POST.replace("IdValue", id), (err, data) => {
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

  request.query(
    FIND_ARTICLE_AS_TOPIC.replace("LabelValue", topicName),
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

exports.searchArticles = async (req, res) => {
  const { searchTxt } = req.body;
  const request = new sql.Request();

  request.query(
    SEARCH_ARTICLES.replace("titleValue", searchTxt)
      .replace("authorValue", searchTxt)
      .replace("contentValue", searchTxt),
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
    stringListId = stringListId.concat(",", `'${listId[i]}'`);
  }

  const request = new sql.Request();
  request.query(
    FIND_ARTICLES_BELONG_IN_LIST_ID.replace("LIST_ID", stringListId),
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
