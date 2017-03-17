/* global describe it before */
'use strict'

let assert = require('assert')
let helper = require('app/test-helper')
let Weapon = require('app/models/weapon')
let request = require('supertest-as-promised')(helper.app)
const URL = '/api/v1/weapons'

describe('Weapons', function () {
  let weapon
  let token

  before(function () {
    return helper.dropCollection(Weapon)
  })

  before(function () {
    token = helper.generateToken()
  })

  it('should add one weapon', function () {
    let data = {
      title: 'Testy',
      description: 'Tester'
    }

    return request
      .post(URL)
      .set('Authorization', token)
      .send(data)
      .then(function (res) {
        weapon = res.body
        assert.equal(res.body.title, data.title)
        assert(res.body._id)
      })
  })

  it('should add second weapon', function () {
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

  it('should list all weapons', function () {
    return request
      .get(URL)
      .then(function (res) {
        assert.equal(res.body.length, 2)
      })
  })

  it('should update a weapon', function () {
    let description = 'hey, imma new descr'
    return request
      .put(`${URL}/${weapon._id}`)
      .set('Authorization', token)
      .send({
        description: description
      })
      .expect(200)
      .then(function (res) {
        assert.equal(res.body.description, description)
      })
  })

  it('should delete a weapon', function () {
    return request
      .delete(`${URL}/${weapon._id}`)
      .set('Authorization', token)
      .expect(200)
  })
})
