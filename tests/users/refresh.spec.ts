import jwt from 'jsonwebtoken'
import { AppDataSource } from '../../src/config/data-source'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import request from 'supertest'
import { RefreshToken } from '../../src/entity/RefreshToken'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'
import dotenv from 'dotenv'
dotenv.config()

describe('POST /auth/refresh', () => {
    let connection: DataSource
    const secret = process.env.REFRESH_TOKEN_SECRET || '' // Shared secret for HS256

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
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

        const userRepository = AppDataSource.getRepository(User)
        const savedUser = await userRepository.save({
            ...userData,
            role: Roles.CUSTOMER,
        })

        // Save a refresh token in the database
        const refreshTokenRepo = AppDataSource.getRepository(RefreshToken)
        const refreshTokenEntity = refreshTokenRepo.create({
            user: savedUser,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
        })
        await refreshTokenRepo.save(refreshTokenEntity)

        // Generate Refresh Token using HS256
        const refreshToken = jwt.sign(
            {
                id: refreshTokenEntity.id,
                sub: String(savedUser.id),
                role: savedUser.role,
            },
            secret, // HS256 shared secret
            { algorithm: 'HS256', expiresIn: '1h' },
        )

        // Send refresh token to refresh endpoint
        const response = await request(app)
            .post('/auth/refresh')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .send()

        // Assert response
        console.log('response body:', response.body)
        expect(response.status).toBe(200) // Expect success
    })
})
