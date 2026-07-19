import { Paper, Typography, Button } from '@mui/material'
const BlogView = ({ blog, user, handleLike, handleDelete }) => {
  if (!blog) {
    return null
  }

  const canRemove =
    user &&
    blog.user &&
    (blog.user.username === user.username ||
      (blog.user.id && user.id && blog.user.id === user.id))

  return (
    <Paper
      sx={{
        p: 3,
        mt: 2,
      }}
    >
      <Typography variant="h4">{blog.title}</Typography>

      <Typography>{blog.url}</Typography>

      <Typography>
        likes {blog.likes}
        {user && (
          <Button variant="contained" onClick={() => handleLike(blog)}>
            like
          </Button>
        )}
      </Typography>

      <Typography>added by {blog.user?.name}</Typography>

      {canRemove && (
        <Button
          color="error"
          variant="contained"
          onClick={() => handleDelete(blog)}
        >
          remove
        </Button>
      )}
    </Paper>
  )
}

export default BlogView
