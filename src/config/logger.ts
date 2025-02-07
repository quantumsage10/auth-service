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
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            // silent: true, // no logs
            silent: Config.NODE_ENV === 'test', // true
        }),
    ],
})

// const logger = winston.createLogger({
//     level: 'debug',  // ✅ Change to debug to capture SQL queries
//     defaultMeta: { serviceName: 'auth-service' },

//     transports: [
//         new winston.transports.File({
//             level: 'debug',  // ✅ Log all queries & debug info
//             dirname: 'logs',
//             filename: 'debug.log',
//             format: winston.format.combine(
//                 winston.format.timestamp(),
//                 winston.format.json(),
//             ),
//             silent: Config.NODE_ENV === 'test',
//         }),

//         new winston.transports.File({
//             level: 'info',
//             dirname: 'logs',
//             filename: 'combined.log',
//             format: winston.format.combine(
//                 winston.format.timestamp(),
//                 winston.format.json(),
//             ),
//             silent: Config.NODE_ENV === 'test',
//         }),

//         new winston.transports.Console({
//             level: 'debug',  // ✅ Capture SQL logs in console
//             format: winston.format.combine(
//                 winston.format.timestamp(),
//                 winston.format.json(),
//             ),
//             silent: Config.NODE_ENV === 'test',
//         }),
//     ],
// })

export default logger
