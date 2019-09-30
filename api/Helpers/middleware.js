const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("Users");

async function authen(req, res, next) {
    console.log("Authen checking");
    let token = req.headers["authorization"];
    if (!token)
      return res.status(401).json({
        message: "No token supply"
      });
  
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, "secret", async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Token is not valid"
        });
      } else {
        req.userDecode = decoded;
        //to compare password
        try {
          const user = await User.findById(decoded.user._id);
          console.log("old: ",decoded.user.password)
          console.log("old: ",user.password)
          if(user.password !== decoded.user.password) {
            return res.status(401).json({
              message: "Password not match"
            });
          }
        } catch (err) {}
        next();
      }
    });
}

module.exports = {
  authen: authen
};
