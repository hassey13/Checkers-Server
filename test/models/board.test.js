const assert = require('assert')
const mongoose = require('mongoose')
const moment = require('moment')

const Board = require('../../models/board')
const User = require('../../models/user')

describe('Creating board records: ', () => {
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

  it('sets date when created', done => {
    const game = new Board({
      turn: 'blue'
    })

    function convertDate(inputFormat) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
        let d = new Date(inputFormat);
      return [d.getMonth()+1, pad(d.getDate()), d.getFullYear()].join('-');
    }

    game.save()
      .then(() => {
        Board.find()
          .then( board => {
            assert( convertDate(board[0].createdAt) === moment().format('l').split('/').join('-'))
            done()
           })
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
        Board.find()
          .populate('players')
          .then( board => {
            assert( board[0].players[0].username === 'Eric' )
            assert( board[0].players[1].username === 'Alanna' )
          done()
        })
      })
  })

})
