const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const logDir = 'logs';  // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, printf, label, errors } = winston.format;

// Define log format
const logFormat = printf(info => {
  return `[${info.timestamp}] [${info.level.toUpperCase()}] : ${info.stack != undefined ? info.stack : typeof info.message == "object" ? JSON.stringify(info.message) : info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/info',
      filename: `%DATE%.info.log`,
      maxFiles: 30, // 30일 저장
      zippedArchive: true, 
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

//! 개발 환경일때 콘솔에 로그를 출력해준다.
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({    
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.colorize({
          all: true,
      }),
    )
  }));
}

module.exports = logger;