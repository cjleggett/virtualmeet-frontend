import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Login() {

  const nameRef = useRef()
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const { serverURL } = useAuth()
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()
    const name = nameRef.current.value

    try {
      setError('')
      setLoading(true)

      // Add team to database
      fetch(`${serverURL()}/teams/newTeam`, {
        credentials: 'include',
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({name})
      }).then(res => res.json()).then(() => {
        history.push('/')
      })
    } catch {
      setError('Could not create team.')
    }
    setLoading(false)
  }

  return (
    <div>
      <h2>Create Team</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Team Name</label>
        <input type="text" ref={nameRef} required></input>
        <button disabled={loading} type="submit">Create Team</button>
      </form>
      <div>
        <Link to="/">Cancel</Link>
      </div>
    </div>
  )
}