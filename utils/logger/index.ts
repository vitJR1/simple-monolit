import winston from 'winston'

let date = new Date().toISOString();
const logFormat = winston.format.printf((info) =>
	`[${date}] ${info.level}: ${JSON.stringify({ ...info, level: undefined })}\n`
)

global.logger = winston.createLogger({
	format: winston.format.json(),
	defaultMeta: { service: '', category: 'gateway' },
	transports: [
		new winston.transports.Console({
			level: 'debug',
			format: winston.format.combine(winston.format.colorize(), logFormat)
		})
	]
})
