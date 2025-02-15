import { DataSource } from 'typeorm'
import request from 'supertest'
import createJWKSMock from 'mock-jwks'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Roles } from '../../src/constants'
import { User } from '../../src/entity/User'
import { Tenant } from '../../src/entity/Tenant'
import { createTenant } from '../utils'

describe('PATCH /users', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501')
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        jwks.start()
        await connection.dropDatabase()
        await connection.synchronize()
    })

    afterEach(() => {
        jwks.stop()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should persist the user in the database', async () => {
            // Create tenant first
            const tenant = await createTenant(connection.getRepository(Tenant))

            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

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

            const userUpdatedData = {
                firstName: 'globe',
                lastName: 'panda',
                role: Roles.CUSTOMER,
                email: 'globe@mern.space',
                tenantId: tenant.id,
            }

            await request(app)
                .patch('/users/1')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userUpdatedData)
                .expect(200)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            expect(users).toHaveLength(1)
            expect(users[0].email).toBe(userData.email)
        })
    })
})
