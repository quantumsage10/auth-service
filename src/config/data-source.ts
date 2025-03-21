import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Config } from '.'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,

    // Don't use this in production, always use false

    synchronize: false, // ⚠️ Be careful in production (use migrations instead to change table's columns/schema/model/entity)
    logging: false, // all postgresql queries logs
    entities: ['src/entity/*.{ts,js}'],
    migrations: ['src/migration/*.{ts,js}'], // as migration scripts
    subscribers: [],
})
