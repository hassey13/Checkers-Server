const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

const User = mongoose.model('user')

describe('Users Controller', () => {

  it('Post request to /users creates a new user', done => {
    User.count()
      .then(count => {
        request(app)
        .post('/api/users')
        .send({username: 'eric'})
        .end(() => {
          User.count().then(newCount => {
            assert(count + 1 === newCount)
            done()
          })
        });
      })
  })

})
