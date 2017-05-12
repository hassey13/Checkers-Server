const assert = require('assert')
const mongoose = require('mongoose')
const moment = require('moment')

const Board = require('../../models/board')
const User = require('../../models/user')
const Helpers = require('../../helpers/boardControllerHelpers')

describe('Helper for Board Controller', () => {

  xit('parse a query and return an object that can be used in a mongoose query', done => {
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
        let query = `lastUpdate=${moment().format('l')}`
        let parsedQuery = Helpers.parseQuery( query )
        Board.find(parsedQuery)
          .populate('players')
          .then( games => {
            assert( games.players[0].username === 'Eric' )
            assert( games.players[1].username === 'Alanna' )
          done()
        })
      })




  })

})
