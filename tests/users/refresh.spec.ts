import createJWKSMock from 'mock-jwks'
import { AppDataSource } from '../../src/config/data-source'
import { DataSource } from 'typeorm'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'
import app from '../../src/app'
import request from 'supertest'

describe('GET /auth/refresh', () => {
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

    it('should refresh the access token when a valid refresh token is provided', async () => {
        // Register user
        const userData = {
            firstName: 'runi',
            lastName: 'p',
            email: 'panda@mern.space',
            password: 'secret',
        }

        const userRepository = connection.getRepository(User)
        const savedUser = await userRepository.save({
            ...userData,
            role: Roles.CUSTOMER,
        })

        // Generate Refresh Token
        const refreshToken = jwks.token({
            sub: String(savedUser.id),
            role: savedUser.role,
            type: 'refresh',
        })

        // Send refresh token to refresh endpoint
        const response = await request(app)
            .get('/auth/refresh')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .send()

        // Logging the response for debugging
        console.log('response body:', response.body)

        // Assert response status code
        expect(response.status).toBe(200)

        // // Assert response contains a new access token
        // expect(response.body).toHaveProperty("accessToken");

        // Verify the new access token using the public key
    })
})
