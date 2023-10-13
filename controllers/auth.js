import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

import User from "../models/User.js";
import getDataUri from "../utils/dataUri.js";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const salt = await bcrypt.genSalt(); //it provides a random salt, i.e., number of rounds of hashing
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // 201 -> data created
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).json({ message: "User does not exists." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const sessUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      picturePath: user.picturePath,
      email: user.email,
    };
    const expirationTime = 3600;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: expirationTime});

    res.status(200).json({
      user: sessUser,
      token,
      message: "Logged in successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};