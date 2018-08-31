import test from 'ava'
import request from 'supertest'
import sinon from 'sinon'

import app from '../../lib/app'
import routes from '../../lib/routes'
import { toJwt } from '../../lib/components/user/auth-helper'
import model from '../../lib/components/user/model'

app.use('/', routes)

let users
let findPromise
let jwt

test.before(() => {
  jwt = toJwt({ _id: '123' })
})

test.beforeEach(() => {
  users = [
    { username: 'test1', firstName: 'Bob', lastName: 'Brown' },
    { username: 'test2', firstName: 'Cindy', lastName: 'Sheridan' },
  ]
  findPromise = Promise.resolve(users)
  findPromise.skip = sinon.stub().returns(findPromise)
  findPromise.limit = sinon.stub().returns(findPromise)
  sinon.stub(model, 'find').returns(findPromise)
})

test.afterEach(() => {
  model.find.restore()
})

function find(query) {
  return request(app)
    .get('/user')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${jwt}`)
    .query(query)
    .send()
}

test.serial('should find users', async t => {
  const res = await find({})
  t.is(res.statusCode, 200)
  t.deepEqual(res.body, { users })
  t.deepEqual(model.find.firstCall.args[0], {})
})

test.serial('should use default paging values', async t => {
  const res = await find({})
  t.is(res.statusCode, 200)
  t.is(findPromise.skip.firstCall.args[0], 0)
  t.is(findPromise.limit.firstCall.args[0], 10)
})

test.serial('should use specified paging values', async t => {
  const skip = 10
  const limit = 30
  const res = await find({ skip, limit })
  t.is(res.statusCode, 200)
  t.is(findPromise.skip.firstCall.args[0], skip)
  t.is(findPromise.limit.firstCall.args[0], limit)
})

test.serial('should ensure valid paging values', async t => {
  const skip = 'rubbish'
  const limit = 'also bad'
  const res = await find({ skip, limit })
  t.is(res.statusCode, 400)
})

const fields = ['username', 'firstName', 'lastName']
fields.forEach(field => {
  test.serial(`should support partial match on ${field}`, async t => {
    const res = await find({ [field]: 'test' })
    t.is(res.statusCode, 200)
    t.deepEqual(model.find.firstCall.args[0], { [field]: new RegExp('test', 'i') })
  })
})

test.serial('should require a JWT', async t => {
  const res = await request(app)
    .get('/user')
    .set('Accept', 'application/json')
    .send()
  t.is(res.statusCode, 401)
})

test.serial('should require a valid JWT', async t => {
  jwt = 'rubbish'
  const res = await find({})
  t.is(res.statusCode, 401)
})
