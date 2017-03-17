'use strict'

let _ = require('lodash')
let mongoose = require('mongoose')
let Jwt = require('app/services/jwt')
let Schema = mongoose.Schema
let ObjectId = Schema.ObjectId
const RESTRICTED = new Set(['email', 'password', 'salt'])

/**
 * Jedi Master Schema
 */
var MasterSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  origin: String,
  masters: [{
    type: ObjectId,
    ref: 'Master'
  }],
  apprentices: [{
    type: ObjectId,
    ref: 'Master'
  }],
  skills: [String],
  level: Number,
  email: {
    type: String,
    select: false,
    set: val => val.toLowerCase()
  },
  phoneNumber: String,
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
})

MasterSchema.virtual('fullname').get(function () {
  return _.trim(`${this.firstName || ''} ${this.lastName || ''}`)
})

MasterSchema.virtual('token').get(function () {
  let payload = {
    _id: this._id,
    role: this.role
  }

  return Jwt.signToken(payload)
})

MasterSchema.pre('save', function (next) {
  // Update the timestamp
  this.updatedOn = Date.now()

  return next()
})

// Convert from 'firstName,lastName' to
// { firstName: 1, lastName: 1}
MasterSchema.statics.reduceFields = function (fields) {
  return fields.split(',').reduce((memo, field) => {
    if (RESTRICTED.has(field)) return memo
    memo[field] = 1
    return memo
  }, {})
}

module.exports = mongoose.model('Master', MasterSchema, 'masters')
