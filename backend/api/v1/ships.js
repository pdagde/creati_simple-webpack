'use strict'

let router = require('express').Router()
let controller = require('app/controllers/ships')
let jwt = require('app/services/jwt')

router.param('id', controller.shipId)

router.route('/')
  .get(controller.list)
  .post(jwt.mw, controller.new)

router.route('/:id')
  .get(controller.get)
  .put(jwt.mw, controller.update)
  .delete(jwt.mw, controller.delete)

module.exports = router
