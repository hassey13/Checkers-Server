const User = require('../models/user')

module.exports = {
  create(req, res, next) {
    const userProps = req.body

    User.create(userProps)
      .then( user => res.send({ user }))
      .catch( next )
  },
  index(req, res, next) {
    User.find()
      .then( users => res.send({ users }))
      .catch( next )
  },
  show(req, res, next) {
    const username = req.params.username

    User.findOne({ username: username})
      .then( user => res.send({ user }))
      .catch( next )
  }
}
