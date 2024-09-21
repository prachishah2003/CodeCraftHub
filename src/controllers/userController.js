const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration function
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Handle any internal server errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// User login function
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username exists in the database
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verify the password using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign({ username: existingUser.username }, 'your_secret_key_here', { expiresIn: '1h' });

    return res.status(200).json({ token });
  } catch (error) {
    // Handle any internal server errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// User profile management function
exports.updateUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { newUsername } = req.body;

    // Update the user's username in the database
    await User.updateOne({ username }, { username: newUsername });

    return res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    // Handle any internal server errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};