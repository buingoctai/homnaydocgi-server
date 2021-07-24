// const sql = require('msnodesqlv8');
const sql = require('mssql');
var Connection = require('tedious').Connection;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
import {DATABASE_SERVER_CONFIG_DEV} from './utils/config';

app.options('*', cors());
app.use(cors());

const { apidocs } = require('./swagger-api');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const botRoutes = require('./routes/botRoutes');
const readNewRoutes = require('./routes/readNewRoutes');
const notifiRoutes = require('./routes/notificationRoutes');
const ggDriveRoutes = require('./routes/ggDriveRoutes');
const audioRoutes = require('./routes/audioRoutes');

const AppError = require('./utils/appError');
// Create app and integrate with many middleware
app.use(helmet()); // Set security HTTP headers
app.use(express.json());
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Qúa nhiều yêu cầu cho chức năng này. Vui lòng thử lại khi khác!',
});
app.use('/api', limiter); // Limit request from the same API

const path = require('path');
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
app.use('/', (req, res, next) => {
  sql.connect(DATABASE_SERVER_CONFIG_DEV, (err) => {
    if (err) {
      console.log('err', err);
      res.statusCode = 500;
      res.json(err);
    } else {
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

const specs = swaggerJsdoc(apidocs);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);
app.use('/webhook', botRoutes);
app.use('/readNew', readNewRoutes);
app.use('/notification', notifiRoutes);
app.use('/google-drive', ggDriveRoutes);
app.use('/audio', audioRoutes);
app.use('*', (req, res, next) => {
  console.log('URL SAI');
  const err = new AppError(404, 'fail', 'undefined route');
  res.send(err);
});

module.exports = app;
