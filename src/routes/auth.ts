import express from 'express'
import { AuthController } from '../controller/AuthController'
import { UserService } from '../services/UserServices'

const authRouter = express.Router()

// instance of classes
const userService = new UserService()

// dependency injection
const authController = new AuthController(userService)

authRouter.post('/register', (req, res) => authController.register(req, res))

export default authRouter
