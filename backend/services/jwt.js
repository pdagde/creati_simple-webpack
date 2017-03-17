'use strict'

let _ = require('lodash')
let jwt = require('jsonwebtoken')
let expressJwt = require('express-jwt')
let config = require('app/config')
let key = config.get('JWT_KEY')

const DEFAULT_OPTS = {
  expiresIn: '7d'
}

exports.mw = expressJwt({ secret: key })

exports.signToken = function (data, options) {
  let opts = _.assign({}, DEFAULT_OPTS, options)
  return jwt.sign(data, key, opts)
}
