import { DataSource } from 'typeorm'
import request from 'supertest'
import createJWKSMock from 'mock-jwks'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Roles } from '../../src/constants'
import { User } from '../../src/entity/User'
import { Tenant } from '../../src/entity/Tenant'
import { createTenant } from '../utils'

describe('DELETE /users', () => {
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

            await request(app)
                .delete('/users/1')
                .set('Cookie', [`accessToken=${adminToken}`])
                .expect(200)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            expect(users).toHaveLength(0)
        })

        it('should return 500 if db connection interrrupted', async () => {
            // Create tenant first

            await connection.dropDatabase()

            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            const response = await request(app)
                .delete('/users/1')
                .set('Cookie', [`accessToken=${adminToken}`])

            expect(response.statusCode).toBe(500)
        })
    })
})
