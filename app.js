const express = require('express');
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
if ( process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/checkers')
  // mongoose.connect(`mongodb://temp:temp@ds131151.mlab.com:31151/react-checkers-server`)
    .then( () => true )
    .catch( (err) => { console.log(err)})
}

const bodyParser = require('body-parser')
const routes = require('./routes/routes')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use( bodyParser.json() )
routes( app )

app.use( (err, req, res, next) => {
  console.log(err.message)
  res.status(422).send({error: err.message})
})

io.on('connection', function(socket){

  socket.on('move', function( board ){
    io.emit('move', board )
  })

  socket.on('resign', function( resignation ){
    io.emit('resign', resignation )
  })

  socket.on('invite', function( invite ){
    io.emit('invite', invite )
  })

  socket.on('acceptedInvite', function( invite ){
    io.emit('acceptedInvite', invite )
  })
})

module.exports = server
