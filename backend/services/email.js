'use strict'

let Sparky = require('sparkpost')
let config = require('app/config')
let client = new Sparky(config.get('EMAIL_APIKEY'))
let from = config.get('EMAIL_FROM')

exports.client = client

exports.send = function send (to, subject, html, text, callback) {
  client.transmissions.send({
    transmissionBody: {
      campaignId: 'new-master',
      content: {
        from: {
          name: 'Mastering MEAN',
          email: from
        },
        subject: subject,
        html: html,
        text: text
      },
      recipients: to
    }
  }, function (err, res) {
    callback(err, res.body)
  })
}
