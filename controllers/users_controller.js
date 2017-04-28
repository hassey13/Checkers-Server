const User = require('../models/user')

module.exports = {
  create(req, res, next) {
    const userProps = req.body

    User.create(userProps)
      .then( user => res.send({ user }))
      .catch( next )
  }
}
