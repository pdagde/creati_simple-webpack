'use strict'

let _ = require('lodash')
let Master = require('app/models/master')
let queue = require('app/jobs/client')

exports.masterId = function (req, res, next, param) {
  Master
    .findById(param)
    .then(function (master) {
      req.master = master
      next()
    })
    .catch(next)
}

exports.get = function (req, res, next) {
  if (req.master) return res.send(req.master)

  res.sendStatus(404)
}

exports.list = function (req, res, next) {
  let sort = req.query.sort || null
  let fields = req.query.fields || null
  let level = req.query.level || null
  let filter = req.query.filter || null

  let query = Master.find()

  if (sort !== null) {
    query.sort(sort.replace(',', ' '))
  }

  if (level !== null) {
    query.where({level: parseInt(level, 10)})
  }

  if (fields !== null) {
    query.select(Master.reduceFields(fields))
  }

  if (filter !== null) {
    let regex = new RegExp(filter, 'i')
    query.or([{firstName: regex}, {lastName: regex}])
  }

  query
    .then(function (masters) {
      res.send(masters)
    })
    .catch(next)
}

exports.new = function (req, res, next) {
  let data = req.body

  let newMaster = new Master(data)
  newMaster
    .save()
    .then(function (master) {
      queue.enqueue('newMaster', {_id: master._id}, () => {
        req.app.locals.io.emit('new master', {master: _.pick(master, ['_id', 'firstName', 'lastName'])})
        res.send(master)
      })
    })
    .catch(next)
}

exports.update = function (req, res, next) {
  if (!req.master) return res.sendStatus(404)

  let data = req.body

  req.master
    .set(data)
    .save()
    .then(function (master) {
      res.send(master)
    })
    .catch(next)
}

exports.delete = function (req, res, next) {
  if (!req.master) return res.sendStatus(404)

  req.master
    .remove()
    .then(function () {
      res.sendStatus(200)
    })
    .catch(next)
}
