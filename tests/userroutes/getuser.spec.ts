import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constants'
import { createTenant } from '../utils'
import { User } from '../../src/entity/User'

describe('GET /users', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>
    let adminToken: string

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
        jwks = createJWKSMock('http://localhost:5501')
    })

    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
        jwks.start()

        // accessToken
        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN,
        })
    })

    afterAll(async () => {
        await connection.destroy()
    })

    afterEach(() => {
        jwks.stop()
    })

    describe('Given all fields', () => {
        it('should return a many users', async () => {
            const tenant = await createTenant(connection.getRepository(Tenant))

            // Register user
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'runi@mern.space',
                password: 'secrettttyyy',
                tenantId: tenant.id,
                role: Roles.MANAGER,
            }

            // Add token to cookie
            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData)
                .expect(201)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            console.log('USERS DB:- ', users)

            const response = await request(app)
                .get('/users')
                .query({ currentPage: 1, perPage: 6 })
                .set('Cookie', [`accessToken=${adminToken}`])

            expect(response.statusCode).toBe(200)

            expect(response.body).toMatchObject({
                currentPage: 1,
                perPage: 6,
                total: 1,
                data: users,
            })
        })

        it('should return a single user', async () => {
            const tenant = await createTenant(connection.getRepository(Tenant))

            // Register user
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'runi@mern.space',
                password: 'secrettttyyy',
                tenantId: tenant.id,
                role: Roles.MANAGER,
            }

            // Add token to cookie
            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData)

            const response = await request(app)
                .get('/users/1')
                .set('Cookie', [`accessToken=${adminToken}`])

            expect(response.statusCode).toBe(200)
        })

        it('should return 200 even if empty users', async () => {
            const response = await request(app)
                .get('/users')
                .set('Cookie', [`accessToken=${adminToken}`])

            expect(response.statusCode).toBe(200)

            expect(response.body).toMatchObject({
                currentPage: 1,
                perPage: 6,
                total: 0,
                data: [],
            })
        })
    })
})
