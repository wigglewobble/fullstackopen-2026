import useAnecdoteStore from '../store'
import useNotificationStore from '../notificationStore'

const AnecdoteForm = () => {
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  )

  const addAnecdote = useAnecdoteStore(
    (state) => state.addAnecdote
  )

  const add = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value

    if (content) {
      addAnecdote(content)
      setNotification(`You created '${content}'`)
      event.target.anecdote.value = ''
    }
  }

  return (
    <form onSubmit={add}>
      <input name="anecdote" />
      <button type="submit">add</button>
    </form>
  )
}

export default AnecdoteForm