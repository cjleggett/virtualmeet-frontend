import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Login() {

  const emailRef = useRef()
  const passwordRef = useRef()
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const { login, serverURL, updateUserData } = useAuth()
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {

      // Log in user using firebase auth
      setError('')
      setLoading(true)
      const res = await login(emailRef.current.value, passwordRef.current.value)

      // Once User is logged in, begin a session in the backend:
      res.user.getIdToken(true).then(function(idToken) {
        fetch(`${serverURL()}/auth/login`, {
          credentials: 'include',
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8"
          },
          body: JSON.stringify({idToken})
        }).then(res => res.json()).then(data => {
          updateUserData(data)
        })
        .catch()
      }).catch()
      
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