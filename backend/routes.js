'use strict'

let _ = require('lodash')
let versionRouter = require('express').Router()
let apiRouter = require('express').Router()
let masterRouter = require('express').Router()
let weaponRouter = require('express').Router()

let mastersDefault = [{
  first_name: 'Yoda',
  last_name: '',
  level: 10,
  planet: 'Dagobah',
  apprentices: []
}, {
  first_name: 'Mace',
  last_name: 'Windu',
  level: 9,
  planet: 'Coruscant',
  apprentices: []
}, {
  first_name: 'Luke',
  last_name: 'Skywalker',
  level: 9,
  planet: 'Tatooine',
  apprentices: []
}]

masterRouter.route('/').get((req, res, next) => {
  let sort = req.query.sort || null
  let fields = req.query.fields || null
  // Narrow by level
  let level = req.query.level || null

  let masters = _.cloneDeep(mastersDefault)

  if (sort !== null) {
    masters = _.sortBy(masters, sort)
  }

  if (level !== null) {
    masters = _.filter(masters, {level: parseInt(level, 10)})
  }

  if (fields !== null) {
    masters = _.map(masters, (master) => {
      return _.pick(master, fields.split(','))
    })
  }

  res.send(masters)
})

weaponRouter.route('/').get((req, res, next) => {
  res.send('weapons list')
})

apiRouter.use('/master', masterRouter)
apiRouter.use('/weapons', weaponRouter)

module.exports = versionRouter.use('/v1', apiRouter)
