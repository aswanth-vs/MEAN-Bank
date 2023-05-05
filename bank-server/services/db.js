const mongoose = require("mongoose");

//defining connection between MongoDB and Express
//localhost will not work in Node v18
mongoose.connect("mongodb://127.0.0.1:27017/bankServer").then(() => {
  console.log("Connected to the Database");
});

//Create a model/schema to store data
const User = mongoose.model("User", {
  acno: Number,
  username: String,
  password: String,
  balance: Number,
  transactions: [],
});

//export collection
module.exports = {
  User,
};
