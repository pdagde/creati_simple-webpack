/* global describe it before */
'use strict'

let assert = require('assert')
let helper = require('app/test-helper')
let Ship = require('app/models/ship')
let request = require('supertest-as-promised')(helper.app)
const URL = '/api/v1/ships'

describe('Ships', function () {
  let ship
  let token

  before(function () {
    return helper.dropCollection(Ship)
  })

  before(function () {
    token = helper.generateToken()
  })

  it('should add one ship', function () {
    let data = {
      title: 'Testy',
      description: 'Tester'
    }

    return request
      .post(URL)
      .set('Authorization', token)
      .send(data)
      .then(function (res) {
        ship = res.body
        assert.equal(res.body.title, data.title)
        assert(res.body._id)
      })
  })

  it('should add second ship', function () {
    let data = {
      title: 'Testy2',
      description: 'Tester2'
    }

    return request
      .post(URL)
      .set('Authorization', token)
      .send(data)
      .then(function (res) {
        assert.equal(res.body.title, data.title)
        assert(res.body._id)
      })
  })

  it('should list all ships', function () {
    return request
      .get(URL)
      .then(function (res) {
        assert.equal(res.body.length, 2)
      })
  })

  it('should update a ship', function () {
    let description = 'hey imma ship desc'
    return request
      .put(`${URL}/${ship._id}`)
      .set('Authorization', token)
      .send({
        description: description
      })
      .expect(200)
      .then(function (res) {
        assert.equal(res.body.description, description)
      })
  })

  it('should delete a ship', function () {
    return request
      .delete(`${URL}/${ship._id}`)
      .set('Authorization', token)
      .expect(200)
  })
})
