//import db.js
const db = require("./db");

//import jsonwebtoken
const jwt = require("jsonwebtoken");

//register
const register = (acno, username, password) => {
  //logic to solve register(acno,uname,psswd)
  console.log("Inside register logic");
  return db.User.findOne({
    acno,
  }).then((response) => {
    console.log(response);
    if (response) {
      return {
        statusCode: 401,
        message: "Account already exists",
      };
    } else {
      const newUser = new db.User({
        acno,
        username,
        password,
        balance: 5000,
        transactions: [],
      });

      newUser.save();
      return {
        statusCode: 200,
        message: "Registration Successfull",
      };
    }
  });
};

//login
const login = (acno, password) => {
  console.log("Inside login logic");
  return db.User.findOne({
    acno,
    password,
  }).then((result) => {
    if (result) {
      const token = jwt.sign(
        {
          loginAcno: acno,
        },
        "supersecretkey"
      );
      console.log(result);
      return {
        statusCode: 200,
        message: "Login Successful...",
        //sending username to client
        currentUser: result.username,
        //sending token to client
        token,
        //send acno to client
        currentAcno: acno,
      };
    } else {
      return {
        statusCode: 400,
        message: "Invalid Account Number or Password",
      };
    }
  });
};

//balance
const getBalance = (acno) => {
  return db.User.findOne({
    acno,
  }).then((result) => {
    if (result) {
      console.log("Inside logic: ", result.balance);
      return {
        statusCode: 200,
        message: "Balance retrieval Successful...",
        balance: result.balance,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid account",
        //sending username to client
      };
    }
  });
};

//fund transfer
const fundTransfer = (fromAcno, fromAcnoPswd, toAcno, amt) => {
  //convert amt to number
  let amount = parseInt(amt);
  console.log("Inside logic");
  //check if debit acc is in mongodb
  return db.User.findOne({
    acno: fromAcno,
    password: fromAcnoPswd,
  }).then((debitDetails) => {
    console.log(debitDetails);
    //to block self transfer
    if (fromAcno == toAcno) {
      return {
        statusCode: 401,
        message: "Operation Denied",
      };
    }
    if (debitDetails) {
      //checking if credit acc is on mongodb
      return db.User.findOne({
        acno: toAcno,
      }).then((creditDetails) => {
        if (creditDetails) {
          //checking if there's sufficient balance in the debit account
          if (debitDetails.balance >= amount) {
            //update Debit Account
            debitDetails.balance -= amount;
            debitDetails.transactions.push({
              type: "Debit",
              amount,
              fromAcno,
              toAcno,
            });
            //save changes to mongodb in fromAcno
            debitDetails.save();

            //update Credit Account
            creditDetails.balance += amount;
            creditDetails.transactions.push({
              type: "Credit",
              amount,
              fromAcno,
              toAcno,
            });
            //save changes to mongodb in toAcno
            creditDetails.save();

            return {
              statusCode: 200,
              message: "Fund Transfer successful",
            };
          } else {
            return {
              statusCode: 404,
              message: "Insufficient Funds",
            };
          }
        } else {
          return {
            statusCode: 404,
            message: "Invalid Credit Account Credentials",
          };
        }
      });
    } else {
      return {
        statusCode: 404,
        message: "Invalid Debit Account Credentials",
      };
    }
  });
};

const allTransactions = (acno) => {
  return db.User.findOne({
    acno,
  }).then((result) => {
    if (result) {
      return {
        statusCode: 200,
        transactions: result.transactions,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid Account",
      };
    }
  });
};

module.exports = {
  register,
  login,
  getBalance,
  fundTransfer,
  allTransactions,
};
