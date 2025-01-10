import { NextFunction, Response } from 'express'
import { AuthRequest, RegisterUserRequest } from '../types'
import { UserService } from '../services/UserServices'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { JwtPayload } from 'jsonwebtoken'
import { TokenService } from '../services/TokenService'
import createHttpError from 'http-errors'
import { CredentialService } from '../services/CredentialService'

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const { firstName, lastName, email, password } = req.body

        const result = validationResult(req)
        if (!result.isEmpty()) {
            //    return res.send(`Hello, ${req.query.person}`)
            res.status(400).json({ errors: result.array() })
        }

        this.logger.debug('New Request to register a User', {
            firstName,
            lastName,
            email,
            password: '*******',
        })

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            })

            this.logger.info('User has been registered', { sub: user.id })

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            // persist refresh token in database (a record for refresh token)
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user)
            // Generate a refresh token with the payload(userId & role), including the new token ID as a string.
            // It then generates a secure token string (with user details and the token ID) that can be used by the client to request new access tokens when the current ones expire.

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1hour
                httpOnly: true,
            })

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1year
                httpOnly: true,
            })

            res.status(201).json({ sub: user.id })
        } catch (error) {
            next(error)
            return
        }
    }

    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        // raw details from request body
        const { email, password } = req.body

        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
        }

        this.logger.debug('New Request to login a user', {
            email,
            password: '*******',
        })

        // Check if useranme(email) exists in database

        try {
            const user = await this.userService.findByEmail(email)

            if (!user) {
                const error = createHttpError(
                    400,
                    "Email or Password doesn't match!",
                )
                next(error)
                return
            }

            // Compare passsword

            const passwordMatch = await this.credentialService.comparePassword(
                // raw password from user login request
                password,

                // previously saved password in db
                user.password,
            )

            if (!passwordMatch) {
                const error = createHttpError(
                    400,
                    'Email or password does not match.',
                )
                next(error)
                return
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            // generate Tokens

            const accessToken = this.tokenService.generateAccessToken(payload)

            // persist in db checks
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user)

            // new refresh token when earlier expires
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })

            // Add tokens to Cookies

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1hour
                httpOnly: true,
            })

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1year
                httpOnly: true,
            })

            // Return the response (id)

            res.json({ sub: user.id })
        } catch (error) {
            next(error)
            return
        }
    }

    async self(req: AuthRequest, res: Response) {
        console.log('AUTH:', req.auth)
        // token req.auth.sub

        const user = await this.userService.findById(Number(req.auth.sub))

        // console.log("Decoded sub:", Number(req.auth.sub));

        // console.log("USER SELF:-",user)
        res.json({ ...user, password: undefined })
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            const user = await this.userService.findById(Number(req.auth.sub))
            if (!user) {
                const error = createHttpError(
                    400,
                    'User with the token could not find',
                )
                next(error)
                return
            }

            // Persist the refresh token - check in database
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user)

            // Delete old refresh token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id))

            // generate refresh token, if access token expires
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1h
                httpOnly: true, // Very important
            })

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                httpOnly: true, // Very important
            })

            this.logger.info('User has been logged in', { id: user.id })
            res.json({ id: user.id })
        } catch (err) {
            next(err)
            return
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        console.log('AUTH LOGOUT:-', req.auth)
        console.log('AUTH USER ID', req.auth.id)
        try {
            // here req takes an id & sub field also
            await this.tokenService.deleteRefreshToken(Number(req.auth.id))

            this.logger.info('Refresh Token has been deleted', {
                id: req.auth.id,
            })
            this.logger.info('User has been logged out', { id: req.auth.sub })

            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            res.json({})
        } catch (err) {
            this.logger.error('Error during logout', { error: err })
            next(err)
        }
    }
}
