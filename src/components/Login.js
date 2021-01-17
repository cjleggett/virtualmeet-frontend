import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Login() {

  const emailRef = useRef()
  const passwordRef = useRef()
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const { login } = useAuth()
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
    } catch(e) {
      setError('Failed to log in')
      setLoading(false)
      return
    }
    history.push('/')

  }

  return (
    <div>
      <h2>Log In</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" ref={emailRef} required></input>
        <label>Password</label>
        <input type="password" ref={passwordRef} required></input>
        <button disabled={loading} type="submit">Log In</button>
      </form>
      <div>
        <Link to="forgot-password">Forgot your password?</Link>
      </div>
      <div>
        Don't have an account yet? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  )
}