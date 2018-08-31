import Ajv from 'ajv'

const definition = {
  type: 'object',
  properties: {
    username: { type: 'string', description: 'Login username' },
  },
}

const ajvDefinition = {
  $async: true,
  required: ['username'],
  ...definition,
}

const ajv = new Ajv({ allErrors: true })

const validate = ajv.compile(ajvDefinition)

export default {
  definition,
  validate,
}
