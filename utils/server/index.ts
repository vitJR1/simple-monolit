import '../expressUpgrade'
import express from 'express'
import morgan from 'morgan'
import morganJson from 'morgan-json'
import cookieParser from 'cookie-parser'
import * as http from 'http'
import swaggerUi from 'swagger-ui-express'
import swaggerApi from '../../doc/swagger.json'
import isSwaggerEnabled from '../middleware/isSwaggerEnabled'
import { RegisterRoutes } from '../../src/router/routes'
import {addDataSourceToRequest} from "../database/middleware";
import source from '../database'

const app = express();

app.use(morgan(morganJson({
	short: ':method :url :status',
	length: ':res[content-length]',
	'response-time': ':response-time ms'
})));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
source.initialize().then(s => app.use(addDataSourceToRequest(s)))

app.use('/docs', isSwaggerEnabled, swaggerUi.serve, swaggerUi.setup(swaggerApi, { explorer: false }))


RegisterRoutes(app)

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr?.port;
	logger.debug('Listening on ' + bind);
}
