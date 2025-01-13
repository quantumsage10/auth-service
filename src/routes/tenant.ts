import express from 'express'
import { TenantController } from '../controller/TenantController'
import { TenantService } from '../services/TenantService'
import { AppDataSource } from '../config/data-source'
import { Tenant } from '../entity/Tenant'
import logger from '../config/logger'
import authenticate from '../middlewares/authenticate'

const tenantRouter = express.Router()

const userRepository = AppDataSource.getRepository(Tenant)

const tenantService = new TenantService(userRepository)

const tenantController = new TenantController(tenantService, logger)

tenantRouter.post('/', authenticate, (req, res, next) =>
    tenantController.create(req, res, next),
)

export default tenantRouter
