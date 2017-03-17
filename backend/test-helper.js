'use strict'

let _ = require('lodash')
let Bluebird = require('bluebird')
let config = require('./config')
let Jwt = require('./services/jwt')
// use a test db instead of the real one
let dbUrl = config.get('DB_URI') + '-test'

config.set('DB_URI', dbUrl)
config.set('DEBUG', false)

exports.app = require('./app')

// Drop a collection
exports.dropCollection = function (Model) {
  if (config.get('NODE_ENV') !== 'test') return Bluebird.reject()
  return Model.remove({})
}

exports.generateToken = function generateToken (payload, opts) {
  let hash = Jwt.signToken(_.assign({}, { _id: 123, role: 'user' }, payload), opts)
  return `Bearer ${hash}`
}
