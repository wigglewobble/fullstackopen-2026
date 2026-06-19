import { describe, expect, test, vi } from 'vitest'
import useAnecdoteStore from './store'

describe('store initialization', () => {
    test('loads anecdotes from backend', async () => {

        const anecdotes = [
            {
                content: 'test anecdote',
                votes: 5,
                id: '1'
            }
        ]

        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(anecdotes)
            })
        )

        await useAnecdoteStore.getState().fetchAnecdotes()

        expect(useAnecdoteStore.getState().anecdotes)
            .toEqual(anecdotes)
    })
    test('voting increases votes', async () => {

        useAnecdoteStore.setState({
            anecdotes: [
                {
                    content: 'test',
                    votes: 0,
                    id: 1
                }
            ]
        })

        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        content: 'test',
                        votes: 1,
                        id: 1
                    })
            })
        )

        await useAnecdoteStore.getState().voteAnecdote(1)

        expect(
            useAnecdoteStore.getState().anecdotes[0].votes
        ).toBe(1)

    })
})