import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import uuidv4 from 'uuid/v4'

import config from '../../config'

export const isMatchingPassword = (user, password) => bcrypt.compare(password, user.passwordHash)

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(config.bcrypt.passwordRounds)
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return reject(err)
      }
      return resolve(hash)
    })
  })
}

export const getRandomPassword = () => uuidv4()

export function toJwt(user) {
  const { _id, username, email, firstName, lastName } = user
  return jsonwebtoken.sign({ _id, username, email, firstName, lastName }, config.jsonwebtoken.secret, {
    expiresIn: '12h',
  })
}
