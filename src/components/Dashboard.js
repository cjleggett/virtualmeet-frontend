import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Dashboard() {

  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    await logout()
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
