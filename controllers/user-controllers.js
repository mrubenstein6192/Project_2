/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");
const {
  User
} = require("../models");
const handle = require("../utils/promise-handler");

const secret = "supersecret"

const register = (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName
  } = req.body;

  const user = new User({
    email,
    password,
    firstName,
    lastName
  });

  user.setFullName();

  user.save(err => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "New user registration Error, try again."
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Your new account has been created!"
      });
    }
  });
}

const login = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  const [findUserErr, userInfo] = await handle(User.findOne({
    email
  }));

  if (findUserErr) {
    console.log(findUserErr);
    res.status(500).json({
      error: "Internal err, please try again"
    });
  } else if (!userInfo) {
    res.status(401).json({
      error: "The email you entered was incorrect"
    })
  } else {
    const [pwErr, same] = await handle(userInfo.isCorrectPassword(password));

    if (pwErr) {
      res.status(500).json({
        error: "Internal Error, try again"
      })
    } else if (!same) {
      res.status(401).json({
        message: "The password you entered is incorrect"
      })
    } else {
      const payload = {
        _id: userInfo._id,
        email: userInfo.email
      }
      const token = jwt.sign(payload, secret, {
        expiresIn: "1h"
      });
      res.status(200).json(token);
    }
  }
}

const getUserProfile = async (req, res) => {
  const [userErr, userProfile] = await handle(User.findById(req._id));

  if (userErr) {
    res.status(500).json(userErr);
  } else {
    res.status(200).json(userProfile);
  }
}

module.exports = {
  getUserProfile,
  login,
  register
}