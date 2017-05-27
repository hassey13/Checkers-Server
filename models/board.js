const mongoose = require('mongoose')
const moment = require('moment')
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
  winner: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  pieces: [{
    type: Schema.Types.ObjectId,
    ref: 'piece'
  }],
  createdAt: {
    type: Date,
    default: new Date()
  },
  lastUpdated: {
    type: Date,
    default: new Date()
  }

})

const Board = mongoose.model('board', BoardSchema)

module.exports = Board
