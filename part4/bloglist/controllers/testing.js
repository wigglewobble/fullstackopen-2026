const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  console.log('RESET ROUTE EXECUTED')

  const blogResult = await Blog.deleteMany({})
  const userResult = await User.deleteMany({})

  console.log('Blogs deleted:', blogResult.deletedCount)
  console.log('Users deleted:', userResult.deletedCount)

  response.status(204).end()
})

module.exports = testingRouter