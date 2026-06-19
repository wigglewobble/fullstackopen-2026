import { create } from 'zustand'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],

  fetchAnecdotes: async () => {
    const response = await fetch('http://localhost:3001/anecdotes')
    const anecdotes = await response.json()

    set({ anecdotes })
  },

  filter: '',

  setFilter: (filter) => set({ filter }),

  voteAnecdote: async (id) => {

    const anecdote =
      get().anecdotes.find(a => a.id === id)

    const changed = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const response = await fetch(
      `http://localhost:3001/anecdotes/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(changed)
      }
    )

    const returned = await response.json()

    set(state => ({
      anecdotes:
        state.anecdotes.map(a =>
          a.id === id ? returned : a
        )
    }))
  },

  addAnecdote: async (content) => {
    const anecdote = {
      content,
      votes: 0
    }

    const response = await fetch(
      'http://localhost:3001/anecdotes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(anecdote)
      }
    )

    const newAnecdote = await response.json()

    set((state) => ({
      anecdotes: state.anecdotes.concat(newAnecdote)
    }))
  },
  removeAnecdote: async (id) => {

    await fetch(
      `http://localhost:3001/anecdotes/${id}`,
      {
        method: 'DELETE'
      }
    )

    set(state => ({
      anecdotes:
        state.anecdotes.filter(
          a => a.id !== id
        )
    }))
  }

}))


export default useAnecdoteStore