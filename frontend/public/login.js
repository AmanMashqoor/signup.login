const form = document.getElementById('login-form');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const errorMessages = document.getElementById('error-messages');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.elements.email.value;
  const password = form.elements.password.value;

  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json();
  // console.log(`Data:`);
  // console.log(data);
  
  function displayError(error, errorElement) {
    if (typeof error === 'string') {
      errorElement.innerHTML = error;
    } else if (error && error.msg) {
      errorElement.innerHTML = error.msg;
    }
    // errorElement.innerHTML = error.msg;
    errorElement.style.visibility = 'visible';
    errorElement.style.padding = '2px 0 2px 2px'; // padding: 'top right bottom left'
    errorElement.style.margin = '5px';
    errorElement.style.color = 'red';
    errorElement.style.color = 'red';
  }

  function clearError(errorElement) {
    errorElement.innerHTML = ''; // Clear the error message content
    errorElement.style.visibility = 'hidden'; // Hide the element
    errorElement.style.padding = '0'; // Remove padding
    errorElement.style.margin = '0'; // Remove margin
  }

  if (response.status === 400) {
    // Clear previous error messages
    clearError(emailError);
    clearError(passwordError);
    clearError(errorMessages);
    
    
    data.errors.forEach(error => {
      
    // Display errors in their respective error divs
    // if (error.path === 'email') {
    //   // Display a specific alert for the email already exists error
    //   displayError(error, emailError)
    // } else {
        // Display other errors in their respective error divs
        if (error.path === 'email') {
          displayError(error, emailError);
        } else if (error.path === 'password') {
          displayError(error, passwordError);
        }
        else if (error.msg === 'Please enter correct credentials.'){
          displayError('Incorrect credentials.', errorMessages)
          console.log('Incorrect credentials.')
        }
        else {
          // errorMessages.innerHTML = "Something went wrong."
          displayError('Something went wrong', errorMessages);
          console.log('Something went wrong')
        }
    });
    
} else {
    // Clear all error message
    clearError(emailError);
    clearError(passwordError);
    errorMessages.innerHTML = '';
    
    // Use setTimeout to delay the alert
    setTimeout(function() {
      const token = data.authtoken;
      localStorage.setItem('authtoken', token);
      alert(data.message); // Display a success message or redirect the user.
      console.log(token);
        if(data.redirect){
          alert("Hallelujah")
          window.location.href = data.redirect;
        }
        else{
          alert("No redirection address present.")
        }

        // console.log("token");
    }, 100); // You can adjust the delay (100 milliseconds in this example)

  }
})