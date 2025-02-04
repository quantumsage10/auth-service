import createHttpError from 'http-errors'
import { JwtPayload, sign } from 'jsonwebtoken'
import { Config } from '../config'
import { RefreshToken } from '../entity/RefreshToken'
import { User } from '../entity/User'
import { Repository } from 'typeorm'
import path from 'path'
import fs from 'fs'

export class TokenService {
    constructor(
        private readonly refreshTokenRepository: Repository<RefreshToken>,
    ) {}

    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer

        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, '../../certs/private.pem'),
            )
        } catch (err) {
            console.log(err)
            const error = createHttpError(
                500,
                'Error while reading private key',
            )
            throw error
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1d',
            issuer: 'auth-service',
        })

        return accessToken
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '1yr',
            issuer: 'auth-service',
            jwtid: String(payload.id),
        })
        return refreshToken
    }

    async persistRefreshToken(user: User) {
        // Persist the refresh token in Database
        // The code saves a refresh token for a user in the database, valid for one year.

        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365 // 1yr

        const newRefreshToken = await this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        })
        return newRefreshToken
    }

    async deleteRefreshToken(tokenId: number) {
        return await this.refreshTokenRepository.delete({ id: tokenId })
    }
}
