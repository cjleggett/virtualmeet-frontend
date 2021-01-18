import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import useTeams from '../hooks/TeamsHook';

export default function JoinTeam() {

  const { serverURL } = useAuth()
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ team, setTeam ] = useState('')
  const history = useHistory()
  const teams = useTeams()
  console.log(teams)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)

      console.log(team)
      // Add new team request to the database
      fetch(`${serverURL()}/teams/join`, {
        credentials: 'include',
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          teamId: team
        })
      }).then(() => {
        history.push('/')
      })


    } catch(e) {
      setError('Failed to create a request')
      setLoading(false)
      return
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Team</label>
          <select defaultValue="" onChange={e => setTeam(e.currentTarget.value)}>
            <option value="" disabled>Choose Team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <button disabled={loading} type="submit">Join Team</button>
        </form>
    </div>
  )
}