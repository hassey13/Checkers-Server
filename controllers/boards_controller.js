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

            new Promise( (resolve, reject) => {
              game.players.push( user )
              setInterval( () => {
                if ( game.players.length === 2 ) {
                  resolve()
                }
              }, 10)
          })
        .then( () => {

          game.save()
            .then( board => res.send({ board }))
            .catch( next )
        })
      })
    })

  },
  update(req, res, next) {
    const id = req.params.id
    const boardProps = req.body;
    let board;

    Board.find({ '_id' : id})
      .populate('players')
      .then( results => {
        board = results[0]
      })
      .then( () => {
        if ( 'accepted' in boardProps ) {
          board.set('accepted', boardProps.accepted)
          board.set('pending', false)
        }
        if ( 'piece' in boardProps ) {
          console.log('received move!')
        }
        board.save()
          .then( ( savedBoard ) => {
            res.send( savedBoard )
          })
      })

  },
  find(req, res, next) {
    const username = req.params.username

    var array = []
    Board.find()
      .populate('players')
      .then( results => {
        results.map( game => {
          if ( (game.players.length > 1 && game.players[0].username === username) || (game.players.length > 1 && game.players[1].username === username) ) {
            array.push(game)
          }
        })
        res.send( array )
      })
  },
  findById(req, res, next) {
    const id = req.params.id

    Board.find({ '_id' : id})
      .populate('players')
      .then( board => {
        res.send( board )
      })
      .catch( (err) => {
        console.log(err)
        console.log(err.message)
      })
  }
}
