const Board = require('../models/board')
const User = require('../models/user')

module.exports = {
  create(req, res, next) {
    const boardProps = req.body
    const game = new Board()

    new Promise( (resolve, reject) => {
      User.findOne({ username: boardProps.challenger})
      .then( user => {
        game.players.push( user )
        resolve()
      })
    })
      .then( () => {
        User.findOne({ username: boardProps.challengee})
          .then( user => {
            game.players.push( user )
          })
      })
        .then( () => {
          // Needs to be refactored
          setTimeout( () => {
            game.save()
            .then( board => res.send({ board }))
            .catch( next )
          }, 100)
        })

  },
  find(req, res, next) {
    const username = req.params.username

    var array = []
    Board.find()
      .populate('players')
      .then( results => {
        results.map( game => {
          if ( game.players.length > 1 && game.players[0].username === username ) {
            array.push(game)
          }
        })
        res.send( array )
      })
  }
}
