import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

export default function ForgotPassword() {

  const emailRef = useRef()
  const [ error, setError ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ message, setMessage ] = useState("")
  const { resetPassword } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setMessage("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your email for further instructions")
      emailRef.current.value = ""
    } catch(e) {
      setError("Failed to send reset password")
    }
    setLoading(false)

  }

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" ref={emailRef} required></input>
        <button disabled={loading} type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
      <div>
        <Link to="login">Back to login</Link>
      </div>
    </div>
  )
}