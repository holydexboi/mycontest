const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')
const _ = require('lodash')
const auth = require('../middleware/auth')
const {Category, validate} = require('../models/category')



const router = express.Router()

router.get('/', auth, async (req, res) => {
    const categories = await Category.find().sort('name')

    res.send(categories)
})

router.get('/:id', auth, async (req, res) => {
    const category = await Category.findById(req.params.id).catch(err => console.log(err.message))

    if(!category) return res.status(404).send('No Category with the given ID')

    res.send(category)
})

router.post('/', auth, async (req, res) => {
    
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const category = new Category({
        name: req.body.name,
        contestant: req.body.contestant
    })

    await category.save()
    res.send(category)
})

router.put('/:id', auth, async (req, res) => {
    
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

   const category =  await Category.findByIdAndUpdate(req.params.id, _.pick(req.body, 'name', 'contestant') , {new: true}).catch(err => console.log(err.message))
   if(!category) return res.status(404).send('No category with the given ID')

   res.send(category)

})

router.delete('/:id', auth, async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id).catch(err => console.log(err.message))
    
    if(!category) return res.status(404).send('Category does not exist')

    res.send(category)
})


module.exports = router