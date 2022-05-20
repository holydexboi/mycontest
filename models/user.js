const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    firstName: {type: String, maxlength: 255, required: true},
    lastName: {type: String, maxlenght: 255},
    email: {type: String, unique: true, required: true},
    password: {type: String, minlength: 8, maxlength: 1024},
    date: {type: Date, default: Date.now()}
})
userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id: this._id}, config.get('jwtPrivateKey'))
}

const User = mongoose.model('User', userSchema)


function validateUser(user){
    const schema = Joi.object({
        firstName: Joi.string().max(255).required(),
        lastName: Joi.string().max(255).required(),
        email: Joi.string().required().email(),
        password: Joi.string().max(255).required()
    })

    return schema.validate(user)
}

module.exports.User = User
module.exports.validate = validateUser