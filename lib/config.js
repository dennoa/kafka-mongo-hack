const requiredEnvVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET']
requiredEnvVars.forEach(envVar => {
  if (typeof process.env[envVar] === 'undefined') {
    throw new Error(`${envVar} is missing from the environment configuration`)
  }
})

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  bcrypt: {
    passwordRounds: +(process.env.PASSWORD_ROUNDS || '10'),
  },
  jsonwebtoken: {
    secret: process.env.JWT_SECRET,
  },
  kafka: {
    kafkaHost: process.env.KAFKA_HOST,
    groupId: 'hackday',
  },
}
