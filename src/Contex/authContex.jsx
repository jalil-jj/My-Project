import { createContext } from "react";


const AuthContext = createContext({
  loggedIn: false,
  token: null,
  userInfos: null,
  login: () => {},
  logout: () => {},
});

export default AuthContext;
