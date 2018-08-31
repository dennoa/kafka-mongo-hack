import test from 'ava'
import request from 'supertest'
import sinon from 'sinon'
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'

import app from '../../lib/app'
import routes from '../../lib/routes'
import logger from '../../lib/utils/logger'
import userModel from '../../lib/components/user/model'

app.use('/', routes)

let user

test.beforeEach(() => {
  user = { email: 'test@example.com', passwordHash: bcrypt.hashSync('secret', bcrypt.genSaltSync(1)) }
  sinon.stub(userModel, 'findOne').returns(Promise.resolve(user))
  sinon.stub(logger, 'error')
})

test.afterEach(() => {
  userModel.findOne.restore()
  logger.error.restore()
})

function auth(creds) {
  return request(app)
    .post('/user/auth')
    .set('Accept', 'application/json')
    .send(creds)
}

test.serial('should authenticate with username and password', async t => {
  const creds = { username: 'test', password: 'secret' }
  const res = await auth(creds)
  t.is(res.statusCode, 200)
  const decoded = jsonwebtoken.verify(res.body.jwt, process.env.JWT_SECRET)
  t.is(decoded.email, user.email)
  const nowSecs = Date.now() / 1000
  const expiresInHours = (decoded.exp - nowSecs) / 3600
  t.is(expiresInHours <= 12, true)
  t.is(expiresInHours >= 11, true)
})

test.serial('should fail authentication if the password does not match', async t => {
  const creds = { username: 'test', password: 'wrong' }
  const res = await auth(creds)
  t.is(res.statusCode, 401)
})

const required = ['username', 'password']
required.forEach(field => {
  test.serial(`should require a ${field}`, async t => {
    const creds = { username: 'test', password: 'secret' }
    delete creds[field]
    const res = await auth(creds)
    t.is(res.statusCode, 400)
  })
})
