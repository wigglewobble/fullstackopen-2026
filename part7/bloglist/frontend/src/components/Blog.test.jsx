import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import '@testing-library/jest-dom'
test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Component testing',
    author: 'Boss',
    url: 'https://example.com',
    likes: 10,
    user: {
      username: 'boss',
      name: 'Boss',
    },
  }

  render(
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      user={blog.user}
    />,
  )

  const defaultView = document.querySelector('.blogDefault')

  const detailsView = document.querySelector('.blogDetails')

  expect(defaultView).toHaveTextContent('Component testing')

  expect(defaultView).toHaveTextContent('Boss')

  expect(detailsView).not.toBeVisible()
})

test('shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Component testing',
    author: 'Boss',
    url: 'https://example.com',
    likes: 10,
    user: {
      username: 'boss',
      name: 'Boss',
    },
  }

  render(
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      user={blog.user}
    />,
  )

  const user = userEvent.setup()

  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('https://example.com')).toBeInTheDocument()

  expect(screen.getByText(/likes 10/i)).toBeInTheDocument()
})

test('if like button is clicked twice, event handler is called twice', async () => {
  const blog = {
    title: 'Component testing',
    author: 'Boss',
    url: 'https://example.com',
    likes: 10,
    user: {
      username: 'boss',
      name: 'Boss',
    },
  }

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      handleLike={mockHandler}
      handleDelete={() => {}}
      user={blog.user}
    />,
  )

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
