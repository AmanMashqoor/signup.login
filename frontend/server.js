import express from 'express';
const app = express();
import * as path from 'path';
import checkAuth from './middleware/checkAuth.js';
import errorHandler from './middleware/errorHandler.js';
import undefinedRouteHandler from './middleware/undefinedRoute.js';

// The following two lines use ES module features to get the current filename and directory.
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Getting the current filename and directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// console.log(__filename) 
//This will print the directory of this file. e.g. : "C:\xampp\htdocs\dashboard\ourwebsites\Experimental_Projects\express_validation\frontend\server.js"

// console.log(__dirname) 
//This will print the directory. e.g. : "C:\xampp\htdocs\dashboard\ourwebsites\Experimental_Projects\express_validation\frontend"

// Define the directory where your HTML file is located.
const publicDirectory = path.join(__dirname, 'public');

// Serve static files from the 'public' directory.
app.use(express.static(publicDirectory));

//example route for this server
app.get('/', (req, res) => {
  res.send(
    `<h1>Hello</h1>
    <h4>Where would you like to go?</h4><br>
    <div>
    <a href="/signup"><button>Go to SignUp</button></a>
    <a href="/login"><button >Go to Login</button></a>
    <div>`);
});

app.use('/api', checkAuth);

app.get('/api/homepage', (req, res) => {
  res.sendFile(path.join(publicDirectory, './api/homepage.html'));
});

// Define a route to serve the signup.html file.
app.get('/signup', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'signup.html'));
});

// Define a route to serve the login.html file.
app.get('/login', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'login.html'));
});

// Define the port for your server.
const PORT = 3002;

// Start the server.
app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT} \nConnect at: http://localhost:3002 `);
});
