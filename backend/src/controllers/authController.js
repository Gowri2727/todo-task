const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
  console.log("========== REGISTER REQUEST ==========");
  console.log("Request Body:", req.body);

  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log("User already exists:", email);

      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    console.log("Creating new user...");

    const user = await User.create({
      name,
      email,
      password,
    });

    console.log("User created:", user);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "production_quality_jwt_secret_key_12345",
      {
        expiresIn: "30d",
      }
    );

    console.log("Registration Successful");

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'production_quality_jwt_secret_key_12345', {
        expiresIn: '30d',
      });

      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
