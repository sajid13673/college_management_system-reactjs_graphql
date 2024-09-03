// import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  // const [token, setToken_] = useState(localStorage.getItem("token"));
  const [token, setToken_] = useReducer((prev, cur) => {
    localStorage.setItem("userData", JSON.stringify(cur));
    return cur;
  }, JSON.parse(localStorage.getItem("userData")));

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    console.log(token);
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
