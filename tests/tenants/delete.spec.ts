import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constants'

describe('DELETE /tenants', () => {
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
        it('should return a 200 status code after deleting', async () => {
            const tenantData = {
                name: 'jane doe',
                address: 'wall street journal, USA',
            }

            const tenantResponse = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData)
                .expect(201)

            expect(tenantResponse.body.id).toBe(1)

            const response = await request(app)
                .delete('/tenants/1')
                .set('Cookie', [`accessToken=${adminToken}`])

            expect(response.statusCode).toBe(200)
        })

        it('should delete a tenant in the database', async () => {
            const tenantData = {
                name: 'jane doe',
                address: 'wall street journal, USA',
            }

            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData)
                .expect(201)

            await request(app)
                .delete('/tenants/1')
                .set('Cookie', [`accessToken=${adminToken}`])
                .expect(200)

            const tenantRepository = connection.getRepository(Tenant)
            const tenants = await tenantRepository.find()
            expect(tenants).toHaveLength(0)
        })
    })
})
