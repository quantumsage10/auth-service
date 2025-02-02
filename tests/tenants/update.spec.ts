import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constants'

describe('PATCH /tenants', () => {
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

    describe('Correct Tenant Data', () => {
        it('should return a 201 status code after updating', async () => {
            const tenantData = {
                name: 'jane doe',
                address: 'wall street journal, USA',
            }

            const tenantResponse = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData)

            expect(tenantResponse.statusCode).toBe(201)
            expect(tenantResponse.body.id).toBe(1)

            const response = await request(app)
                .patch('/tenants/1')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData)

            expect(response.statusCode).toBe(200)
        })

        it('should update a tenant in the database', async () => {
            const tenantData = {
                name: 'jane doe',
                address: 'wall street journal, USA',
            }

            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData)

            await request(app)
                .patch('/tenants/1')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData)

            const tenantRepository = connection.getRepository(Tenant)
            const tenants = await tenantRepository.find()
            expect(tenants).toHaveLength(1)
            expect(tenants[0].name).toBe(tenantData.name)
            expect(tenants[0].address).toBe(tenantData.address)
        })
    })
})
