import commonSchema from '../../../utils/schema'
import logger from '../../../utils/logger'
import { onHackdayMessage, notifyHackday } from '../../../kafka'
import schema from '../schema'
import model from '../model'
import { isMatchingPassword, toJwt, getRandomPassword, hashPassword } from '../auth-helper'
import { notifyPasswordReset } from '../events'

function toFindConditions(query) {
  function toFindCondition(conditions, key) {
    if (typeof query[key] === 'undefined') {
      return conditions
    }
    return { [key]: new RegExp(query[key], 'i'), ...conditions }
  }
  return Object.keys(schema.find.definition.properties).reduce(toFindCondition, {})
}

export async function find(req, res) {
  await schema.find.validate(req.query)
  const users = await model
    .find(toFindConditions(req.query))
    .skip(+req.query.skip)
    .limit(+req.query.limit)
  return res.status(200).send({ users })
}

export async function create(req, res) {
  await schema.create.validate(req.body)
  const password = req.body.password || getRandomPassword()
  const newUser = {
    passwordHash: await hashPassword(password),
    ...req.body,
  }
  await notifyHackday(JSON.stringify(newUser))
  return res.status(200).send({ newUser })
}

onHackdayMessage(async message => {
  try {
    const newUser = JSON.parse(message.value)
    return model.create(newUser)
  } catch (err) {
    logger.error(`Failed to process hackday message: ${message}`)
    return undefined
  }
})

export async function get(req, res) {
  await commonSchema.validateId(req.params)
  const user = await model.findOne(req.params)
  return user ? res.status(200).send({ user }) : res.status(404).send()
}

export async function authenticate(req, res) {
  await schema.auth.validate(req.body)
  const { username, password } = req.body
  const user = await model.findOne({ username })
  if (await isMatchingPassword(user, password)) {
    return res.status(200).send({ jwt: toJwt(user) })
  }
  return res.status(401).send()
}

export async function resetPassword(req, res) {
  await schema.resetPassword.validate(req.body)
  const { username } = req.body
  const user = await model.findOne({ username })
  if (!user) {
    return res.status(404).send()
  }
  const password = getRandomPassword()
  user.passwordHash = await hashPassword(password)
  await user.save()
  const { email, firstName, lastName } = user
  notifyPasswordReset({ password, username, email, firstName, lastName })
  return res.status(204).send()
}
