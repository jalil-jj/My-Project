import React, { useCallback, useEffect, useState } from 'react';
import routes from './routes';
import { useRoutes } from 'react-router-dom';
import AuthContext from './Contex/authContex';
import axios from 'axios';

export default function App() {

  const router = useRoutes(routes);

  const [logedIn, setLogedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userInfos, setUserInfos] = useState(null);

  const login = useCallback((token, userInfos) => {
    setToken(token)
    setLogedIn(true)
    setUserInfos(userInfos)
    localStorage.setItem('user', JSON.stringify({ token }))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserInfos({})
    localStorage.removeItem('user')
  }, [])


  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem('user'))


    if (localStorageData) {

      axios.get("http://localhost:4000/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorageData.token}`
        }
      })
        .then(res => {
          setLogedIn(true);
          setUserInfos(res.data);
        })
        .catch(err => {
          setLogedIn(false);
          setUserInfos(null);
          setToken(null);
          localStorage.removeItem('user');
        });
    } else {
      setLogedIn(false);
    }
  }, []);




  return (
    <AuthContext.Provider value={{
      logedIn,
      token,
      userInfos,
      login,
      logout,
    }}>
      {router}
    </AuthContext.Provider>
  );
}
