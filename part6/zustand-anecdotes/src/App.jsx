import { useEffect } from 'react'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import useAnecdoteStore from './store'

const App = () => {
  const fetchAnecdotes = useAnecdoteStore(
    (state) => state.fetchAnecdotes
  )

  useEffect(() => {
    fetchAnecdotes()
  }, [])

  return (
    <div>
      <h2>Anecdotes</h2>

      <Notification />

      <Filter />

      <AnecdoteList />

      <h2>Create new</h2>

      <AnecdoteForm />
    </div>
  )
}

export default App
