import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'
import bcrypt from 'bcrypt'

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
    })
})
