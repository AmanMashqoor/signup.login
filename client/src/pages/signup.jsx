import { Link } from "react-router-dom"

const SignUp = () => {
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const form = e.target;
        const usernameError = form.querySelector('#username-error');
        const emailError = form.querySelector('#email-error');
        const passwordError = form.querySelector('#password-error');
        const errorMessages = form.querySelector('#error-messages');
    
        const username = form.elements.username.value;
        const email = form.elements.email.value;
        const password = form.elements.password.value;
    
        const response = await fetch('http://localhost:3000/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
    

        const displayError = (error, errorElement) => {
            errorElement.innerHTML = error.msg;
            errorElement.style.visibility = 'visible';
            errorElement.style.padding = '2px 0 2px 2px';
            errorElement.style.margin = '5px';
            errorElement.style.color = 'red';
          };
        
          const clearError = (errorElement) => {
            errorElement.innerHTML = '';
            errorElement.style.visibility = 'hidden';
            errorElement.style.padding = '0';
            errorElement.style.margin = '0';
          };

        const data = await response.json();
    
        if (response.status === 400) {
          clearError(usernameError);
          clearError(emailError);
          clearError(passwordError);
    
          data.errors.forEach(error => {
            if (error.path === 'email') {
              displayError(error, emailError);
            } else {
              if (error.path === 'username') {
                displayError(error, usernameError);
              } else if (error.path === 'email') {
                displayError(error, emailError);
              } else if (error.path === 'password') {
                displayError(error, passwordError);
              }
            }
          });
    
        } else {
          clearError(usernameError);
          clearError(emailError);
          clearError(passwordError);
    
          setTimeout(function() {
            alert(data.message);
            // Redirect to a new page if needed: window.location.href = '/new-page';
          }, 100);
        }
      };
    
      return (
        <>
          <Link to="/signup"><button>Go to SignUp</button></Link>
          <Link to="/login"><button>Go to Login</button></Link>
          <br />
          <form id="signup-form" onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" /><br />
            <div id="username-error" className="error-message"></div>
    
            <input type="email" name="email" placeholder="Email" /><br />
            <div id="email-error" className="error-message"></div>
    
            <input type="password" name="password" placeholder="Password" /><br />
            <div id="password-error" className="error-message"></div>
    
            <input type="submit" value="Sign Up" />
          </form>
    
          <div id="error-messages"></div>
        </>
      );
    };
    

//     const SignUp = () => {

//     return (
//         <>
//             <Link to="/signup"><button>Go to SignUp</button></Link>
//             <Link to="/login"><button >Go to Login</button></Link>
//             <br />
//             <form id="signup-form">

//                 <input type="text" name="username" placeholder="Username" /><br />
//                 <div id="username-error" class="error-message"></div>
//                 {/* <!-- Error div for username --> */}

//                 <input type="email" name="email" placeholder="Email" /><br />
//                 <div id="email-error" class="error-message"></div>
//                 {/* <!-- Error div for email --> */}

//                 <input type="password" name="password" placeholder="Password" /><br />
//                 <div id="password-error" class="error-message"></div>
//                 {/* <!-- Error div for password --> */}

//                 <input type="submit" value="Sign Up" />
//             </form>

//             <div id="error-messages"></div>

//         </>
//     )
// }

export default SignUp