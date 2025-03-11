import 'reflect-metadata'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth'
import tenantRouter from './routes/tenant'
import userRouter from './routes/user'
import cors from 'cors'
import { globalErrorHandler } from './middlewares/globalErrorHandler'
import express from 'express'
import { Config } from './config'

const app = express()

const ALLOWED_DOMAINS = [Config.CLIENT_UI_DOMAIN, Config.ADMIN_UI_DOMAIN]

app.use(cors({ origin: ALLOWED_DOMAINS as string[] }))

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
