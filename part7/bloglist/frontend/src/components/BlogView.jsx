import {
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import useField from '../hooks/useField'
import useBlogStore from '../stores/blogStore'

const BlogView = ({ blog, user, handleLike, handleDelete }) => {
  const addComment = useBlogStore((state) => state.addComment)
  const comment = useField('text')

  if (!blog) {
    return null
  }

  const canRemove =
    user &&
    blog.user &&
    (blog.user.username === user.username ||
      (blog.user.id && user.id && blog.user.id === user.id))

  const handleComment = async (event) => {
    event.preventDefault()

    if (!comment.input.value.trim()) {
      return
    }

    await addComment(blog.id, comment.input.value)
    comment.reset()
  }

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 700,
        mx: 'auto',
        mt: 4,
        p: 4,
        borderRadius: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {blog.title}
      </Typography>

      <Typography
        component="a"
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          textDecoration: 'none',
          color: 'primary.main',
        }}
      >
        {blog.url}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mt: 3,
        }}
      >
        <Typography>
          Likes: {blog.likes}
        </Typography>

        {user && (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleLike(blog)}
          >
            Like
          </Button>
        )}
      </Box>

      <Typography sx={{ mt: 2 }}>
        Added by <strong>{blog.user?.name}</strong>
      </Typography>

      {canRemove && (
        <Button
          color="error"
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => handleDelete(blog)}
        >
          Remove Blog
        </Button>
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>
        Comments
      </Typography>

      <Box
        component="form"
        onSubmit={handleComment}
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          size="small"
          label="Write a comment..."
          {...comment.input}
        />

        <Button type="submit" variant="contained">
          Add
        </Button>
      </Box>

      <List>
        {blog.comments?.map((comment, index) => (
          <ListItem key={`${comment}-${index}`} divider>
            <ListItemText primary={comment} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default BlogView