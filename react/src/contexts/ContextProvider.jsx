import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const StateContext = createContext({
  currentUser: {},
  userToken: null,
  toast: {
    message: null,
    show: false,
  },
  setCurrentUser: () => {},
  setUserToken: () => {},
});

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [userToken, _setUserToken] = useState(localStorage.getItem('token') || '');

  const setUserToken = (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    _setUserToken(token);
  }

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userToken,
        setUserToken
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);