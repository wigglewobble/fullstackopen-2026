import { useState, useEffect } from 'react'
import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [type, setType] = useState('success')

  useEffect(() => {
    personService.getAll().then(res => setPersons(res.data))
  }, [])

  const showMessage = (msg, type = 'success') => {
    setMessage(msg)
    setType(type)
    setTimeout(() => setMessage(null), 3000)
  }

  const addPerson = (e) => {
    e.preventDefault()

    const existing = persons.find(p => p.name === newName)

    if (existing) {
      if (window.confirm(`${newName} exists, replace number?`)) {
        const updated = { ...existing, number: newNumber }

        personService.update(existing.id, updated)
          .then(res => {
            setPersons(persons.map(p =>
              p.id !== existing.id ? p : res.data
            ))
            showMessage(`Updated ${newName}`)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            showMessage(`${newName} was already removed`, 'error')
            setPersons(persons.filter(p => p.id !== existing.id))
          })
      }
      return
    }

    const person = { name: newName, number: newNumber }

    personService
      .create(person)
      .then(res => {
        setPersons(persons.concat(res.data))
        showMessage(`Added ${newName}`)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        showMessage(error.response.data.error, 'error')
      })

  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
        showMessage(`Deleted ${name}`)
      })
    }
  }

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={type} />

      <Filter search={search} setSearch={setSearch} />

      <h3>Add new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>
      <Persons persons={filtered} deletePerson={deletePerson} />
    </div>
  )
}

export default App