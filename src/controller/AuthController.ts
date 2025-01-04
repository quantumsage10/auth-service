import { NextFunction, Response } from 'express'
import { RegisterUserRequest } from '../types'
import { UserService } from '../services/UserServices'

export class AuthController {
    constructor(private userService: UserService) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        // console.log('Body', req.body)
        const { firstName, lastName, email, password } = req.body

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            })

            //  console.log("User:",user)

            res.status(201).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }
}
