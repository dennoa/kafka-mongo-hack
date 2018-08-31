import test from 'ava'
import request from 'supertest'
import sinon from 'sinon'

import app from '../../lib/app'
import routes from '../../lib/routes'
import model from '../../lib/components/user/model'
import { toJwt } from '../../lib/components/user/auth-helper'

app.use('/', routes)

let user
let jwt

test.before(() => {
  jwt = toJwt({ _id: '123' })
})

test.beforeEach(() => {
  user = {
    _id: '5b075a098171be2d6cc53644',
    username: 'test',
    firstName: 'Bob',
    lastName: 'Brown',
  }
  sinon.stub(model, 'findOne').returns(Promise.resolve(user))
})

test.afterEach(() => {
  model.findOne.restore()
})

function get(_id) {
  return request(app)
    .get(`/user/${_id}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${jwt}`)
    .send()
}

test.serial('should get a user', async t => {
  const _id = '5b075a098171be2d6cc53644'
  const res = await get(_id)
  t.is(res.statusCode, 200)
  t.deepEqual(res.body, { user })
  t.deepEqual(model.findOne.firstCall.args[0], { _id })
})

test.serial('should require a valid _id', async t => {
  const _id = 'incorrect'
  const res = await get(_id)
  t.is(res.statusCode, 400)
})

test.serial('should return 404 when failing to get a user', async t => {
  model.findOne.returns(Promise.resolve(undefined))
  const id = '5b075a098171be2d6cc53644'
  const res = await get(id)
  t.is(res.statusCode, 404)
})
