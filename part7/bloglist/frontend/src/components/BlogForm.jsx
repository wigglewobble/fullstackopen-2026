import { TextField, Button } from '@mui/material'
import useField from '../hooks/useField'

const BlogForm = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title.input.value,
      author: author.input.value,
      url: url.input.value,
    })

    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="Title"
            {...title.input}
          />
        </div>

        <div>
          <TextField
            label="Author"
            {...author.input}
          />
        </div>

        <div>
          <TextField
            label="URL"
            {...url.input}
          />
        </div>

        <Button variant="contained" type="submit">
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm