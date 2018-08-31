import { onPasswordReset } from './components/user/events'
import logger from './utils/logger'

onPasswordReset(data => {
  logger.info(`TODO: handle onPasswordReset notification ${JSON.stringify(data)}`)
})
