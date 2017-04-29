const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = require('./user');
const PieceSchema = require('./piece');

const BoardSchema = new Schema ({
  turn: {
    type: String
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  pieces: [{
    type: Schema.Types.ObjectId,
    ref: 'piece'
  }]

})

const Board = mongoose.model('board', BoardSchema)

module.exports = Board
