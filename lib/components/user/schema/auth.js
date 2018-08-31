import Ajv from 'ajv'

const definition = {
  type: 'object',
  properties: {
    username: { type: 'string', description: 'Login username' },
    password: { type: 'string', description: 'Login password' },
  },
}

const ajvDefinition = {
  $async: true,
  required: ['username', 'password'],
  ...definition,
}

const ajv = new Ajv({ allErrors: true })

const validate = ajv.compile(ajvDefinition)

export default {
  definition,
  validate,
}
