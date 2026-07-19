import { useState } from 'react'
import { TextField, Button } from '@mui/material'
const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title,
            author,
            url,
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>

                <div>
                    <TextField
                        label="Author"
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>

                <div>
                    <TextField
                        label="URL"
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>

                <Button
                    variant="contained"
                    type="submit"
                >
                    create
                </Button>
            </form>
        </div>

    )
}
export default BlogForm