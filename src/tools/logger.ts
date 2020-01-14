import * as moment from 'moment';

interface ILogger {
	clearLine(): void;
	debug(message?: any, ...params: Array<any>): void;
	error(message?: any, ...params: Array<any>): void;
	log(message?: any, ...params: Array<any>): void;
	warn(message?: any, ...params: Array<any>): void;
	raw?(message?: any): void;
}

const CONSOLE = {
	Blink: '\x1b[5m',
	BoldOff: '\x1b[22m',
	BoldOn: '\x1b[1m',
	Bright: '\x1b[1m',
	Dim: '\x1b[2m',
	Hidden: '\x1b[8m',
	Reset: '\x1b[0m',
	Reverse: '\x1b[7m',
	Underscore: '\x1b[4m',

	FgBlack: '\x1b[30m',
	FgBlue: '\x1b[34m',
	FgCyan: '\x1b[36m',
	FgGreen: '\x1b[32m',
	FgMagenta: '\x1b[35m',
	FgRed: '\x1b[31m',
	FgWhite: '\x1b[37m',
	FgYellow: '\x1b[33m',

	BgBlack: '\x1b[40m',
	BgBlue: '\x1b[44m',
	BgCyan: '\x1b[46m',
	BgGreen: '\x1b[42m',
	BgMagenta: '\x1b[45m',
	BgRed: '\x1b[41m',
	BgWhite: '\x1b[47m',
	BgYellow: '\x1b[43m',
};

const DEBUG = 'debug';
const DEBUG_DB = 'debugDB';
const ERROR = 'error';
const LOG = 'log';
const WARN = 'warn';
const PROGRESS = 'progress';

const loggers: Array<ILogger> = [];

const displayed = {
	debug: false,
	debugDB: false,
	error: true,
	log: true,
	progress: true,
	warn: false,
};

function addLogger(l: ILogger) {
	loggers.push(l);
}

function getEmojiFor(logType) {
	switch (logType) {
		case DEBUG:
			return '💬';
		case WARN:
			return '‼️ ';
		case LOG:
			return 'ℹ️ ';
		case ERROR:
			return '⛔';
		case PROGRESS:
			return '🏗️';
		default:
			return '📖';
	}
}

function getColorMessageFor(logType) {
	switch (logType) {
		case LOG:
			return `${CONSOLE.FgBlue}${CONSOLE.BoldOn}%s %s${CONSOLE.Reset}`;
		case WARN:
			return `${CONSOLE.FgYellow}${CONSOLE.BoldOn}%s %s${CONSOLE.Reset}`;
		case DEBUG:
			return `${CONSOLE.FgCyan}%s %s${CONSOLE.Reset}`;
		case ERROR:
			return `${CONSOLE.FgRed}${CONSOLE.BoldOn}%s %s${CONSOLE.Reset}`;
		case PROGRESS:
			return `${CONSOLE.FgYellow}${CONSOLE.BoldOff}%s %s${CONSOLE.Reset}`;
		default:
			return '%s %s';
	}
}

function callLoggers(logType: string, message?: any, ...params: Array<any>) {
	for (const logger of loggers) {
		if (logger[logType]) {
			logger[logType](
				getColorMessageFor(logType),
				`${getEmojiFor(logType)}  [${moment().format('hh:mm:ss')}]`,
				message,
				...params,
			);
		}
	}
}

function callRawLoggers(logType: string, message?: any, ...params: Array<any>) {
	for (const logger of loggers) {
		if (logger.raw) {
			const firstReplacement = `${getEmojiFor(logType)}  [${moment().format('hh:mm:ss')}]`;
			const fullMessage = `${getColorMessageFor(logType)
				.replace(/\%s/, firstReplacement)
				.replace(/\%s/, message)} ${
				params.length ? JSON.stringify(params, null, 2) : ''
			} \r`;

			logger.clearLine();
			logger.raw(fullMessage);
		}
	}
}

function setDebug(value: boolean) {
	displayed[DEBUG] = value;
}

function setDebugDB(value: boolean) {
	displayed[DEBUG_DB] = value;
}

function setWarn(value: boolean) {
	displayed[WARN] = value;
}

function debug(message?: any, ...params: Array<any>) {
	if (displayed[DEBUG]) {
		callLoggers(DEBUG, message, ...params);
	}
}

function warn(message?: any, ...params: Array<any>) {
	if (displayed[WARN]) {
		callLoggers(WARN, message, ...params);
	}
}

function log(message?: any, ...params: Array<any>) {
	callLoggers(LOG, message, ...params);
}

function error(message?: any, ...params: Array<any>) {
	callLoggers(ERROR, message, ...params);
}

function progress(message?: any, ...params: Array<any>) {
	callRawLoggers(PROGRESS, message, ...params);
}

function dbDebug(message?: any) {
	if (displayed[DEBUG_DB]) {
		callLoggers(DEBUG, message);
	}
}

export default {
	addLogger,
	setDebug,
	setDebugDB,
	setWarn,

	d: debug,
	dbD: dbDebug,
	e: error,
	l: log,
	p: progress,
	w: warn,

	debug,
	error,
	info: log,
	progress,
	trace: log,
	warn,
};
