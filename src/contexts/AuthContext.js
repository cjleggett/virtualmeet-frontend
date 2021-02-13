import React, { useContext, useState, useEffect } from "react"
import { auth } from "../helpers/firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

const SERVER_URL = "http://localhost:5000"

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function updateUserData(data) {
    console.log('setting data')
    console.log(data)
    localStorage.setItem("userData", JSON.stringify(data))
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  function serverURL() {
    return SERVER_URL
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    updateUserData,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    serverURL
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}