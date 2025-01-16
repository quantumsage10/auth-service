import express from 'express'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { Roles } from '../constants'

import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import { UserController } from '../controller/UserContriller'
import { UserService } from '../services/UserServices'

const userRouter = express.Router()

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const userController = new UserController(userService)

userRouter.post('/', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.create(req, res, next),
)

export default userRouter
