import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : '',
  }

  const showWhenVisible = {
    display: visible ? '' : 'none',
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showRemoveButton =
    blog.user && user && blog.user.username === user.username

  return (
    <div className="blog" style={blogStyle}>
      <div className="blogDefault" style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button type="button" onClick={() => setVisible(true)}>
          view
        </button>
      </div>

      <div className="blogDetails" style={showWhenVisible}>
        <div>
          {blog.title} {blog.author}
          <button type="button" onClick={() => setVisible(false)}>
            hide
          </button>
        </div>

        <div>{blog.url}</div>

        <div>
          likes {blog.likes}
          <button type="button" onClick={() => handleLike(blog)}>
            like
          </button>
        </div>

        <div>{blog.user?.name}</div>

        {showRemoveButton && (
          <button type="button" onClick={() => handleDelete(blog)}>
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog
