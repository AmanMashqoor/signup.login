// authMiddleware.js

import fetchuser from "./fetchuser.js";

export const requireAuth = (req, res, next) => {
    // Check if the user is authenticated (You can use any method to verify, like checking the token or session)
    const isAuthenticated = fetchuser;/* Implement your authentication check logic here */;
    
    if (!isAuthenticated) {
      // If not authenticated, redirect to the login page
      return res.redirect('/login');
    }
    else{
      return res.redirect('/homepage');
    }
    
    // If authenticated, proceed to the next middleware or route handler
    next();
  };
  