/* global describe it before */
'use strict'

let assert = require('assert')
let helper = require('app/test-helper')
let User = require('app/models/user')
let request = require('supertest-as-promised')(helper.app)
const URL = '/api/v1/users'

describe('Users', function () {
  let user
  let password = '123456'

  before(function () {
    return helper.dropCollection(User)
  })

  it('should add one user', function () {
    let data = {
      firstName: 'Testy',
      lastName: 'Tester',
      email: 'test1@example.com',
      password: password
    }

    return request
      .post(URL)
      .send(data)
      .then(function (res) {
        user = res.body
        assert.equal(res.body.email, data.email)
        assert(res.body._id)
      })
  })

  it('should add second user', function () {
    let data = {
      firstName: 'Testy',
      lastName: 'Tester',
      email: 'test2@example.com',
      password: password
    }

    return request
      .post(URL)
      .send(data)
      .then(function (res) {
        assert.equal(res.body.email, data.email)
        assert(res.body._id)
      })
  })

  it('should fail to add duplicate user', function () {
    let data = {
      email: 'test2@example.com',
      password: password
    }

    return request
      .post(URL)
      .send(data)
      .expect(400)
  })

  it('should login with a user', function () {
    return request
      .post(`${URL}/login`)
      .send({
        email: user.email,
        password: password
      })
      .expect(200)
      .then(function (res) {
        assert.equal(res.body.email, user.email)
        assert(res.body.token)
      })
  })

  it('should fail login with invalid creds', function () {
    return request
      .post(`${URL}/login`)
      .send({
        email: user.email,
        password: 123
      })
      .expect(400)
  })

  it('should update a user', function () {
    let email = 'jedi@example.com'
    return request
      .put(`${URL}/${user._id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        email: email
      })
      .expect(200)
      .then(function (res) {
        assert.equal(res.body.email, email)
      })
  })

  it('should fail to update other user', function () {
    let email = 'sith@example.com'
    return request
      .put(`${URL}/${user._id}`)
      .set('Authorization', helper.generateToken())
      .send({
        email: email
      })
      .expect(403)
  })
})
