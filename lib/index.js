import db from './db'
import kafka from './kafka'
import app from './app'
import config from './config'
import routes from './routes'
import logger from './utils/logger'
import './event-listeners'

Promise.all([db.connect(), kafka.connect()]).then(() => {
  app.use('/', routes)
  app.listen(config.port, () => logger.info(`Listening on port ${config.port}`))
})
