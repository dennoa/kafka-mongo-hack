import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  username: { type: String, lowercase: true, index: true, unique: true },
  email: { type: String, lowercase: true },
  firstName: String,
  lastName: String,
  passwordHash: String,
  created: { type: Date, default: Date.now },
})

export default mongoose.model('user', schema)
