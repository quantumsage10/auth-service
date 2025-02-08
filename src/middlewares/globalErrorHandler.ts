/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'
import { v4 as uuidv4 } from 'uuid'
import logger from '../config/logger'

export const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errorId = uuidv4()
    const statusCode = err.status || 500

    // if inside production mode, do not show original message cuz we are sending to client
    const isProduction = process.env.NODE_ENV === 'production'
    const message = isProduction ? 'Internal server error' : err.message

    // show original message inside console for developers
    logger.error(err.message, {
        id: errorId, // uuid
        statusCode, // 400 500
        error: err.stack, // full stack functions
        path: req.path, // endpoint
        method: req.method, // crud
    })

    // sending to client
    res.status(statusCode).json({
        errors: [
            {
                ref: errorId,
                type: err.name, // syntax, db error can check error type (if/else)
                msg: message, // if production error
                path: req.path, // endpoint
                method: req.method, // crud
                location: 'server',
                stack: isProduction ? null : err.stack,
            },
        ],
    })
}
