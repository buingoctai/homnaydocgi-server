const sql = require("mssql");
const uuidv4 = require("uuid/v4");

const constants = require("../utils/constants");
const { INSERT_ARTICLE, DELETE_ARTICLES, UPDATE_ARTICLES } = constants;

exports.submitArticle = async (req, res) => {
  const { author, title, content, topic, submitDate, imageUrl } = req.body;
  const subContentList = content.split(".");
  let brief = "";

  if (subContentList.length < 2) {
    brief = subContentList[0];
  } else {
    brief = subContentList[0].concat(`.${subContentList[1]}`);
  }

  const id = uuidv4();
  const request = new sql.Request();
  request.query(
    INSERT_ARTICLE.replace("IdValue", id)
      .replace("AuthorValue", author)
      .replace("TitleValue", title)
      .replace("ContentValue", content)
      .replace("TopicValue", topic)
      .replace("SubmitDateValue", submitDate)
      .replace("ImageValue", imageUrl)
      .replace("BriefValue", brief),
    (err) => {
      if (err) {
        res.statusCode = 500;
        res.json(err);
      } else {
        res.json();
      }
    }
  );
};

exports.deletePosts = async (req, res) => {
  const { items } = req.body;
  const request = new sql.Request();
  let stringList = `'${items[0]}'`;

  for (i = 1; i < items.length; i++) {
    stringList = stringList.concat(",", `'${items[i]}'`);
  }
  request.query(DELETE_ARTICLES.replace("LIST_ID", stringList), (err) => {
    if (err) {
      res.statusCode = 500;
      res.json(err);
    }
    res.json();
  });
};

exports.updatePosts = async (req, res) => {
  const { items, data } = req.body;
  const request = new sql.Request();
  const { author, title, content, topic, submitDate, imageUrl } = data;
  const subContentList = content.split(".");
  let brief = "";

  if (subContentList.length < 2) {
    brief = subContentList[0];
  } else {
    brief = subContentList[0].concat(`.${subContentList[1]}`);
  }

  const updateFunc = new Promise((resolve, reject) => {
    for (let i = 0; i < items.length; i++) {
      request.query(
        UPDATE_ARTICLES.replace("AuthorValue", author)
          .replace("TitleValue", title)
          .replace("ContentValue", content)
          .replace("TopicValue", topic)
          .replace("SubmitDateValue", submitDate)
          .replace("ImageUrlValue", imageUrl)
          .replace("BriefValue", brief)
          .replace("IdValue", `'${items[i]}'`),
        (err) => {
          if (err) {
            reject(err);
          }
        }
      );
      if (i === items.length - 1) {
        resolve("");
      }
    }
  });
  updateFunc
    .then(() => res.json())
    .catch((err) => {
      res.statusCode = 500;
      res.json(err);
    });
};
