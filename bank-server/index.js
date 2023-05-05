const express = require("express");

//creating a server using Express
const server = express();

//import cors
const cors = require("cors");

//import logic.js
const logic = require("./services/logic");

//import jwt
const jwt = require("jsonwebtoken");

//use cors
server.use(
  cors({
    origin: "http://localhost:4200",
  })
);

//parse json content
server.use(express.json());

//setup port
server.listen(3000, () => {
  console.log("server listening on port 3000");
});

//Router specific middleware for verifying token
const jwtMiddleware = (req, res, next) => {
  console.log("JWT Middleware");
  //getting token from req headers
  const token = req.headers["verify-token"];
  console.log(token);
  try {
    //verify token
    const data = jwt.verify(token, "supersecretkey");
    console.log(data);
    //to get login account number
    req.currentAcno = data.loginAcno;
    //to process client request
    next();
  } catch {
    res.status(401).json({ message: "Error Occured...Please Log In!" });
  }
};

//register POST
server.post("/register", (req, res) => {
  console.log("Inside register API");
  console.log(req.body);
  //logic to solve register(acno, username, password)
  logic.register(req.body.acno, req.body.username, req.body.password).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//login
server.post("/login", (req, res) => {
  console.log("Inside login API");
  console.log(req.body);
  logic.login(req.body.acno, req.body.password).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//get balance
server.get("/get-balance/:acno", jwtMiddleware, (req, res) => {
  console.log("Inside get balance API");
  console.log(req.params);
  logic.getBalance(req.params.acno).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//fund transfer
server.post("/fund-transfer", jwtMiddleware, (req, res) => {
  console.log("Inside Fund Transfer API");
  logic.fundTransfer(req.currentAcno, req.body.pswd, req.body.toAcno, req.body.amount).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

server.get("/transactions", jwtMiddleware, (req, res) => {
  console.log("Inside Transaction API");
  logic.allTransactions(req.currentAcno).then((result) => {
    res.status(result.statusCode).json(result);
  });
});
