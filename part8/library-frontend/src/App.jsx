import { useState, useEffect, useRef } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { useApolloClient } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [notification, setNotification] = useState(null)
  const client = useApolloClient()
  const localBooks = useRef(new Set())

  useEffect(() => {
    const updateBooksCache = (addedBook) => {
      const addBookToQuery = (variables) => {
        const queryOptions = variables
          ? { query: ALL_BOOKS, variables }
          : { query: ALL_BOOKS }

        client.cache.updateQuery(queryOptions, (data) => {
          if (!data || data.allBooks.some((book) => book.title === addedBook.title)) {
            return data
          }

          return {
            allBooks: data.allBooks.concat(addedBook),
          }
        })
      }

      addBookToQuery()
      addedBook.genres.forEach((genre) => addBookToQuery({ genre }))
    }

    const sub = client.subscribe({ query: BOOK_ADDED }).subscribe({
      next: ({ data }) => {
        const addedBook = data?.bookAdded
        if (addedBook) {
          updateBooksCache(addedBook)
          if (localBooks.current.has(addedBook.title)) {
            localBooks.current.delete(addedBook.title)
          } else {
            setNotification(`added ${addedBook.title}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          }
        }
      },
      error: (err) => {
        console.error('Subscription error:', err)
      }
    })
    return () => sub.unsubscribe()
  }, [client])

  const logout = () => {
    localStorage.removeItem('library-user-token')
    setToken(null)
    client.clearStore()
  }

  return (
    <div>
      {notification && <div>{notification}</div>}

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommend')}>recommend</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors show={page === 'authors'} authenticated={!!token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add' && !!token} onBookAdded={(title) => localBooks.current.add(title)} />
      <Recommendations show={page === 'recommend' && !!token} />
      <Login show={page === 'login' && !token} onLogin={(value) => {
        localStorage.setItem('library-user-token', value)
        setToken(value)
        setPage('authors')
      }} />
    </div>
  )
}

export default App
