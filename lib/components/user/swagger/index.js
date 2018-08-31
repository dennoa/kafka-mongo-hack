import merge from 'deepmerge'
import swaggerHelper from 'swagger-doc-helper'

import commonSchema from '../../../utils/schema'
import schema from '../schema'

const tag = 'user'
const userAuthRequest = schema.auth.definition
const userCreateRequest = schema.create.definition
const userFindParameters = schema.find.definition.properties
const userResetPasswordRequest = schema.resetPassword.definition

export default {
  tags: [{ name: tag, description: tag }],
  paths: {
    '/user': {
      get: swaggerHelper.getOperation({
        tag,
        summary: 'Search for users',
        param: Object.keys(userFindParameters).concat(commonSchema.pagingParameters),
        resBody: 'usersResponse',
      }),
      post: swaggerHelper.getOperation({
        tag,
        summary: 'Create a new user',
        reqBody: 'userCreateRequest',
        resBody: 'userResponse',
        no401: true,
        no404: true,
      }),
    },
    '/user/auth': {
      post: swaggerHelper.getOperation({
        tag,
        summary: 'Authenticate with username and password',
        reqBody: 'userAuthRequest',
        resBody: 'userAuthResponse',
        no401: true,
        no404: true,
      }),
    },
    '/user/reset-password': {
      post: swaggerHelper.getOperation({
        tag,
        summary: 'Reset a password',
        reqBody: 'userResetPasswordRequest',
        no401: true,
      }),
    },
    '/user/{_id}': {
      get: swaggerHelper.getOperation({
        tag,
        summary: 'Get a user by id',
        param: '_id',
        resBody: 'userResponse',
      }),
    },
  },
  definitions: {
    userAuthRequest,
    userCreateRequest,
    userResetPasswordRequest,
    userModel: merge(userCreateRequest, {
      properties: {
        _id: { type: 'string', description: 'Uniquely identifies the user' },
        created: { type: 'string', format: 'date-time', description: 'The date / time the user was created' },
      },
    }),
    userAuthResponse: {
      type: 'object',
      properties: {
        jwt: { type: 'string', description: 'JWT to be used on subsequent requests' },
      },
    },
    userResponse: {
      type: 'object',
      properties: {
        user: { $ref: '#/definitions/userModel' },
      },
    },
    usersResponse: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: { $ref: '#/definitions/userModel' },
        },
      },
    },
  },
  parameters: merge(userFindParameters, {
    username: { name: 'username', in: 'query' },
    firstName: { name: 'firstName', in: 'query' },
    lastName: { name: 'lastName', in: 'query' },
  }),
}
