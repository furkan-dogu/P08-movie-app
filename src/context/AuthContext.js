import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toastErrorNotify, toastSuccessNotify } from "../helpers/ToastNotify";

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    userObserver();
  }, []);

  //! REGISTER
  const createUser = async (email, password, displayName) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      //? Register gerçekleşirken kullanıcı adını yakaladım
      await updateProfile(auth.currentUser, { displayName: displayName });
      navigate("/");
      toastSuccessNotify("Registered successfully");
    } catch (error) {
      toastErrorNotify(error.message);
    }
  };

  //! LOGIN
  const singIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      toastSuccessNotify("Logged in successfully");
    } catch (error) {
      toastErrorNotify(error.message);
    }
  };

  //! LOGIN VE LOGOUT KONTROLÜ
  const userObserver = () => {
    //? User'da veri çok olduğu için sadece ihtiyacım olanları desc. ettim
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, displayName, photoURL } = user;
        setCurrentUser({ email, displayName, photoURL });
      } else {
        setCurrentUser(false);
      }
    });
  };

  //! LOGOUT
  const logOut = () => {
    signOut(auth);
    toastSuccessNotify("Logged out successfully");
  };

  //! GOOGLE HESABI İLE GİRİŞ
  const signUpProvider = () => {
    const provider = new GoogleAuthProvider();

    //? Pop up işlemi
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/");
        toastSuccessNotify("Logged in successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //! FORGOT PASSWORD
  const forgotPassword = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toastSuccessNotify("Please check your e-mail");
      })
      .catch((error) => {
        toastErrorNotify(error.message);
      });
  };

  const values = {
    createUser,
    singIn,
    logOut,
    currentUser,
    signUpProvider,
    forgotPassword,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
