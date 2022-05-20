const express = require('express')
const Fawn = require('fawn')
const _ = require('lodash')
const {Contest, validate} = require('../models/contest')
const { Category } = require('../models/category')
const auth = require('../middleware/auth')
const {User} = require('../models/user')



const router = express.Router()


router.get('/', async (req, res) => {
    
    const contest = await Contest.find().sort({createdDate: 1}).select('-createdDate')
    res.send(contest)
   
})

router.get('/:id', async (req, res) => {
    const contest = await Contest.findById(req.params.id).catch(err => console.log(err.message))
    if(!contest) return res.status(404).send('No contest with the given ID')

    res.send(contest)
})

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user = await User.findById(req.body.userId).catch(err => console.log(err.message))
    if(!user) return res.status(404).send('No user with the given ID')

    const categories = await Category.insertMany(req.body.categories, {rawResult: true}).catch(err => console.log(err.message))
    if(!categories) return res.status(500).send('Error creating Category')
    
    const contest = new Contest({
        title: req.body.title,
        openDate: req.body.openDate,
        closingDate: req.body.closingDate,
        user: {
            _id: user._id,
            email: user.email
        },
        categories: categories.ops
    })
    await contest.save()
    res.send(contest)
})

router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const contest = await Contest.findByIdAndUpdate(req.params.id, _.pick(req.body, 'title', 'openDate', 'closingDate', 'categories'), {new: true}).catch(err => console.log(err.message))
    if(!contest) return res.status(404).send('No contest with the given ID')

    res.send(contest)
})


router.delete('/:id', auth,  async (req, res) => {
    const contest = await Contest.findByIdAndRemove(req.body.id).catch(err => console.log(err.message))
    if(!contest) return res.status(404).send('No contest with the given ID')

    res.send(contest)
})

module.exports = router
