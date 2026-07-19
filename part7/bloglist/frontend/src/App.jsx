import { useState, useEffect } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'

import blogService from './services/blogs'
import loginService from './services/login'

import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'

import { AppBar, Toolbar, Button } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const match = useMatch('/blogs/:id')

  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      setUser(user)
      blogService.setToken(user.token)

      setUsername('')
      setPassword('')

      navigate('/')
    } catch {
      setMessage('wrong username or password')

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLike = async (blog) => {
    console.log('BLOG RECEIVED:', blog)
    console.log('BLOG USER:', blog.user)

    try {
      const updatedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id || blog.user._id,
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      setBlogs((prevBlogs) =>
        prevBlogs.map((b) => (b.id !== returnedBlog.id ? b : returnedBlog)),
      )
    } catch (exception) {
      console.log('LIKE ERROR')
      console.log(exception)
    }
  }

  const handleDelete = async (blog) => {
    try {
      await blogService.remove(blog.id)

      setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id))

      navigate('/')
    } catch (exception) {
      console.log(exception)
      alert(exception.response?.data?.error || 'failed to delete blog')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)

    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs((prevBlogs) =>
        prevBlogs.concat({
          ...returnedBlog,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
          },
        }),
      )

      navigate('/')
    } catch {
      alert('failed to create blog')
    }
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>

          {user && (
            <Button color="inherit" component={Link} to="/create">
              create new
            </Button>
          )}

          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        </Toolbar>
      </AppBar>

      <Notification message={message} />

      {user && (
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
      )}

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />

          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blog={blog}
                user={user}
                handleLike={handleLike}
                handleDelete={handleDelete}
              />
            }
          />

          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />

          <Route
            path="/login"
            element={
              <LoginForm
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                handleLogin={handleLogin}
              />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
