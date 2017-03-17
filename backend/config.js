'use strict'
let nconf = require('nconf')

module.exports = nconf
  .argv()
  .env()
  .file({
    file: './.env.json'
  })
  .defaults({
    PORT: 3000,
    DB_URI: 'mongodb://localhost/mean',
    JWT_KEY: 'may the force be with you',
    EMAIL_KEY: 'test',
    EMAIL_FROM: 'example@example.com'
  })
