'use strict'

let router = require('express').Router()
let controller = require('app/controllers/users')
let jwt = require('app/services/jwt')

router.route('/login')
  .post(controller.login)

router.route('/')
  .post(controller.signup)

router.route('/:id')
  .get(
    jwt.mw,
    controller.ensureFound,
    controller.ensureSameUser,
    controller.get
  )
  .put(
    jwt.mw,
    controller.ensureFound,
    controller.ensureSameUser,
    controller.update
  )

router.param('id', controller.userId)

module.exports = router
