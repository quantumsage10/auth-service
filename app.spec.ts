import { calculateDiscount } from './src/utils'
import request from 'supertest'
import { createServer } from 'http'

// Create an HTTP server instance for testing
const testServer = createServer()

describe.skip('App', () => {
    it('should return correct discount amount', () => {
        const discount = calculateDiscount(100, 10)
        expect(discount).toBe(10)
    })

    it('should return 200 status code', async () => {
        const response = await request(testServer).get('/').send()
        expect(response.statusCode).toBe(200)
    })
})
