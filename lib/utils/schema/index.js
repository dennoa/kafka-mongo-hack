import Ajv from 'ajv'

const idSchema = {
  $async: true,
  type: 'object',
  required: ['_id'],
  properties: {
    _id: { pattern: '^[0-9A-Fa-f]{24}$' },
  },
}

const pagingSchema = {
  $async: true,
  type: 'object',
  properties: {
    skip: {
      type: 'integer',
      minimum: 0,
      maximum: 500,
      default: 0,
    },
    limit: {
      type: 'integer',
      minimum: 0,
      maximum: 50,
      default: 10,
    },
  },
}

const pagingParameters = Object.keys(pagingSchema.properties)

const ajv = new Ajv({ allErrors: true, coerceTypes: true, useDefaults: true })

const validateId = ajv.compile(idSchema)
const validatePaging = ajv.compile(pagingSchema)

export default {
  pagingParameters,
  pagingSchema,
  validateId,
  validatePaging,
}
