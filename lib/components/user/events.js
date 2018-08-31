import EventEmitter from 'events'

class Events extends EventEmitter {}
const events = new Events()

const passwordReset = 'user_password_reset'

function emit(name, data) {
  process.nextTick(() => events.emit(name, data))
  return data
}

export const notifyPasswordReset = data => emit(passwordReset, data)
export const onPasswordReset = listener => events.on(passwordReset, listener)
export const removePasswordResetListener = listener => events.removeListener(passwordReset, listener)
