'use strict'

let config = require('./config')
let app = require('./app.js')
let port = config.get('PORT') || 3000

app.listen(port, () => {
  console.log(`Running on ${port}`)
})
