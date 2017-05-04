const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PieceSchema = new Schema ({
  id: {
    type: Number
  },
  color: {
    type: String
  },
  king: {
    type: Boolean,
    default: false
  },
  cellId: {
    type: Number
  }

})

const Piece = mongoose.model('piece', PieceSchema)

module.exports = Piece
