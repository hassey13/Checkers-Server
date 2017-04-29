const assert = require('assert')
const mongoose = require('mongoose')

const Piece = require('../../models/piece')
const Board = require('../../models/board')
const User = require('../../models/user')

describe('Creating records', () => {
  it('saves a piece', done => {
    const piece = new Piece({
      id: 1,
      color: 'blue',
      king: false,
      cellId: 0
    })
    piece.save()
      .then(() => {
        assert(!piece.isNew)
        done()
      })
  })

  it('game can hold pieces', done => {
    const piece = new Piece({
      id: 1,
      color: 'blue',
      king: false,
      cellId: 0
    })
    const pieceTwo = new Piece({
      id: 2,
      color: 'blue',
      king: false,
      cellId: 2
    })
    piece.save()
    pieceTwo.save()
    const game = new Board({
      turn: 'blue'
    })
    game.pieces.push(piece)
    game.pieces.push(pieceTwo)
    game.save()
      .then(() => {
        Board.findOne({turn: 'blue'})
          .populate('pieces')
          .then( gameFound => {
            assert( gameFound.pieces[0].cellId === 0 )
            assert( gameFound.pieces[1].cellId === 2 )
          done()
        })
      })
  })

})
