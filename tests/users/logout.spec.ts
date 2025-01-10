import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'
import bcrypt from 'bcrypt'
import { isJwt } from '../utils'

describe('POST /auth/logout', () => {
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

    describe('Given a logged-in user', () => {
        it('should logout the user & return a 200 status', async () => {
            // Arrange: create a user in the DB
            const userData = {
                firstName: 'runi',
                lastName: 'p',
                email: 'runi@mern.space',
                password: 'secret',
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10)
            const userRepository = connection.getRepository(User)
            await userRepository.save({
                ...userData,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            })

            interface Headers {
                ['set-cookie']: string[]
            }

            // Act: login the user
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({ email: userData.email, password: userData.password })

            const cookies =
                (loginResponse.headers as unknown as Headers)['set-cookie'] ||
                []

            let accessToken = null
            let refreshToken = null

            // cookies extraction
            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0] + ';'
                }

                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0]
                }
            })

            console.log('COOKIES', cookies)
            console.log('ACCESS TOKEN:', accessToken)
            console.log('REFRESH TOKEN', refreshToken)

            const cookiesnew =
                accessToken && refreshToken
                    ? accessToken + ' ' + refreshToken
                    : ''
            console.log('COOKIES NEW:', cookiesnew)

            //    const cookie = 'accessToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5Iiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzM2NTAzMTM4LCJleHAiOjE3MzY1MDY3MzgsImlzcyI6ImF1dGgtc2VydmljZSJ9.U7NCXPIEgygQD-lJuLDOcKrmxr6-HLptilTy8k7QKYvjTrYs2alE6g91axBmxToUIrVZpaOjqr9-OrCeKEDxuNq8LXbhDtX3R74KCRFBojbRj6Pb-azaCZ5TlKXu1O0_7VoSexxCxbBziEgTzmLZ0uS5Q5Ffj5YRCCupM8bOKKbvfsPoabXZQ3TgsfsphBfxhk85KgHwx3j1L0-R1ZHu4oiXVrT_Yyh8hpo-Oib3gj8hRzalQFB44dR513_OUWhUmepDc7X1MUuw9tS5DRL_yfi7qNCo7IqIj8oxERalwSkQSrM1jjq5NCgWwiGi4Qf9AKA22uroGZ4dG1BswKAe8w; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5Iiwicm9sZSI6ImN1c3RvbWVyIiwiaWQiOiIxNDYiLCJpYXQiOjE3MzY1MDMxMzgsImV4cCI6MTc2ODA2MDczOCwiaXNzIjoiYXV0aC1zZXJ2aWNlIiwianRpIjoiMTQ2In0.MAZYUp-5PUfmQheuySt_QiRxktB6wMGGX-yJLfE6BVU'

            // Act: make a logout request with the cookies
            const logoutResponse = await request(app)
                .post('/auth/logout')
                .set('Cookie', cookiesnew)
                .send()

            expect(isJwt(accessToken)).toBeTruthy()
            // Assert: check if logout was successful
            expect(logoutResponse.statusCode).toBe(200) // Expect 200 OK for successful logout
        }, 5000000) // You can adjust this timeout if needed

        // it('should return 401 if no valid cookies are provided', async () => {
        //     // Act: make a logout request with no cookies
        //     const logoutResponse = await request(app).post('/auth/logout')

        //     // Assert: check for failure due to missing cookies
        //     expect(logoutResponse.statusCode).toBe(401); // Expect 401 Unauthorized
        // })

        // it('should return 401 if the user is not logged in (invalid cookies)', async () => {
        //     // Act: make a logout request with invalid cookies
        //     const logoutResponse = await request(app)
        //         .post('/auth/logout')
        //         .set('Cookie', [
        //             'accessToken=invalid_token',
        //             'refreshToken=invalid_token'
        //         ])
        //         .send()

        //     // Assert: check for failure due to invalid cookies
        //     expect(logoutResponse.statusCode).toBe(401); // Expect 401 Unauthorized
        // })
    })
})
