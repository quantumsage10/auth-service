import fs from 'fs'
import createHttpError from 'http-errors'
import { JwtPayload, sign } from 'jsonwebtoken'
import path from 'path'
import { Config } from '../config'

export class TokenService {
    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer

        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, '../../certs/public.pem'),
            )
        } catch (err) {
            const error = createHttpError(
                500,
                'Error while reading private key',
            )
            throw error
            console.log(err)
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1hr',
            issuer: 'auth-service',
        })
        return accessToken
    }

    generateRefreshToken(payload: JwtPayload) {
        // console.log(payload)
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '1yr',
            issuer: 'auth-service',
            jwtid: String(payload.id),
        })
        return refreshToken
    }
}
