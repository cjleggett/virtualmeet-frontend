import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function UpdateProfile() {

  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const [ error, setError ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const { updateEmail, updatePassword } = useAuth()
  const history = useHistory()
  const { currentUser } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const promises = []
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }

    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises).then(() => {
      history.push("/")
    }).catch(() => {
      setError("Failed to update profile. Try logging out and trying again.")
    }).finally(() => {
      setLoading(false)
    })

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
          <button disabled={loading} type="submit">Update</button>
        </form>
      <div>
        <Link to="/">Cancel</Link>
      </div>
    </div>
  )
}