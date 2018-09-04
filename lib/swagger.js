import merge from 'deepmerge'
import swaggerHelper from 'swagger-doc-helper'

// Swagger fragments
import user from './components/user/swagger'

const base = swaggerHelper.getBase({
  title: 'Kafka Mongo Hack',
  description: 'Kafka Mongo hack for education purposes',
})

export default merge.all([base, user])
