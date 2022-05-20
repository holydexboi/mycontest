const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const {User, validate} = require('../models/user')
const auth = require('../middleware/auth')


const router = express.Router()

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password').catch(err => console.log(err.message))
    if(!user) return res.status(404).send('No User with the given ID')
    res.send(user)
})

router.post('/', async (req, res) => {
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({email: req.body.email}).catch(err => console.log(err.message))
    if(user) return res.status(400).send('User with the email already exist')

    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)

    user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']))
    await user.save()

    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(user, ['firstName', 'lastName', 'email']))
})

module.exports = router