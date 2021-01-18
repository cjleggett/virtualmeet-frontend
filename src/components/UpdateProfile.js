import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function UpdateProfile() {

  const emailRef = useRef()
  const passwordRef = useRef()
  const firstRef = useRef()
  const lastRef = useRef()
  const birthdayRef = useRef()
  const passwordConfirmRef = useRef()
  const [ error, setError ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const { updateEmail, updatePassword, serverURL } = useAuth()
  const history = useHistory()
  const { currentUser, updateUserData, userData } = useAuth()
  const [ gender, setGender ] = useState(userData.gender)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    // Update database information:
    const first = firstRef.current.value
    const last = lastRef.current.value
    const birthday = birthdayRef.current.value

    fetch(`${serverURL()}/users/editUser`, {
      credentials: 'include',
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({
        gender,
        first,
        last,
        birthday
      })
    }).then(() => {
      updateUserData({gender, first, last, birthday})
      const promises = []
      if (emailRef.current.value !== currentUser.email) {
        promises.push(updateEmail(emailRef.current.value))
      }

      if (passwordRef.current.value) {
        promises.push(updatePassword(passwordRef.current.value))
      }
      Promise.all(promises).then(() => {
        history.push("/")
      })
      .catch(() => {})
      
    }).catch(() => {
      setError("Failed to update profile. Try logging out and trying again.")
    }).finally(() => {
      setLoading(false)
    })

  }

  function changeOption(e) {
    setGender(e.currentTarget.value)
    setGender(e.currentTarget.value)
  }

  return (
    <div>
      <h2>Update Profile</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" ref={emailRef} defaultValue={currentUser.email} required></input>
          <label>Password</label>
          <input type="password" ref={passwordRef} placeholder="Leave blank to keep the same"></input>
          <label>Confirm Password</label>
          <input type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same"></input>
          <label>First Name</label>
          <input type="text" defaultValue={userData.first} ref={firstRef} required></input>
          <label>Last Name</label>
          <input type="text" defaultValue={userData.last} ref={lastRef} required></input>
          <label>Birthday</label>
          <input type="date" defaultValue={userData.birthday} ref={birthdayRef} required></input>
          <label>Gender</label>
          <select defaultValue={userData.gender} onChange={e => changeOption(e)}>
            <option value="no_choice" disabled>Choose Gender</option>
            <option value="Woman">Woman</option>
            <option value="Prefer not to say">Prefer not to say</option>
            <option value="Other">Other</option>
            <option value="Man">Man</option>
          </select>
          <button disabled={loading} type="submit">Update</button>
        </form>
      <div>
        <Link to="/">Cancel</Link>
      </div>
    </div>
  )
}