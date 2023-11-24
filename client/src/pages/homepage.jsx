import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import {apiLink} from '../../config.js'

const Homepage = () => {

  const handleLogout = () => {
    // Perform any logout-related actions (e.g., clearing local storage)
    localStorage.removeItem('authtoken');

    // Set loggedOut to true to trigger redirection
    // setLoggedOut(true);
    return redirect("/login");
  };

  useEffect(() => {
    async function checkUserAuthentication() {
      const token = localStorage.getItem('authtoken');

      if (!token) {
        alert('Please log in and continue.');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch(`${apiLink}get-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authtoken: `${token}`,
          },
        });

        

        if (response.ok) {
          const data = await response.json();
          // console.log('Data from protected route:', data);
          // Process the received data
        } else {
          console.log('Error:', response.statusText);
          // Handle errors or unauthorized access
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    checkUserAuthentication();
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('authtoken');
  //   window.location.href = '/login';
  // };

  return (
    <div>
      <h1>Welcome to Homepage</h1>
      {/* <LogoutComponent/> */}
      <Link onClick={handleLogout} to="/login"><button>Logout</button></Link>
    </div>
  );
};

export default Homepage;
