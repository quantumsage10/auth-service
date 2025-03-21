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
import logger from '../config/logger'

import { CreateUserRequest, UpdateUserRequest } from '../types'
import { UserService } from '../services/UserServices'
import { UserController } from '../controller/UserContriller'
import createUsersValidators from '../validator/create-users-validators'
import updateUserValidator from '../validator/update-user-validator'
import listUsersValidators from '../validator/list-users-validators'

const router = express.Router()

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const userController = new UserController(userService, logger)

router.post(
    '/',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    createUsersValidators,
    (req: CreateUserRequest, res: Response, next: NextFunction) =>
        userController.create(req, res, next),
)

router.patch(
    '/:id',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    (async (req: UpdateUserRequest, res: Response, next: NextFunction) =>
        await userController.update(req, res, next)) as RequestHandler,
)

// Pagination - query params data
router.get(
    '/',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    listUsersValidators,
    (req: Request, res: Response, next: NextFunction) =>
        userController.getAll(req, res, next),
)

router.get(
    '/:id',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) => userController.getOne(req, res, next),
)

router.delete(
    '/:id',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) => userController.destroy(req, res, next),
)

export default router
