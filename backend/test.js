'use strict'

let monq = require('monq')
let config = require('./config')

let client = monq(config.get('DB_URI'), { safe: true })
let queue = client.queue('mean')

queue.enqueue('newMaster', {_id: '568037d954934bbd03cb0f07'}, function (err, job) {
  if (err) throw err
  console.log('Enqueued:', job.data)
  process.exit()
})
