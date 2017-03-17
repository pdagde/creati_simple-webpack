'use strict'

let _ = require('lodash')
let Bluebird = require('bluebird')
let Master = require('app/models/master')
let User = require('app/models/user')
let email = require('app/services/email')
let view = require('app/views/new-master-email')

module.exports = function newMaster (params, callback) {
  let id = params._id

  // Get Master
  let master = Master
    .findById(id)
    .populate('masters')
    .populate('apprentices')

  let users = User.find()

  Bluebird.join(master, users, function sendEmail (_master, _users) {
    // If no master found, we just bail here
    if (_master === null) return Bluebird.reject('No master found')

    let recipients = _users.map(user => {
      return {
        address: {
          email: user.email,
          name: _.isEmpty(user.fullname) ? user.email : user.fullname
        }
      }
    })

    let data = {master: _master}

    let html = view.html(data)
    let text = view.text(data)

    email.send(recipients, 'A new Jedi Master', html, text, callback)
  })
  .catch(callback)
}
