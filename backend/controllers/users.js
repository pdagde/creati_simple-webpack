'use strict'

let _ = require('lodash')
let User = require('app/models/user')
let Bluebird = require('bluebird')
let Errors = require('app/errors')

exports.signup = function signup (req, res, next) {
  let data = req.body || {}

  let user = new User(data)
  user
    .setPassword(data.password)
    .save()
    .then(function (_user) {
      res.send(_user.response)
    })
    .catch(next)
}

exports.login = function login (req, res, next) {
  let data = req.body || {}

  let user = User.findByEmail(data.email)

  let isValid = Bluebird
    .resolve(user)
    .then(function (_user) {
      return _user.validatePassword(data.password)
        ? true
        : Bluebird.reject(new Errors.BadData('Password is incorrect'))
    })

  Bluebird.join(user, isValid, function sendRes (_user, _isValid) {
    req.app.locals.io.emit('user login', {user: _.pick(_user, ['firstName', 'lastName', 'obfuscatedEmail'])})
    res.send(_user.response)
  })
  .catch(next)
}

exports.userId = function (req, res, next, param) {
  User
    .findById(param)
    .then(function (meanUser) {
      req.meanUser = meanUser
      next()
    })
    .catch(next)
}

exports.ensureFound = function (req, res, next) {
  if (!req.meanUser) return next(new Errors.NotFound('User not found'))
  next()
}

exports.ensureSameUser = function (req, res, next) {
  if (req.user._id !== req.meanUser._id.toString()) {
    return next(new Errors.Unauthorized('Token does not match'))
  }
  next()
}

exports.get = function get (req, res, next) {
  res.send(req.meanUser)
}

exports.update = function update (req, res, next) {
  let data = req.body
  let hasPassword = !_.isEmpty(data.password)
  let password = data.password

  let update = _.omit(data, 'password')

  let result = req.meanUser.set(update)

  if (hasPassword) {
    result.setPassword(password)
  }

  result
    .save()
    .then(function (user) {
      res.send(user.response)
    })
    .catch(next)
}
