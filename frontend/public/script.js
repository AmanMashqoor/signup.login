const form = document.getElementById('signup-form');
const usernameError = document.getElementById('username-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const errorMessages = document.getElementsByClassName('error-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

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

  const data = await response.json();

  function displayError(error, errorElement) {
      errorElement.innerHTML = error.msg;
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
    clearError(usernameError);
    clearError(emailError);
    clearError(passwordError);
    
    
    data.errors.forEach(error => {
      
    // Display errors in their respective error divs
    if (error.path === 'email') {
      // Display a specific alert for the email already exists error
      displayError(error, emailError)
    } else {
        // Display other errors in their respective error divs
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
    // Clear all error messages    
    clearError(usernameError);
    clearError(emailError);
    clearError(passwordError);
    errorMessages.innerHTML = '';
    
    // Use setTimeout to delay the alert
    setTimeout(function() {
        alert(data.message); // Display a success message or redirect the user.
    }, 100); // You can adjust the delay (100 milliseconds in this example)

  }
});