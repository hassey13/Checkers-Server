const UsersController = require('../controllers/users_controller')
const BoardsController = require('../controllers/boards_controller')

module.exports = ( app ) => {
  app.get('/api/users/:username', UsersController.show )
  app.post('/api/users', UsersController.create )

  app.get('/api/boards/:id', BoardsController.findById )
  app.get('/api/boards/users/:username', BoardsController.find )

  app.post('/api/boards', BoardsController.create )
}
