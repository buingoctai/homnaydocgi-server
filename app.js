const sql = require("mssql");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();
const constants = require("./utils/constants");
const { DATABASE_SERVER_CONFIG_DEV, DATABASE_SERVER_CONFIG_PRO } = constants;
app.options("*", cors());
app.use(cors());

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const blogRoutes = require("./routes/blogRoutes");
const botRoutes = require("./routes/botRoutes");
const readNewRoutes = require("./routes/readNewRoutes");
const notifiRoutes = require("./routes/notificationRoutes");
const AppError = require("./utils/appError");
// Create app and integrate with many middleware
app.use(helmet()); // Set security HTTP headers
app.use(express.json());
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Qúa nhiều yêu cầu cho chức năng này. Vui lòng thử lại khi khác!",
});
app.use("/api", limiter); // Limit request from the same API

// CONNECT TO DAT5ABASE SERVER
app.use("/", (req, res, next) => {
  sql.connect(DATABASE_SERVER_CONFIG_DEV, (err) => {
    if (err) {
      res.statusCode = 500;
      res.json(err);
    } else {
      next();
    }
  });
});
// ROUTES
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/blog", blogRoutes);
app.use("/webhook", botRoutes);
app.use("/readNew", readNewRoutes);
app.use("/notification", notifiRoutes);
app.use("*", (req, res, next) => {
  console.log("URL SAI");
  const err = new AppError(404, "fail", "undefined route");
  res.send(err);
});

module.exports = app;
