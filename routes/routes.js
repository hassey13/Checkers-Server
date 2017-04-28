const UsersController = require('../controllers/users_controller')

module.exports = ( app ) => {
  app.post('/users', UsersController.create )
}
