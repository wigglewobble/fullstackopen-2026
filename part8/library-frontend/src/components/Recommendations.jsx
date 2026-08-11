import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = ({ show }) => {
  const me = useQuery(ME, { skip: !show })
  const genre = me.data?.me?.favoriteGenre
  const books = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !show || !genre,
  })

  if (!show) return null
  if (me.loading || books.loading) return <div>loading...</div>

  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre <strong>{genre}</strong></div>
      <table>
        <tbody>
          <tr><th>title</th><th>author</th><th>published</th></tr>
          {books.data.allBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td><td>{book.author.name}</td><td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
