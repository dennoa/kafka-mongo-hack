import test from 'ava'
import request from 'supertest'
import sinon from 'sinon'
import bcrypt from 'bcryptjs'

import app from '../../lib/app'
import routes from '../../lib/routes'
import logger from '../../lib/utils/logger'
import model from '../../lib/components/user/model'

app.use('/', routes)

let user

test.beforeEach(() => {
  user = { _id: '1', username: 'test', firstName: 'bob', lastName: 'brown' }
  sinon.stub(model, 'create').returns(Promise.resolve(user))
  sinon.stub(model, 'findOne').returns(Promise.resolve())
  sinon.stub(logger, 'error')
})

test.afterEach(() => {
  model.create.restore()
  model.findOne.restore()
  logger.error.restore()
})

function create(data) {
  return request(app)
    .post('/user')
    .set('Accept', 'application/json')
    .send(data)
}

test.skip('should create a user', async t => {
  const data = { username: 'bob', email: 'test@example.com', firstName: 'Bob', lastName: 'Brown' }
  const res = await create(data)
  t.is(res.statusCode, 200)
  t.deepEqual(res.body, { user })
  const args = model.create.firstCall.args[0]
  t.is(args.username, data.username)
  t.is(args.email, data.email)
  t.is(args.firstName, data.firstName)
  t.is(args.lastName, data.lastName)
})

test.skip('should defaut the username to the email', async t => {
  const data = { email: 'test@example.com', firstName: 'Bob', lastName: 'Brown' }
  const res = await create(data)
  t.is(res.statusCode, 200)
  t.is(model.create.firstCall.args[0].username, data.email)
})

test.skip('should include a default password', async t => {
  const data = { email: 'test@example.com', firstName: 'Bob', lastName: 'Brown' }
  const res = await create(data)
  t.is(res.statusCode, 200)
  t.is(typeof model.create.firstCall.args[0].passwordHash, 'string')
})

test.skip('should allow password to be specified', async t => {
  const data = { email: 'test@example.com', firstName: 'Bob', lastName: 'Brown', password: 'secret' }
  const res = await create(data)
  t.is(res.statusCode, 200)
  t.is(bcrypt.compareSync(data.password, model.create.firstCall.args[0].passwordHash), true)
})

test.skip('should ensure a unique username', async t => {
  model.findOne.returns(Promise.resolve({ _id: '23' }))
  const data = { username: 'test', email: 'test@example.com', firstName: 'Bob', lastName: 'Brown' }
  const res = await create(data)
  t.is(res.statusCode, 400)
  t.deepEqual(model.findOne.firstCall.args[0], { username: data.username })
})

test.skip('should require an email', async t => {
  model.findOne.returns(Promise.resolve({ _id: '23' }))
  const data = { username: 'test', firstName: 'Bob', lastName: 'Brown' }
  const res = await create(data)
  t.is(res.statusCode, 400)
})

test.skip('should report unexpected errors', async t => {
  model.findOne.throws(new Error())
  const data = { username: 'test', email: 'test@example.com', firstName: 'Bob', lastName: 'Brown' }
  const res = await create(data)
  t.is(res.statusCode, 500)
  t.is(logger.error.called, true)
})

test.skip('should report unexpected failures', async t => {
  model.findOne.returns(Promise.reject('failed')) // eslint-disable-line prefer-promise-reject-errors
  const data = { username: 'test', email: 'test@example.com', firstName: 'Bob', lastName: 'Brown' }
  const res = await create(data)
  t.is(res.statusCode, 500)
  t.is(logger.error.called, true)
})

test.skip('should return an error if it fails to hash the password', async t => {
  sinon.stub(bcrypt, 'hash').yields(new Error('failed'))
  const data = { username: 'bob', email: 'test@example.com', firstName: 'Bob', lastName: 'Brown' }
  const res = await create(data)
  bcrypt.hash.restore()
  t.is(res.statusCode, 500)
})
