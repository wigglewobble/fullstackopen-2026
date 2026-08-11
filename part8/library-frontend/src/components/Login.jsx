import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const Login = ({ show, onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [login] = useMutation(LOGIN)

  if (!show) return null

  const submit = async (event) => {
    event.preventDefault()
    try {
      const result = await login({ variables: { username, password } })
      onLogin(result.data.login.value)
      setUsername('')
      setPassword('')
      setError(null)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div>
      <h2>login</h2>
      {error && <div>login failed: {error}</div>}
      <form onSubmit={submit}>
        <label>username <input value={username} onChange={({ target }) => setUsername(target.value)} /></label>
        <label>password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></label>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login
