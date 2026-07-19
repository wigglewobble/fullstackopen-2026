import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls event handler with correct details when a new blog is created', async () => {
  const createBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  const inputs = container.querySelectorAll('input')

  await user.type(inputs[0], 'Component testing')
  await user.type(inputs[1], 'Boss')
  await user.type(inputs[2], 'https://example.com')

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Component testing',
    author: 'Boss',
    url: 'https://example.com',
  })
})
