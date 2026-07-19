import { render, screen } from '@testing-library/react'
import BlogView from './BlogView'
import { test, expect } from 'vitest'

test('unlogged user sees info but no buttons', () => {
  const blog = {
    title: 'React patterns',
    url: 'google.com',
    likes: 3,
    user: {
      username: 'mluukkai',
      name: 'Matti'
    }
  }

  render(<BlogView blog={blog} />)

  expect(screen.getByText(blog.url)).toBeDefined()
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('non creator sees only like button', () => {
  const blog = {
    title: 'React patterns',
    url: 'google.com',
    likes: 3,
    user: {
      username: 'mluukkai',
      name: 'Matti'
    }
  }

  const user = {
    username: 'someone'
  }

  render(
    <BlogView
      blog={blog}
      user={user}
      handleLike={() => {}}
      handleDelete={() => {}}
    />
  )

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('creator sees remove button', () => {
  const blog = {
    title: 'React patterns',
    url: 'google.com',
    likes: 3,
    user: {
      username: 'mluukkai',
      name: 'Matti'
    }
  }

  const user = {
    username: 'mluukkai'
  }

  render(
    <BlogView
      blog={blog}
      user={user}
      handleLike={() => {}}
      handleDelete={() => {}}
    />
  )

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})