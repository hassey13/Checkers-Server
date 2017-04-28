const assert = require('assert')
const mongoose = require('mongoose')

const User = require('../../models/user')

describe('Creating records', () => {
  it('saves a user', (done) => {
    const eric = new User({ username: 'Eric' })
    eric.save()
      .then(() => {
        assert(!eric.isNew)
        done()
      })
  })
})
