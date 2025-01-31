import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { Roles } from '../constants'

import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import { UserController } from '../controller/UserContriller'
import { UserService } from '../services/UserServices'
import listUsersValidators from '../validator/list-users-validators'
import logger from '../config/logger'
import { CreateUserRequest } from '../types'
import createUsersValidators from '../validator/create-users-validators'

const userRouter = express.Router()

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const userController = new UserController(userService, logger)

userRouter.post(
    '/',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    createUsersValidators,
    (req: CreateUserRequest, res: Response, next: NextFunction) =>
        userController.create(req, res, next),
)

userRouter.get(
    '/',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    listUsersValidators,
    (req: Request, res: Response, next: NextFunction) =>
        userController.getAll(req, res, next),
)

export default userRouter
