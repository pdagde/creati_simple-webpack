'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema
const RESTRICTED = new Set()

/**
 * Ship Schema
 */
var ShipSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  hyperdrive: Boolean,
  shieldGenerator: Boolean,
  cannons: Boolean,
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
})

ShipSchema.pre('save', function (next) {
  // Update the timestamp
  this.updatedOn = Date.now()

  return next()
})

// Convert from 'firstName,lastName' to
// { firstName: 1, lastName: 1}
ShipSchema.statics.reduceFields = function (fields) {
  return fields.split(',').reduce((memo, field) => {
    if (RESTRICTED.has(field)) return memo
    memo[field] = 1
    return memo
  }, {})
}

module.exports = mongoose.model('Ship', ShipSchema, 'ships')
