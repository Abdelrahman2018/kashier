import winston from 'winston';
import path from 'path';

// const Reset = '\x1b[0m';
// Bright = '\x1b[1m';
// Dim = '\x1b[2m';
// Underscore = '\x1b[4m';
// Blink = '\x1b[5m';
// Reverse = '\x1b[7m';
// Hidden = '\x1b[8m';

// FgBlack = '\x1b[30m';
// const FgRed = '\x1b[31m';
// FgGreen = '\x1b[32m';
// FgYellow = '\x1b[33m';
// FgBlue = '\x1b[34m';
// FgMagenta = '\x1b[35m';
// FgCyan = '\x1b[36m';
// FgWhite = '\x1b[37m';

// BgBlack = '\x1b[40m';
// const BgRed = '\x1b[41m';
// BgGreen = '\x1b[42m';
// BgYellow = '\x1b[43m';
// BgBlue = '\x1b[44m';
// BgMagenta = '\x1b[45m';
// BgCyan = '\x1b[46m';
// const BgWhite = '\x1b[47m';

const { createLogger, format } = winston;
// const logPath = path.join(__dirname, '../../logs');

const LEVELS = {
  error: { color: 'red' },
  warn: { color: 'yellow' },
  info: { color: 'bold' },
  verbose: { color: 'gray' },
  debug: { color: 'dim' },
  silly: { color: 'blue' },
};

winston.addColors(
  Object.keys(LEVELS).reduce((prev, level) => {
    prev[level] = LEVELS[level].color;
    return prev;
  }, {})
);

const consoleTransport = new winston.transports.Console({
  format: format.combine(
    format.colorize({ all: true }),
    format.printf(({ timestamp, level, message, ...args }) => {
      const output = [timestamp, level, '==>', message];
      return output.join(' ');
    })
  ),
  handleExceptions: true,
});

const fileTransportArr = [
  // new winston.transports.File({
  //   filename: path.join(logPath, 'all.log'),
  // }),
  // new winston.transports.File({
  //   filename: path.join(logPath, 'errors.log'),
  //   level: 'error',
  // }),
];

const transports = [];

transports.push(consoleTransport);
transports.push(...fileTransportArr);

const defaultFormat = format.combine(
  format.timestamp({ format: 'DD-MM HH:mm:ss' }),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = createLogger({
  levels: Object.keys(LEVELS).reduce((prev, level, index) => {
    prev[level] = index;
    return prev;
  }, {}),
  format: defaultFormat,
  transports: [...transports],
  exitOnError: false,
});

Object.keys(LEVELS).forEach((level) => {
  const original = logger[level];
  logger[level] = (...params) => {
    for (let i = 0; i < params.length; i++) {
      if (params[i] instanceof Error && params[i].stack) {
        const e = params[i];
        const lines = e.stack.split('\n');
        lines.shift();
        lines.unshift(
          `${e.name}:` + (e.code ? `${e.code}` : '') + ` ${e.message}`
        );
        params[i] = lines.join('\n');
      } else if (typeof params[i] === 'string' && params[i].length > 1000) {
        params[i] = params[i].substring(0, 1000) + '[MORE]';
      } else if (Array.isArray(params[i]) && params[i].length > 20) {
        params[i] = params[i].slice(0, 20);
        params[i].push('[MORE]');
      }
    }
    return original(...params);
  };
});

export default logger;
