import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'
import bcrypt from 'bcryptjs'
import { isJwt } from '../utils'
import createJWKSMock from 'mock-jwks'

describe('POST /auth/logout', () => {
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
            role: Roles.CUSTOMER,
        })
    })

    afterAll(async () => {
        await connection.destroy()
    })

    afterEach(() => {
        jwks.stop()
    })

    describe('Given a logged-in user', () => {
        // it('should logout the user & return a 200 status', async () => {
        //     // TRUNCATE ALL TABLES
        //     // const truncateTables = async (connection: DataSource) => {
        //     //     const entities = connection.entityMetadatas
        //     //     for (const entity of entities) {
        //     //         const repository = connection.getRepository(entity.target)
        //     //         await repository.query(
        //     //             `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`,
        //     //         )
        //     //     }
        //     // }
        //     // await truncateTables(connection)
        //     // Arrange: create a user in the DB
        //     const userData = {
        //         firstName: 'jane',
        //         lastName: 'doe',
        //         email: 'jannee@mern.space',
        //         password: 'secret',
        //     }
        //      await request(app)
        //     .post('/auth/register')
        //     .send(userData)
        //     .expect(201)
        //     // const hashedPassword = await bcrypt.hash(userData.password, 10)
        //     // const userRepository = connection.getRepository(User)
        //     // await userRepository.save({
        //     //     ...userData,
        //     //     password: hashedPassword,
        //     //     role: Roles.CUSTOMER,
        //     // })
        //     interface Headers {
        //         ['set-cookie']: string[]
        //     }
        //     // Act: login the user
        //     const loginResponse = await request(app)
        //         .post('/auth/login')
        //         .send({ email: userData.email, password: userData.password })
        //         .expect(200)
        //     const cookies =
        //         (loginResponse.headers as unknown as Headers)['set-cookie'] ||
        //         []
        //     let accessToken: string | null = null
        //     let refreshToken: string | null = null
        //     cookies.forEach((cookie) => {
        //         if (cookie.startsWith('accessToken=')) {
        //             accessToken = cookie.split(';')[0].split('=')[1]
        //         }
        //         if (cookie.startsWith('refreshToken=')) {
        //             refreshToken = cookie.split(';')[0].split('=')[1]
        //         }
        //     })
        //     // Act: make a logout request with the cookies
        //     const logoutResponse = await request(app)
        //         .post('/auth/logout')
        //         .set('Cookie', [
        //             `accessToken=${accessToken}`,
        //             `refreshToken=${refreshToken}`,
        //         ])
        //     expect(isJwt(accessToken)).toBeTruthy()
        //     expect(isJwt(refreshToken)).toBeTruthy()
        //     expect(logoutResponse.statusCode).toBe(401)
        // }, 500000)
        // it('should return 401 if no valid cookies are provided', async () => {
        //     // Act: make a logout request with no cookies
        //     const logoutResponse = await request(app).post('/auth/logout')
        //     // Assert: check for failure due to missing cookies
        //     expect(logoutResponse.statusCode).toBe(401) // Expect 401 Unauthorized
        // })
        // it('should return 401 if the user is not logged in (invalid cookies)', async () => {
        //     // Act: make a logout request with invalid cookies
        //     const logoutResponse = await request(app)
        //         .post('/auth/logout')
        //         .set('Cookie', [
        //             'accessToken=invalid_token',
        //             'refreshToken=invalid_token',
        //         ])
        //         .send()
        //     // Assert: check for failure due to invalid cookies
        //     expect(logoutResponse.statusCode).toBe(401) // Expect 401 Unauthorized
        // })
    })
})
