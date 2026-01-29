import React, {useState, useContext} from 'react'
import './login.css'
import axios from 'axios'
import AuthContext from '../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const auth = useContext(AuthContext);

    const [data, setData] = useState(null);
    const {username, password} = credentials;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials({...credentials, [name]: value});
    };

    const login = async (e) => {
        e.preventDefault();
        try {
            await auth.login(credentials); // app-level login handles API + token
            alert("Login successful");
        } catch (error) {
            console.error('Login failed', {
              message: error?.response?.data?.message,
              status: error?.response?.status,
              data: error?.response?.data,
            });
            alert(error?.response?.data?.message || 'Login failed');
        }
    };

 const logout = () => {
  auth.logout();
  alert("Logout successful");
 };


 const requestData = async () => {
    try {
        const {data} = await axios("http://localhost:3001/api/auth/profile", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        setData(data.message);
        console.log(data.message);
    } catch (error) {
        console.log(error);
    }
    };


  return (
    <div className="wrapper">
        <div className="boxx">
            <div className="login-header">
                <span>Login</span>
            </div>
            <div className="input">
                <input
                 type="text"
                  id="user" className="input-field" required
                  value={username} 
                  onChange={handleChange}
                  name="username"/>
                <label htmlFor="user" className="label">Username</label>
                <i className="bx bx-user icon"></i>
            </div>
            <div className="input">
                <input type="password"
                 id="pass" className="input-field" required
                 value={password}
                 onChange={handleChange}
                 name="password"/>
                <label htmlFor="pass" className="label">Password</label>
                <i className="bx bx-lock-alt icon"></i>
            </div>
            <div className="remember">
                <div className="remember-me">
                    <input type="checkbox" id="remember"></input>
                    <label htmlFor="remember">Remember me</label>
                </div>
                <div className="forgot">
                    <a href="#">Forgot password?</a>
                </div>
            </div>
            <div className="input_boxx">
                <button type="submit" className="input-submit" onClick={login} >Login</button>
            </div>
               <div className="sign-up">
                <span>Don't have an account? <Link to="/register">Sign up!</Link></span>
            </div>
                        {auth.isLoggedIn && (
                            <>
                                <Link to="/profile" className="input-submit" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center', padding: '12px 16px', marginTop: '8px' }}>
                                    View Profile
                                </Link>
                                <button onClick={logout}>
                                    Logout
                                </button>
                            </>
                        )}

        </div>
        {data && (
            <div> {data} </div>
        )}

    </div>
  )
};

export default Login;