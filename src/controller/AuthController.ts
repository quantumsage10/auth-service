import { Response } from 'express'
import { RegisterUserRequest } from '../types'
import { UserService } from '../services/UserServices'

export class AuthController {
    constructor(private userService: UserService) {}

    async register(req: RegisterUserRequest, res: Response) {
        console.log('Body', req.body)
        const { firstName, lastName, email, password } = req.body

        await this.userService.create({ firstName, lastName, email, password })
        res.status(201).json()
    }
}
