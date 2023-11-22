import express from 'express';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import { Users } from './models/Users.js';
import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';
import fetchuser from './middleware/fetchuser.js';
import errorHandler from './middleware/errorHandler.js';
import undefinedRouteHandler from './middleware/undefinedRoute.js';

const app = express();
app.use(express.json());

// Example: Allowing requests from all
app.use(cors());

app.options('*', cors());

// Example: Allowing requests only from a specific origin (specific domain with all it's ports)
// const origin = 'http://localhost'; 
// app.use(cors({
//   origin: (origin, callback) => {
//     if (origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }}
// }));


// Start the server & Connect to database
mongoose
.connect(mongoDBURL)
.then(()=>{
    console.log('App connected to database');
    app.listen(PORT, () =>{
        console.log(`App is listening to port: ${PORT}`);
    });
})
.catch((error)=>{
    console.log(error);
});


app.get('/check', (req, res)=>{
    res.send("Hello.")
})

//ROUTE 1:  Define a route '/create-user' for signup form and add validation middleware.
app.post('/create-user', [
  check('username') //validatin for username
    .isLength({ min: 4 }) //minimum length for username
    .withMessage('Username must be at least 5 characters'), 
  
  check('email') //validation for email
    .isEmail() //checking pattern of email
    .withMessage('Invalid email'),
  
  check('password') //validation for password
    .isLength({ min: 8 }) //minimum length of pass
    .withMessage('Password must be at least 8 characters') //message if(length != minimum length)
    /* .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) //password should have one uppercase letter, one lowercase letter, one symbol, and one number
    .withMessage('Password must contain at least one uppercase letter, \none lowercase letter, one symbol, and one number') //message if(charcters != set of characters described above)  */

], async (req, res) => {

  //If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract user data from the request
    const { username, email, password } = req.body;

    // Check if the email already exists in the database
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ errors: [{ path: 'email', msg: 'This email already exists.' }] }); // if email exists, throw this error specifically designed for frontend to fetch 
    }

    const salt = await bcrypt.genSalt(10); //generating salt for hashing it with password
    const secPass = await bcrypt.hash(password, salt); //hashing password + salt

    /* Create a new user document after checking
      -email does not exists already
      -and other validation checks are OK
    */
    const newUser = await Users.create({
      username: username,
      email: email,
      password: secPass,
    });

    // Save the user to the database
    // await newUser.save();

    const data = {
      newUser:{
        id: newUser.id
      }
    } //get unique id of newly created user

    const authtoken = jwt.sign(data, JWT_SECRET); //create a unique jwt token for user using it's unique id
    console.log(authtoken);

    console.log('New user added to the database:', newUser);

    res.json({ message: 'User created successfully', authtoken }); //send succesful message + authtoken to the frontend
  } catch (error) {
    console.error('Error adding user to the database:', error);
    res.status(500).json({ errors: [{ error: 'Internal Server Error' }] });
  }

});

//ROUTE 2: Authenticate a user using POST '/login/'. Define a route '/login' for login authentication and add validation middleware.
app.post('/login', [
  
  check('email') //validation for email
    .isEmail() //checking pattern of email
    .notEmpty()
    .withMessage('Invalid email'),
  
  check('password') //validation for password
    .exists()
    .notEmpty()
    .withMessage('Invalid password')
    /* .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) //password should have one uppercase letter, one lowercase letter, one symbol, and one number
    .withMessage('Password must contain at least one uppercase letter, \none lowercase letter, one symbol, and one number') //message if(charcters != set of characters described above)  */

], async (req, res) => {

  let success = false;

  //If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {email, password} = req.body;
    let user = await Users.findOne({email});

    if(!user){
      return res.status(400).json({ errors: [{ msg: 'Please enter correct credentials.' }] });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if(!passwordCompare){
      return res.status(400).json({ errors: [{ msg: 'Please enter correct credentials.' }] });
    }

    success = true;

    const data = {
      user:{
        id: user.id
      }
    } //get unique id of newly created user

    const authtoken = jwt.sign(data, JWT_SECRET); //create a unique jwt token for user using it's unique id
    console.log(authtoken);

    res.json({success, authtoken, redirect:'/api/homepage.html'})

  } catch (error) {
    // console.error('Error adding user to the database:', error);
    res.status(500).json({ errors: [{ error: 'Internal Server Error' }] });
  }
});

app.use(fetchuser);

app.get('/api/homepage', async (req, res) => {

  //If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    res.send('Hello login user.') 
  } catch (error) {
    // console.error('Error adding user to the database:', error);
    res.status(500).json({ errors: [{ error: 'Internal Server Error' }] });
  }
  
})

app.get('/son', (req, res)=>{
  res.send("BITCH")
})

//ROUTE 3: Check if a user is authenticated or not using POST '/get-user'. Define a route '/get-user' for checking authentication. If user is not authenticated, redirect them to '/login' page using 'fetchuser' middleware.
app.post('/get-user', fetchuser, async (req, res) => {

  //If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id; //extract userId from middleware 'fetchuser'
    const user = await Users.findById(userId).select("-password") //use 'userId' to get all the details of the user minus password 
    res.send({user}) 
  } catch (error) {
    // console.error('Error adding user to the database:', error);
    res.status(500).json({ errors: [{ error: 'Internal Server Error' }] });
  }

});

// Apply the middleware for handling undefined routes
app.use(undefinedRouteHandler);

// Apply the error handling middleware
app.use(errorHandler);