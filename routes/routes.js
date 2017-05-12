const UsersController = require('../controllers/users_controller')
const BoardsController = require('../controllers/boards_controller')

module.exports = ( app ) => {
  app.get('/api/boards/users/:username', BoardsController.find )

  app.get('/api/users', UsersController.index )
  app.get('/api/users/:username', UsersController.show )

  app.post('/api/users', UsersController.create )

  app.get('/api/boards', BoardsController.index )
  app.get('/api/boards/query/:query', BoardsController.query )
  app.get('/api/boards/:id', BoardsController.findById )

  app.post('/api/boards', BoardsController.create )
  app.post('/api/boards/:id', BoardsController.update )
}
