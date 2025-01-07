// logger config file

import winston from 'winston'
import { Config } from '.'

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: {
        serviceName: 'auth-service', // matadata
    },

    // craete & format the logs inside file
    transports: [
        new winston.transports.File({
            level: 'info',
            dirname: 'logs',
            filename: 'error.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            // silent: true, // no logs
            silent: Config.NODE_ENV === 'test', // true
        }),

        new winston.transports.File({
            level: 'info',
            dirname: 'logs',
            filename: 'combined.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            // silent: true, // no logs
            silent: Config.NODE_ENV === 'test',
        }),

        // create & format the logs inside console terminal
        new winston.transports.Console({
            level: 'info',
            // format: winston.format.json(),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV === 'test', // true
        }),
    ],
})

export default logger
