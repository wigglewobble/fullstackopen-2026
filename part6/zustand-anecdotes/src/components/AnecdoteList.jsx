import useAnecdoteStore from '../store'
import useNotificationStore from '../notificationStore'
const AnecdoteList = () => {
    const anecdotes = useAnecdoteStore(
        (state) => state.anecdotes
    )
    const filter = useAnecdoteStore(
        (state) => state.filter
    )
    const sortedAnecdotes = anecdotes
        .filter((anecdote) =>
            anecdote.content
                .toLowerCase()
                .includes(filter.toLowerCase())
        )
        .toSorted((a, b) => b.votes - a.votes)

    const voteAnecdote = useAnecdoteStore(
        (state) => state.voteAnecdote
    )
    const removeAnecdote = useAnecdoteStore(
        (state) => state.removeAnecdote
    )
    const setNotification = useNotificationStore(
        (state) => state.setNotification
    )
    return (
        <>
            {sortedAnecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>

                    <div>
                        has {anecdote.votes}

                        <button
                            onClick={() => {
                                voteAnecdote(anecdote.id)
                                setNotification(`You voted '${anecdote.content}'`)
                            }}
                        >
                            vote
                        </button>

                        <button
                            onClick={() => {
                                removeAnecdote(anecdote.id)
                                setNotification(`Removed '${anecdote.content}'`)
                            }}
                        >
                            delete
                        </button>
                    </div>

                    <br />
                </div>
            ))}
        </>
    )
}

export default AnecdoteList