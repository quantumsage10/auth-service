import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constants'

describe('GET /tenants', () => {
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
            role: Roles.ADMIN,
        })
    })

    afterAll(async () => {
        await connection.destroy()
    })

    afterEach(() => {
        jwks.stop()
    })

    describe('Given all fields', () => {
        it('should return a many tenants', async () => {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            }

            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData)
                .expect(201)

            const response = await request(app)
                .get('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])

            expect(response.statusCode).toBe(200)

            expect(response.body).toMatchObject({
                currentPage: 1,
                perPage: 6, // Default value from validation
                total: 1,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Tenant name',
                        address: 'Tenant address',
                    }),
                ]),
            })
        })

        it('should return a single tenant', async () => {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            }

            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData)
                .expect(201)

            const response = await request(app)
                .get('/tenants/1')
                .set('Cookie', [`accessToken=${adminToken}`])

            expect(response.statusCode).toBe(200)
        })

        it('should return an empty array when no tenants exist', async () => {
            const response = await request(app)
                .get('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .expect(200)

            expect(response.body).toMatchObject({
                currentPage: 1,
                perPage: 6,
                total: 0,
                data: [],
            })
        })
    })
})
