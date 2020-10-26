const sql = require("mssql");
const constants = require("../utils/constants");
const uuidv4 = require("uuid/v4");
const webpush = require("web-push");
const {
  GET_ALL_SUBSCRITION,
  INSERT_SUBSCRITION,
  DELETE_SUBSCRIPTION,
} = constants;

const vapidKeys = {
  privateKey: "bdSiNzUhUP6piAxLH-tW88zfBlWWveIx0dAsDO66aVU",
  publicKey:
    "BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8",
};

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

exports.saveSubscription = (req, res) => {
  const subscriptionString = JSON.stringify(req.body);
  const idValue = uuidv4();
  const request = new sql.Request();

  request.query(
    INSERT_SUBSCRITION.replace("idValue", idValue).replace(
      "subscriptionValue",
      subscriptionString
    ),
    (err) => {
      if (err) {
        res.statusCode = 500;
        res.json(err);
      } else {
        res.json({ subscriptionId: idValue });
      }
    }
  );
};

exports.deleteSubscription = (req, res) => {
  const { subscriptionId } = req.body;
  const request = new sql.Request();

  request.query(
    DELETE_SUBSCRIPTION.replace("idValue", subscriptionId),
    (err) => {
      if (err) {
        res.statusCode = 500;
        res.json(err);
      }
      res.json();
    }
  );
};

const performSendNotification = ({ subscriptionList, title }) => {
  for (index in subscriptionList) {
    webpush
      .sendNotification(
        JSON.parse(subscriptionList[index].Subscription),
        JSON.stringify({
          title: "Bài viết mới",
          text: title,
          tag: "new",
          url: "/home",
        })
      )
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.sendNotificationToAll = (req, res) => {
  const { title } = req.body;
  const request = new sql.Request();

  request.query(GET_ALL_SUBSCRITION, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json(err);
    }
    const { recordset: subscriptionList } = data;

    performSendNotification({ subscriptionList, title });
    res.json("");
  });
};
