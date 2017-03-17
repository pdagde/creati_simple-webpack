'use strict'

let monq = require('monq')
let config = require('app/config')

let client = monq(config.get('DB_URI'), { safe: true })
let queue = client.queue('mean')

module.exports = queue
