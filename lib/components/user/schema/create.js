import Ajv from 'ajv'
import merge from 'deepmerge'

import model from '../model'

const definition = {
  type: 'object',
  properties: {
    username: { type: 'string', description: 'The username' },
    email: { type: 'string', format: 'email', description: 'Email address' },
    firstName: { type: 'string', description: 'The user first name' },
    lastName: { type: 'string', description: 'The user last name' },
    password: { type: 'string', description: 'Login password' },
  },
}

const ajvDefinition = merge(definition, {
  $async: true,
  additionalProperties: false,
  required: ['email'],
  usernameMustBeUnique: true,
})

const keywords = {
  usernameMustBeUnique: {
    async: true,
    errors: false,
    schema: false,
    modifying: true,
    validate: user => {
      if (!user.email) {
        return true
      }
      const username = user.username || user.email
      Object.assign(user, { username })
      return model.findOne({ username }).then(found => !found)
    },
  },
}

function validate(data) {
  const ajv = new Ajv({ allErrors: true, removeAdditional: true })
  Object.keys(keywords).forEach(keyword => ajv.addKeyword(keyword, keywords[keyword]))
  return ajv.validate(ajvDefinition, data)
}

export default {
  definition,
  validate,
}
