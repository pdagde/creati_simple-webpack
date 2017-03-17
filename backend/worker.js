'use strict'

let config = require('./config')
let monq = require('monq')
let client = monq(config.get('DB_URI'), { safe: true })
let worker = client.worker(['mean'])
let db = require('app/db')
let jobs = require('app/jobs')
db.once('open', console.log.bind(console, 'worker connected to mongoose'))

worker.register(jobs)

worker.on('dequeued', function (data) {
  console.log('Dequeued:')
  console.log(data)
})

worker.on('failed', function (data) {
  console.log('Failed:')
  console.log(data)
})

worker.on('complete', function (data) {
  console.log('Complete:')
  console.log(data)
})

worker.on('error', function (err) {
  console.log('Error:')
  console.log(err)
  worker.stop()
})

worker.start()
