const mongoose = require('mongoose')
const Joi = require('joi')

const categorySchema = new mongoose.Schema({
    name: {type: String, maxlength: 255, minlength: 5, required: true},
    contestant: [{name: String, count: Number}]
})
const Category  = mongoose.model('category', categorySchema)

function validateCategory(category){
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        contestant: Joi.array().min(2).required()
    })
    return schema.validate(category)
}

module.exports.Category = Category
module.exports.validate = validateCategory
module.exports.categorySchema = categorySchema