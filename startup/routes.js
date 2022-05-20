const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const user = require('../routes/users')
const contest = require('../routes/contests')
const category = require('../routes/category')
const auth = require('../routes/auth')
const error = require('../middleware/error')

module.exports = function(app){

    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(helmet())
    app.use(morgan('tiny'))
    app.use('/api/users', user)
    app.use('/api/contests', contest)
    app.use('/api/categories', category)
    app.use('/api/auth', auth)
    app.use(error)

}