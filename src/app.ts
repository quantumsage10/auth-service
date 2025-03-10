import 'reflect-metadata'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth'
import tenantRouter from './routes/tenant'
import userRouter from './routes/user'
import cors from 'cors'
import { globalErrorHandler } from './middlewares/globalErrorHandler'
import express from 'express'

const app = express()

app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:8000',
        ],
        credentials: true,
    }),
)

app.use(
    express.static('public', {
        maxAge: '1yr', // Cache for one year
    }),
)

app.use(cookieParser())

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to Auth service')
})

app.use('/auth', authRouter)

app.use('/tenants', tenantRouter)

app.use('/users', userRouter)

app.use(globalErrorHandler)

export default app
