const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, splat } = format;
const { Loggly } = require('winston-loggly-bulk');

const winston = createLogger({
    format: combine(
        timestamp(),
        splat(),
        printf(({ level, message, timestamp }) => String().concat(`[${level}][${timestamp}]`, message))
    ),
    transports: [
        new transports.Console(),
        new Loggly({
            token: "2068b73d-e6c1-4a2e-b7ec-34dad9dc5b69",
            subdomain: "malotech",
            tags: ['Malotech'],
            json: true,
            timestamp: true,
            networkErrorsOnConsole: true,
            bufferOptions: { size: 1000, retriesInMilliSeconds: 60 * 1000 }
        })
    ]
});

module.exports = winston;