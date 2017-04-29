const Board = require('../models/board')

module.exports = {
  create(req, res, next) {
    const boardProps = req.body

    Board.create(boardProps)
      .then( user => res.send({ user }))
      .catch( next )
  },
  find(req, res, next) {
    const username = req.params.username

    var array = []
    Board.find()
      .populate('players')
      .then( results => {
        results.map( game => {
          if ( game.players[0].username === username ) {
            array.push(game)
          }
        })
      })
    return array
  }
}
