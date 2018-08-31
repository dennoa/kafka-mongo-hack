import test from 'ava'
import request from 'supertest'
import sinon from 'sinon'

import app from '../../lib/app'
import routes from '../../lib/routes'
import { onPasswordReset, removePasswordResetListener } from '../../lib/components/user/events'
import model from '../../lib/components/user/model'

app.use('/', routes)

let user

test.beforeEach(() => {
  user = {
    _id: '5b075a098171be2d6cc53644',
    username: 'test',
    firstName: 'Bob',
    lastName: 'Brown',
  }
  user.save = sinon.stub().returns(user)
  sinon.stub(model, 'findOne').returns(Promise.resolve(user))
})

test.afterEach(() => {
  model.findOne.restore()
})

function resetPassword(data) {
  return request(app)
    .post('/user/reset-password')
    .set('Accept', 'application/json')
    .send(data)
}

test.serial('should reset a user password', async t => {
  const username = 'test'
  const res = await resetPassword({ username })
  t.is(res.statusCode, 204)
  t.deepEqual(model.findOne.firstCall.args[0], { username })
  t.is(user.save.called, true)
  t.is(typeof user.passwordHash, 'string')
})

test.serial('should require a username', async t => {
  const res = await resetPassword({})
  t.is(res.statusCode, 400)
})

test.serial('should return 404 when failing to find the user', async t => {
  model.findOne.returns(Promise.resolve(undefined))
  const res = await resetPassword({ username: 'bob' })
  t.is(res.statusCode, 404)
})

test.serial('should notify of a password reset event', async t => {
  const listener = sinon.stub()
  onPasswordReset(listener)
  await resetPassword({ username: 'bob' })
  t.is(listener.calledOnce, true)
  removePasswordResetListener(listener)
})
