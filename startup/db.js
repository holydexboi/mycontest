const winston = require('winston')
const mongoose = require('mongoose')

module.exports = function(){
    mongoose.connect('mongodb://localhost/election', {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
    .then(() => winston.info('Connected to Mongo Database'))
    
}
