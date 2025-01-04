import express from 'express'
import { AuthController } from '../controller/AuthController'
import { UserService } from '../services/UserServices'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'

const authRouter = express.Router()

// typeorm
const userRepository = AppDataSource.getRepository(User)

// instance of classes
const userService = new UserService(userRepository)

// dependency injection
const authController = new AuthController(userService, logger)

authRouter.post('/register', (req, res, next) =>
    authController.register(req, res, next),
)

export default authRouter
