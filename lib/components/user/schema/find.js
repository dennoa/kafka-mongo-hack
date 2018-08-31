import Ajv from 'ajv'
import merge from 'deepmerge'

import commonSchema from '../../../utils/schema'

const definition = {
  type: 'object',
  properties: {
    username: { type: 'string', description: 'Search by username' },
    firstName: { type: 'string', description: 'Search by first name' },
    lastName: { type: 'string', description: 'Search by last name' },
  },
}

const ajvDefinition = merge(definition, commonSchema.pagingSchema)

const ajv = new Ajv({ allErrors: true, coerceTypes: true, useDefaults: true })

const validate = ajv.compile(ajvDefinition)

export default {
  definition,
  validate,
}
