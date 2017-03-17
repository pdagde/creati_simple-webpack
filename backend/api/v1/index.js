'use strict'

let router = require('express').Router()

router.use('/masters', require('./masters'))
router.use('/weapons', require('./weapons'))
router.use('/ships', require('./ships'))
router.use('/users', require('./users'))

module.exports = router
