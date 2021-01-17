import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Signup() {

  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const { signup } = useAuth()
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    try {
      setError('')
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
    } catch(e) {
      setError('Failed to create an account')
      setLoading(false)
      return
    }
    history.push('/')

    

  }

  return (
    <div>
      <h2>Sign Up</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" ref={emailRef} required></input>
          <label>Password</label>
          <input type="password" ref={passwordRef} required></input>
          <label>Confirm Password</label>
          <input type="password" ref={passwordConfirmRef} required></input>
          <button disabled={loading} type="submit">Sign Up</button>
        </form>
      <div>
        Already have an ccount? <Link to="/login">Log in</Link>
      </div>
    </div>
  )
}