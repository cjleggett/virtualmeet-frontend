import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import useTeam from '../hooks/TeamHook'
import GetStarted from './GetStarted'
import Races from './Races'

export default function Dashboard() {

  const team = useTeam()
  const [ userData, setUserData ] = useState(JSON.parse(localStorage.getItem('userData')))
  console.log(userData)

  return (
    <div>
      <div>
        {!team.team && userData && userData.requests && !userData.requests.length && <GetStarted setUserData={setUserData}/>}
        {team.captain && <div><Link to="requests">Manage Requests</Link></div>}
        {team.captain && <div><Link to="make-race">Create a new race!</Link></div>}
      </div>
      <div><Races/></div>
    </div>
  )
}
