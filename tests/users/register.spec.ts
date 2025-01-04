import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import truncateTables from '../utils'
import { User } from '../../src/entity/User'
import { createServer } from 'http'

// Create an HTTP server instance for testing
const testServer = createServer()

describe('POST /auth/register', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // Database truncate
        await truncateTables(connection)
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            // AAA

            // Arrange
            const userData = {
                firstName: 'runi',
                lastName: 'panda',
                email: 'runipanda@gmail.com',
                password: 'secret',
            }

            // Act
            const response = await request(testServer)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(201)
        })

        it('should return valid json response', async () => {
            // Arrange
            const userData = {
                firstName: 'runi',
                lastName: 'panda',
                email: 'runi@mern.space',
                password: 'secret',
            }
            // Act
            const response = await request(testServer)
                .post('/auth/register')
                .send(userData)

            // Assert application/json utf-8
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'))
        })

        it('should persist the user in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'runi',
                lastName: 'panda',
                email: 'runi@mern.space',
                password: 'secret',
            }
            // Act
            await request(testServer).post('/auth/register').send(userData)

            // Assert
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(1)
        })
    })
    describe('Fields are missing', () => {})
})
