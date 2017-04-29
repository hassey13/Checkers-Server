const assert = require('assert')
const mongoose = require('mongoose')

const Board = require('../../models/board')
const User = require('../../models/user')

describe('Creating records', () => {
  it('saves a board', done => {
    const game = new Board({
      turn: 'blue'
    })
    game.save()
      .then(() => {
        assert(!game.isNew)
        done()
      })
  })

  it('game can hold two players', done => {
    const eric = new User({ username: 'Eric' })
    eric.save()
    const alanna = new User({ username: 'Alanna' })
    alanna.save()

    const game = new Board({
      turn: 'blue'
    })
    game.players.push(eric)
    game.players.push(alanna)
    game.save()
      .then(() => {
        Board.findOne({turn: 'blue'})
          .populate('players')
          .then( gameFound => {
            assert( gameFound.players[0].username === 'Eric' )
            assert( gameFound.players[1].username === 'Alanna' )
          done()
        })
      })
  })

})
