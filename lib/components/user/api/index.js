import { Router } from 'express'

import handle from '../../../utils/handle-error'
import { requireIdentifiedUser } from '../../../utils/middleware'
import { create, find, get, authenticate, resetPassword } from './handlers'

const api = Router()
api.get('/:_id', requireIdentifiedUser, handle(get))
api.get('/', requireIdentifiedUser, handle(find))
api.post('/', handle(create))
api.post('/auth', handle(authenticate))
api.post('/reset-password', handle(resetPassword))

export default api
