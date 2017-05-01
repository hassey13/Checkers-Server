const express = require('express');
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
if ( process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/checkers')
}

const bodyParser = require('body-parser')
const routes = require('./routes/routes')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})

app.use( bodyParser.json() )
routes( app )

app.use( (err, req, res, next) => {
  console.log(err.message)
  res.status(422).send({error: err.message})
})

io.on('connection', function(socket){
  console.log('New User connected!')

  socket.on('move', function( board ){
    console.log('emitting move')
    io.emit('move', board )
  })

  socket.on('invite', function( invite ){
    console.log('emitting invite')
    io.emit('invite', invite )
  })
})



module.exports = server
