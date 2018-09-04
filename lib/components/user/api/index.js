import { Router } from 'express'

import handle from '../../../utils/handle-error'
import { requireIdentifiedUser } from '../../../utils/middleware'
import { create, find, get, authenticate, reload, resetPassword } from './handlers'

const api = Router()
api.get('/', requireIdentifiedUser, handle(find))
api.post('/', handle(create))
api.post('/auth', handle(authenticate))
api.get('/reload', handle(reload))
api.post('/reset-password', handle(resetPassword))
api.get('/:_id', requireIdentifiedUser, handle(get))

export default api
