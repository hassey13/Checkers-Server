const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema ({
  username: {
    type: String,
    validate: {
      validator: (name) => name.length > 1,
      message: 'Name must be longer than 1 characters.'
    },
    required: [true, 'Name is required.']
  }
})

UserSchema.virtual('nameLength').get(function() {
  return this.username.length;
})

const User = mongoose.model('user', UserSchema)

module.exports = User
