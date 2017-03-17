/* global describe it before */
'use strict'

let assert = require('assert')
let helper = require('app/test-helper')
let Master = require('app/models/master')
let request = require('supertest-as-promised')(helper.app)
const URL = '/api/v1/masters'

describe('Masters', function () {
  let master
  let token

  before(function () {
    return helper.dropCollection(Master)
  })

  before(function () {
    token = helper.generateToken()
  })

  it('should add one master', function () {
    let data = {
      firstName: 'Testy',
      lastName: 'Tester'
    }

    return request
      .post(URL)
      .set('Authorization', token)
      .send(data)
      .then(function (res) {
        master = res.body
        assert.equal(res.body.firstName, data.firstName)
        assert(res.body._id)
      })
  })

  it('should add second master', function () {
    let data = {
      firstName: 'Testy2',
      lastName: 'Tester2'
    }

    return request
      .post(URL)
      .set('Authorization', token)
      .send(data)
      .then(function (res) {
        assert.equal(res.body.firstName, data.firstName)
        assert(res.body._id)
      })
  })

  it('should list all masters', function () {
    return request
      .get(URL)
      .then(function (res) {
        assert.equal(res.body.length, 2)
      })
  })

  it('should update a master', function () {
    let email = 'jedi@example.com'
    return request
      .put(`${URL}/${master._id}`)
      .set('Authorization', token)
      .send({
        email: email
      })
      .expect(200)
      .then(function (res) {
        assert.equal(res.body.email, email)
      })
  })

  it('should delete a master', function () {
    return request
      .delete(`${URL}/${master._id}`)
      .set('Authorization', token)
      .expect(200)
  })
})
