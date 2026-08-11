import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()

  const logout = () => {
    localStorage.removeItem('library-user-token')
    setToken(null)
    client.clearStore()
  }

  return (
    <div>
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

      <NewBook show={page === 'add' && !!token} />
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
