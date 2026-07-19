const path = require('path')

const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const express = require('express')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

console.log('NODE_ENV =', process.env.NODE_ENV)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

app.use(express.static(path.join(__dirname, 'dist')))

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testingRouter)
}

app.get('/{*splat}', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app