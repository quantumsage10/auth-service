import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import createJWKSMock from 'mock-jwks'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'

describe('GET /auth/self', () => {
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

    describe('Given all Fields', () => {
        it('should return the 200 status code', async () => {
            // send token compulsory
            const accessToken = jwks.token({
                sub: '1',
                role: Roles.CUSTOMER,
            })

            //  console.log("Access Token :",accessToken )
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send()

            // console.log("Response Body:", response.body)
            expect(response.statusCode).toBe(200)
        })

        it('should return the user data', async () => {
            // Register user
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'panda@mern.space',
                password: 'secret',
            }

            const userRepository = connection.getRepository(User)
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            })

            // Generate Token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            })

            // Add token to cookie
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send()

            // Assert
            // Check if user id matches with registered user
            expect((response.body as Record<string, string>).id).toBe(data.id)
        })
    })
})
