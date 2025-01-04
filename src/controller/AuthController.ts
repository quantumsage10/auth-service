import { Response } from 'express'
import { RegisterUserRequest } from '../types'
import { UserService } from '../services/UserServices'

export class AuthController {
    // decoupling
    userService: UserService
    constructor(userService: UserService) {
        this.userService = userService
    }

    async register(req: RegisterUserRequest, res: Response) {
        console.log('Body', req.body)
        const { firstName, lastName, email, password } = req.body

        // instance of class - problem is coupling
        // const userService = new UserService()

        await this.userService.create({ firstName, lastName, email, password })
        res.status(201).json()
    }
}
