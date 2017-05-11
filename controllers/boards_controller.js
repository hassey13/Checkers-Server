const Board = require('../models/board')
const User = require('../models/user')
const Piece = require('../models/piece')

module.exports = {
  create(req, res, next) {
    const boardProps = req.body
    const board = new Board()

    let count = 1
    for (let i = 0; i < 24; i+=2) {
      if ( Math.floor(i / 8) % 2 === 0 ) {

        let piece = new Piece({
          id: count,
          color: 'blue',
          cellId: i
        })

        piece.save()
          .then( () => {
            board.pieces.push(piece)
          })
        count++
      }
      else {

        let piece = new Piece({
          id: count,
          color: 'blue',
          cellId: i+1
        })
        piece.save()
          .then( () => {
            board.pieces.push(piece)
          })
        count++
      }
    }
    count = 1
    for (let i = 63; i >= 64 - 24; i-=2) {
        if ( Math.floor(i / 8) % 2 === 0 ) {
          let piece = new Piece({
            id: count,
            color: 'red',
            cellId: i-1
          })
          piece.save()
            .then( () => {
              board.pieces.push(piece)
            })
          count++
        }
        else {
          let piece = new Piece({
            id: count,
            color: 'red',
            cellId: i
          })
          piece.save()
            .then( () => {
              board.pieces.push(piece)
            })
          count++
        }
    }

    new Promise( (resolve, reject) => {
      User.findOne({ username: boardProps.challenger})
      .then( user => {
        board.players.push( user )
        resolve()
      })
    })
      .then( () => {
        User.findOne({ username: boardProps.challengee})
          .then( user => {

            new Promise( (resolve, reject) => {
              board.players.push( user )
              setInterval( () => {
                if ( board.players.length === 2 ) {
                  resolve()
                }
              }, 10)
          })
        .then( () => {

          board.save()
            .then( game =>{
              let board = game
              res.send({ board })})
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
      .populate('pieces')
      .then( results => {
        board = results[0]
      })
      .then( () => {
        if ( 'accepted' in boardProps ) {
          board.set('accepted', boardProps.accepted)
          board.set('pending', false)
        }
        if ( 'turn' in boardProps ) {
          board.set('turn', boardProps.turn)
        }
        if ( 'piece' in boardProps ) {
          let piece = board.pieces.filter( (piece, i) => piece.id === boardProps.piece.id && piece.color === boardProps.piece.color )[0]

          for( key in boardProps.piece ) {
            piece.set(key, boardProps.piece[key])
          }
          piece.save()
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
      .populate('pieces')
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
      .populate('pieces')
      .then( board => {
        res.send( board )
      })
      .catch( (err) => {
        console.log(err)
        console.log(err.message)
      })
  },
  index(req, res, next) {
    Board.find()
      .populate('players')
        .then( boards => res.send({ boards }))
        .catch( next )
  }
}
