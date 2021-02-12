import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import useTeams from '../hooks/TeamsHook';
import useTeam from '../hooks/TeamHook'

export default function AddMeet() {

  const { serverURL } = useAuth()
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ chosenTeams, setChosenTeams ] = useState('')
  const [ units, setUnits ] = useState('')
  const distance = useRef()
  const start = useRef()
  const end = useRef()
  const name = useRef()

  const history = useHistory()
  const teams = useTeams()
  const currentTeam = useTeam()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)

      // Add new team request to the database
      fetch(`${serverURL()}/meets/newMeet`, {
        credentials: 'include',
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          distance: distance.current.value,
          startDate: start.current.value,
          endDate: end.current.value,
          invitedTeams: chosenTeams,
          name: name.current.value,
          units
        })
      }).then(() => {
        history.push('/')
      })
    } catch(e) {
      setError('Failed to create a race')
      setLoading(false)
      return
    }
  }

  function handleChange(e) {
    let value = Array.from(e.target.selectedOptions, option => option.value);
    setChosenTeams(value)
  }

  return (
    <div>
      <h2>Make a Race</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" ref={name} required></input>
          <label>Distance</label>
          <input type="number" ref={distance} required></input>
          <label>Units</label>
          <select defaultValue="" onChange={e => setUnits(e.currentTarget.value)}>
            <option value="" disabled>Choose units</option>
            <option value="Miles">Miles</option>
            <option value="Kilometers">Kilometers</option>
            <option value="Meters">Meters</option>
            <option value="Yards">Yards</option>
            
          </select>
          <label>Start Date</label>
          <input type="date" ref={start} required></input>
          <label>End Date</label>
          <input type="date" ref={end} required></input>
          <label>Invite Teams</label>
          <select multiple={true} onChange={handleChange}>
            {teams.filter(team => team.id !== currentTeam.team)
            .map(team => (
              <option key={team.id} value={team.id} >{team.name}</option>
            ))}
          </select>
          <button disabled={loading} type="submit">Make Race</button>
        </form>
    </div>
  )
}