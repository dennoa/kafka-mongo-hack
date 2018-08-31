import { Router } from 'express'

import info from '../package.json'
import user from './components/user/api'
import config from './config'
import swagger from './swagger'
import { identifyUser } from './utils/middleware'

const routes = Router()

// API routes
routes.use('/user', identifyUser, user)

// Combined swagger docs
routes.use('/swagger', (req, res) => res.status(200).send(swagger))

// Basic landing page
routes.use('/', (req, res) => res.render('index', { info, config }))

export default routes
