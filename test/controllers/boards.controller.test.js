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
          })
        });
      })
  })

  it('Post request to /users creates a new board with players', done => {
    const eric = new User({ username: 'eric' })
    eric.save()
    const alanna = new User({ username: 'alanna' })
    alanna.save()

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
            .populate('players')
            .then( boards => {
              assert( boards[0].players.length === 2 );
              done()
            })
        });
      })
  })

})
