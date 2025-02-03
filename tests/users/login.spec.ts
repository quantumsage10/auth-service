import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'
import bcrypt from 'bcryptjs'
import { isJwt } from '../utils'

describe('POST/auth/login', () => {
    let connection: DataSource

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

    describe('Given all Fields', () => {
        it('should login the user & by default status code is 200', async () => {
            // Arrange
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'runi@mern.space',
                password: 'secret',
            }

            // hash the passowrd & store in the db
            const hashedPassword = await bcrypt.hash(userData.password, 10)

            const userRepository = connection.getRepository(User)
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            })

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send({ email: userData.email, password: userData.password })

            // Assert
            expect(response.statusCode).toBe(200)
        })

        it('should return the access token and refresh token inside a cookie', async () => {
            // Arrange
            const userData = {
                firstName: 'admin',
                lastName: 'r',
                email: 'admin@mern.space',
                password: 'secret',
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10)

            const userRepository = connection.getRepository(User)
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.ADMIN,
            })

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send({ email: userData.email, password: userData.password })

            interface Headers {
                ['set-cookie']: string[]
            }
            // Assert
            let accessToken: string | null = null
            let refreshToken: string | null = null

            const cookies =
                (response.headers as unknown as Headers)['set-cookie'] || []

            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0].split('=')[1]
                }

                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0].split('=')[1]
                }
            })
            expect(accessToken).not.toBeNull()
            expect(refreshToken).not.toBeNull()

            expect(isJwt(accessToken)).toBeTruthy()
            expect(isJwt(refreshToken)).toBeTruthy()
            expect(response.statusCode).toBe(200)
        })
        it('should return the 400 if email or password is wrong', async () => {
            // Arrange
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: 'password',
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10)

            const userRepository = connection.getRepository(User)
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            })

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send({ email: userData.email, password: 'wrongPassword' })

            // Assert

            expect(response.statusCode).toBe(400)
        })
    })
})
