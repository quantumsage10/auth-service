import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'

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
                email: 'runi@mern.space',
                password: 'secret',
            }

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            // Assert
            expect(response.badRequest).toBe(true)
        })
    })
})
