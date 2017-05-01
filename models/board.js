const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = require('./user');
const PieceSchema = require('./piece');

const BoardSchema = new Schema ({
  pending: {
    type: Boolean,
    default: true
  },
  accepted: {
    type: Boolean,
    default: false
  },
  turn: {
    type: String,
    default: 'blue'
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