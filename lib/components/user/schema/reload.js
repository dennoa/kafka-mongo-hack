import Ajv from 'ajv'

const definition = {
  type: 'object',
  properties: {
    userReloadOffset: { type: 'integer', minimum: 0, default: 0 },
  },
}

const ajv = new Ajv({ allErrors: true, coerceTypes: true, useDefaults: true })

const validate = ajv.compile({ $async: true, ...definition })

export default {
  definition,
  validate,
}
