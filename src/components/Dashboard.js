import React, {  } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Dashboard() {

  const { currentUser, logout, serverURL } = useAuth()
  const history = useHistory()

  async function handleLogout() {

    // Log out on frontend
    await logout()

    // Terminate session on backend
    fetch(`${serverURL()}/auth/logout`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({})
    })

    history.push('login')
  }

  return (
    <div>
      <div>
        <strong>email:</strong> {currentUser.email}
        <div><Link to="update-profile">Update Profile</Link></div>
      </div>
      <div>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </div>
  )
}
