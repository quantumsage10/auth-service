import { NextFunction, Response } from 'express'
import { RegisterUserRequest } from '../types'
import { UserService } from '../services/UserServices'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
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

            this.logger.info('User has been registered', { id: user.id })

            const accessToken = 'uewhbjnfkj'
            const refreshToken = 'qrheigk'

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1hour
                httpOnly: true,
            })

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1hour
                httpOnly: true,
            })

            res.status(201).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }
}
