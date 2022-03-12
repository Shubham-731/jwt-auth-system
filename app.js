// Loading packages/modules
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const app = express();
const secretKey = process.env.SECRET_KEY;

app.get("/user", (req, res) => {
  res.json({ status: "ok", message: "Welcome to this user system!" });
});

app.post("/user/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      res.json({ status: "error", message: err });
    } else {
      res.json({ status: "ok", message: "Post created...", authData });
    }
  });
});

app.post("/user/login", (req, res) => {
  const user = {
    id: 1,
    username: "anyone",
    email: "anything@gmail.com",
  };

  // Creating JWT token
  jwt.sign({ user }, secretKey, { expiresIn: "30s" }, (err, token) => {
    if (err) {
      res.json({ status: "error", error: err });
    }
    res.json({ status: "ok", token });
  });
});

// Verifying the token
function verifyToken(req, res, next) {
  // Setting the authorization header value
  const bearerHeader = req.headers["authorization"];

  // Check if the bearer is undefined
  if (bearerHeader !== undefined) {
    // Split the header
    const bearer = bearerHeader.split(" ");

    // Getting the token
    const bearerToken = bearer[1];

    // Setting the token
    req.token = bearerToken;

    // next middlewares
    next();
  } else {
    res.sendStatus(403);
  }
}

// Starting the server
app.listen(3000, () => console.log("Server started on port 3000..."));
