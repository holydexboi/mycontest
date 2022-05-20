const winston = require('winston')
require('express-async-errors')
require('winston-mongodb')

module.exports = function(){
    winston.add( winston.createLogger({
        exceptionHandlers: [
            new winston.transports.Console({level: 'info', format: winston.format.combine(winston.format.colorize(), winston.format.simple(), winston.format.prettyPrint(), winston.format.json())}),
            new winston.transports.File({filename: 'exception.log'}),
        ]
    }))
    
    process.on('unhandledRejection', (ex) => {
        console.log('We GOT AN UNHANDLE REJECTION')
        throw ex
        
    })
    const file = new winston.transports.File( {filename: 'logfile.log', format: winston.format.json()}, )
    const console = new winston.transports.Console( {level: 'info', format: winston.format.combine(winston.format.colorize(), winston.format.simple())})
    const db = new winston.transports.MongoDB( {db: 'mongodb://localhost/election', useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true, level: 'info'})

    winston.add(file)
    winston.add(console)
    winston.add(db)
}