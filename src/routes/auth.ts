import express, { Request } from 'express'
import { AuthController } from '../controller/AuthController'
import { UserService } from '../services/UserServices'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import registerValidator from '../validator/registerValidation'
import { NextFunction, Response } from 'express'
import { AuthRequest, RegisterUserRequest } from '../types'
import { TokenService } from '../services/TokenService'
import { RefreshToken } from '../entity/RefreshToken'
import loginValidator from '../validator/loginValidator'
import { CredentialService } from '../services/CredentialService'
import authenticate from '../middlewares/authenticate'
import validateRefreshToken from '../middlewares/validateRefresh'

const authRouter = express.Router()

// typeorm
const userRepository = AppDataSource.getRepository(User)

// instance of classes
const userService = new UserService(userRepository)

// dependency injection
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)

const tokenService = new TokenService(refreshTokenRepository)
const credentialService = new CredentialService()
// dependency injection
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
)

authRouter.post(
    '/register',
    registerValidator,
    (req: RegisterUserRequest, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
)

authRouter.post(
    '/login',
    loginValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
)

authRouter.get('/self', authenticate, (req: Request, res: Response) =>
    authController.self(req as AuthRequest, res),
)

authRouter.post(
    '/refresh',
    validateRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(req as AuthRequest, res, next),
)

export default authRouter
