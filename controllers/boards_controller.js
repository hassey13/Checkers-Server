
const Board = require('../models/board')
const User = require('../models/user')
const Piece = require('../models/piece')

const moment = require('moment')

const Helpers = require('../helpers/boardControllerHelpers')
const DateHelpers = require('../helpers/dateHelpers')

module.exports = {
  create(req, res, next) {
    const boardProps = req.body;
    const board = new Board();
    let mem = [];

    let count = 1;
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
        mem.push(user.username)
        board.players.push( user )
        resolve()
      })
    })
      .then( () => {
        User.findOne({ username: boardProps.challengee})
          .then( user => {

            new Promise( (resolve, reject) => {
              mem.push(user.username)
              board.players.push( user )
              setInterval( () => {
                if ( board.players.length === 2 ) {
                  resolve()
                }
              }, 10)
          })
        .then( () => {

          board.save()
            .then( board =>{

              let resp = { };
                resp.boardId = board._id.toString();
                resp.accepted = board.accepted;
                resp.pending = board.pending;
                resp.challenger = mem[0];
                resp.challengee = mem[1];

              res.send(resp)
            })
            .catch( err => {
              console.log(err.message)
              next
            })
        })
      })
    })

  },
  update(req, res, next) {
    const id = req.params.id
    const boardProps = req.body;

    Board.find({ '_id' : id})
      .populate('players')
      .populate('pieces')
      .populate('winner')
      .then( results => {

        let board = results[0]
        let actions = []

        function processKeys( key, value ) {
          return (
            new Promise( (resolve, reject) => {
              switch ( key ) {
                case 'accepted':
                  board.set('accepted', boardProps.accepted)
                  board.set('pending', false)
                  resolve()
                  break;

                case 'turn':
                  board.set('turn', boardProps.turn)
                  resolve()
                  break;

                case 'winner':
                  let winner = board.players[0].username === boardProps.winner.username ? board.players[0].username : board.players[1].username

                  User.findOne({'username': winner})
                    .then( winner => {
                      board.winner.push(winner)
                      setInterval( () => {
                        if ( board.winner.length ) {
                          resolve()
                        }
                      }, 20)
                    })
                    .catch( err => {console.log( err.message ) })
                  break;

                case 'resign':
                  let declaredWinner = board.players[0].username === boardProps.resign.username ? board.players[1].username : board.players[0].username

                  User.findOne({'username': declaredWinner})
                    .then( winner => {
                      board.winner.push(winner)
                      setInterval( () => {
                        if ( board.winner.length ) {
                          resolve()
                        }
                      }, 20)
                    })
                    .catch( err => {console.log( err.message ) })
                  break;

                case 'piece':
                  let piece = board.pieces.filter( (piece, i) => piece.id === boardProps.piece.id && piece.color === boardProps.piece.color )[0]

                  for( key in boardProps.piece ) {
                    piece.set(key, boardProps.piece[key])
                  }
                  board.set('lastUpdated', moment())
                  piece.save()
                    .then( () => {
                      resolve()
                    })
                  break;

                default:
                  resolve()
              }
            })
          )
        }

        for (let key in boardProps) {
          actions.push( processKeys(key, boardProps[key] ))
        }

        Promise.all(actions)
          .then( () => {
            board.save()
              .then( ( savedBoard ) => {
                res.send( savedBoard )
              });
          });
      });

  },
  find(req, res, next) {
    const username = req.params.username

    var array = []
    Board.find()
      .populate('players')
      .populate('pieces')
      .populate('winner')
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
      .populate('winner')
      .then( board => {
        res.send( board )
      })
      .catch( (err) => {
        console.log(err)
        console.log(err.message)
      })
  },
  query(req, res, next) {
    const query = req.params.query

    let parsedQuery = Helpers.parseQuery( query )

    Board.find()
      .populate('players')
      .populate('pieces')
      .populate('winner')
      .then( boards => {
        if ( Object.keys( parsedQuery ).length === 0 ) {
          res.send( {} )
          return
        }
        if ( Object.keys( parsedQuery ).length > 0 ) {
          let filteredResults = boards

          for (let key in parsedQuery) {
            filteredResults = filteredResults.filter( (board, i) => {
              if ( DateHelpers.convertDate(new Date( board[key] )) === parsedQuery[key] ) {
                return true
              }

              return board[key].toString() === parsedQuery[key];
            })
          }

          res.send( filteredResults )
          return
        }
        res.send( res.status(500).send('Query function failure, check your query syntax and try again.') )
      })
      .catch( (err) => {
        console.log(err)
        console.log(err.message)
      })
  },
  index(req, res, next) {
    Board.find()
      .populate('players')
      .populate('pieces')
      .populate('winner')
        .then( boards => res.send({ boards }))
        .catch( next )
  }
}
