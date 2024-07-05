const jwt = require("jsonwebtoken");

require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.headers.authorization || req.header.Authorization;
  if (token) {
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      if (err) {
        res.status(401).send({ msg: "Please login first" });
      } else {
        console.log(decoded);
        req.body.username = decoded.username;
        req.body.userID = decoded.userID;
        req.body.role = decoded.role;
        next();
      }
    });
  } else {
    res.status(404).send({ msg: "Please login first" });
  }
};

module.exports = { auth };
