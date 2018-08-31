import merge from 'deepmerge'
import swaggerHelper from 'swagger-doc-helper'

// Swagger fragments
import user from './components/user/swagger'

const base = swaggerHelper.getBase({
  title: 'API Starter',
  description: 'Starting point for the api',
})

export default merge.all([base, user])
