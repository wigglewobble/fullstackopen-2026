import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'
export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    return {
        inputProps: {
            type,
            value,
            onChange
        },
        reset
    }
}
export const useAnecdotes = () => {
    const [anecdotes, setAnecdotes] = useState([])

    useEffect(() => {
        anecdoteService.getAll().then(data => setAnecdotes(data))
    }, [])

    const addAnecdote = async (anecdote) => {
        const newAnecdote = await anecdoteService.create(anecdote)

        setAnecdotes(prev => prev.concat(newAnecdote))
    }

    const deleteAnecdote = async (id) => {
        await anecdoteService.remove(id)

        setAnecdotes(prev =>
            prev.filter(anecdote => anecdote.id !== id)
        )
    }

    return {
        anecdotes,
        addAnecdote,
        deleteAnecdote
    }
}