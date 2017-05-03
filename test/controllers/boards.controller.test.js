const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

const Board = mongoose.model('board')
const User = mongoose.model('user')

describe('Boards Controller', () => {

  it('Post request to /users creates a new board', done => {
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

})
