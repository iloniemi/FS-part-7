import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useUserValue } from '../UserContext'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const user = useUserValue()

  if (user) navigate('/')

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('logging in as', username, password)

    setUsername('')
    setPassword('')

    handleLogin(username, password)
  }

  return (
    <div>
      <h2 data-testid='login-header' >Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            data-testid='login-username'
          />
        </div>
        <div>
          <TextField
            label="Password"
            value={password}
            type='password'
            onChange={({ target }) => setPassword(target.value)}
            data-testid='login-password'
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            data-testid='login-submit-button'
          >
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm