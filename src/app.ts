import express, { Request, Response, NextFunction } from 'express'
import logger from './config/logger'
import { HttpError } from 'http-errors'
const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Welcome to auth service')
})

// global error handler middleware

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    })

    next()
})

export default app
