'use strict'

let router = require('express').Router()
let controller = require('app/controllers/masters')
let jwt = require('app/services/jwt')

router.route('/')
  .get(controller.list)
  .post(jwt.mw, controller.new)

router.route('/:id')
  .get(controller.get)
  .put(jwt.mw, controller.update)
  .delete(jwt.mw, controller.delete)

router.param('id', controller.masterId)

module.exports = router
