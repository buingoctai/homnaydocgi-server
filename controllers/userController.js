const uuidv4 = require("uuid/v4");
const jwt = require("jsonwebtoken");
const sql = require("mssql");

const constants = require("../utils/constants");
const {
  PYTHON_SERVER_URL,
  INSERT_USER_DATA,
  USER_FIND,
  INSERT_PERSONALIZED_INFORMS,
  DATABASE_SERVER_CONFIG_DEV,
} = constants;

//-------------
exports.submitUserData = async (req, res, next) => {
  const request = require("superagent");
  const { userName, fbUrl, techKnowledge, addKnowledge } = req.body;
  const isStringTech = typeof techKnowledge === "string";
  const isStringAdd = typeof addKnowledge === "string";
  const id = uuidv4();

  if (isStringTech && isStringAdd) {
    // Saving to database to Users table
    sql.connect(DATABASE_SERVER_CONFIG_DEV, (err) => {
      if (err) console.log(err);
      const request = new sql.Request();
      // Check value exist (UserName & FbUrl) in Users table
      request.query(
        INSERT_USER_DATA.replace("IdValue", id)
          .replace("UserNameValue", userName)
          .replace("FbUrlValue", fbUrl)
          .replace("TechTxtValue", techKnowledge)
          .replace("AddTxtValue", addKnowledge),
        (err) => {
          if (err) console.log("INSERT USERS TABLE=", err);
        }
      );
    });
    // Call python server
    // request
    //   .post(PYTHON_SERVER_URL + "/userData_classification")
    //   .send({
    //     list: [
    //       { data: techKnowledge, fileName: "predictiveTech" },
    //       { data: addKnowledge, fileName: "predictiveAdd" }
    //     ]
    //   })
    //   .set("Accept", "application/json")
    //   .end((err, data) => {
    //     if (err) res.send(err);
    //     response = JSON.parse(data.text);
    //     // Fake handle response
    //     // some code
    //     //---------------
    //     const fakeConfidentTech = 0.69;
    //     const fakeConfidentAdd = 0.69;
    //     let techHandler = {};
    //     let addHandler = {};

    //     if (fakeConfidentTech > 0.7) {
    //       techHandler = {
    //         classified: true,
    //         labels: ["Mobile"]
    //       };
    //       // Insert into database: labels
    //     } else {
    //       // Query into database: labels
    //       techHandler = {
    //         classified: false,
    //         labels: ["Front-End", "Back-End", "Mobile"]
    //       };
    //     }
    //     if (fakeConfidentAdd > 0.7) {
    //       addHandler = {
    //         classified: true,
    //         labels: ["Marketing"]
    //       };
    //       // Insert into database: labels
    //     } else {
    //       // Query into database: labels
    //       addHandler = {
    //         classified: false,
    //         labels: ["Marketing", "Leader", "Sales"]
    //       };
    //     }
    //     const token = jwt.sign({ id: id }, "SECET_KEY", {
    //       expiresIn: "1h"
    //     });
    //     res.status(200).send({ techHandler, addHandler, token });
    //   });

    // Non call python server
    const fakeConfidentTech = 0.69;
    const fakeConfidentAdd = 0.69;
    let techHandler = {};
    let addHandler = {};

    if (fakeConfidentTech > 0.7) {
      techHandler = {
        classified: true,
        labels: ["Mobile"],
      };
    } else {
      // Query into database: labels
      techHandler = {
        classified: false,
        labels: ["Front-End", "Back-End", "Mobile"],
      };
    }
    if (fakeConfidentAdd > 0.7) {
      addHandler = {
        classified: true,
        labels: ["Marketing"],
      };
    } else {
      // Query into database: labels
      addHandler = {
        classified: false,
        labels: ["Marketing", "Leader", "Sales"],
      };
    }
    const token = jwt.sign({ id: id }, "SECET_KEY", {
      expiresIn: "1h",
    });

    // Insert personalized informs
    if (techHandler.classified && addHandler.classified) {
      sql.connect(DATABASE_SERVER_CONFIG_DEV, (err) => {
        if (err) console.log(err);
        const request = new sql.Request();
        request.query(
          INSERT_PERSONALIZED_INFORMS.replace("UserIdValue", id)
            .replace("TechListValue", "Mobile")
            .replace("AddListValue", "Marketing"),
          (err) => {
            if (err) console.log("INSERT PERSONALIZEDINFORMS TABLE=", err);
          }
        );
      });
    }
    res.status(200).send({ techHandler, addHandler, token });
  } else {
    // Insert personalized informs
    sql.connect(DATABASE_SERVER_CONFIG_DEV, (err) => {
      if (err) console.log(err);
      const request = new sql.Request();
      request.query(
        INSERT_PERSONALIZED_INFORMS.replace("UserIdValue", id)
          .replace("TechListValue", techKnowledge.toString())
          .replace("AddListValue", addKnowledge.toString()),
        (err) => {
          if (err) console.log("INSERT PERSONALIZEDINFORMS TABLE=", err);
        }
      );
    });
    // Query into database: labels
    const responseChoosing = {
      techHandler: {
        classified: true,
        labels: techKnowledge,
      },
      addHandler: {
        classified: true,
        labels: addKnowledge,
      },
    };

    res.status(200).send({ ...responseChoosing });
  }
};

exports.auhtencation = async (req, res) => {
  const {
    headers: { authorization },
  } = req;
  const token = authorization.split(" ")[1];

  jwt.verify(token, "SECET_KEY", (err, data) => {
    if (err) {
      return res.json({
        success: false,
        message: "Failed to authenticate token.",
      });
    } else {
      return res.json(data);
    }
  });
};

exports.getProfile = async (req, res) => {
  const { userId } = req.body;

  sql.connect(DATABASE_SERVER_CONFIG_DEV, (err) => {
    if (err) res.status(500).send({});
    const request = new sql.Request();
    request.query(USER_FIND.replace("IdValue", userId), (err, data) => {
      if (err) res.status(500).send();
      const {
        recordset: [userData],
      } = data;
      res.json(userData);
    });
  });
};

exports.example = (req, res) => {
  res.status(200).send({ author: "bui ngoc tai" });
};