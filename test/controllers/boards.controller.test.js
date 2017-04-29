const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

const Board = mongoose.model('board')

describe('Boards Controller', () => {

  it('Post request to /users creates a new board', done => {
    Board.count()
      .then(count => {
        request(app)
        .post('/api/boards')
        .send({ turn: 'blue' })
        .end(() => {
          Board.count().then(newCount => {
            assert(count + 1 === newCount)
            done()
          })
        });
      })
  })

})
