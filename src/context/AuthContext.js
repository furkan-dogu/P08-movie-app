import React, { createContext, useContext } from 'react'
import { auth } from '../auth/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuthContext = () => {
  return useContext(AuthContext)
}

const AuthContextProvider = ({children}) => {
  const navigate = useNavigate()
  const createUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log(userCredential);
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }
  const singIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log(userCredential);
      
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }
    const values = {createUser,singIn}
  return (
    <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
  )
}

export default AuthContextProvider