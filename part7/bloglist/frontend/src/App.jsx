import { useEffect } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'

import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  Typography,
} from '@mui/material'

import Users from './components/Users'
import User from './components/User'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'

import loginService from './services/login'

import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'
import useUserListStore from './stores/userListStore'
import useNotificationStore from './stores/notificationStore'

import useField from './hooks/useField'

const App = () => {
  const username = useField('text')
  const password = useField('password')

  const blogs = useBlogStore((state) => state.blogs)
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs)
  const createBlog = useBlogStore((state) => state.createBlog)
  const likeBlog = useBlogStore((state) => state.likeBlog)
  const deleteBlog = useBlogStore((state) => state.deleteBlog)

  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const initializeUser = useUserStore((state) => state.initializeUser)
  const logout = useUserStore((state) => state.logout)

  const users = useUserListStore((state) => state.users)
  const initializeUsers = useUserListStore((state) => state.initializeUsers)

  const setMessage = useNotificationStore((state) => state.setMessage)

  const navigate = useNavigate()

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  useEffect(() => {
    initializeUsers()
  }, [initializeUsers])

  const match = useMatch('/blogs/:id')
  const userMatch = useMatch('/users/:id')

  const blog = match
    ? blogs.find((b) => b.id === match.params.id)
    : null

  const selectedUser = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({
        username: username.input.value,
        password: password.input.value,
      })

      setUser(loggedUser)

      username.reset()
      password.reset()

      navigate('/')
    } catch {
      setMessage('wrong username or password')
    }
  }

  const handleLike = async (blog) => {
    try {
      await likeBlog(blog)
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleDelete = async (blog) => {
    try {
      await deleteBlog(blog)
      navigate('/')
    } catch (exception) {
      setMessage(exception.response?.data?.error || 'failed to delete blog')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      await createBlog(blogObject)
      navigate('/')
    } catch {
      setMessage('failed to create blog')
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Blogs
          </Button>

          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>

          {user && (
            <Button color="inherit" component={Link} to="/create">
              Create New
            </Button>
          )}

          {!user && (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
        <Notification />

        {user && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              my: 2,
            }}
          >
            <Typography>
              Logged in as <strong>{user.name}</strong>
            </Typography>

            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        )}

        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={<BlogList blogs={blogs} />}
            />

            <Route
              path="/users"
              element={<Users users={users} />}
            />

            <Route
              path="/users/:id"
              element={<User user={selectedUser} />}
            />

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

            <Route
              path="/create"
              element={
                <BlogForm createBlog={addBlog} />
              }
            />

            <Route
              path="/login"
              element={
                <LoginForm
                  username={username}
                  password={password}
                  handleLogin={handleLogin}
                />
              }
            />

            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </ErrorBoundary>
      </Container>
    </>
  )
}

export default App