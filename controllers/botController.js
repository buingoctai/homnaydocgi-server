var request = require("request");

const constants = require("../utils/constants");
const { FACEBOOK_DEV } = constants;

exports.handleVerify = async (request, response) => {
  if (request.query["hub.verify_token"] === FACEBOOK_DEV.VALIDATION_TOKEN) {
    response.send(request.query["hub.challenge"]);
  }
  response.send("Error, wrong validation token");
};

exports.handleMsg = async (request, response) => {
  console.log("req.body.entry=", request.body.entry);

  var entries = request.body.entry;
  for (var entry of entries) {
    console.log("entry=", entry);
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      console.log("senderId=", senderId);
      if (message.message) {
        if (message.message.text) {
          var text = message.message.text;
          handleMessage(
            senderId,
            "Hello Admin Tài, có phải bạn nhắn tôi:" + text
          );
        }
      }
    }
  }
  response.status(200).send({ notifi: "OK" });
};

// Send msg to page
const handleMessage = (senderId, message) => {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {
      access_token: FACEBOOK_DEV.PAGE_ACCESS_TOKEN,
    },
    method: "POST",
    json: {
      recipient: {
        id: senderId,
      },
      message: {
        text: message,
      },
    },
  });
};

exports.sendMessage = async (request, response) => {
  const { message } = request.body;
  const id_buingoctai_user = FACEBOOK_DEV.ADMIN_MESSENGER_ID;

  handleMessage(id_buingoctai_user, message);
  response.status(200).send({ message: "Thành công" });
};
