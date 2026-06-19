import { render, screen } from '@testing-library/react'
import AnecdoteList from './AnecdoteList'
import useAnecdoteStore from '../store'
import { test, expect } from 'vitest'

test('renders anecdotes sorted by votes', () => {

    useAnecdoteStore.setState({
        filter: 'debug',
        anecdotes: [
            {
                content: 'debugging is hard',
                votes: 0,
                id: 1
            },
            {
                content: 'premature optimization',
                votes: 0,
                id: 2
            }
        ]
    })

    render(<AnecdoteList />)

    expect(
        screen.getByText('debugging is hard')
    ).toBeInTheDocument()

    expect(
        screen.queryByText('premature optimization')
    ).toBeNull()
})