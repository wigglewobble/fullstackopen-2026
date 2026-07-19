import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set, get) => ({
  blogs: [],

  initializeBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },

  addComment: async (blogId, comment) => {
    const updatedBlog = await blogService.addComment(blogId, comment)

    set({
      blogs: get().blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      ),
    })
  },

  createBlog: async (blogObject, user) => {
    const returnedBlog = await blogService.create(blogObject)

    set({
      blogs: get().blogs.concat({
        ...returnedBlog,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
      }),
    })
  },

  likeBlog: async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user:
        typeof blog.user === 'object'
          ? blog.user.id || blog.user._id
          : blog.user,
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    set({
      blogs: get().blogs.map((b) =>
        b.id === returnedBlog.id ? returnedBlog : b
      ),
    })
  },

  deleteBlog: async (blog) => {
    await blogService.remove(blog.id)

    set({
      blogs: get().blogs.filter((b) => b.id !== blog.id),
    })
  },
}))

export default useBlogStore