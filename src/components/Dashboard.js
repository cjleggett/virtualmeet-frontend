import React, { useState } from 'react'
import useTeam from '../hooks/TeamHook'
import GetStarted from './GetStarted'
import Meets from './Meets'

export default function Dashboard() {

  const team = useTeam()
  const [ userData, setUserData ] = useState(JSON.parse(localStorage.getItem('userData')))
  console.log(userData)

  return (
    <div>
      <div>
        {!team.team && userData && userData.requests && !userData.requests.length && <GetStarted setUserData={setUserData}/>}
      </div>
      <div><Meets/></div>
    </div>
  )
}
