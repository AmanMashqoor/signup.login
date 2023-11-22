const checkUserAuthentication = async () =>{
    const token = localStorage.getItem('authtoken');

    if (!token) {
    // Handle scenario where the token is not present (optional)
    console.log('Token not found.');
    alert("Please login before continuing.")
    window.location.href = '/login'
    return;
}

try {
    const response = await fetch('http://localhost:3000/get-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authtoken': `${token}`, // Include the token in the 'authtoken' header
        },
    });

    if (response.ok) {
        // If the response is successful (status 200)
        const data = await response.json();
        // console.log('Data from protected route:', data);
        // Process the received data
        } else {
            // Handle errors or unauthorized access
            console.log('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export default checkUserAuthentication;