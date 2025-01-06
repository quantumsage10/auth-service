import app from './app'
import { Config } from './config'
import { AppDataSource } from './config/data-source'
import logger from './config/logger'

const startServer = async () => {
    const PORT = Config.PORT
    try {
        // database connection
        await AppDataSource.initialize()
        logger.info('Database Connection successfully')

        app.listen(PORT, () => logger.info(`http://localhost:${PORT}`))
        logger.warn('warning')
        logger.error('error')
        logger.debug('debug')
    } catch (err) {
        if (err instanceof Error) {
            logger.error(err.message)
            setTimeout(() => {
                process.exit(1)
            }, 1000)
        }
    }
}

void startServer()
