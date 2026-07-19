import { TextField, Button } from '@mui/material'

const LoginForm = ({
  username,
  password,
  handleLogin,
}) => {
  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="Username"
            {...username.input}
          />
        </div>

        <div>
          <TextField
            label="Password"
            {...password.input}
          />
        </div>

        <Button variant="contained" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm