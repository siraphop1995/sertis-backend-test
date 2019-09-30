const router = require("express").Router();
const mongoose = require("mongoose");
const User = mongoose.model("Users");
const jwt = require("jsonwebtoken");
const middleware = require("../Helpers/middleware");
const stringHash = require("string-hash");

//login and give token
app.post("/login", async function(req, res, next) {
  try {
    const _user = await User.findOne({ username: req.body.username });
    if (!_user) {
      return res.status(401).json({ message: "Username does not exist" });
    }

    let date = new Date();
    let time = date.getTime();
    let newUser = {
      username: _user.username,
      password: stringHash(_user.username+time)
    };
    const user = await User.findByIdAndUpdate(_user._id, newUser, {
      new: true
    });

    let token = jwt.sign({ user }, "secret", {
      expiresIn: "7d"
    });

    return res.status(200).json({
      user,
      message: "Authenticated!",
      token: token
    });
  } catch (err) {
    next(err);
  }
});

//read all users
app.get("/users", async function(req, res, next) {
  console.log("test");
  try {
    const user = await User.find({}, null);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

//create
app.post("/users", async function(req, res, next) {
  try {
    let newUser = new User(req.body);
    newUser.password = stringHash(req.body.username);
    const user = await newUser.save();
    return res.json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(409)
        .json({ message: "username already exist", location: "post `/users`" });
    }
    next(err);
  }
});


module.exports = router;
