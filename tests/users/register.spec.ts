import request from 'supertest'
import app from '../../src/app'

describe('POST /auth/register', () => {
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
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(201)
        })
    })
    describe('Fields are missing', () => {})
})
