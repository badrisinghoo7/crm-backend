const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const auth = require("../middleware/auth.middleware");
require("dotenv").config();

userRouter.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.send({ msg: "Possword Could not be hashed. Something went wrong" });
      } else {
        const user = new UserModel({ username, email, password: hash, role });
        await user.save();
        res
          .status(201)
          .send({ msg: " User Registered successfully", user: user });
      }
    });
  } catch (error) {
    res.send({ msg: "Something went wrong in registration" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await UserModel.findOne({
      $and: [{ email: email }, { role: role }],
    });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { userID: user._id, username: user.username, role: user.role },
            process.env.SECRETKEY
          );
          res.send({
            msg: "Login Successful",
            token,
            user,
          });
        } else {
          res.send({ msg: "Wrong credentials" });
        }
      });
    } else {
      res.send({ msg: "User not found" });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong in Login" });
  }
});
// for creating the user
userRouter.post("/create-user", async (req, res) => {
  const payload = req.body;
  const user = new UserModel(payload);
  await user.save();
  res.status(201).send({ msg: "User created successfully", user });
});
// for Lead person details
userRouter.get("/lead-person", async (req, res) => {
  try {
    const users = await UserModel.find({ role: "lead-person" });
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// For Sale person details
userRouter.get("/sale-person", async (req, res) => {
  try {
    const users = await UserModel.find({ role: "sale-person" });
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
userRouter.get("/allusers", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = { userRouter };
