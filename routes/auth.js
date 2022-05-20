const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const { User } = require('../models/user')


const router = express.Router()

router.post('/', async (req, res) => {
    const {error} = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({email: req.body.email}).catch(err => console.log(err.message))
    if(!user) return res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password')

    const token = jwt.sign({_id: user.id}, config.get('jwtPrivateKey'))

    res.send(token)
})

function validateUser(req){
    const schema = Joi.object({
        email: Joi.string().max(255).required().email(),
        password: Joi.string().max(255).required()
    })
    return schema.validate(req)
}

module.exports = router