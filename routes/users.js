const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const validateRequest = require('../middlewares/validate_request');
const schemas = require('../schemas');
const jwt = require('jsonwebtoken');

router.post('/register', validateRequest(schemas.userPost), async (req, res) => {
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: encryptedPassword,
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.post('/login', validateRequest(schemas.loginPost), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(
        { id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email },
        process.env.REFRESH_TOKEN_SECRET
      );

      const updatedUser = await User.updateOne(
        { email: user.email },
        { $set: { access_token: accessToken, refresh_token: refreshToken } }
      );

      res.json({
        accessToken: { token: accessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
        refreshToken: refreshToken,
      });

      return;
    }

    res.status(400).send('invalid email or password');
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.post('/token', validateRequest(schemas.refreshTokenPost), async (req, res) => {
  try {
    jwt.verify(req.body.token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) return res.status(403).send('invalid token provided');

      const dbUser = await User.findOne({ email: user.email });

      if (dbUser.refresh_token != req.body.token) {
        return res.status(403).send('invalid token provided');
      }

      const accessToken = generateAccessToken(user);

      const updatedUser = await User.updateOne(
        { email: user.email },
        { $set: { access_token: accessToken } }
      );

      res.json({
        accessToken: { token: accessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
        refreshToken: req.body.token,
      });
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.delete('/logout', validateRequest(schemas.logoutDelete), async (req, res) => {
  try {
    jwt.verify(req.body.token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) return res.status(403).send('invalid token provided');

      const updatedUser = await User.updateOne(
        { email: user.email },
        { $set: { access_token: '', refresh_token: '' } }
      );

      res.sendStatus(204);
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
}

module.exports = router;
