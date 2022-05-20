const Joi = require('joi')
const mongoose = require('mongoose')
const { categorySchema } = require('../models/category')

const Contest = mongoose.model('Contest', new mongoose.Schema({
    title: { type: String, maxlength: 255, required: true},
    openDate: {type: Date, required: true},
    closingDate: {type: Date, require: true},
    createdDate: {type: Date, default: Date.now()},
    user: {type: new mongoose.Schema({
        email: {type: String, required: true}
    }), required: true},
    categories: [ categorySchema ]
    
}))


function validateContest(contest){
    const schema = Joi.object({
        title: Joi.string().max(255).required(),
        openDate: Joi.string().required(),
        closingDate: Joi.string().required(),
        userId: Joi.string().required(),
        categories: Joi.array().min(0).required()
    })

    return schema.validate(contest)
}

function validateCategories(categories){
    const schema = Joi.object({
        categories: Joi.array().min(0).required()
    })
    return schema.validate(categories)
}

module.exports.Contest = Contest;
module.exports.validate = validateContest
module.exports.validateCat = validateCategories