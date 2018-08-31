import Ajv from 'ajv'
import logger from '../logger'

function respondWithError(res, result) {
  if (result instanceof Ajv.ValidationError) {
    const { errors } = result
    return res.status(400).json({ errors })
  }
  logger.error(result)
  const error = result instanceof Error ? result.message : result
  return res.status(500).send({ error })
}

const handleError = mainFunction => (req, res, next) => {
  mainFunction(req, res, next).catch(result => respondWithError(res, result))
}

export default handleError
