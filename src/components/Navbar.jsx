import React from 'react'
import { Link } from 'react-router-dom';
import AuthContext from '/src/contexts/AuthContext.jsx';
import {useContext} from 'react';
import {useStateValue} from '../contexts/StateProvider.jsx';


const Navbar = () => {
    const auth = useContext(AuthContext);
    const [{user}, dispatch] = useStateValue();
    //const bcrypt = require('bcrypt');
 //bcrypt.hash('password', 10).then(console.log);
 //bcrypt.hash('dianepass', 10).then(console.log);
 //bcrypt.hash('elifpass', 10).then(console.log);
  return (
    <nav className="navbar">
        <Link to="/">home</Link>
       
        { !auth?.isLoggedIn && <Link to="/login"> Login <i class='bx bx-log-in'></i> </Link> }
       { auth?.isLoggedIn && <Link to="/profile"> <i className='bx bx-user bx-md'> </i> </Link> }
       { auth?.isLoggedIn && <Link to="/profile"><p>Welcome, {user?.username}</p></Link>}
        { auth?.isLoggedIn && <Link to="/login" onClick={auth.logout}> Logout <i className='bx bx-log-out'></i> </Link>}
        
      </nav>
  )
}

export default Navbar;