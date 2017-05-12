const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const moment = require('moment')

const Board = mongoose.model('board')
const User = mongoose.model('user')
const Piece = mongoose.model('piece')

describe('Boards Controller', () => {

  it('Post request to /boards creates a new board', done => {
    Board.count()
      .then(count => {
        request(app)
        .post('/api/boards')
        .send({
          challenger: 'eric',
          challengee: 'alanna'
        })
        .end(() => {
          Board.count().then(newCount => {
            assert(count + 1 === newCount)
            done()
          });
        });
      });
  });

  it('Post request to /boards creates a new board with 24 pieces', done => {

    Board.count()
      .then(count => {
        request(app)
        .post('/api/boards')
        .send({
          challenger: 'eric',
          challengee: 'alanna'
        })
        .end(() => {
          Board.find()
          .populate('pieces')
          .then( boards => {
            assert( boards[0].pieces.length === 24 )
            done()
          });
        });
      });
  });

  it('Post request to /users creates a new board with players', done => {
    const eric = new User({ username: 'eric' })
    eric.save()
      .then( () => {
        const alanna = new User({ username: 'alanna' })
        alanna.save()
          .then(count => {
            request(app)
            .post('/api/boards')
            .send({
              challenger: 'eric',
              challengee: 'alanna'
            })
            .end(() => {
              Board.find()
              .populate('players')
              .then( boards => {
                assert( boards[0].players.length === 2 )
                done()
              });
            });
          });
      });
  });

  it('Post request to /board/:id updates a board', done => {
    const eric = new User({ username: 'eric' });
    const alanna = new User({ username: 'alanna' });

    let board = new Board()


    Promise.all([alanna.save(), eric.save()])
      .then( () => {
        new Promise((resolve, reject) => {
          board.players.push(eric);
          board.players.push(alanna);
          setInterval( () => {
            if ( board.players.length === 2 ) {
              resolve()
            }
          }, 10);
        })
        .then( () => {
          board.save()
            .then( () => {
              request(app)
              .post(`/api/boards/${board._id.toString()}`)
              .send({
                accepted: true
              })
              .end(() => {
                Board.find()
                .then( boards => {
                  assert( boards[0].accepted );
                  done()
                });
              });
            })
        })
      })
  })

  it('Post request to /board/:id updates a piece on the board', done => {
    const piece = new Piece({ id: 1, color: 'blue', king: false, cellId: 9 });

    let board = new Board();

    Promise.all([piece.save()])
      .then( () => {
        new Promise((resolve, reject) => {
          board.pieces.push(piece);

          setInterval( () => {
            if ( board.pieces.length === 1 ) {
              resolve()
            }
          }, 10);
        })
        .then( () => {
          board.save()
            .then( () => {
              request(app)
              .post(`/api/boards/${board._id.toString()}`)
              .send({
                piece: {
                  id: 1,
                  color: 'blue',
                  king: true,
                  cellId: 1
                }
              })
              .end(() => {
                Board.find()
                .populate('pieces')
                .then( boards => {
                  assert( boards[0].pieces[0].cellId === 1 );
                  done()
                });
              });
            });
        });
      });
  })

  it('updates date when move takes place', done => {
    const piece = new Piece({ id: 1, color: 'blue', king: false, cellId: 9 });
    const board = new Board();

    setTimeout(  () => {
      Promise.all([piece.save()])
      .then( () => {
        new Promise((resolve, reject) => {
          board.pieces.push(piece);

          setInterval( () => {
            if ( board.pieces.length === 1 ) {
              resolve()
            }
          }, 10);
        })
        .then( () => {
          board.save()
            .then( () => {
              request(app)
              .post(`/api/boards/${board._id.toString()}`)
              .send({
                piece: {
                  id: 1,
                  color: 'blue',
                  king: true,
                  cellId: 1
                }
              })
              .end(() => {
                Board.find()
                  .then( boards => {
                    assert( boards[0].lastUpdated.toLocaleTimeString() !== boards[0].createdAt.toLocaleTimeString() )
                    done()
                  });
              });
          });
        });
      });

    }, 1000)

  })

})
