import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'

export default function AddEntry({ raceId }) {

  const { serverURL } = useAuth()
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const hours = useRef()
  const minutes = useRef()
  const seconds = useRef()
  const elevation = useRef()


  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)

      // Add new team request to the database
      fetch(`${serverURL()}/entries/new`, {
        credentials: 'include',
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          hours: hours.current.value,
          minutes: minutes.current.value,
          seconds: seconds.current.value,
          elevation: elevation.current.value,
          race: raceId
        })
      }).then(() => {
        window.location.reload(false);
      })
    } catch(e) {
      setError('Failed to create a race')
      setLoading(false)
      return
    }
  }

  return (
    <div>
      <h2>Submit your Run</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Hours</label>
          <input type="number" min="0" step="1" ref={hours} required></input>
          <label>Minutes</label>
          <input type="number" min="0" max="60" step="1" ref={minutes} required></input>
          <label>Seconds</label>
          <input type="number" min="0" step=".01" ref={seconds} required></input>
          <label>Elevation Gain (in feet)</label>
          <input type="number" min="0" ref={elevation} required></input>
          
          <button disabled={loading} type="submit">Submit</button>
        </form>
    </div>
  )
}