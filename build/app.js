"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const sql = require('msnodesqlv8');
var sql = require('mssql');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
var app = express();
var config_1 = require("./utils/config");
var log_system_1 = require("./utils/log-system");
var apidocs = require('./swagger-api').apidocs;
var userRoutes = require('./routes/userRoutes');
var adminRoutes = require('./routes/adminRoutes');
var blogRoutes = require('./routes/blogRoutes');
var botRoutes = require('./routes/botRoutes');
var readNewRoutes = require('./routes/readNewRoutes');
var notifiRoutes = require('./routes/notificationRoutes');
var ggDriveRoutes = require('./routes/ggDriveRoutes');
var audioRoutes = require('./routes/audioRoutes');
var speechRoutes = require('./routes/speechRoutes');
var AppError = require('./utils/appError');
var allowlist = ['http://localhost:3007', 'https://taibui.info', 'https://homnaydocgi-client-2-iogc8.ondigitalocean.app'];
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    }
    else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Create app and integrate with many middleware
app.use(helmet()); // Set security HTTP headers
app.use(express.json());
var limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Max request for this api.',
});
app.use('/ai', limiter);
var path = require('path');
global.appRoot = path.resolve(__dirname);
// Connect databse server
app.use('/', function (req, res, next) {
    sql.connect(config_1.DATABASE_SERVER_CONFIG_DEV, function (err) {
        if (err) {
            log_system_1.HCommon.logError("[App] [Connect DB] Error: " + err);
            res.statusCode = 500;
            res.json(err);
        }
        else {
            next();
        }
    });
});
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
app.use('/ai', speechRoutes);
app.use('*', function (req, res, next) {
    console.log('URL SAI');
    var err = new AppError(404, 'fail', 'undefined route');
    res.send(err);
});
module.exports = app;
