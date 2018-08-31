import test from 'ava'
import request from 'supertest'

import app from '../lib/app'
import routes from '../lib/routes'

app.use('/', routes)

function get() {
  return request(app)
    .get('/')
    .accept('text/html')
    .send()
}

test.serial('should get the combined swagger docs', async t => {
  const res = await get()
  t.is(res.statusCode, 200)
  t.is(res.text.indexOf('html') >= 0, true)
})
