import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Signup() {

  const emailRef = useRef()
  const firstRef = useRef()
  const lastRef = useRef()
  const birthdayRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ gender, setGender ] = useState('')
  const { signup, serverURL, updateUserData } = useAuth()
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    const first = firstRef.current.value
    const last = lastRef.current.value
    const birthday = birthdayRef.current.value

    try {

      // Create new auth user
      setError('')
      setLoading(true)
      const res = await signup(emailRef.current.value, passwordRef.current.value)

      // get id token for new user
      res.user.getIdToken(true).then(function(idToken) {
        
        // Add new user info to database
        fetch(`${serverURL()}/auth/signup`, {
          credentials: 'include',
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8"
          },
          body: JSON.stringify({
            idToken,
            gender,
            first,
            last,
            birthday
          })
        }).then(() => {
          updateUserData({gender, first, last, birthday})
          history.push('/')
        })
      })


    } catch(e) {
      setError('Failed to create an account')
      setLoading(false)
      return
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>First Name</label>
          <input type="text" ref={firstRef} required></input>
          <label>Last Name</label>
          <input type="text" ref={lastRef} required></input>
          <label>Birthday</label>
          <input type="date" ref={birthdayRef} required></input>
          <label>Gender</label>
          <select defaultValue="" onChange={e => setGender(e.currentTarget.value)}>
            <option value="" disabled>Choose Gender</option>
            <option value="Woman">Woman</option>
            <option value="Prefer not to say">Prefer not to say</option>
            <option value="Other">Other</option>
            <option value="Man">Man</option>
          </select>
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