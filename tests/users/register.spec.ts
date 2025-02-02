import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import { Roles } from '../../src/constants'
import { isJwt } from '../utils'
import { RefreshToken } from '../../src/entity/RefreshToken'

describe('POST /auth/register', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
        // await truncateTables(connection)
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'runi@mern.space',
                password: 'secret',
            }
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            expect(response.statusCode).toBe(201)
        })

        it('should return valid json response', async () => {
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'runi@mern.space',
                password: 'secret',
            }
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'))
        })

        it('should persist the user in the database', async () => {
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'runi@mern.space',
                password: 'secret',
            }
            await request(app).post('/auth/register').send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            console.log('USERS: -', users)

            expect(users).toHaveLength(1)
            expect(users[0].firstName).toBe(userData.firstName)
            expect(users[0].lastName).toBe(userData.lastName)
            expect(users[0].email).toBe(userData.email)
        })

        it('should assign a customer role', async () => {
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'runi@mern.space',
                password: 'secret',
            }

            await request(app).post('/auth/register').send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            console.log('USERS MAIN:', users)

            expect(users[0]).toHaveProperty('role')
            expect(users[0].role).toBe(Roles.CUSTOMER)
        })

        it('should store the hashed password in the database', async () => {
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'runi@mern.space',
                password: 'secret',
            }

            await request(app).post('/auth/register').send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            expect(users[0].password).not.toBe(userData.password)

            expect(users[0].password).toHaveLength(60)
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/)
        })

        it('should return 400 status code if email is already exists', async () => {
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'runi@mern.space',
                password: 'secret',
            }
            const userRepository = connection.getRepository(User)
            await userRepository.save({ ...userData, role: Roles.CUSTOMER })

            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            const expectedStatusCode = 400
            const users = await userRepository.find()
            expect(response.statusCode).toBe(expectedStatusCode)
            expect(users).toHaveLength(1)
        })

        it('should return the access token and refresh token inside a cookie', async () => {
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'panda@mern.space',
                password: 'secret',
            }

            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            let accessToken: string | null = null
            let refreshToken: string | null = null

            interface Headers {
                ['set-cookie']: string[]
            }

            const cookies =
                (response.headers as unknown as Headers)['set-cookie'] || []

            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split('=')[1]
                }
            })

            cookies.forEach((cookie) => {
                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split('=')[1]
                }
            })

            expect(accessToken).not.toBeNull()
            expect(refreshToken).not.toBeNull()

            expect(isJwt(accessToken)).toBeTruthy()

            expect(isJwt(refreshToken)).toBeTruthy()
        })

        it('should store the refresh token in the database', async () => {
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'panda@mern.space',
                password: 'secret',
            }

            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            console.log('REFRESH TOKEN RESPONSE BODY ID:', response.body)

            const refreshTokenRepo = connection.getRepository(RefreshToken)

            // const refreshTokens = await refreshTokenRepo.find()

            const tokens = await refreshTokenRepo
                .createQueryBuilder('refreshTokens')
                .where('refreshTokens.userId = :userId', {
                    userId: (response.body as Record<string, string>).sub,
                })
                .getMany()

            expect(tokens).toHaveLength(1)
        }, 500000)
    })

    describe('Fields are missing', () => {
        it('should return 400 status code if email validation fails or email fields missing', async () => {
            await connection.dropDatabase()
            await connection.synchronize()

            // Arrange
            const userData = {
                firstName: 'jane',
                lastName: 'doe',
                email: '',
                password: 'secret',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            console.log('NO EMAIL GIVEN:-', response.body)

            // Assert
            expect(response.statusCode).toBe(400)
            // const userRepository = connection.getRepository(User)
            // const users = await userRepository.find()

            // console.log('USER REPOSITORY USER', users)
            // expect(users).toHaveLength(0)
        }, 500000)

        // it('shoud return an array of error messages if email is missing', async () => {
        //     // Arrange
        //     const userData = {
        //         firstName: 'runi',
        //         lastName: 'p',
        //         email: '  ',
        //         password: 'secret',
        //     }
        //     // Act
        //     const response = await request(app)
        //         .post('/auth/register')
        //         .send(userData)

        //     console.log('Response Body Object:-', response.body)

        //     // Assert
        //     expect(response.body).toHaveProperty('errors')
        //     expect(
        //         (response.body as Record<string, string>).errors.length,
        //     ).toBeGreaterThan(0)
        // }, 500000)

        it('should return 400 status code if firstName is missing', async () => {
            await connection.dropDatabase()
            await connection.synchronize()

            // Arrange
            const userData = {
                firstName: '',
                lastName: 'p',
                email: 'panda@mern.space',
                password: 'secret',
            }
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(0)
        }, 500000)

        it('should return 400 status code if lastName is missing', async () => {
            await connection.dropDatabase()
            await connection.synchronize()

            // Arrange
            const userData = {
                firstName: 'runi',
                lastName: '',
                email: 'panda@mern.space',
                password: 'secret',
            }
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(0)
        }, 500000)

        it('should return 400 status code if password is missing', async () => {
            await connection.dropDatabase()
            await connection.synchronize()

            // Arrange
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'panda@mern.space',
                password: '',
            }
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(0)
        }, 500000)
    })

    describe('Fields are not in proper format', () => {
        it('should trim the email field', async () => {
            await connection.dropDatabase()
            await connection.synchronize()

            // Arrange
            const userData = {
                firstName: 'panda',
                lastName: 'p',
                email: ' panda@mern.space ',
                password: 'secret',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // console.log(response.body)
            // Assert
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            console.log('Users:', users)
            const user = users[0]
            expect(user.email).toBe('panda@mern.space')
        }, 500000)

        it('should return 400 status code if email is not a valid email', async () => {
            await connection.dropDatabase()
            await connection.synchronize()

            // Arrange
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: ' runi_mern.space ', // Invalid email
                password: 'password',
            }
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
            // const userRepository = connection.getRepository(User)
            // const users = await userRepository.find()
            // expect(users).toHaveLength(0)
        }, 500000)

        // it('should return 400 status code if password length is less than 6 chars', async () => {
        //     await connection.dropDatabase()
        //     await connection.synchronize()

        //     // Arrange
        //     const userData = {
        //         firstName: 'runi',
        //         lastName: 'p',
        //         email: ' panda@mern.space ',
        //         password: 'pass', // 4 chars
        //     }

        //     // Act
        //     const response = await request(app)
        //         .post('/auth/register')
        //         .send(userData)

        //     // Assert
        //     expect(response.statusCode).toBe(400)
        //     const userRepository = connection.getRepository(User)
        //     const users = await userRepository.find()
        //     expect(users).toHaveLength(0)
        // }, 500000)
    })
})
