import app from './app'
import { Config } from './config'
import logger from './config/logger'

const startServer = () => {
    const PORT = Config.PORT
    try {
        app.listen(PORT, () => logger.info(`http://localhost:${PORT}`))
        logger.warn('warning')
        logger.error('error')
        logger.debug('debug')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

startServer()
