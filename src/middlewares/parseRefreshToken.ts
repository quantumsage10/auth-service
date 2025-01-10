import { expressjwt } from 'express-jwt'
import { Config } from '../config'
import { Request } from 'express'
import { AuthCookie } from '../types'

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],

    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie

        // ; Max-Age=31536000; Domain=localhost; Path=/; Expires=Fri, 09 Jan 2026 14:13:07 GMT; HttpOnly; SameSite=Strict'
        return refreshToken
    },
})
