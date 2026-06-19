import { useAnecdotes } from './hooks/useAnecdotes'
import Notification from './components/Notification'
import { useNotify } from './NotificationContext'

const App = () => {
  const {
    anecdotesQuery,
    newAnecdoteMutation,
    voteMutation
  } = useAnecdotes()

  const notify = useNotify()

  if (anecdotesQuery.isPending) {
    return <div>loading data...</div>
  }

  if (anecdotesQuery.isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  const anecdotes = anecdotesQuery.data

  const onCreate = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value

    newAnecdoteMutation.mutate(content)

    notify(`you created '${content}'`)

    event.target.anecdote.value = ''
  }

  return (
    <div>
      <Notification />

      <h3>Create new</h3>

      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>

      <h3>Anecdotes</h3>

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>

          <div>
            has {anecdote.votes}

            <button
              onClick={() => {
                voteMutation.mutate(anecdote)
                notify(`you voted '${anecdote.content}'`)
              }}
            >
              vote
            </button>
          </div>

          <br />
        </div>
      ))}
    </div>
  )
}

export default App