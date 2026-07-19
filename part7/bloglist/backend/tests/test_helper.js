const Blog=require('../models/blog')
const initialBlogs = [
  {
    title: 'First blog',
    author: 'Boss',
    url: 'https://example.com/1',
    likes: 5,
  },
  {
    title: 'Second blog',
    author: 'Boss',
    url: 'https://example.com/2',
    likes: 10,
  }
]
const blogsInDb=async()=>{
    const blogs=await Blog.find({})
    return blogs.map(blog=>blog.toJSON())
}
const nonExistingId=async()=>{
    const blog=new Blog({
        title:'temporary',
        author:'temp',
        url:'temp',
        likes:1,
    })
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}
module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
}