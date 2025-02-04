import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express'

import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'

import { TokenService } from '../services/TokenService'
import { RefreshToken } from '../entity/RefreshToken'
import { CredentialService } from '../services/CredentialService'
import authenticate from '../middlewares/authenticate'
import { AuthRequest } from '../types'

import parseRefreshToken from '../middlewares/parseRefreshToken'
import { UserService } from '../services/UserServices'
import { AuthController } from '../controller/AuthController'
import loginValidator from '../validator/loginValidator'
import registerValidator from '../validator/registerValidator'
import validateRefreshToken from '../middlewares/validateRefreshToken'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)
const tokenService = new TokenService(refreshTokenRepository)
const credentialService = new CredentialService()
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
)

router.post('/register', registerValidator, (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await authController.register(req, res, next)
}) as RequestHandler)

router.post(
    '/login',
    loginValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
)

router.get(
    '/self',
    authenticate as RequestHandler,
    (req: Request, res: Response) =>
        authController.self(req as AuthRequest, res),
)

router.post(
    '/refresh',
    validateRefreshToken as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(req as AuthRequest, res, next),
)

router.post(
    '/logout',
    // authenticate as RequestHandler,
    parseRefreshToken as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        authController.logout(req as AuthRequest, res, next),
)

export default router
