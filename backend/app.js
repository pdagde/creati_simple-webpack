'use strict'

let express = require('express')
let http = require('http')
let cors = require('cors')
let compression = require('compression')
let bodyParser = require('body-parser')

let app = express()
let server = http.Server(app)
let io = require('socket.io')(server)
let Errors = require('app/errors')
let api = require('./api')
let db = require('app/db')

db.once('open', console.log.bind(console, 'web connected to mongo'))

app.locals.io = io

app.use(cors())
app.use(compression())
app.use(bodyParser.json())

app.use('/api', api)

// Set responses based on error types
app.use(Errors.ErrorMiddleware)

module.exports = server
