// const sql = require('msnodesqlv8');
const sql = require('mssql');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
import { DATABASE_SERVER_CONFIG_DEV } from './utils/config';
import { HCommon } from './utils/log-system';

const { apidocs } = require('./swagger-api');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const botRoutes = require('./routes/botRoutes');
const readNewRoutes = require('./routes/readNewRoutes');
const notifiRoutes = require('./routes/notificationRoutes');
const ggDriveRoutes = require('./routes/ggDriveRoutes');
const audioRoutes = require('./routes/audioRoutes');
const speechRoutes = require('./routes/speechRoutes');
const AppError = require('./utils/appError');

app.options('*', cors());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create app and integrate with many middleware
app.use(helmet()); // Set security HTTP headers
app.use(express.json());
const limiter = rateLimit({
	max: 150,
	windowMs: 60 * 60 * 1000,
	message: 'Max request for this api.',
});
app.use('/ai', limiter);

const path = require('path');
global.appRoot = path.resolve(__dirname);

// Connect databse server
app.use('/', (req, res, next) => {
	sql.connect(DATABASE_SERVER_CONFIG_DEV, (err) => {
		if (err) {
			HCommon.logError(`[App] [Connect DB] Error: ${err}`);
			res.statusCode = 500;
			res.json(err);
		} else {
			next();
		}
	});
});

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
app.use('/ai', speechRoutes);
app.use('*', (req, res, next) => {
	console.log('URL SAI');
	const err = new AppError(404, 'fail', 'undefined route');
	res.send(err);
});

module.exports = app;
