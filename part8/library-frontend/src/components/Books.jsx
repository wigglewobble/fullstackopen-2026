import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const result = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState(null)
  const filtered = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
    fetchPolicy: genre ? 'network-only' : 'cache-first',
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = genre ? filtered.data?.allBooks ?? [] : result.data.allBooks
  const genres = [...new Set(result.data.allBooks.flatMap((book) => book.genres))]

  return (
    <div>
      <h2>books</h2>
      <div>
        <button onClick={() => setGenre(null)}>all genres</button>
        {genres.map((bookGenre) => (
          <button key={bookGenre} onClick={() => setGenre(bookGenre)}>{bookGenre}</button>
        ))}
      </div>
      {genre && <h3>in genre {genre}</h3>}

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
