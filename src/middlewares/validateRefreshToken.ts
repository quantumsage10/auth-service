import { expressjwt } from 'express-jwt'
import { Config } from '../config'
import { Request } from 'express'
import { AuthCookie, IRefreshTokenPayload } from '../types'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import logger from '../config/logger'

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie
        return refreshToken
    },

    // check whether refresh token exists in database
    async isRevoked(request: Request, token) {
        console.log('VALIDATE REFRESH TOKEN', token)

        try {
            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken)
            const refreshToken = await refreshTokenRepo.findOne({
                where: {
                    id: Number((token?.payload as IRefreshTokenPayload).id),
                    user: { id: Number(token?.payload.sub) },
                },
            })
            // if not refreshtoken in db
            return refreshToken === null // if null === null , true else false
        } catch (err) {
            logger.error('Error while getting the refresh token', {
                id: (token?.payload as IRefreshTokenPayload).id,
            })
            console.log('validate Refresh token', err)
        }
        return true
    },
})
