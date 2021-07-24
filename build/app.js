"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const sql = require('msnodesqlv8');
var sql = require('mssql');
var Connection = require('tedious').Connection;
var express = require('express');
var cors = require('cors');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
var app = express();
var config_1 = require("./utils/config");
app.options('*', cors());
app.use(cors());
var apidocs = require('./swagger-api').apidocs;
var userRoutes = require('./routes/userRoutes');
var adminRoutes = require('./routes/adminRoutes');
var blogRoutes = require('./routes/blogRoutes');
var botRoutes = require('./routes/botRoutes');
var readNewRoutes = require('./routes/readNewRoutes');
var notifiRoutes = require('./routes/notificationRoutes');
var ggDriveRoutes = require('./routes/ggDriveRoutes');
var audioRoutes = require('./routes/audioRoutes');
var AppError = require('./utils/appError');
// Create app and integrate with many middleware
app.use(helmet()); // Set security HTTP headers
app.use(express.json());
var limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Qúa nhiều yêu cầu cho chức năng này. Vui lòng thử lại khi khác!',
});
app.use('/api', limiter); // Limit request from the same API
var path = require('path');
global.appRoot = path.resolve(__dirname);
// CONNECT TO DAT5ABASE SERVER
// app.use('/', (req, res, next) => {
//   const pool = new sql.ConnectionPool(DATABASE_SERVER_LOCAL);
//   pool
//     .connect()
//     .then(() => {
//       console.log('connect to db successfuly');
//       next();
//     })
//     .catch((err) => {
//       console.log('err', err);
//       res.statusCode = 500;
//       res.json(err);
//     });
// });
app.use('/', function (req, res, next) {
    sql.connect(config_1.DATABASE_SERVER_CONFIG_DEV, function (err) {
        if (err) {
            console.log('err', err);
            res.statusCode = 500;
            res.json(err);
        }
        else {
            console.log('Connect DB Succesfully');
            next();
        }
    });
});
// app.use('/', (req, res, next) => {
//   var connection = new Connection(DATABASE_SERVER_LOCAL);
//   connection.on('connect', function (err) {
//     // If no error, then good to proceed.
//     if (err) {
//       console.log('err', err);
//     } else {
//       console.log('Connected');
//     }
//   });
// });
// ROUTES
var specs = swaggerJsdoc(apidocs);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);
app.use('/webhook', botRoutes);
app.use('/readNew', readNewRoutes);
app.use('/notification', notifiRoutes);
app.use('/google-drive', ggDriveRoutes);
app.use('/audio', audioRoutes);
app.use('*', function (req, res, next) {
    console.log('URL SAI');
    var err = new AppError(404, 'fail', 'undefined route');
    res.send(err);
});
module.exports = app;
