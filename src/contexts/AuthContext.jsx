import React, { createContext, useCallback } from 'react';
import { useSelector, useDispatch} from 'react-redux';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider
export const AuthProvider = ({ children }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const setUser = useCallback (user =>{
    dispatch({type: "SET_USER", user: user});
  }, [dispatch]);
  //const [user, setUser] = useState(null);

  // Optional: Persist login with localStorage
  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem('user'));
  //   if (storedUser) setUser(storedUser);
  // }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isLoggedIn = !!user;

  return (
   
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;