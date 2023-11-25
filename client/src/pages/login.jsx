import { React, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import {apiLink} from '../../config.js'

const Login = () => {

    // const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //   e.preventDefault();
  
    //   const form = e.target;
    //   const emailError = form.querySelector('#email-error');
    //   const passwordError = form.querySelector('#password-error');
    //   const errorMessages = form.querySelector('#error-messages');
  
    //   const email = form.elements.email.value;
    //   const password = form.elements.password.value;
  
    //   const response = await fetch(`${apiLink}login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });
  
    //   const data = await response.json();
    // //   console.log(apiLink)
  
    //   const displayError = (error, errorElement) => {
    //     if (typeof error === 'string') {
    //       errorElement.innerHTML = error;
    //     } else if (error && error.msg) {
    //       errorElement.innerHTML = error.msg;
    //     }
    //     errorElement.style.visibility = 'visible';
    //     errorElement.style.padding = '2px 0 2px 2px';
    //     errorElement.style.margin = '5px';
    //     errorElement.style.color = 'red';
    //   };
  
    //   const clearError = (errorElement) => {
    //     errorElement.style.visibility = 'hidden';
    //     if(!errorElement === ''){
    //       errorElement.innerHTML = ''
    //     }
    //     else{
    //       console.log("errorElement is not null")
    //     }
    //     // (errorElement.innerHTML === '' ?  : console.log("errorElement is not null"));
    //     errorElement.style.padding = '0';
    //     errorElement.style.margin = '0';
    //   };
  
    //   if (response.status === 400) {
    //     clearError(emailError);
    //     clearError(passwordError);
    //     clearError(errorMessages);
  
    //     data.errors.forEach(error => {
    //       if (error.path === 'email') {
    //         displayError(error, emailError);
    //       } else if (error.path === 'password') {
    //         displayError(error, passwordError);
    //       } else if (error.msg === 'Please enter correct credentials.') {
    //         displayError('Incorrect credentials.', errorMessages);
    //       } else {
    //         displayError('Something went wrong', errorMessages);
    //       }
    //     });
  
    //   } else {
    //     clearError(emailError);
    //     clearError(passwordError);
  
    //     console.log(data.message);
    //     // console.log(response)
    //     setTimeout(function () {
    //       const token = data.authtoken;
    //       localStorage.setItem('authtoken', token);
    //       if (data.success === true) {
    //             navigate("/homepage")
    //       } else {
    //         alert("No redirection address present.");
    //       }
    //     }, 100);
    //   }
    // }

    const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessages, setErrorMessages] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.elements.email.value;
    const password = form.elements.password.value;

    const response = await fetch(`${apiLink}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    const clearError = () => {
      setEmailError('');
      setPasswordError('');
      setErrorMessages('');
    };

    if (response.status === 400) {
      clearError();

      data.errors.forEach(error => {
        if (error.path === 'email') {
          setEmailError(error.msg);
        } else if (error.path === 'password') {
          setPasswordError(error.msg);
        } else if (error.msg === 'Please enter correct credentials.') {
          setErrorMessages('Incorrect credentials.');
        } else {
          setErrorMessages('Something went wrong');
        }
      });

    } else {
      clearError();

      console.log(data.message);
      setTimeout(function () {
        const token = data.authtoken;
        localStorage.setItem('authtoken', token);
        if (data.success === true) {
          navigate("/homepage");
        } else {
          alert("No redirection address present.");
        }
      }, 100);
    }
  };


    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', handleSubmit);
      });
  
    return (
      <>
        <div>
          <Link to="/signup"><button>Go to SignUp</button></Link>
          <Link to="/login"><button>Go to Login</button></Link>
        </div>
        <div>
          <form id="login-form" onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" required /><br />
            <div id="email-error" className="error-message">{emailError}</div>
  
            <input type="password" name="password" placeholder="Password" required autoComplete="current-password" /><br />
            <div id="password-error" className="error-message">{passwordError}</div>
  
            <input type="submit" value="Login" />
          </form>
        </div>
  
        <div id="error-messages" className='error-message' style={{ color: 'red' }}>{errorMessages}</div>
      </>
    );
  };

// const Login = () => {

//     return (
//         <>
//             <div>
//                 <Link to="/signup"><button>Go to SignUp</button></Link>
//                 <Link to="/login"><button >Go to Login</button></Link>
//             </div>
//             <div>
//                 <form id="login-form">

//                     <input type="email" name="email" placeholder="Email" required /><br />
//                     <div id="email-error" class="error-message"></div>
//                     {/* <!-- Error div for email --> */}

//                     <input type="password" name="password" placeholder="Password" required autocomplete="current-password" /><br />
//                     <div id="password-error" class="error-message"></div>
//                     {/* <!-- Error div for password --> */}

//                     <input type="submit" value="Login" />
//                 </form>
//             </div>

//             <div id="error-messages"></div>
//         </>
//     )
// }

export default Login